
//state
export const InitialState: AppReducerStateType = {
    status: 'idle',
    error: null
}

//reducer
export const appReducer = (state: AppReducerStateType = InitialState, action: ActionsType) => {

    switch (action.type){
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
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

//thunks


//types
export type AppReducerStateType = {
    status: RequestStatusType
    error: string | null
}

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
type ActionsType = SetAppErrorActionType | SetAppStatusActionType