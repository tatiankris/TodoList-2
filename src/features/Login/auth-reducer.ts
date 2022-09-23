import {authAPI, LoginParamsType} from "../../api/todolists-api";
import {Dispatch} from "redux";
import {setAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {clearDataAC} from "../TodolistsList/todolists-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


const initialState: AuthReducerStateType = {
    isLoggedIn: false

}
type AuthReducerStateType = {
    isLoggedIn: boolean
}
export const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setIsLoggedInAC(state , action: PayloadAction<{isLoggedValue: boolean}>) {
            state.isLoggedIn = action.payload.isLoggedValue
        }
    }})

export const {setIsLoggedInAC} = authSlice.actions

//thunks

export const loginTC = (data:LoginParamsType) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    authAPI.login(data)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({isLoggedValue: true}))
                dispatch(setAppStatusAC({status: 'succeeded'}));
            }
            else handleServerAppError(res.data, dispatch);
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch);
        })
}

export const logoutTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status:'loading'}))
    authAPI.logout()
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({isLoggedValue: false}))
                dispatch(setAppStatusAC({status:'succeeded'}));
                dispatch(clearDataAC());
            }
            else handleServerAppError(res.data, dispatch);
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch);
        })
}







