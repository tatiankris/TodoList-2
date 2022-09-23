import React, {useCallback, useEffect} from 'react'
import './App.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {Menu} from '@mui/icons-material';
import {TodolistsList} from "../features/TodolistsList/TodolistsList";
import {CircularProgress, LinearProgress} from "@mui/material";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./store";
import {initializeAppTC, RequestStatusType} from "./app-reducer";
import {Login} from "../features/Login/Login";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {logoutTC} from "../features/Login/auth-reducer";
import {removeTaskTC} from "../features/TodolistsList/tasks-reducer";






type PropsType = {
    demo?: boolean
}

function App ({demo = false}: PropsType) {

    const dispatch = useDispatch();
    const status = useSelector<AppRootStateType, RequestStatusType >((state) => state.app.status)
    const isLoggedIn = useSelector<AppRootStateType>((state) => state.auth.isLoggedIn)
    const isInitialized = useSelector<AppRootStateType>((state) => state.app.isInitialized)

    useEffect(() => {
        dispatch(initializeAppTC());
    }, [])

    const logoutHandler = useCallback( () => {
        dispatch(logoutTC())
    }, []);


    if (!isInitialized) {
        return <div style={{position:'fixed', top: '30%', textAlign: 'center', width:'100%' }}>
            <CircularProgress/>
        </div>
    }

    return (
        <div className="App">
            <AppBar position="static">
                <ErrorSnackbar />
                <Toolbar>
                    <Typography variant="h6">
                        News
                    </Typography>
                    {isLoggedIn && <Button color="inherit" onClick={logoutHandler}>Log out</Button>}
                </Toolbar>
                {status === "loading" && <LinearProgress />}
            </AppBar>
            <Container fixed>
                <Routes>
                        <Route path="/" element={<TodolistsList/>}/>
                        <Route path="/login" element={<Login/>}/>
                        {/*<Route path="*" element={<Navigate to={"/404"}/>}/>*/}
                        <Route path="/404" element={<h1>404. PAGE NOT FOUND</h1>}/>
                </Routes>
            </Container>
        </div>
    );
}

export default App;
