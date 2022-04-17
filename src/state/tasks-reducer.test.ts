import {TasksStateType} from "../App";
import {TaskPriorities, TaskStatuses} from "../api/todolists-api";
import {addTodolistAC, removeTodolistAC, setTodolistsAC} from "./todolists-reducer";
import {
    addTaskAC,
    changeTaskStatusAC,
    changeTaskTitleAC,
    removeTaskAC,
    setTasksAC,
    tasksReducer
} from "./tasks-reducer";


const state: TasksStateType = {
    "todolistId1": [
        { id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ],
    "todolistId2": [
        { id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ]
}

test ('tasks should be added when we set tasks', () => {

    const oldState = {
        "todolistId3": []
    }
    const action = setTasksAC([
        { id: "1", title: "one", status: TaskStatuses.New, todoListId: "todolistId3", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "two", status: TaskStatuses.Completed, todoListId: "todolistId3", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }], "todolistId3");

    const newState = tasksReducer(oldState, action);

    expect(newState["todolistId3"].length).toBe(2);
    expect(newState["todolistId3"][0].title).toBe("one");
})


test ('empty arrays should be added when we set todolists', () => {

    const action = setTodolistsAC([
        {id:"todolistId1", title:'What to learn',  order: 0, addedDate: ""},
        {id:"todolistId2", title:'What to buy', order: 0, addedDate: ""},
    ]);

    const newState = tasksReducer({}, action);

    expect(newState["todolistId1"]).toEqual([]);
    expect(newState["todolistId2"]).toEqual([]);
})



test ('tasks array of remote todolist should be removed from the state', () => {

    const action = removeTodolistAC("todolistId2");

    const newState = tasksReducer(state, action);

    expect(newState["todolistId1"]).toBeDefined();
    expect(newState["todolistId2"]).toBeUndefined();
})

test ('empty array should be added when we add todolist', () => {

    const action = addTodolistAC({
        id:"todolistID3", title:'What to keep', order: 0, addedDate: "",
    });

    const newState = tasksReducer(state, action);

    expect(newState["todolistID3"]).toEqual([]);
    expect(newState["todolistId2"][0].title).toBe('bread');
    expect(newState["todolistId1"][0].todoListId).toBe("todolistId1");
})

//'ADD-TASK'
test ('task should be added to tasks array', () => {

    const action = addTaskAC({
        id: "4", title: "Webstorm", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
        startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
    });

    const newState = tasksReducer(state, action);

    expect(newState["todolistId1"][3]).toBeDefined();
    expect(newState["todolistId1"][3].id).toBe('4');
    expect(newState["todolistId1"][3].title).toBe('Webstorm');
})

//'REMOVE-TASK'
test ('task should be removed from tasks array', () => {

    const action = removeTaskAC("3", "todolistId1");

    const newState = tasksReducer(state, action);

    expect(newState["todolistId1"][2]).toBeUndefined();
    expect(newState["todolistId1"][0].id).toBe('1');
    expect(newState["todolistId1"][1].id).toBe('2');
})
//'CHANGE-TASK-STATUS'
test ('task status should be changed', () => {

    const action = changeTaskStatusAC("3", TaskStatuses.Completed, "todolistId1");

    const newState = tasksReducer(state, action);

    expect(newState["todolistId1"][2].status).toBe(TaskStatuses.Completed);
    expect(newState["todolistId1"][2].id).toBe('3');
})

//'CHANGE-TASK-TITLE'
test ('task title should be changed', () => {

    const action = changeTaskTitleAC("3", 'meowww', "todolistId1");

    const newState = tasksReducer(state, action);

    expect(newState["todolistId1"][2].title).toBe('meowww');
    expect(newState["todolistId1"][2].id).toBe('3');
})

