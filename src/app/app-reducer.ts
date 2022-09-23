import {Dispatch} from "redux";
import {authAPI} from "../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


export const initialState: AppReducerStateType = {
    status: 'idle',
    error: null,
    isInitialized: false
}

//reducer

export const appSlice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        setAppStatusAC(state , action: PayloadAction<{status: RequestStatusType}>) {
            state.status = action.payload.status
        },
        setAppErrorAC(state, action: PayloadAction<{error: string | null}>) {
            state.error = action.payload.error
        },
        setAppInitializedAC(state , action: PayloadAction<{value: boolean}>) {
            state.isInitialized = action.payload.value
        },
    }
})

export const {setAppStatusAC, setAppErrorAC, setAppInitializedAC} = appSlice.actions


//thunks
export const initializeAppTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    authAPI.me()
        .then((res) => {
            if (res.data.resultCode === 0) {

                dispatch(setIsLoggedInAC({isLoggedValue: true}));
                dispatch(setAppStatusAC({status: 'succeeded'}));
            }
            else {
                handleServerAppError(res.data, dispatch);
            }
            dispatch(setAppInitializedAC({value: true}))
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch);
        })
}

//types
export type AppReducerStateType = {
    status: RequestStatusType
    error: string | null
    isInitialized: boolean
}

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

