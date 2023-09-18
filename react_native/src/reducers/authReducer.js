import { REGISTER_SUCCESS, LOGIN_SUCCESS, LOGIN_ERROR, REGISTER_ERROR, LOGOUT } from '../actions/types';

/**
 * Initialize state for Auth store
 */
const initialState = {
    token: null,
    isAuthenticated: false,
    loading: true,
};

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case REGISTER_SUCCESS:
        case REGISTER_ERROR:
            return {
                ...state,
                ...payload,
                error: true,
                errorMessage: payload,
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false,
            };
        case LOGIN_ERROR:
            return {
                ...state,
                ...payload,
                error: true,
                errorMessage: payload,
            };
        case LOGOUT:
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false,
            };
        default:
            return state;
    }
}
