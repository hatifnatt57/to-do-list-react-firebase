import { useEffect } from 'react';
import { auth, firestore, storage } from '../firebase';
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, Timestamp, updateDoc } from 'firebase/firestore/lite';
import { deleteObject, listAll, ref } from 'firebase/storage';
import { signInAnonymously } from 'firebase/auth';

import { useTodosDispatch, useTodos } from '../utils/TodosContext';

import AddItem from './AddItem';
import ToDoItem from './ToDoItem';

/**
 * To-do list component.
 */
export default function ToDoList() {
  const todos = useTodos();
  const dispatch = useTodosDispatch();

  /**
   * Fetch data with identifiers from database, order by timestamp, dispatch.
   */
  useEffect(() => {
    async function getTodos() {
      await signInAnonymously(auth);
      const colRef = collection(firestore, 'to-do-items');
      const q = query(colRef, orderBy('timestamp'));
      const docs = await getDocs(q);
      const fetchedTodos = docs.docs.map(doc => {
        const { timestamp, ...docWithoutTimestamp } = doc.data();
        return { ...docWithoutTimestamp, id: doc.id }
      });
      dispatch({
        type: 'fetched',
        fetchedTodos
      })
    };
    getTodos();
  }, [dispatch]);

  /**
   * Sync database with the changes in state.
   * 
   * Uses flag properties in data objects (deleted, added, updated). 
   */
  useEffect(() => {
    if (todos.length === 0) return;
    async function updateDB() {
      for (let i = 0; i < todos.length; i++) {
        const item = todos[i];
        /**
         * Item's delete item button was pressed.
         * Delete item's firestore document and storage bucket folder.
         */
        if (item.deleted) {
          const docRef = doc(firestore, 'to-do-items', item.id);
          await deleteDoc(docRef);
          const storageFolderRef = ref(storage, item.id);
          const { items } = await listAll(storageFolderRef);
          for (let i = 0; i < items.length; i++) {
            await deleteObject(items[i]);
          };
          dispatch({
            type: 'deleted-from-db',
            id: item.id
          });
        }
        /**
         * New item was added.
         * Add document to firestore.
         */
        else if (item.added) {
          const timestamp = Timestamp.now();
          const { added, ...itemWithoutFlag } = item;
          const itemWithTimestamp = { ...itemWithoutFlag, timestamp };
          const colRef = collection(firestore, 'to-do-items');
          const docRef = await addDoc(colRef, itemWithTimestamp);
          dispatch({
            type: 'added-to-db',
            id: docRef.id
          });
        }
        /**
         * Existing item was updated.
         * Update firestore document.
         */
        else if (item.updated) {
          const docRef = doc(firestore, 'to-do-items', item.id);
          const { id, updated, ...itemWithoutFlagAndId } = item;
          await updateDoc(docRef, itemWithoutFlagAndId);
          dispatch({
            type: 'updated-in-db',
            id: docRef.id
          });
        }
      };
    }
    updateDB();
  }, [todos, dispatch])

  const todoItems = todos.map(todo => (
    // Check for id to filter out newly added items.
    todo.id && (
      <ToDoItem 
        todo={todo} 
        key={todo.id}
      />
    )
  )
  );

  return (
    <div className="to-do-list">
      <h1 className="to-do-list--title">Список дел</h1>
      <ul className="to-do-list--list">
        {todoItems}
        <AddItem />
      </ul>
    </div>
  )
}