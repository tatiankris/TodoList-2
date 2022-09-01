import {authAPI, LoginParamsType} from "../../api/todolists-api";
import {Dispatch} from "redux";
import {SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {changeTodolistEntityStatusType, clearDataAC, ClearDataActionType} from "../TodolistsList/todolists-reducer";


const initialState: AuthReducerStateType = {
    isLoggedIn: false

}
type AuthReducerStateType = {
    isLoggedIn: boolean
}


export const authReducer = (state: AuthReducerStateType = initialState, action: ActionsType): AuthReducerStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN': {
            return {...state, isLoggedIn: action.isLoggedValue};
        }
        default:
            return state
    }
}

//actions
export const setIsLoggedInAC = (isLoggedValue: boolean) => ({type: 'login/SET-IS-LOGGED-IN', isLoggedValue} as const)


//thunks

export const loginTC = (data:LoginParamsType) => (dispatch: Dispatch<ThunkDispatch>) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.login(data)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true))
                dispatch(setAppStatusAC('succeeded'));
            }
            else handleServerAppError(res.data, dispatch);
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch);
        })
}

export const logoutTC = () => (dispatch: Dispatch<ThunkDispatch>) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.logout()
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(false))
                dispatch(setAppStatusAC('succeeded'));
                dispatch(clearDataAC());
            }
            else handleServerAppError(res.data, dispatch);
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch);
        })
}





//types
type ThunkDispatch = ActionsType | SetAppErrorActionType | SetAppStatusActionType | changeTodolistEntityStatusType
export type SetIsLoggedInType = ReturnType<typeof setIsLoggedInAC>
type ActionsType = SetIsLoggedInType | ClearDataActionType