import {AppReducerStateType, appSlice, setAppErrorAC, setAppStatusAC} from "./app-reducer";

let appTestState: AppReducerStateType;

beforeEach(() => {
    appTestState = {
        status: 'idle',
        error: null,
        isInitialized: true
    }
})

const appReducer = appSlice.reducer

test ('correct error message should be set', () => {

   const errorStringState = appReducer(appTestState, setAppErrorAC({error: 'some error'}))
    const errorNullState = appReducer(errorStringState, setAppErrorAC({error: null}))

    expect(errorStringState.error).toBe('some error');
    expect(errorNullState.error).toBe(null);
})

test ('correct status should be set', () => {

    const idleStatusState = appReducer(appTestState, setAppStatusAC({status: 'idle'}))
    const loadingStatusState = appReducer(appTestState, setAppStatusAC({status: 'loading'}))
    const succeededStatusState = appReducer(appTestState, setAppStatusAC({status: 'succeeded'}))
    const failedStatusState = appReducer(appTestState, setAppStatusAC({status: 'failed'}))

    expect(idleStatusState.status).toBe('idle');
    expect(loadingStatusState.status).toBe('loading');
    expect(succeededStatusState.status).toBe('succeeded');
    expect(failedStatusState.status).toBe('failed');
})




