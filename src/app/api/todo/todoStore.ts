// Simple in-memory data store for todos
// In a real application, this would be replaced with a database

export interface TodoItem {
  id: string;
  todo: string;
  isCompleted: boolean;
  createdAt: string;
}

// In-memory storage (will reset when server restarts)
let todos: TodoItem[] = [
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

export const TodoStore = {
  getAll: (): TodoItem[] => {
    return todos;
  },

  findById: (id: string): TodoItem | undefined => {
    return todos.find(todo => todo.id === id);
  },

  create: (todo: TodoItem): void => {
    todos.push(todo);
  },

  update: (id: string, updatedTodo: Partial<TodoItem>): boolean => {
    const index = todos.findIndex(todo => todo.id === id);
    if (index === -1) return false;
    
    todos[index] = { ...todos[index], ...updatedTodo };
    return true;
  },

  delete: (id: string): boolean => {
    const index = todos.findIndex(todo => todo.id === id);
    if (index === -1) return false;
    
    todos.splice(index, 1);
    return true;
  },

  exists: (id: string): boolean => {
    return todos.some(todo => todo.id === id);
  }
};