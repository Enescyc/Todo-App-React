import React from 'react';
import TodoBody from './TodoBody';
import TodoFilter from './TodoFilter';
import TodoForm from './TodoForm';


function Container() {



  return <>
    <div className='relative h-full w-full'>
      <div className='flex flex-col flex-wrap justify-center content-center 
          w-5/6 h-full  m-auto shadow-xl shadow-slate-800 border-2 bg-orange-100 p-5'>
        <div className='w-full h-full overflow-y-auto relative'>
          <TodoForm />
          <TodoBody />
          <TodoFilter></TodoFilter>
        </div>
      </div>
    </div>



  </>
}

export default Container;
