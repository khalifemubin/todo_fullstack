import { GET_TASKS, ADD_TASK, UPDATE_TASK, DELETE_TASK, SERVER_DOWN, SERVER_UP } from '../actions/types';

/**
 * Initialize state for Task store
 */
const initialState = {
    tasks: [],
    loading: true,
};

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_TASKS:
            return {
                ...state,
                tasks: payload,
                loading: false,
            };
        case ADD_TASK:
            return {
                ...state,
                tasks: [...state.tasks, payload],
                loading: false,
            };
        case UPDATE_TASK:
            return {
                ...state,
                tasks: state.tasks.map((task) => (task._id === payload._id ? payload : task)),
                loading: false,
            };
        case DELETE_TASK:
            return {
                ...state,
                tasks: state.tasks.filter((task) => task._id !== payload),
                loading: false,
            };
        case SERVER_DOWN: {
            return {
                ...state,
                loading: false,
                serverDown: true,
            };
        }
        case SERVER_UP: {
            return {
                ...state,
                loading: false,
                serverDown: false,
            };
        }
        default:
            return state;
    }
}
