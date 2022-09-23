import {setAppErrorAC, SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from "../app/app-reducer";
import {ResponseType} from '../api/todolists-api'
import {Dispatch} from "redux";



// generic function
export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch<SetAppStatusActionType | SetAppErrorActionType>) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC({error: data.messages[0]}))
    } else {
        dispatch(setAppErrorAC({error:'Some error occurred'}))
    }
    dispatch(setAppStatusAC({status: 'failed'}))
}

export const handleServerNetworkError = (error: {message: string} , dispatch: Dispatch<SetAppStatusActionType | SetAppErrorActionType>) => {
    dispatch(setAppStatusAC({status: 'failed'}))
    dispatch(setAppErrorAC({error: error.message}))
}
