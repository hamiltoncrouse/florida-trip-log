import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { text, author } = await req.json();
    const comment = await prisma.comment.create({
      data: {
        photoId: params.id,
        text,
        author: author || "Guest",
      },
    });
    return NextResponse.json(comment);
  } catch (error) {
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  }
}
