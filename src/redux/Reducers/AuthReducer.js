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
        },
        tokenUser(state, action) {
            state.token = action.payload;
        }
    }
});

export const {UserCredential,logout, tokenUser} = authSlice.actions;

export default authSlice.reducer;

