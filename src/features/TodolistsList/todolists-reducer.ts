import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {Dispatch} from "redux";
import {
    RequestStatusType,
    setAppStatusAC
} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {fetchTasksTC} from "./tasks-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: Array<TodolistDomainType> = [
    /*{id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
    {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0}*/
]

export const todolistsSlice = createSlice({
    name: 'todolists',
    initialState,
    reducers: {
        removeTodolistAC(state, action: PayloadAction<{id: string}>) {
            const index = state.findIndex(tl => tl.id === action.payload.id);
            if (index > -1) {
                state.splice(index, 1);
            }
        },
        addTodolistAC(state, action: PayloadAction<{todolist: TodolistType}>) {
            state.push({...action.payload.todolist, filter:<FilterValuesType> 'all', entityStatus: 'idle'});
        },
        changeTodolistTitleAC(state, action: PayloadAction<{id: string, title: string}>) {
            let index = state.findIndex(tl => tl.id === action.payload.id);
            state[index].title = action.payload.title;
        },
        changeTodolistFilterAC(state, action: PayloadAction<{id: string, filter: FilterValuesType}>) {
            let index = state.findIndex(tl => tl.id === action.payload.id);
            state[index].filter = action.payload.filter;
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{id: string, status: RequestStatusType}>) {
            let index = state.findIndex(tl => tl.id === action.payload.id);
            state[index].entityStatus = action.payload.status;
        },
        setTodolistsAC(state, action: PayloadAction<{todolists: Array<TodolistType>}>) {
           return action.payload.todolists.map(tl => ({...tl, filter:<FilterValuesType> 'all', entityStatus: 'idle'}))
        },
        clearDataAC(state) {
            state = [];
        },
    },
})

export const {removeTodolistAC, addTodolistAC, changeTodolistTitleAC, changeTodolistFilterAC,
    changeTodolistEntityStatusAC, setTodolistsAC, clearDataAC} = todolistsSlice.actions;

//thunks
export const fetchTodoListsTC = () => (dispatch: any) => {
    dispatch(setAppStatusAC({status: 'loading'}))
        todolistsAPI.getTodolists()
            .then((res) => {
                dispatch(setTodolistsAC({todolists: res.data}));
                dispatch(setAppStatusAC({status: 'succeeded'}));
                return res.data;
            })
            .then((todos)=> {
                todos.forEach(tl => {
                    dispatch(fetchTasksTC(tl.id));
                })
            })
}
export const addTodoListTC = (title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(addTodolistAC({todolist: res.data.data.item}));
                    dispatch(setAppStatusAC({status: 'succeeded'}));
                }
                else handleServerAppError(res.data, dispatch);

            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch);
            })
}
export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    debugger
    dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'loading'}))
        todolistsAPI.deleteTodolist(todolistId)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(removeTodolistAC({id: todolistId}));
                    dispatch(setAppStatusAC({status: 'succeeded'}));
                }
                else handleServerAppError(res.data, dispatch);
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch);
            })
}
export const changeTodolistTitleTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'loading'}))
        todolistsAPI.updateTodolist(todolistId, title)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(setAppStatusAC({status: 'succeeded'}));
                    dispatch(changeTodolistTitleAC({id: todolistId, title: title}));
                    dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'succeeded'}))
                }
                else handleServerAppError(res.data, dispatch);
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch);
            })
}

//types
export type FilterValuesType = 'all' | 'active' | 'completed';

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

