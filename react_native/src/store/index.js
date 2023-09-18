import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import authReducer from '../reducers/authReducer';
import taskReducer from '../reducers/taskReducer';

/**
 * Combine auth and task reducers
 */
const rootReducer = combineReducers({
    auth: authReducer,
    tasks: taskReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
