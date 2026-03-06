import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const photos = await prisma.photo.findMany({
      include: {
        comments: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(photos);
  } catch (error) {
    console.error("Failed to fetch photos:", error);
    return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 });
  }
}

// Simple seed route or just handle creation
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const photo = await prisma.photo.create({
      data: body,
    });
    return NextResponse.json(photo);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create photo" }, { status: 500 });
  }
}
