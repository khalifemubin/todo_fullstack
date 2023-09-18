import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import AuthForm from '../components/AuthForm';
import { useDispatch, useSelector } from 'react-redux';
import HomeScreen from './HomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOGIN_SUCCESS } from '../actions/types';
import { StyleSheet } from 'react-native';

/**
 *
 * @returns Either Home screen for logged user or Login screen
 */
const AuthScreen = () => {
    //Get authenticated status from redux store
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    //Initialize dispatch
    const dispatch = useDispatch();
    //State to determine whether to make user logout
    const [logout, setLogout] = useState(false);

    useEffect(() => {
        //If user already loggedin then dispatch accordingly and go inside app
        const alreadyLoggedIn = async () => {
            const token = await AsyncStorage.getItem('token');
            if (token?.length > 0) {
                dispatch({ type: LOGIN_SUCCESS, payload: token });
            }
        };

        alreadyLoggedIn();
    }, [dispatch, logout]);

    return (
        <View style={styles.container}>
            {isAuthenticated && !logout ? (
                <HomeScreen setLogout={setLogout} />
            ) : (
                <AuthForm setLogout={setLogout} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        fontSize: 25,
        fontWeight: '500',
    },
});

export default AuthScreen;
