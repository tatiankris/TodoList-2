import {
    addTodoListTC,
    changeTodolistEntityStatusAC,
    clearDataAC,
    fetchTodoListsTC,
    removeTodolistTC
} from './todolists-reducer';
import {TaskStatuses, TaskType, todolistsAPI } from '../../api/todolists-api'
import {Dispatch} from "redux";
import {AppRootStateType} from "../../app/store";
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";

//thunks
export const fetchTasksTC = createAsyncThunk(
    'tasks/fetchTasks', async (todolistID: string, thunkAPI) => {

        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))

        const res = await todolistsAPI.getTasks(todolistID)
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return {tasks: res.data.items, todolistId: todolistID}
        }

)

export const addTaskTC = createAsyncThunk(
    'tasks/addTask', async ({todolistId, title}: {todolistId: string, title: string}, thunkAPI) => {

        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
        thunkAPI.dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'loading'}))
    try {
        const res = await todolistsAPI.createTask(todolistId, title)
        if (res.data.resultCode === 0) {
            // thunkAPI.dispatch(addTaskAC({task: res.data.data.item}));
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}));
            thunkAPI.dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'succeeded'}))
            return {task: res.data.data.item};
        }
        else {
            handleServerAppError(res.data, thunkAPI.dispatch);
            return thunkAPI.rejectWithValue({})
        }

    } catch (error) {
            const err = error as AxiosError
            handleServerNetworkError(err, thunkAPI.dispatch);
            return thunkAPI.rejectWithValue({})
    }}
)

export const removeTaskTC = createAsyncThunk(
    'tasks/removeTask', async ({taskId, todolistId}: {taskId: string, todolistId: string}, thunkAPI) => {

        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
        thunkAPI.dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'loading'}))
        try {
            const res = await todolistsAPI.deleteTask(todolistId, taskId)
            if (res.data.resultCode === 0) {
                // dispatch(removeTaskAC({taskId: taskId, todolistId: todolistId}))
                thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}));
                thunkAPI.dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'succeeded'}))
                return {taskId: taskId, todolistId: todolistId}
            }
            else {
                handleServerAppError(res.data, thunkAPI.dispatch);
                return thunkAPI.rejectWithValue({})
            }

        } catch (error) {
            const err = error as AxiosError
            handleServerNetworkError(err, thunkAPI.dispatch);
            return thunkAPI.rejectWithValue({})
        }}
)

export const updateTaskStatusTC = createAsyncThunk(
    'tasks/updateTaskStatus', async ({taskId, todolistId, status}: {taskId: string, todolistId: string, status: TaskStatuses}, thunkAPI) => {

        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
        const state = thunkAPI.getState() as AppRootStateType
        const allTasksFromState = state.tasks
        const tasksForCurrentTodolist = allTasksFromState[todolistId]
        const task = tasksForCurrentTodolist.find( t => {
            return t.id === taskId
        })

        if (task) {
            try {
            const res = await todolistsAPI.updateTask(todolistId, taskId, {
                title: task.title,
                description: task.description,
                status: status,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline
            })
            if (res.data.resultCode === 0) {
               // dispatch(changeTaskStatusAC({taskId: taskId, status: status, todolistId: todolistId}))
                thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}));
                return {taskId: taskId, status: status, todolistId: todolistId}
            }
            else {
                handleServerAppError(res.data, thunkAPI.dispatch);
                return thunkAPI.rejectWithValue({})
            }

        } catch (error) {
            const err = error as AxiosError
            handleServerNetworkError(err, thunkAPI.dispatch);
            return thunkAPI.rejectWithValue({})
        }} else {
            return thunkAPI.rejectWithValue({})
        }
    }
)

export const updateTaskTitleTC = createAsyncThunk(
    'tasks/updateTaskTitle', async ({taskId, todolistId, title}: {taskId: string, todolistId: string, title: string}, thunkAPI) => {

        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))

        const state = thunkAPI.getState() as AppRootStateType
        const allTasksFromState = state.tasks
        const tasksForCurrentTodolist = allTasksFromState[todolistId]
        const task = tasksForCurrentTodolist.find( t => {
            return t.id === taskId
        })

        if (task) {
            try {
                const res = await todolistsAPI.updateTask(todolistId, taskId, {
                    title: title,
                    description: task.description,
                    status: task.status,
                    priority: task.priority,
                    startDate: task.startDate,
                    deadline: task.deadline
                })
                if (res.data.resultCode ===  0) {
                   // dispatch(changeTaskTitleAC({taskId: taskId, title: title, todolistId: todolistId}))
                    thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}));
                    return {taskId: taskId, title: title, todolistId: todolistId}
                }
                else {
                    handleServerAppError(res.data, thunkAPI.dispatch);
                    return thunkAPI.rejectWithValue({})
                }

            } catch (error) {
                const err = error as AxiosError
                handleServerNetworkError(err, thunkAPI.dispatch);
                return thunkAPI.rejectWithValue({})
            }} else {
            return thunkAPI.rejectWithValue({})
        }
    }
)

//state
const initialState: TasksStateType = {}

//reducer
export const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        builder.addCase(addTodoListTC.fulfilled, (state, action) => {
            state[action.payload.todolist.id] = []
        });
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            delete state[action.payload.id]
        });
        builder.addCase(fetchTodoListsTC.fulfilled, (state, action) => {
            action.payload.todolists.forEach(t => {
                state[t.id] = []
            })
        });
        builder.addCase(clearDataAC, (state) => {
            state = {}
        });
        builder.addCase(fetchTasksTC.fulfilled, (state, action) => {
            state[action.payload.todolistId] = action.payload.tasks
        });
        builder.addCase(addTaskTC.fulfilled, (state, action) => {
            state[action.payload.task.todoListId].push(action.payload.task);
        });
        builder.addCase(removeTaskTC.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId]
            const taskIndex = tasks.findIndex(t => t.id === action.payload.taskId)
            tasks.splice(taskIndex, 1);
        });
        builder.addCase(updateTaskStatusTC.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId]
            const taskIndex = tasks.findIndex(t => t.id === action.payload.taskId)
            tasks[taskIndex].status = action.payload.status
        });
        builder.addCase(updateTaskTitleTC.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId]
            const taskIndex = tasks.findIndex(t => t.id === action.payload.taskId)
            tasks[taskIndex].title = action.payload.title
        });

    }
    })

export const {} = tasksSlice.actions

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

export type TasksStateDomainType = TasksStateType & {
    entityStatus: RequestStatusType
}