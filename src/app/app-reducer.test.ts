import {appReducer, AppReducerStateType, setAppErrorAC, setAppStatusAC} from "./app-reducer";

let appTestState: AppReducerStateType;

beforeEach(() => {
    appTestState = {
        status: 'idle',
        error: null
    }
})

test ('correct error message should be set', () => {

   const errorStringState = appReducer(appTestState, setAppErrorAC('some error'))
    const errorNullState = appReducer(errorStringState, setAppErrorAC(null))

    expect(errorStringState.error).toBe('some error');
    expect(errorNullState.error).toBe(null);
})

test ('correct status should be set', () => {

    const idleStatusState = appReducer(appTestState, setAppStatusAC('idle'))
    const loadingStatusState = appReducer(appTestState, setAppStatusAC('loading'))
    const succeededStatusState = appReducer(appTestState, setAppStatusAC('succeeded'))
    const failedStatusState = appReducer(appTestState, setAppStatusAC('failed'))

    expect(idleStatusState.status).toBe('idle');
    expect(loadingStatusState.status).toBe('loading');
    expect(succeededStatusState.status).toBe('succeeded');
    expect(failedStatusState.status).toBe('failed');
})




