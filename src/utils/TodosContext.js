import { createContext, useContext, useReducer } from 'react';
import dayjs from 'dayjs';

const TodosContext = createContext(null);
const TodosDispatchContext = createContext(null);

export function TodosProvider({ children }) {
  const [todos, dispatch] = useReducer(todosReducer, []);

  return (
    <TodosContext.Provider value={todos}>
      <TodosDispatchContext.Provider value={dispatch}>
        {children}
      </TodosDispatchContext.Provider>
    </TodosContext.Provider>
  )
}

export function useTodos() {
  return useContext(TodosContext);
}

export function useTodosDispatch() {
  return useContext(TodosDispatchContext);
}

function todosReducer(todos, action) {
  switch (action.type) {
    case 'fetched': {
      return action.fetchedTodos;
    }
    case 'added': {
      const newDeadline = dayjs().add(7, 'day').format('YYYY-MM-DD');
      const newItem = { 
        title: 'Название', 
        description: 'Описание', 
        deadline: newDeadline, 
        done: false, 
        attachments: [],
        added: true
      };
      return [...todos, newItem];
    }
    case 'updated': {
      return todos.map(todo => {
        if (todo.id === action.id)
          return { ...todo, ...action.changedFields, updated: true };
        else
          return todo;
      });
    }
    case 'deleted': {
      return todos.map(todo => {
        if (todo.id === action.id)
          return { ...todo, deleted: true };
        else
          return todo;
      });
    }
    case 'added-to-db': {
      return todos.map(todo => {
        if (todo.added) {
          const { added, timestamp, ...todoWithNoFlagAndTimestamp } = todo;
          return { ...todoWithNoFlagAndTimestamp, id: action.id };
        }
        else
          return todo;
      });
    }
    case 'updated-in-db': {
      return todos.map(todo => {
        if (todo.updated) {
          const { updated, ...todoWithNoFlag } = todo;
          return todoWithNoFlag;
        }
        else
          return todo;
      })
    }
    case 'deleted-from-db': {
      return todos.filter(todo => todo.id !== action.id);
    }
    default: {
      throw Error(`Unknown action: ${action.type}`);
    }
  }
}