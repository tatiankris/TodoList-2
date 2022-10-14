import {authAPI, LoginParamsType} from "../../api/todolists-api";
import {Dispatch} from "redux";
import {setAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {clearDataAC} from "../TodolistsList/todolists-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";

//thunks
export const loginTC = createAsyncThunk<undefined, LoginParamsType,
    { rejectValue: { errors: Array<string>, fieldsErrors: Array<{ error: string, field: string }> | undefined } }
    >
('auth/login', async (param, thunkAPI) => {

        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await authAPI.login(param)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}));
            return;

        } else {
            handleServerAppError(res.data, thunkAPI.dispatch);
            return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
        }
    } catch (error) {
        const err = error as AxiosError<any>
        handleServerNetworkError(err, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue({errors: [err.message], fieldsErrors: undefined})
    }
})

export const logoutTC = createAsyncThunk('auth/logout', async (arg, thunkAPI) =>{
    thunkAPI.dispatch(setAppStatusAC({status:'loading'}))
    try {
        const res = await authAPI.logout()
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}));
            thunkAPI.dispatch(clearDataAC());
            return;
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch);
            return thunkAPI.rejectWithValue({})
        }
    }
    catch (error) {
        const err = error as AxiosError
            handleServerNetworkError(err, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue({})
        }
})

//state
const initialState: AuthReducerStateType = {
    isLoggedIn: false

}
type AuthReducerStateType = {
    isLoggedIn: boolean
}

//reducer
export const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setIsLoggedInAC(state , action: PayloadAction<{isLoggedValue: boolean}>) {
            state.isLoggedIn = action.payload.isLoggedValue
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginTC.fulfilled, (state, action) => {
            state.isLoggedIn = true
        })
        builder.addCase(logoutTC.fulfilled, (state, action) => {
            state.isLoggedIn = false
        })
    }
})

export const {setIsLoggedInAC} = authSlice.actions













