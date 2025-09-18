import { NextRequest, NextResponse } from "next/server";
import { TodoStore, TodoItem } from "./todoStore";

export async function GET() {
  return NextResponse.json(await TodoStore.getAll());
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, todo, isCompleted, createdAt } = body;

    // Validate required fields
    if (!id || !todo || isCompleted === undefined || !createdAt) {
      return NextResponse.json(
        { error: "Missing required fields: id, todo, isCompleted, createdAt" },
        { status: 400 }
      );
    }

    // Check if todo with this id already exists
    if (await TodoStore.exists(id)) {
      return NextResponse.json(
        { error: "Todo with this id already exists" },
        { status: 409 }
      );
    }

    const newTodo: TodoItem = {
      id,
      todo,
      isCompleted,
      createdAt
    };

    await TodoStore.create(newTodo);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON format" },
      { status: 400 }
    );
  }
}
