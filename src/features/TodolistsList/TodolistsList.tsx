import React, {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {
    addTodoListTC,
    changeTodolistFilterAC,
    changeTodolistTitleTC,
    fetchTodoListsTC,
    FilterValuesType,
    removeTodolistTC,
    TodolistDomainType
} from "./todolists-reducer";
import {addTaskTC, removeTaskTC, TasksStateType, updateTaskStatusTC, updateTaskTitleTC} from "./tasks-reducer";
import {TaskStatuses} from "../../api/todolists-api";
import Grid from "@mui/material/Grid";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import Paper from "@mui/material/Paper";
import {Todolist} from "./Todolist/Todolist";
import {Navigate} from "react-router-dom";


type PropsType = {
    demo?: boolean
}
export const TodolistsList: React.FC<PropsType> = ({demo = false}) => {

    const isLoggedIn = useSelector<AppRootStateType>((state) => state.auth.isLoggedIn)

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return
        }
        dispatch(fetchTodoListsTC());
    }, [])

    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const dispatch = useDispatch();

    const removeTask = useCallback(function (id: string, todolistId: string) {
        const thunk = removeTaskTC({taskId: id, todolistId: todolistId});
        dispatch(thunk);
    }, []);

    const addTask = useCallback(function (title: string, todolistId: string) {
        const thunk = addTaskTC({todolistId: todolistId, title: title})
        dispatch(thunk);
    }, []);

    const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
        const thunk = updateTaskStatusTC({taskId: id, todolistId: todolistId, status: status});
        dispatch(thunk);
    }, []);

    const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
        const thunk = updateTaskTitleTC({taskId: id, todolistId: todolistId, title: newTitle});
        dispatch(thunk);
    }, []);

    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        const action = changeTodolistFilterAC({id: todolistId, filter: value});
        dispatch(action);
    }, []);

    const removeTodolist = useCallback(function (id: string) {
        const thunk = removeTodolistTC(id);
        dispatch(thunk);
    }, []);

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        const thunk = changeTodolistTitleTC({todolistId: id, title: title});
        dispatch(thunk);
    }, []);

    const addTodolist = useCallback((title: string) => {
        const thunk = addTodoListTC(title);
        dispatch(thunk);
    }, [dispatch]);

    if (!isLoggedIn) {
        return <Navigate to={'/login'}/>
    }

    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id];

                    return <Grid item key={tl.id}>
                        <Paper style={{padding: '10px'}}>
                            <Todolist
                                todolist={tl}
                                tasks={allTodolistTasks}
                                removeTask={removeTask}
                                changeFilter={changeFilter}
                                addTask={addTask}
                                changeTaskStatus={changeStatus}
                                removeTodolist={removeTodolist}
                                changeTaskTitle={changeTaskTitle}
                                changeTodolistTitle={changeTodolistTitle}
                                demo={demo}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}