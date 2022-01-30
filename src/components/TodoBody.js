import React, { useEffect } from 'react';
import { useTodoContext } from '../context/TodoContext';

function TodoBody() {
  const context = useTodoContext();
  const onButtonClick = (item) => {
    const filtered = context.todo.filter(todos => todos !== item)
    context.setTodo(filtered)
  }

  const onCheckedChange = (e, index) => {
    const cloneState = context.todo.slice();
    cloneState[index].isCompleted = !cloneState[index].isCompleted;
    context.setTodo(cloneState);

  }
  // 0 all 
  // 1 active 
  // 2 completed 

  const filterItems = (todo) => {
    return context.filter === 0 ? todo
      : context.filter === 1 ? todo.filter(value => value.isCompleted === false)
        : context.filter === -1 ? todo.filter(value => value.isCompleted === true)
          : false
  };

  useEffect(() => {
    filterItems(context.todo);


  })

  const filteredItem = filterItems(context.todo)



  const todoList = (filteredItem) =>
    filteredItem.map((todos, index) => {


      return (


        todos != null && context.visible ?
          <li key={index}>
            <div className='flex h-full justify-between items-center border-b-2 border-b-black'>
              <input onChange={(e) => onCheckedChange(e, index)}
                type={"checkbox"}
                datatype='boolean'
                checked={todos.isCompleted}
                className="h-4 w-4 mr-5" />
              {todos.isCompleted ?

                <h1 className='text-2xl opacity-50 line-through'>{todos.content} </h1> :
                <h1 className='text-2xl'>{todos.content}</h1>}
              <span>
                <button id={index} onClick={() => onButtonClick(todos)}>
                  <svg xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            </div>
          </li>
          : false)

    })


  return <div className=''>
    <ul className='w-full overflow-x-hidden '>
      {todoList(filteredItem)}
    </ul>
  </div>;
}

export default TodoBody;

