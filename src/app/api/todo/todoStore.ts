import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  setDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

export interface TodoItem {
  id: string;
  todo: string;
  isCompleted: boolean;
  createdAt: string;
}

const COLLECTION_NAME = "todos";

export const TodoStore = {
  getAll: async (): Promise<TodoItem[]> => {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const result = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as TodoItem)
    );

    return result ?? [];
  },

  findById: async (id: string): Promise<TodoItem | undefined> => {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as TodoItem;
    }
    return undefined;
  },

  create: async (todoData: TodoItem): Promise<string> => {
    // Use the ID from the object
    const docRef = doc(db, "todos", todoData.id); // set custom doc id
    await setDoc(docRef, {
      ...todoData,
      createdAt: new Date().toISOString(), // optional, override timestamp
    });
    return docRef.id;
  },

  update: async (
    id: string,
    updatedTodo: Partial<TodoItem>
  ): Promise<boolean> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, updatedTodo);
      return true;
    } catch (error) {
      return false;
    }
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      return true;
    } catch (error) {
      return false;
    }
  },

  exists: async (id: string): Promise<boolean> => {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  },
};
