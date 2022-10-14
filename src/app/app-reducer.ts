import {Dispatch} from "redux";
import {authAPI} from "../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";

//thunks
export const initializeAppTC = createAsyncThunk('app/initializeApp', async (arg, thunkAPI) => {
        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
        try {
            const res = await authAPI.me()
            if (res.data.resultCode === 0) {
                thunkAPI.dispatch(setIsLoggedInAC({isLoggedValue: true}));
                thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}));
            } else {
                handleServerAppError(res.data, thunkAPI.dispatch);
            }
            return ;// thunkAPI.dispatch(setAppInitializedAC({value: true}))
        } catch (error) {
            const err = error as AxiosError
            handleServerNetworkError(err, thunkAPI.dispatch);
            return thunkAPI.rejectWithValue({})
        }
    }
)

//state
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
    },
    extraReducers: (builder) => {
    builder.addCase(initializeAppTC.fulfilled, (state, action) => {
        state.isInitialized = true
    })
    }}
)

export const {setAppStatusAC, setAppErrorAC} = appSlice.actions

//types
export type AppReducerStateType = {
    status: RequestStatusType
    error: string | null
    isInitialized: boolean
}

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

