import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableHighlight, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { register, login } from '../actions/authActions';
import MainImage from '../assets/img/mainImage.jpeg';

/**
 * @param {setLogout}
 * @returns Login/Registration form
 * setLogout is used by parent AuthScreen to check if user is aleady logged in
 */
const AuthForm = ({ setLogout }) => {
    //Get state of authentication error from redux store
    const ctaError = useSelector((state) => state.auth.error);
    //Get message of authentication error from redux store
    const ctaErrorMessage = useSelector((state) => state.auth.errorMessage);
    //turn raw iamge into resource uri
    const MAIN_IMAGE = Image.resolveAssetSource(MainImage).uri;

    //State to store whether user wants to register or login
    const [isRegister, setIsRegister] = useState(false);

    //State to store data of form
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    //Init disptach
    const dispatch = useDispatch();

    //Extract form fields
    const { email, password } = formData;

    //When any field is change, save them in formData state
    const onChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    /**
     * function to validate email
     * @returns Boolean (true for correct, false for invalid)
     */
    const validateEmail = (val) => {
        return String(val)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    /**
     * function to show native Alert component
     * @params {title} - Title for Alert
     * @params {message} - Content body for Alert
     */
    const showAlert = (title, message) => {
        return (
            Alert.alert(
                title,
                message, [
                {
                    text: 'OK',
                },
            ]
            )
        );
    };

    useEffect(() => {
        //If there is error while submitting, display proper message for User
        if (ctaError) {
            const msg = (ctaErrorMessage) ? ((ctaErrorMessage?.toLowerCase() === 'network error') ? 'Server is down. Sorry for inconvenience.' : ctaErrorMessage) : 'Server is down. Sorry for inconvenience.';
            return (showAlert('Operation Error', msg));
        }
    }, [ctaError, ctaErrorMessage]);

    /**
     * For both login and registration
     * @returns dispatch action to register/login user
     */
    const onSubmit = () => {
        try {
            if (!validateEmail(email)) {
                return (showAlert('Invalid Email', 'Please enter valid email'));
            }

            //Ensure password length is minimum 6
            if (password.length < 6) {
                return (showAlert('Weak Password', 'Please enter more than 6 characters for the password'));
            }

            //Required by Parent AuthScreen
            setLogout(false);

            //If user selected register action
            if (isRegister) {
                dispatch(register({ email, password }));
            } else {
                dispatch(login({ email, password }));
            }
        } catch (err) {
            return (showAlert('Operation Error', err.message));
        }
    };

    return (
        <View style={formStyle.body}>
            <Image
                style={formStyle.mainImage}
                source={{ uri: MAIN_IMAGE }}
            />
            <Text style={formStyle.label}>Email</Text>
            <TextInput style={formStyle.input} onChangeText={(text) => onChange('email', text)} value={email} placeholder="Enter Email" placeholderTextColor="#000" inputMode="email" autoCapitalize="none"
            />
            <Text style={formStyle.label}>Password</Text>
            <TextInput
                style={formStyle.input}
                onChangeText={(text) => onChange('password', text)}
                value={password}
                secureTextEntry
                placeholder="Enter Password"
                placeholderTextColor="#000"
                autoCapitalize="none"
            />
            <TouchableHighlight onPress={onSubmit} style={formStyle.cta}>
                <Text style={formStyle.ctaText}>{isRegister ? 'Register' : 'Login'}</Text>
            </TouchableHighlight>
            <View style={formStyle.promptOtherAction}>
                <Text
                    style={formStyle.promptOtherActionText}
                    onPress={() => setIsRegister(!isRegister)}>
                    {
                        isRegister ? 'Already have an account? Login' : 'Not registered? Click Here'
                    }

                </Text>
            </View>
        </View>
    );
};

const formStyle = StyleSheet.create({
    mainImage: {
        width: 200,
        height: 200,
        alignSelf: 'center',
    },
    body: {
        backgroundColor: '#dcdcdc',
        padding: 15,
        borderRadius: 10,
        flex: 1,
        justifyContent: 'center',
    },
    label: {
        color: '#000',
        margin: 5,
    },
    input: {
        color: '#000',
        backgroundColor: '#fff',
        borderRadius: 10,
        margin: 10,
    },
    cta: {
        backgroundColor: '#68a0cf',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        margin: 5,
    },
    ctaText: {
        color: 'black',
        fontSize: 20,
    },
    promptOtherAction: {
        alignItems: 'center',
    },
    promptOtherActionText: {
        color: '#0000ff',
        marginTop: 15,
    },
});

export default AuthForm;
