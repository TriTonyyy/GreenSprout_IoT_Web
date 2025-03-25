import { red } from '@mui/material/colors';
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './AuthReducer';

const rootReducer = combineReducers({
    auth: authReducer,
})

export default rootReducer;