import axios from 'axios';
import { LOGIN_SUCCESS, REGISTER_SUCCESS, LOGIN_ERROR, REGISTER_ERROR } from './types';
import { API_URL } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
* Register new user and make them logged in directly into the app
*/
export const register =
    ({ email, password }) =>
        async dispatch => {
            //Extract fields from request
            try {
                //Send them to API end point
                const res = await axios.post(`${API_URL}/auth/register`, {
                    email,
                    password,
                });

                //If everything is ok, dispatch success request
                dispatch({ type: REGISTER_SUCCESS, payload: res.data });

                // Store the user's token in local storage
                await AsyncStorage.setItem('token', res.data.token);
            } catch (error) {
                // console.error(error);
                //If there is an error, dispatch error request
                dispatch({ type: REGISTER_ERROR, payload: error.response.data.msg });
            }
        };

/**
* Login user
*/
export const login =
    ({ email, password }) =>
        async dispatch => {
            //Extract fields from request
            console.log(`${API_URL}/auth/login`);
            try {
                //Send them to API end point
                const res = await axios.post(`${API_URL}/auth/login`, {
                    email,
                    password,
                });

                //If everything is ok, dispatch success request
                dispatch({ type: LOGIN_SUCCESS, payload: res.data });

                // Store the user's token in local storage
                await AsyncStorage.setItem('token', res.data.token);
            } catch (error) {
                // console.error(error);
                //If there is an error, dispatch error request
                dispatch({ type: LOGIN_ERROR, payload: error.response.data.msg });
            }
        };

/**
* Logout function
*/
export const logout = async () => {
    try {
        //Remove data from local storage
        await AsyncStorage.removeItem('token');
    } catch (error) {
        console.error(error);
    }
};
