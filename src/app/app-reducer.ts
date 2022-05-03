
//state
import {Dispatch} from "redux";
import {authAPI} from "../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {loginTC, setIsLoggedInAC, SetIsLoggedInType} from "../features/Login/auth-reducer";


export const InitialState: AppReducerStateType = {
    status: 'idle',
    error: null,
    isInitialized: false
}

//reducer
export const appReducer = (state: AppReducerStateType = InitialState, action: ActionsType) => {

    switch (action.type){
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case 'APP/SET-IS-INITIALIZED':
            return {...state, isInitialized: action.value}
        default:
            return state
    }
}

//actions
export const setAppStatusAC = (status: RequestStatusType) => {
    return {
        type: 'APP/SET-STATUS',
        status
    } as const
}
export const setAppErrorAC = (error: string | null) => {
    return {
        type: 'APP/SET-ERROR',
        error
    } as const
}
export const setAppInitializedAC = (value: boolean) => {
    return {
        type: 'APP/SET-IS-INITIALIZED',
        value
    } as const
}

//thunks
export const initializeAppTC = () => (dispatch: Dispatch<ThunkDispatch>) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.me()
        .then((res) => {
            if (res.data.resultCode === 0) {

                dispatch(setIsLoggedInAC(true));
                dispatch(setAppStatusAC('succeeded'));
            }
            else {
                handleServerAppError(res.data, dispatch);
            }
            dispatch(setAppInitializedAC(true))
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

export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
type ActionsType = SetAppErrorActionType | SetAppStatusActionType | ReturnType<typeof setAppInitializedAC>
type ThunkDispatch = ActionsType | SetAppErrorActionType | SetAppStatusActionType | SetIsLoggedInType