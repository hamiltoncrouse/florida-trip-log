import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { authenticateRequest, AuthError } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const uploadSchema = z.object({
  fileName: z.string().min(1),
  mimeType: z.string().min(1),
  data: z.string().min(1), // base64
});

function handleAuthError(error: unknown) {
  if (error instanceof AuthError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function POST(request: NextRequest, { params }: any) {
  try {
    const { account } = await authenticateRequest(request);
    const body = await request.json();
    const parsed = uploadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { tripId, dayId, activityId } = params;

    const activity = await prisma.activity.findFirst({
      where: {
        id: activityId,
        tripDay: {
          id: dayId,
          trip: { id: tripId, userId: account.id },
        },
      },
      select: { metadata: true },
    });

    if (!activity) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }

    const metadata = (activity.metadata as Record<string, unknown> | null) || {};
    const attachments = Array.isArray(metadata.attachments) ? [...(metadata.attachments as unknown[])] : [];

    attachments.push({
      id: crypto.randomUUID(),
      fileName: parsed.data.fileName,
      mimeType: parsed.data.mimeType,
      data: parsed.data.data,
      uploadedAt: new Date().toISOString(),
    });

    const updated = await prisma.activity.update({
      where: { id: activityId },
      data: {
        metadata: {
          ...(metadata || {}),
          attachments,
        } as Prisma.InputJsonValue,
      },
      select: { metadata: true },
    });

    return NextResponse.json({ attachments: (updated.metadata as { attachments?: unknown[] } | null)?.attachments || [] });
  } catch (error) {
    const authResponse = handleAuthError(error);
    if (authResponse) return authResponse;
    console.error("Failed to upload artifact", error);
    return NextResponse.json({ error: "Failed to upload artifact" }, { status: 500 });
  }
}
