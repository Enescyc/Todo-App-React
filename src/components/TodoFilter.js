import React from 'react';
import { useTodoContext } from '../context/TodoContext';

function TodoFilter() {
  const context = useTodoContext();
  const [todo, setTodo] = [context.todo, context.setTodo];



  return <div className='sticky b-0 m-auto  bg-orange-100'>
    <div className='flex flex-wrap w-full h-4 mb-3 pb-12 sm:justify-center md:justify-around justify-between items-center font-mono'>
      <div className='self-center p-2'>
        <h5 className='text-md font-bold text-center'>{context.todoCount + " items left"}</h5>
      </div>
      <div className='flex flex-wrap items-center justify-center '>
        <button onClick={() => context.setFilter(0)} className='w-24 h-6 m-2 focus:bg-red-900 bg-slate-800 text-white rounded-lg text-sm '>All</button>
        <button onClick={() => context.setFilter(1)} className='w-24 h-6 m-2 focus:bg-red-900 bg-slate-800 text-white rounded-lg text-sm'>Active</button>
        <button onClick={() => context.setFilter(-1)} className='w-24 h-6 m-2  focus:bg-red-900 bg-slate-800 text-white rounded-lg text-sm'>Completed</button>
      </div>
      <div className='flex flex-wrap items-center justify-center'>
        <h1
          onClick={() => setTodo(todo.filter(value => value.isCompleted === false))}
          className=" hover:cursor-pointer text-sm text-black text-md font-bold text-center"><p className='ml-2 mr-2'>Clear Completed</p></h1>
      </div>
    </div>
  </div>;
}

export default TodoFilter;
