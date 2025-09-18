"use client";

import { useEffect, useState } from "react";
import SimpleModal from "./components/SimpleModal";
import SimpleButton from "./components/SimpleButton";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

interface Todo {
  id: string;
  todo: string;
  isCompleted: boolean;
  createdAt: string;
  status: "editing" | "viewing";
  draft?: string; // for editing mode
}

export default function Home() {
  // declaring variable for state
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");
  const [loadingStates, setLoadingStates] = useState<{
    adding: boolean;
    [key: string]: boolean; // For individual todo operations
  }>({
    adding: false,
  });

  // Filter todos based on input
  const filteredTodos = todos.filter((todo) =>
    todo.todo.toLowerCase().includes(filter.toLowerCase())
  );

  // init state
  useEffect(() => {
    setStatus("loading");
    const unsub = onSnapshot(
      collection(db, "todos"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          status: "viewing" as const,
        })) as Todo[];
        setTodos(data);
        setStatus("done");
      },
      (error) => {
        console.error("Failed to fetch todos:", error);
        setStatus("error");
      }
    );

    return () => unsub(); // cleanup on unmount
  }, []);

  // methods
  const addTodo = async () => {
    if (!input.trim() || loadingStates.adding) return;

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
      setLoadingStates((prev) => ({ ...prev, adding: true }));

      const response = await fetch("/api/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      });

      if (response.ok) {
        setInput("");
        setFilter("");
      } else {
        console.error("Failed to add todo");
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, adding: false }));
    }
  };

  const removeTodo = async (index: number) => {
    const todoToRemove = todos[index];
    const loadingKey = `deleting-${todoToRemove.id}`;

    if (loadingStates[loadingKey]) return;

    try {
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: true }));

      const response = await fetch(`/api/todo/${todoToRemove.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        console.error("Failed to delete todo");
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  const editTodo = async (index: number, newTodoText: string) => {
    const todoToUpdate = todos[index];
    const loadingKey = `editing-${todoToUpdate.id}`;

    if (loadingStates[loadingKey]) return;

    try {
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: true }));

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

      if (!response.ok) {
        console.error("Failed to update todo");
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  const toggleComplete = async (index: number) => {
    const todoToToggle = todos[index];
    const loadingKey = `toggling-${todoToToggle.id}`;

    if (loadingStates[loadingKey]) return;

    try {
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: true }));

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

      if (!response.ok) {
        console.error("Failed to toggle todo completion");
      }
    } catch (error) {
      console.error("Error toggling todo completion:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: false }));
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
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loadingStates.adding}
            >
              {loadingStates.adding ? "Adding..." : "Add"}
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

          {filteredTodos.map((todo) => {
            // find original index in todos
            const originalIndex = todos.findIndex((t) => t.id === todo.id);

            const isEditing = todo.status === "editing";
            const isToggling = loadingStates[`toggling-${todo.id}`];
            const isEditingLoading = loadingStates[`editing-${todo.id}`];
            const isDeleting = loadingStates[`deleting-${todo.id}`];

            return (
              <li
                key={todo.id}
                className="flex justify-between items-center bg-white/80 backdrop-blur-sm shadow-sm rounded-md px-4 py-2 w-full transition-shadow hover:shadow-md group"
              >
                {/* left side */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-medium">
                    {originalIndex + 1}
                  </div>

                  {isEditing ? (
                    <input
                      type="text"
                      value={todo.draft}
                      onChange={(e) => {
                        const updated = [...todos];
                        updated[originalIndex].draft = e.target.value; // update local draft only
                        setTodos(updated);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          editTodo(originalIndex, todo.draft || todo.todo);
                        } else if (e.key === "Escape") {
                          const updated = [...todos];
                          updated[originalIndex].status = "viewing";
                          updated[originalIndex].draft = undefined;
                          setTodos(updated);
                        }
                      }}
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    <span
                      className={`text-gray-800 break-words ${
                        todo.isCompleted ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {todo.todo}
                    </span>
                  )}

                  {/* toggle complete */}
                  <SimpleButton
                    label={
                      isToggling
                        ? "Updating..."
                        : todo.isCompleted
                        ? "Mark Incomplete"
                        : "Mark Complete"
                    }
                    onClick={() => toggleComplete(originalIndex)}
                    disabled={isToggling}
                    textColor={
                      todo.isCompleted
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }
                  />
                </div>

                {/* right side */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {isEditing ? (
                    <SimpleButton
                      label={isEditingLoading ? "Saving..." : "Save"}
                      onClick={() =>
                        editTodo(originalIndex, todo.draft || todo.todo)
                      }
                      disabled={isEditingLoading}
                      textColor="text-green-600"
                    />
                  ) : (
                    <SimpleButton
                      label="Edit"
                      onClick={() => {
                        const updated = [...todos];
                        updated[originalIndex].status = "editing";
                        updated[originalIndex].draft =
                          updated[originalIndex].todo; // copy original text
                        setTodos(updated);
                      }}
                      disabled={isEditingLoading || isToggling || isDeleting}
                    />
                  )}

                  <SimpleButton
                    onClick={() => removeTodo(originalIndex)}
                    disabled={isDeleting}
                    label={isDeleting ? "Removing..." : "Remove"}
                    textColor="text-red-600"
                  />
                </div>
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
