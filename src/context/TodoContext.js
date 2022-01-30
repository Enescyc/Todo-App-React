import { useContext, createContext, useState, useEffect } from "react";



const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
    const [todo, setTodo] = useState([
        {
            isCompleted:true,
            content:"Learn React"
        },
        {
            isCompleted:false,
            content:"Use React"
        },
        {
            isCompleted:false,
            content:"Repeat 100 Times"
        },
    ]);
   
    const [todoCount,setTodoCount] = useState(todo.length>1 ? todo.filter(value => value.isCompleted===false).length : 1);

    const [filter,setFilter] = useState(0);
    
    const [visible,setVisible]= useState(true);
    const values = {
        todo,
        setTodo,
        todoCount,
        filter,
        setFilter,
        visible,
        setVisible
    };

    useEffect(()=> {setTodoCount(todo.length>0 ? todo.filter(value => value.isCompleted===false).length : 0)},[todo])

    return <TodoContext.Provider value={values}>{children}</TodoContext.Provider>
}


export const useTodoContext = () => useContext(TodoContext);
