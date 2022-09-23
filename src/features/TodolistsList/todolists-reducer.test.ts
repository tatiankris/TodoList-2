import {v1} from "uuid";
import {
    addTodolistAC, changeTodolistEntityStatusAC, changeTodolistFilterAC, changeTodolistTitleAC,
    removeTodolistAC,
    setTodolistsAC,
    TodolistDomainType,
    todolistsSlice
} from "./todolists-reducer";

const todolistID1 = v1();
const todolistID2 = v1();

let state: Array<TodolistDomainType> = [
    {id:todolistID1, title:'What to learn', filter: 'all', order: 0, addedDate: "", entityStatus: 'idle'},
    {id:todolistID2, title:'What to buy', filter: 'all', order: 0, addedDate: "", entityStatus: 'idle'},
]

const todolistsReducer = todolistsSlice.reducer

test ('todolists should be set to the state', () => {

    const action = setTodolistsAC({todolists: state});
    const endState = todolistsReducer([], action)

    expect(endState.length).toBe(2);

})

test ('todolist should be removed from the state', () => {

    const action = removeTodolistAC({id: todolistID2});
    const endState = todolistsReducer(state, action)

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistID1);

})


test ('todolist should be added to the state', () => {

    const action = addTodolistAC({todolist: {id:"todolistID3", title:'What to keep', order: 0, addedDate: ""}});
    const endState = todolistsReducer(state, action)

    expect(endState.length).toBe(3);
    expect(endState[2].id).toBe("todolistID3");

})

//'CHANGE-TODOLIST-TITLE'
test ('todolist title should be changed', () => {

    const action = changeTodolistTitleAC({id: todolistID1, title: 'What to say'});
    const endState = todolistsReducer(state, action)

    expect(endState.length).toBe(2);
    expect(endState[0].id).toBe(todolistID1);
    expect(endState[0].title).toBe('What to say');
})

//'CHANGE-TODOLIST-FILTER'
test ('todolist filter should be changed', () => {

    const action = changeTodolistFilterAC({id: todolistID1, filter: 'active'});
    const endState = todolistsReducer(state, action)

    expect(endState.length).toBe(2);

    expect(endState[0].filter).toBe('active');
})

//'CHANGE-TODOLIST-ENTITY-STATUS
test ('todolist entity status should be changed', () => {

    const endState = todolistsReducer(state, changeTodolistEntityStatusAC({id: todolistID1, status: 'loading'}))

    expect(endState[0].entityStatus).toBe('loading');
    expect(endState[1].entityStatus).toBe('idle');
})