"use client"

import { useState } from "react";

export default function Home() {
  const [todos, setTodos] = useState<string[]>([]);

  const [input, setInput] = useState("");

  const addTodo = () => {
    if (!input.trim()) return;

    setTodos([...todos, input]);
    setInput("");
  }

  const removeTodo = (index: number) => {
    setTodos(todos.filter((_, i) => i !== index));
  }

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-6 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">Todo App</h1>

        <form onSubmit={(e) => {
          e.preventDefault();
          addTodo();
        }}>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="border rounded px-2 py-1"
              placeholder="Enter todo"
            />
            <button
              onClick={addTodo}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </form>

        <ul className="list-disc  space-y-2">
          {todos.map((todo, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-white/80 backdrop-blur-sm shadow-sm rounded-md px-4 py-2 w-full transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-medium">
                  {index + 1}
                </div>
                <span className="text-gray-800 break-words">{todo}</span>
              </div>

              <button
                onClick={() => removeTodo(index)}
                aria-label={`Remove todo ${index + 1}`}
                className="inline-flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-red-200 transition"
              >
                <span className="text-sm">Remove</span>
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}


