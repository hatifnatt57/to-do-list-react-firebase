import ToDoList from './ToDoList';
import { TodosProvider } from '../utils/TodosContext';

/**
 * App component.
 */
export default function App() {
  return (
    <TodosProvider>
      <ToDoList />
    </TodosProvider>
  );
}