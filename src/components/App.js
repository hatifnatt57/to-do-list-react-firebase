import { useEffect, useState } from 'react';
import { auth, firestore, storage } from '../firebase';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore/lite';
import { deleteObject, listAll, ref } from 'firebase/storage';
import { signInAnonymously } from 'firebase/auth';

import dayjs from 'dayjs';

import ToDoList from './ToDoList';

/**
 * App component.
 */
export default function App() {
  /**
   * App state.
   */
  const [todos, setTodos] = useState([]);

  /**
   * Fetch data with identifiers from database, update app state.
   * Runs only on first render.
   */
  useEffect(() => {
    async function getTodos() {
      await signInAnonymously(auth);
      const colRef = collection(firestore, 'to-do-items');
      const docs = await getDocs(colRef);
      const itemsList = docs.docs.map(doc => {
        return {...doc.data(), id: doc.id}
      });
      setTodos(itemsList);
    };
    getTodos();
  }, []);

  /**
   * Runs when app state changes.
   * 
   * Sync database with the changes. 
   */
  useEffect(() => {
    if (todos.length === 0) return;
    async function updateDB() {
      let idToPassToNewItem = null;
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
        }
        /**
         * New item was added.
         * Add document to firestore.
         */
        else if (!item.id) {
          const colRef = collection(firestore, 'to-do-items');
          const docRef = await addDoc(colRef, item);
          idToPassToNewItem = docRef.id;
        }
        /**
         * Existing item was updated.
         * Update firestore document.
         */
        else {
          const docRef = doc(firestore, 'to-do-items', item.id);
          const { id, ...itemWithNoId } = item;
          await updateDoc(docRef, itemWithNoId);
        }
      };
      /**
       * If new item was added, set its id field with the firestore-generated id.
       */
      if (idToPassToNewItem) {
        setTodos(todos.map((todo, i) => {
          if (i === todos.length - 1)
            return {...todo, id: idToPassToNewItem};
          return todo;
        }));
      };
    }
    updateDB();
  }, [todos])

  /**
   * New to-do item button click handler.
   * 
   * Update app state with placeholder item.
   */
  function handleNewItem() {
    const newDeadline = dayjs().add(7, 'day').format('YYYY-MM-DD');
    const newItem = { 
      title: 'Название', 
      description: 'Описание', 
      deadline: newDeadline, 
      done: false, 
      attachments: [] 
    };
    setTodos([...todos, newItem]);
  }

  /**
   * Item done button click handler to be passed as a prop.
   * 
   * Update app state accordingly.
   * 
   * @param {number} id To-do item id.
   */
  function handleDone(id) {
    setTodos(
      todos.map((todo, i) => {
        if (i === id)
          return { ...todo, done: !todo.done };
        else
          return todo;
      })
    )
  }

  /**
   * Flag to-do item in app state as to be deleted.
   * This flag will be interpreted when syncing the database 
   * with state changes in useEffect of this component.
   * 
   * @param {number} id To-do item id.
   */
  function deleteById(id) {
    setTodos(
      todos.map((todo, i) => {
        if (i === id)
          return { ...todo, deleted: true };
        else
          return todo;
      })
    )
  }

  /**
   * Update to-do item's app state entry with new/changed fields.
   * 
   * @param {number} id To-do item id.
   * @param {object} changedItem Object, containing new/changed fields.
   */
  function handleUpdate(id, changedItem) {
    setTodos(
      todos.map((todo, i) => {
        if (i === id)
          return {...todo, ...changedItem};
        else
          return todo;
      })
    )
  }

  return (
    <ToDoList
      todos={todos}
      handleNewItem={handleNewItem}
      handleDone={handleDone}
      deleteById={deleteById}
      handleUpdate={handleUpdate}
    />
  );
}