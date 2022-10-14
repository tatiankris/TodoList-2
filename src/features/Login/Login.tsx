import React from 'react';
import {Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, TextField} from "@mui/material";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import {FormikErrors, FormikHelpers, useFormik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import {loginTC} from "./auth-reducer";
import {AppDispatchType, AppRootStateType, useAppDispatch} from "../../app/store";
import {Navigate} from "react-router-dom";

type FormikErrorType   = {
    email?: string
    password?: string
    rememberMe?: boolean
}

type FormValuesType = {
    email: string
    password: string
    rememberMe: boolean
}

export const Login = () => {

    const dispatch = useAppDispatch();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },

        validate: (values) => {
            let errors: FormikErrors<FormikErrorType> = {};
            if (!values.email) {
                errors.email = "Email is required"
            }
            else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address';
            }

                if (!values.password) {
                    errors.password = "Password is required"
                }
            else if (values.password.length < 2) {
                errors.password = "Password must be more than 2 cymbols"
            }
            return errors
        },

        onSubmit: async (values, formikHelpers) => {
            // alert(JSON.stringify(values.email));
            formik.resetForm();
            const action = await dispatch(loginTC(values));
            if (loginTC.rejected.match(action)) {
                if (action.payload?.fieldsErrors?.length) {
                    formikHelpers.setFieldError(action.payload.fieldsErrors[0].field, action.payload.fieldsErrors[0].error);
                    formikHelpers.setFieldTouched(action.payload.fieldsErrors[0].field)
                }
                else {
                    new Error ('error: Some error')
                }
            }
        },
    });
    console.log(formik)

    const isLoggedIn = useSelector<AppRootStateType>((state) => state.auth.isLoggedIn)
    if (isLoggedIn) {
        return <Navigate to={'/'}/>
    }

    return <Grid container justifyContent={'center'}>
        <Grid item justifyContent={'center'}>
            <form onSubmit={formik.handleSubmit}>
            <FormControl>
                <FormLabel>
                    <p>To log in get registered
                        <a href={'https://social-network.samuraijs.com/'}
                           target={'_blank'}> here
                        </a>
                    </p>
                    <p>or use common test account credentials:</p>
                    <p>Email: free@samuraijs.com</p>
                    <p>Password: free</p>
                </FormLabel>
                <FormGroup>
                    <TextField label="Email" margin="normal" {...formik.getFieldProps("email")}
                               // onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && formik.errors.email ? <div style={{color: 'red'}}>{formik.errors.email}</div> : null}

                    <TextField type="password" label="Password" margin="normal" {...formik.getFieldProps("password")}
                               // onBlur={formik.handleBlur}
                    />
                    {formik.touched.password && formik.errors.password ? <div style={{color: 'red'}}>{formik.errors.password}</div> : null}

                    <FormControlLabel label={'Remember me'} control={<Checkbox/>} {...formik.getFieldProps("rememberMe")}
                    />

                    <Button type={'submit'} variant={'contained'} color={'primary'}>
                        Login
                    </Button>

                </FormGroup>
            </FormControl>
            </form>
        </Grid>
    </Grid>
}
