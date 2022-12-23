import ToDoItem from './ToDoItem';

/**
 * To-do list component.
 */
export default function ToDoList({ todos, handleNewItem, handleDone, handleUpdate, deleteById }) {
  const todoComponents = todos.map((todo, i) => (
      <ToDoItem 
        todo={todo} 
        key={i}
        todoId={i}
        handleDone={handleDone}
        deleteById={deleteById}
        handleUpdate={handleUpdate}
      />
    )
  );

  return (
    <div className="to-do-list">
      <h1 className="to-do-list--title">Список дел</h1>
      <ul className="to-do-list--list">
        {todoComponents}
        <li>
          <button className="to-do-list--new-item-btn" onClick={handleNewItem}>
            <svg viewBox="0 0 30 30">
              <path d="M27.8571 11.7857H18.2143V2.14286C18.2143 0.959598 17.2547 0 16.0714 0L13.9286 0C12.7453 0 11.7857 0.959598 11.7857 2.14286V11.7857H2.14286C0.959598 11.7857 0 12.7453 0 13.9286L0 16.0714C0 17.2547 0.959598 18.2143 2.14286 18.2143H11.7857V27.8571C11.7857 29.0404 12.7453 30 13.9286 30H16.0714C17.2547 30 18.2143 29.0404 18.2143 27.8571V18.2143H27.8571C29.0404 18.2143 30 17.2547 30 16.0714V13.9286C30 12.7453 29.0404 11.7857 27.8571 11.7857Z"/>
            </svg>
          </button>
        </li>
      </ul>
    </div>
  )
}