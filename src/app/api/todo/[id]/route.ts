import { NextRequest, NextResponse } from "next/server";
import { TodoStore } from "../todoStore";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { todo, isCompleted, createdAt } = body;

    // Validate required fields
    if (!todo || isCompleted === undefined || !createdAt) {
      return NextResponse.json(
        { error: "Missing required fields: todo, isCompleted, createdAt" },
        { status: 400 }
      );
    }

    // Update the todo
    const success = await TodoStore.update(id, {
      todo,
      isCompleted,
      createdAt,
    });

    if (!success) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete the todo
    const success = await TodoStore.delete(id);

    if (!success) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
