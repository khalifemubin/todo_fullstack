import axios from 'axios';
import { GET_TASKS, ADD_TASK, UPDATE_TASK, DELETE_TASK, LOGOUT, SERVER_DOWN, SERVER_UP } from './types';
import { API_URL } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
* When main screen loads for loggedin user, this method gets called
*/
export const getTasks = () => async (dispatch) => {
    try {
        //Send token in header before making request
        const config = {
            headers: { 'x-auth-token': await AsyncStorage.getItem('token') },
        };

        //send request to API end point to fetch data
        const res = await axios.get(`${API_URL}/tasks`, config);

        //If server is working, dispatch success action
        dispatch({ type: SERVER_UP, payload: {} });

        //Dispatch retrieved data/tasks
        dispatch({ type: GET_TASKS, payload: res.data });
    } catch (error) {
        // console.error(error);

        //If the server sends error response
        if (error.response) {
            //If the error is related to authentication
            if (error.response.status === 401) {
                //If there is token saved in local storage remove it
                await AsyncStorage.removeItem('token');
                //Dispatch logout action
                dispatch({ type: LOGOUT, payload: {} });
            }
        } else {
            //If server is down, then dispatch the message for better UX
            dispatch({ type: SERVER_DOWN, payload: {} });
        }
    }
};

/**
* Get specific task/document data
*/
export const getSingleTask = async (id) => {
    try {
        //Send token in header before making request
        const config = {
            headers: { 'x-auth-token': await AsyncStorage.getItem('token') },
        };

        //return retrieved data/specific task
        const res = await axios.get(`${API_URL}/tasks/${id}`, config);
        return res.data;
    } catch (error) {
        // console.error(error);
        // If the server sends error response
        const dispatchError = async (dispatch) => {
            if (error.response) {
                //If the error is related to authentication
                if (error.response.status === 401) {
                    //If there is token saved in local storage remove it
                    await AsyncStorage.removeItem('token');
                    //Dispatch logout action
                    dispatch({ type: LOGOUT, payload: {} });
                }
            } else {
                //If server is down, then dispatch the message for better UX
                dispatch({ type: SERVER_DOWN, payload: {} });
            }
        };
        dispatchError();
    }
};

/**
* Add Data document in task collection
*/
export const addTask = ({ title, description, tags, expiryDate }) => async (dispatch) => {
    try {
        //Send token in header before making request
        const config = {
            headers: { 'x-auth-token': await AsyncStorage.getItem('token') },
        };

        //Send data to API endpoint
        const res = await axios.post(`${API_URL}/tasks`, {
            title,
            description,
            tags,
            expiryDate,
        }, config);

        //Dispatch sucessfull add task action
        dispatch({ type: ADD_TASK, payload: res.data });
    } catch (error) {
        // console.error(error);
        //If the server sends error response
        if (error.response) {
            //If the error is related to authentication
            if (error.response.status === 401) {
                //If there is token saved in local storage remove it
                await AsyncStorage.removeItem('token');
                //Dispatch logout action
                dispatch({ type: LOGOUT, payload: {} });
            }
        } else {
            //If server is down, then dispatch the message for better UX
            dispatch({ type: SERVER_DOWN, payload: {} });
        }
    }
};

/**
* Update a document in task collection
*/
export const updateTask = (id, { title, description, tags, completed, expiryDate }) => async (dispatch) => {
    try {
        //Send token in header before making request
        const config = {
            headers: { 'x-auth-token': await AsyncStorage.getItem('token') },
        };

        //Send data to API endpoint
        const res = await axios.put(`${API_URL}/tasks/${id}`, {
            title,
            description,
            tags,
            completed,
            expiryDate,
        }, config);

        //Dispatch sucessfull update task action
        dispatch({ type: UPDATE_TASK, payload: res.data });
    } catch (error) {
        // console.error(error);
        //If the server sends error response
        if (error.response) {
            //If the error is related to authentication
            if (error.response.status === 401) {
                //If there is token saved in local storage remove it
                await AsyncStorage.removeItem('token');
                //Dispatch logout action
                dispatch({ type: LOGOUT, payload: {} });
            }
        } else {
            //If server is down, then dispatch the message for better UX
            dispatch({ type: SERVER_DOWN, payload: {} });
        }
    }
};

/**
* Delete a document from task collection
*/
export const deleteTask = (id) => async (dispatch) => {
    try {
        const config = {
            headers: { 'x-auth-token': await AsyncStorage.getItem('token') },
        };
        await axios.delete(`${API_URL}/tasks/${id}`, config);
        dispatch({ type: DELETE_TASK, payload: id });
    } catch (error) {
        // console.error(error);
        //If the server sends error response
        if (error.response) {
            //If the error is related to authentication
            if (error.response.status === 401) {
                //If there is token saved in local storage remove it
                await AsyncStorage.removeItem('token');
                //Dispatch logout action
                dispatch({ type: LOGOUT, payload: {} });
            }
        } else {
            //If server is down, then dispatch the message for better UX
            dispatch({ type: SERVER_DOWN, payload: {} });
        }
    }
};
