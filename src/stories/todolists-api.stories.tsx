import React, {useEffect, useState} from 'react';
import {todolistsAPI} from "../api/todolists-api";

export default {
    title: 'TODOLISTS-API',
}



export const GetTodoLists = () => {

    const [state, setState] = useState<any>(null);

    useEffect (() => {
        todolistsAPI.getTodolists()
            .then((res) => {
                setState(res.data);
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>

}

export const CreateTodoLists = () => {

    const [state, setState] = useState<any>(null);

    useEffect (() => {
        const title = "List of SOMTH"
        todolistsAPI.createTodolist(title)
            .then((res) => {

                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>

}

export const DeleteTodoLists = () => {

    const [state, setState] = useState<any>(null);
    const [todolistId, setTodolistId] = useState<string>('');

    const deleteTodoList = () => {
        todolistsAPI.deleteTodolist(todolistId)
            .then((res) => {
                setState(res.data)
            })
    }

    return <div>{JSON.stringify(state)}
        <div>
            <input placeholder={'todolistId'} value={todolistId}
                   onChange={(e) => {
                       setTodolistId(e.currentTarget.value)
                   }}
            />

            <button onClick={deleteTodoList}>delete todolist</button>
        </div>
    </div>

}

export const UpdateTodoLists = () => {

    const [state, setState] = useState<any>(null);
    const [todolistId, setTodolistId] = useState<string>('');
    const [todolistTitle, setTodolistTitle] = useState<string>('');

    const updateTodolist = () => {

        todolistsAPI.updateTodolist(todolistId, todolistTitle)
            .then((res) => {
                setState(res.data)
            })
    }

    return <div>{JSON.stringify(state)}
        <div>
            <input placeholder={'todolistId'} value={todolistId}
                   onChange={(e) => {setTodolistId(e.currentTarget.value)}}/>
            <input placeholder={'taskTitle'} value={todolistTitle}
                   onChange={(e) => {setTodolistTitle(e.currentTarget.value)}}/>
            <button onClick={updateTodolist}>update todolist</button>
        </div>
    </div>

}






