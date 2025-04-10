import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './AuthReducer';
import langReducer from './langReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    lang: langReducer
})

export default rootReducer;