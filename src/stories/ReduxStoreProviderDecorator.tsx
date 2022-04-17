import React from "react";
import {Provider} from "react-redux";
import {AppRootStateType} from "../state/store";
import {combineReducers, createStore} from "redux";
import {todolistsReducer} from "../state/todolists-reducer";
import {tasksReducer} from "../state/tasks-reducer";
import {v1} from "uuid";
import {TaskStatuses, TaskPriorities} from "../api/todolists-api"



const rootReducer = combineReducers({
    todoLists: todolistsReducer,
    tasks: tasksReducer,
})

const initialGlobalState = {


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
        {id:'todolistID1', title:'What to learn', filter: 'all', order: 0, addedDate: ""},
        {id:'todolistID2', title:'What to buy', filter: 'all', order: 0, addedDate: ""},
    ]
}

export const storyBookStore = createStore(rootReducer, initialGlobalState as AppRootStateType);

export const ReduxStoreProviderDecorator = (storyFn: any) => {
    return <Provider
        store={storyBookStore}>{storyFn()}</Provider>
}