import {tasksSlice} from '../features/TodolistsList/tasks-reducer';
import {todolistsSlice} from '../features/TodolistsList/todolists-reducer';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunk from "redux-thunk";
import {appSlice} from "./app-reducer";
import {authSlice} from "../features/Login/auth-reducer";
import {configureStore} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";


const rootReducer = combineReducers({
    tasks: tasksSlice.reducer,
    todolists: todolistsSlice.reducer,
    app: appSlice.reducer,
    auth: authSlice.reducer,
})


export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk)
})


export type RootReducerType = typeof rootReducer
export type AppRootStateType = ReturnType<typeof rootReducer>

export type AppDispatchType = typeof store.dispatch
export const useAppDispatch: () => AppDispatchType = useDispatch

// @ts-ignore

window.store = store;
