import { createSlice } from '@reduxjs/toolkit'

const initialState = {};

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        UserCredential(state,action){
            
            state.user = action.payload;
        },
        logout(state){
            state.user = null;
        }
    }
});

export const {UserCredential,logout} = authSlice.actions;

export default authSlice.reducer;

