import React from "react";
import {Provider} from "react-redux";
import {AppRootStateType} from "../app/store";
import {applyMiddleware, combineReducers, createStore} from "redux";
import {todolistsReducer} from "../features/TodolistsList/todolists-reducer";
import {tasksReducer} from "../features/TodolistsList/tasks-reducer";
import {v1} from "uuid";
import {TaskStatuses, TaskPriorities} from "../api/todolists-api"
import {appReducer} from "../app/app-reducer";
import thunk from "redux-thunk";



const rootReducer = combineReducers({
    todoLists: todolistsReducer,
    tasks: tasksReducer,
    app: appReducer,
})

const initialGlobalState: AppRootStateType = {

    tasks: {
        ['todolistID1']: [
            {
                id: v1(), title: "HTML&CSS", status: TaskStatuses.Completed, todoListId: 'todolistID1', order: 0,
                addedDate: '', priority: TaskPriorities.Middle, startDate: "", deadline: "", description: ""

            },
            {
                id: v1(), title: "Rest API", status: TaskStatuses.New, todoListId: 'todolistID1', order: 0,
                addedDate: '', priority: TaskPriorities.Middle, startDate: "", deadline: "", description: ""
            },
        ],
        ['todolistID2'] : [
            {
                id: v1(), title: "HTML&CSS", status: TaskStatuses.Completed, todoListId: 'todolistID2', order: 0,
                addedDate: '', priority: TaskPriorities.Middle, startDate: "", deadline: "", description: ""
            },
            {
                id: v1(), title: "JS", status: TaskStatuses.Completed, todoListId: 'todolistID2', order: 0,
                addedDate: '', priority: TaskPriorities.Middle, startDate: "", deadline: "", description: ""
            },
        ]
    },
    todolists: [
        {id:'todolistID1', title:'What to learn', filter: 'all', order: 0, addedDate: "", entityStatus: 'idle'},
        {id:'todolistID2', title:'What to buy', filter: 'all', order: 0, addedDate: "", entityStatus: 'idle'},
    ],
    app: {
        status: 'idle',
        error: null
    }
}

export const storyBookStore = createStore(rootReducer, initialGlobalState, applyMiddleware(thunk));

export const ReduxStoreProviderDecorator = (storyFn: any) => (
    <Provider
        store={storyBookStore}>{storyFn()}
    </Provider>)