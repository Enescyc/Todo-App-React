import React from 'react';
import { useTodoContext } from '../context/TodoContext';

function TodoForm() {
  const context = useTodoContext();
  const todoObject = { isCompleted: false, content: "" }
  const formSubmit = (e) => {
    context.setTodo([...context.todo, todoObject])
    e.preventDefault();
    e.target.children.todo.value = "";

  }
  return <div>

    <div className='flex content-center justify-start'>
      <span className='mt-2 hover:cursor-pointer' onClick={() => context.setVisible(!context.visible)} >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </span>
      <form onSubmit={formSubmit} className='w-full'>
        <input
          onChange={(e) => { todoObject.content = e.target.value }}
          id="todo"
          type={"text"}
          className='w-full h-12 outline-none text-center text-3xl bg-orange-100' placeholder='Add a new Todo'></input>
      </form>
    </div>
  </div>;
}

export default TodoForm;
