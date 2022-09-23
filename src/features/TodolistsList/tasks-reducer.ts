import {addTodolistAC, changeTodolistEntityStatusAC, clearDataAC,
    removeTodolistAC, setTodolistsAC} from './todolists-reducer';
import {TaskStatuses, TaskType, todolistsAPI } from '../../api/todolists-api'
import {Dispatch} from "redux";
import {AppRootStateType} from "../../app/store";
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";



const initialState: TasksStateType = {}


export const tasksSlice = createSlice({
    name: 'todolists',
    initialState,
    reducers: {
        removeTaskAC(state, action: PayloadAction<{taskId: string, todolistId: string}>) {
            const tasks = state[action.payload.todolistId]
            const taskIndex = tasks.findIndex(t => t.id === action.payload.taskId)
            tasks.splice(taskIndex, 1);
        },
        addTaskAC(state, action: PayloadAction<{task: TaskType}>) {
            state[action.payload.task.todoListId].push(action.payload.task);
        },
        changeTaskStatusAC(state, action: PayloadAction<{taskId: string, status: TaskStatuses, todolistId: string}>) {
            const tasks = state[action.payload.todolistId]
            const taskIndex = tasks.findIndex(t => t.id === action.payload.taskId)
            tasks[taskIndex].status = action.payload.status
        },
        changeTaskTitleAC(state, action: PayloadAction<{taskId: string, title: string, todolistId: string}>) {
            const tasks = state[action.payload.todolistId]
            const taskIndex = tasks.findIndex(t => t.id === action.payload.taskId)
            tasks[taskIndex].title = action.payload.title
        },
        setTasksAC(state, action: PayloadAction<{tasks: Array<TaskType>, todolistId: string}>) {
            state[action.payload.todolistId] = action.payload.tasks
        },
    },
    extraReducers: (builder) => {

        builder.addCase(addTodolistAC, (state, action) => {
            state[action.payload.todolist.id] = []
        });
        builder.addCase(removeTodolistAC, (state, action) => {
            delete state[action.payload.id]
        });
        builder.addCase(setTodolistsAC, (state, action) => {
            action.payload.todolists.forEach(t => {
                state[t.id] = []
            })
        });
        builder.addCase(clearDataAC, (state) => {
            state = {}

        });
    }
    })

export const {removeTaskAC, addTaskAC, changeTaskStatusAC, changeTaskTitleAC,
    setTasksAC} = tasksSlice.actions

//actions

//thunks
export const fetchTasksTC = (todolistID: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
        todolistsAPI.getTasks(todolistID)
            .then((res) => {
                    dispatch(setTasksAC( {tasks: res.data.items, todolistId: todolistID}))
                    dispatch(setAppStatusAC({status: 'succeeded'}));
                })
            .catch((error) => {
                handleServerNetworkError(error, dispatch);
            })
}
export const addTaskTC = ( todolistId: string, title: string ) => (dispatch: Dispatch) => {

    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'loading'}))
        todolistsAPI.createTask(todolistId, title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(addTaskAC({task: res.data.data.item}));
                    dispatch(setAppStatusAC({status: 'succeeded'}));
                    dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'succeeded'}))
                }
                else handleServerAppError(res.data, dispatch);
                })
            .catch((error) => {
                handleServerNetworkError(error, dispatch);
            })

}
export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'loading'}))
        todolistsAPI.deleteTask(todolistId, taskId)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(removeTaskAC({taskId: taskId, todolistId: todolistId}))
                    dispatch(setAppStatusAC({status: 'succeeded'}));
                    dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'succeeded'}))
                }
                else handleServerAppError(res.data, dispatch);
                })
            .catch((error) => {
                handleServerNetworkError(error, dispatch);
            })
}
export const updateTaskStatusTC = (taskId: string, todolistId: string, status: TaskStatuses) => {
    return (dispatch: Dispatch, getState: () => AppRootStateType) => {

        dispatch(setAppStatusAC({status: 'loading'}))
        const allTasksFromState = getState().tasks
        const tasksForCurrentTodolist = allTasksFromState[todolistId]
        const task = tasksForCurrentTodolist.find( t => {
            return t.id === taskId
        })

        if (task) {
            todolistsAPI.updateTask(todolistId, taskId, {
                title: task.title,
                description: task.description,
                status: status,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline
            })
                .then(res => {
                    if (res.data.resultCode === 0) {
                        dispatch(changeTaskStatusAC({taskId: taskId, status: status, todolistId: todolistId}))
                        dispatch(setAppStatusAC({status: 'succeeded'}));
                    }
                    else handleServerAppError(res.data, dispatch);
                    })
                .catch((error) => {
                    handleServerNetworkError(error, dispatch);
                })
        }}
}
export const updateTaskTitleTC = (taskId: string, todolistId: string, title: string) => {

    return (dispatch: Dispatch, getState: () => AppRootStateType) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        const allTasksFromState = getState().tasks
        const tasksForCurrentTodolist = allTasksFromState[todolistId]
        const task = tasksForCurrentTodolist.find( t => {
            return t.id === taskId
        })

        if (task) {
            todolistsAPI.updateTask(todolistId, taskId, {
                title: title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline
            })
                .then(res => {
                    if (res.data.resultCode === 0) {
                        dispatch(changeTaskTitleAC({taskId: taskId, title: title, todolistId: todolistId}))
                        dispatch(setAppStatusAC({status: 'succeeded'}));
                    }
                    else handleServerAppError(res.data, dispatch);
                })
                .catch((error) => {
                    handleServerNetworkError(error, dispatch);
                })
        }}
}

//types

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

export type TasksStateDomainType = TasksStateType & {
    entityStatus: RequestStatusType
}