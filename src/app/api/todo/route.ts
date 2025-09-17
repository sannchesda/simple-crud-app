import { NextResponse } from "next/server";

export async function GET() {
  const todos = [
    {
      id: "1",
      todo: "Learn Next.js",
      isCompleted: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      todo: "Build a Todo App",
      isCompleted: true,
      createdAt: new Date().toISOString(),
    },
  ];

  return NextResponse.json(todos);
}
