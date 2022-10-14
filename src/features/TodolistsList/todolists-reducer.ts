import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {Dispatch} from "redux";
import {
    RequestStatusType,
    setAppStatusAC
} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {fetchTasksTC} from "./tasks-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";

//thunks
export const fetchTodoListsTC = createAsyncThunk(
    'todolists/fetchTodoLists', async (arg, thunkAPI) => {

        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
        const res = await todolistsAPI.getTodolists()
        thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}));
        res.data.forEach(tl => {
            thunkAPI.dispatch(fetchTasksTC(tl.id))
        })
        return {todolists: res.data}


    }
)

export const addTodoListTC = createAsyncThunk(
    'todolists/addTodoList', async (title: string, {dispatch, rejectWithValue}) => {

        dispatch(setAppStatusAC({status: 'loading'}))
        try {
            const res = await todolistsAPI.createTodolist(title)
            if (res.data.resultCode === 0) {
              //  dispatch(addTodolistAC({todolist: res.data.data.item}));
                dispatch(setAppStatusAC({status: 'succeeded'}));
                return {todolist: res.data.data.item}
            }
            else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue({})
            }

        } catch (error) {
            const err = error as AxiosError
            handleServerNetworkError(err, dispatch);
            return rejectWithValue({})
        }}
)

export const removeTodolistTC = createAsyncThunk(
    'todolists/removeTodolist', async (todolistId: string, {dispatch, rejectWithValue}) => {

        dispatch(setAppStatusAC({status: 'loading'}))
        dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'loading'}))
        try {
            const res = await todolistsAPI.deleteTodolist(todolistId)
            if (res.data.resultCode === 0) {
                dispatch(setAppStatusAC({status: 'succeeded'}));
                return {id: todolistId}
            }
            else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue({})
            }

        } catch (error) {
            const err = error as AxiosError
            handleServerNetworkError(err, dispatch);
            return rejectWithValue({})
        }}
)

export const changeTodolistTitleTC = createAsyncThunk('todolists/changeTodolistTitle',
    async ({todolistId, title}: {todolistId: string, title: string}, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'loading'}))
    try {
        const res = await todolistsAPI.updateTodolist(todolistId, title)
        if (res.data.resultCode === 0) {
            dispatch(setAppStatusAC({status: 'succeeded'}));
            dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'succeeded'}))
            return {id: todolistId, title: title}
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue({})
        }
    } catch (error) {
            const err = error as AxiosError
            handleServerNetworkError(err, dispatch);
            return rejectWithValue({})
        }
})


//state
const initialState: Array<TodolistDomainType> = [
    /*{id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
    {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0}*/
]

//reducer
export const todolistsSlice = createSlice({
    name: 'todolists',
    initialState,
    reducers: {
        changeTodolistFilterAC(state, action: PayloadAction<{id: string, filter: FilterValuesType}>) {
            let index = state.findIndex(tl => tl.id === action.payload.id);
            state[index].filter = action.payload.filter;
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{id: string, status: RequestStatusType}>) {
            let index = state.findIndex(tl => tl.id === action.payload.id);
            state[index].entityStatus = action.payload.status;
        },
        clearDataAC(state) {
            state = [];
        },
    },
    extraReducers: (build) => {
        build.addCase(fetchTodoListsTC.fulfilled, (state, action) => {
            return action.payload.todolists.map(tl => ({...tl, filter:<FilterValuesType> 'all', entityStatus: 'idle'}))
        })
        build.addCase(addTodoListTC.fulfilled, (state, action) => {
            state.push({...action.payload.todolist, filter:<FilterValuesType> 'all', entityStatus: 'idle'});
        })
        build.addCase(removeTodolistTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.id);
            if (index > -1) {
                state.splice(index, 1);
            }
        })
        build.addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
            let index = state.findIndex(tl => tl.id === action.payload.id);
            state[index].title = action.payload.title;
        })
}
})

export const { changeTodolistFilterAC,
    changeTodolistEntityStatusAC, clearDataAC} = todolistsSlice.actions;

//types
export type FilterValuesType = 'all' | 'active' | 'completed';

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

