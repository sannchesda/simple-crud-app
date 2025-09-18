"use client";

import { useEffect, useState } from "react";
import SimpleModal from "./components/SimpleModal";

interface Todo {
  id: string;
  todo: string;
  isCompleted: boolean;
  createdAt: string;
  status: "editing" | "viewing";
}

export default function Home() {
  // declaring variable for state
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");

  // Filter todos based on input
  const filteredTodos = todos.filter(todo => 
    todo.todo.toLowerCase().includes(filter.toLowerCase())
  );

  // init state
  useEffect(() => {
    setStatus("loading");
    const fetchTodos = async () => {
      try {
        const res = await fetch("/api/todo");
        const data: Todo[] = await res.json();
        setTodos(data.map(todo => ({ ...todo, status: "viewing" as const })));
      } catch (error) {
        console.error("Failed to fetch todos:", error);
        setStatus("error");
      } finally {
        setStatus("done");
      }
    };
    fetchTodos();
  }, []);

  // methods
  const addTodo = async () => {
    if (!input.trim()) return;

    // check if input is duplicate
    if (todos.some((todo) => todo.todo.toLowerCase() === input.toLowerCase())) {
      setIsModalOpen(true);
      return;
    }

    const newTodo = {
      id: crypto.randomUUID(),
      todo: input,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      });

      if (response.ok) {
        // Refresh the todos list from the server
        const res = await fetch("/api/todo");
        const data: Todo[] = await res.json();
        setTodos(data.map(todo => ({ ...todo, status: "viewing" as const })));
        setInput("");
        setFilter("");
      } else {
        console.error("Failed to add todo");
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const removeTodo = async (index: number) => {
    const todoToRemove = todos[index];
    
    try {
      const response = await fetch(`/api/todo/${todoToRemove.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Refresh the todos list from the server
        const res = await fetch("/api/todo");
        const data: Todo[] = await res.json();
        setTodos(data.map(todo => ({ ...todo, status: "viewing" as const })));
      } else {
        console.error("Failed to delete todo");
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const editTodo = async (index: number, newTodoText: string) => {
    const todoToUpdate = todos[index];
    
    try {
      const response = await fetch(`/api/todo/${todoToUpdate.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: todoToUpdate.id,
          todo: newTodoText,
          isCompleted: todoToUpdate.isCompleted,
          createdAt: todoToUpdate.createdAt,
        }),
      });

      if (response.ok) {
        // Refresh the todos list from the server
        const res = await fetch("/api/todo");
        const data: Todo[] = await res.json();
        setTodos(data.map(todo => ({ ...todo, status: "viewing" as const })));
      } else {
        console.error("Failed to update todo");
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const toggleComplete = async (index: number) => {
    const todoToToggle = todos[index];
    
    try {
      const response = await fetch(`/api/todo/${todoToToggle.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: todoToToggle.id,
          todo: todoToToggle.todo,
          isCompleted: !todoToToggle.isCompleted,
          createdAt: todoToToggle.createdAt,
        }),
      });

      if (response.ok) {
        // Refresh the todos list from the server
        const res = await fetch("/api/todo");
        const data: Todo[] = await res.json();
        setTodos(data.map(todo => ({ ...todo, status: "viewing" as const })));
      } else {
        console.error("Failed to toggle todo completion");
      }
    } catch (error) {
      console.error("Error toggling todo completion:", error);
    }
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-6 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">Todo App</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            addTodo();
          }}
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setFilter(e.target.value);
              }}
              className="border rounded px-2 py-1"
              placeholder="Enter todo"
            />
            <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
              Add
            </button>
          </div>
        </form>

        <ul className="list-disc space-y-2">
          <div className="text-gray-500 text-center">
            {status == "loading" ? (
              <p>Loading...</p>
            ) : status == "error" ? (
              <p className="text-red-500">Failed to load todos</p>
            ) : todos.length === 0 ? (
              <p>No todos yet. Add one above to get started!</p>
            ) : filteredTodos.length === 0 && filter.trim() !== "" ? (
              <p>No result. Create a new one instead!</p>
            ) : null}
          </div>

          {filteredTodos.map((todo, index) => {
            // Get the original index from the todos array for proper state management
            const originalIndex = todos.findIndex(t => t.id === todo.id);
            return (
            <li
              key={todo.id}
              className="flex justify-between items-center bg-white/80 backdrop-blur-sm shadow-sm rounded-md px-4 py-2 w-full transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-medium">
                  {originalIndex + 1}
                </div>
                {todo.status === "editing" ? (
                  <input
                    type="text"
                    value={todo.todo}
                    onChange={(e) => {
                      editTodo(originalIndex, e.target.value);
                    }}
                    className="border rounded px-2 py-1"
                  />
                ) : (
                  <span className="text-gray-800 break-words">{todo.todo}</span>
                )}
                <button
                  onClick={() => toggleComplete(originalIndex)}
                  className={`ml-4 px-3 py-1 rounded text-sm font-medium transition ${
                    todo.isCompleted 
                      ? "bg-green-100 text-green-700 hover:bg-green-200" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  aria-label={`Mark todo ${originalIndex + 1} as ${
                    todo.isCompleted ? "incomplete" : "complete"
                  }`}
                >
                  {todo.isCompleted ? "Mark Incomplete" : "Mark Complete"}
                </button>
              </div>

              {todo.status === "editing" ? (
                <button
                  onClick={() => {
                    editTodo(originalIndex, todo.todo);
                  }}
                  aria-label={`Save todo ${originalIndex + 1}`}
                  className="inline-flex items-center gap-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-green-200 transition"
                >
                  <span className="text-sm">Save</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    const updatedTodos = [...todos];
                    updatedTodos[originalIndex].status = "editing";
                    setTodos(updatedTodos);
                  }}
                  aria-label={`Edit todo ${originalIndex + 1}`}
                  className="inline-flex items-center gap-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                >
                  <span className="text-sm">Edit</span>
                </button>
              )}
              <button
                onClick={() => removeTodo(originalIndex)}
                aria-label={`Remove todo ${originalIndex + 1}`}
                className="inline-flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-red-200 transition"
              >
                <span className="text-sm">Remove</span>
              </button>
            </li>
            );
          })}
        </ul>

        <SimpleModal
          isOpen={isModalOpen}
          onClose={function (): void {
            setIsModalOpen(false);
          }}
          title={"Duplicate Item"}
        ></SimpleModal>
      </main>
    </div>
  );
}
