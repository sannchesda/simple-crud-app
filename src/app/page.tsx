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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 py-4 sm:py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2 sm:mb-4">
            Simple CRUD Todo
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 font-medium px-4">
            Just something
          </p>
        </div>

        <main className="animate-slide-up">

          {/* Add Todo Form */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 p-4 sm:p-8 mb-6 sm:mb-8 animate-bounce-in">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addTodo();
              }}
              className="space-y-4"
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setFilter(e.target.value);
                  }}
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-base sm:text-lg bg-gray-50/50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
                  placeholder="What needs to be done today? ✨"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 sm:py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={loadingStates.adding || !input.trim()}
              >
                {loadingStates.adding ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Adding magic...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Todo
                  </div>
                )}
              </button>
            </form>
          </div>

          {/* Todo List */}
          <div className="space-y-4">
            {/* Status Messages */}
            <div className="text-center py-8">
              {status === "loading" ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-3 border-purple-600 border-t-transparent"></div>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">Loading your todos...</p>
                </div>
              ) : status === "error" ? (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                  <div className="text-red-600 dark:text-red-400 text-lg font-semibold">⚠️ Oops! Something went wrong</div>
                  <p className="text-red-500 dark:text-red-400 mt-2">Failed to load todos. Please try refreshing the page.</p>
                </div>
              ) : todos.length === 0 ? (
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-8">
                  <div className="text-4xl mb-4">🌟</div>
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Ready to get productive?</h3>
                  <p className="text-gray-600 dark:text-gray-400">Add your first todo above to get started on your journey!</p>
                </div>
              ) : filteredTodos.length === 0 && filter.trim() !== "" ? (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
                  <div className="text-2xl mb-2">🔍</div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No matching todos found</h3>
                  <p className="text-gray-600 dark:text-gray-400">Try a different search term or create a new todo!</p>
                </div>
              ) : null}
            </div>

            {/* Todo Items */}
            {filteredTodos.map((todo) => {
              // find original index in todos
              const originalIndex = todos.findIndex((t) => t.id === todo.id);

              const isEditing = todo.status === "editing";
              const isToggling = loadingStates[`toggling-${todo.id}`];
              const isEditingLoading = loadingStates[`editing-${todo.id}`];
              const isDeleting = loadingStates[`deleting-${todo.id}`];

              return (
                <div
                  key={todo.id}
                  className={`group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-white/30 dark:border-gray-700/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${todo.isCompleted ? 'opacity-75 scale-98' : ''
                    }`}
                >
                  {/* Todo Content */}
                  <div className="flex items-start gap-3 sm:gap-4 flex-1">
                    {/* Number Badge */}
                    <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full font-bold text-xs sm:text-sm shadow-lg flex-shrink-0 ${todo.isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gradient-to-br from-purple-500 to-blue-500 text-white'
                      }`}>
                      {todo.isCompleted ? '✓' : originalIndex + 1}
                    </div>

                    {/* Todo Text/Input */}
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <input
                          type="text"
                          value={todo.draft}
                          onChange={(e) => {
                            const updated = [...todos];
                            updated[originalIndex].draft = e.target.value;
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
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200 text-gray-900 dark:text-white"
                          autoFocus
                        />
                      ) : (
                        <div className="py-2">
                          <p className={`text-base sm:text-lg font-medium break-words ${todo.isCompleted
                            ? "line-through text-gray-500 dark:text-gray-400"
                            : "text-gray-800 dark:text-gray-200"
                            }`}>
                            {todo.todo}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-1">
                            {new Date(todo.createdAt).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 sm:gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 flex-shrink-0">
                    {/* Complete Toggle */}
                    <button
                      onClick={() => toggleComplete(originalIndex)}
                      disabled={isToggling}
                      className={`p-1.5 sm:p-2 rounded-xl transition-all duration-200 ${todo.isCompleted
                        ? 'bg-green-100 text-green-600 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        } disabled:opacity-50`}
                      title={todo.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {isToggling ? (
                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-current border-t-transparent"></div>
                      ) : todo.isCompleted ? (
                        <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>

                    {/* Edit/Save Button */}
                    {isEditing ? (
                      <button
                        onClick={() => editTodo(originalIndex, todo.draft || todo.todo)}
                        disabled={isEditingLoading}
                        className="p-1.5 sm:p-2 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200 disabled:opacity-50"
                        title="Save changes"
                      >
                        {isEditingLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-current border-t-transparent"></div>
                        ) : (
                          <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          const updated = [...todos];
                          updated[originalIndex].status = "editing";
                          updated[originalIndex].draft = updated[originalIndex].todo;
                          setTodos(updated);
                        }}
                        disabled={isEditingLoading || isToggling || isDeleting}
                        className="p-1.5 sm:p-2 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200 disabled:opacity-50"
                        title="Edit todo"
                      >
                        <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    )}

                    {/* Delete Button */}
                    <button
                      onClick={() => removeTodo(originalIndex)}
                      disabled={isDeleting}
                      className="p-1.5 sm:p-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200 disabled:opacity-50"
                      title="Delete todo"
                    >
                      {isDeleting ? (
                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-current border-t-transparent"></div>
                      ) : (
                        <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <SimpleModal
            isOpen={isModalOpen}
            onClose={function (): void {
              setIsModalOpen(false);
            }}
            title={"Duplicate Item"}
          ></SimpleModal>
        </main>
      </div>
    </div>
  );
}
