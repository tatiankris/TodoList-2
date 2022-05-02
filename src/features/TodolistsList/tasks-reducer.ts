
import {
    AddTodolistActionType,
    changeTodolistEntityStatusAC, changeTodolistEntityStatusType,
    RemoveTodolistActionType,
    SetTodolistsActionType
} from './todolists-reducer';
import {TaskStatuses, TaskType, todolistsAPI} from '../../api/todolists-api'
import {Dispatch} from "redux";
import {AppRootStateType} from "../../app/store";
import {
    setAppStatusAC,
    SetAppErrorActionType,
    SetAppStatusActionType,
    RequestStatusType
} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

export type TasksStateDomainType = TasksStateType & {
    entityStatus: RequestStatusType
}

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            return {...state,[action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)};
        }
        case 'ADD-TASK': {
            return {...state, [action.todoListId]: [...state[action.todoListId], {...action.task, }] }
        }
        case 'CHANGE-TASK-STATUS': {
            return {...state, [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {...t, status: action.status} : t)}
        }
        case 'CHANGE-TASK-TITLE': {
            return {...state, [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {...t, title: action.title} : t)};
        }
        case 'ADD-TODOLIST': {
            return {...state, [action.todolist.id]: []}
        }
        case 'REMOVE-TODOLIST': {
            const CopyState = {...state}
            delete CopyState[action.id]
            return CopyState
        }
        case "SET-TODOLISTS": {
            const stateCopy = {...state}
            action.todolists.forEach(
                tl => {
                    stateCopy[tl.id] = []
                })
            return stateCopy;
        }
        case "SET-TASKS": {
            return {...state, [action.todolistId]: action.tasks}
        }
        default:
            return state;
    }
}

//actions
export const removeTaskAC = (taskId: string, todolistId: string) => ({type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId} as const)
export const addTaskAC = (task: TaskType) => ({type: 'ADD-TASK', task, todoListId: task.todoListId} as const)
export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string) => ({type: 'CHANGE-TASK-STATUS', status, todolistId, taskId} as const)
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string) => ({type: 'CHANGE-TASK-TITLE', title, todolistId, taskId} as const)
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) => ({type: "SET-TASKS", tasks, todolistId} as const)

//thunks
export const fetchTasksTC = (todolistID: string) => (dispatch: Dispatch<ThunkDispatch>) => {
    dispatch(setAppStatusAC('loading'))
        todolistsAPI.getTasks(todolistID)
            .then((res) => {
                    dispatch(setTasksAC(res.data.items, todolistID))
                    dispatch(setAppStatusAC('succeeded'));
                })
            .catch((error) => {
                handleServerNetworkError(error, dispatch);
            })
}
export const addTaskTC = ( todolistId: string, title: string ) => (dispatch: Dispatch<ThunkDispatch>) => {

    dispatch(setAppStatusAC('loading'))
    dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'))
        todolistsAPI.createTask(todolistId, title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(addTaskAC(res.data.data.item));
                    dispatch(setAppStatusAC('succeeded'));
                    dispatch(changeTodolistEntityStatusAC(todolistId, 'succeeded'))
                }
                else handleServerAppError(res.data, dispatch);
                })
            .catch((error) => {
                handleServerNetworkError(error, dispatch);
            })

}
export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: Dispatch<ThunkDispatch>) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'))
        todolistsAPI.deleteTask(todolistId, taskId)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(removeTaskAC(taskId, todolistId))
                    dispatch(setAppStatusAC('succeeded'));
                    dispatch(changeTodolistEntityStatusAC(todolistId, 'succeeded'))
                }
                else handleServerAppError(res.data, dispatch);
                })
            .catch((error) => {
                handleServerNetworkError(error, dispatch);
            })
}
export const updateTaskStatusTC = (taskId: string, todolistId: string, status: TaskStatuses) => {
    return (dispatch: Dispatch<ThunkDispatch>, getState: () => AppRootStateType) => {

        dispatch(setAppStatusAC('loading'))
        const allTasksFromState = getState().tasks
        const tasksForCurrentTodolist = allTasksFromState[todolistId]
        const task = tasksForCurrentTodolist.find( t => {
            return t.id === taskId
        })

        if (task) {
            todolistsAPI.updateTask(todolistId, taskId, {
                title: task.title,
                description: task.description,
                status: status,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline
            })
                .then(res => {
                    if (res.data.resultCode === 0) {
                        dispatch(changeTaskStatusAC(taskId, status, todolistId))
                        dispatch(setAppStatusAC('succeeded'));
                    }
                    else handleServerAppError(res.data, dispatch);
                    })
                .catch((error) => {
                    handleServerNetworkError(error, dispatch);
                })
        }}
}
export const updateTaskTitleTC = (taskId: string, todolistId: string, title: string) => {

    return (dispatch: Dispatch<ThunkDispatch>, getState: () => AppRootStateType) => {
        dispatch(setAppStatusAC('loading'))
        const allTasksFromState = getState().tasks
        const tasksForCurrentTodolist = allTasksFromState[todolistId]
        const task = tasksForCurrentTodolist.find( t => {
            return t.id === taskId
        })

        if (task) {
            todolistsAPI.updateTask(todolistId, taskId, {
                title: title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline
            })
                .then(res => {
                    if (res.data.resultCode === 0) {
                        dispatch(changeTaskTitleAC(taskId, title, todolistId))
                        dispatch(setAppStatusAC('succeeded'));
                    }
                    else handleServerAppError(res.data, dispatch);
                })
                .catch((error) => {
                    handleServerNetworkError(error, dispatch);
                })
        }}
}

//types
type ActionsType = ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof changeTaskStatusAC>
    | ReturnType<typeof changeTaskTitleAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | ReturnType<typeof setTasksAC>

export type ThunkDispatch = ActionsType | SetAppErrorActionType | SetAppStatusActionType | changeTodolistEntityStatusType