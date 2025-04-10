import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    lang: 'vi',
};

const langSlice = createSlice({
    name:'lang',
    initialState,
    reducers:{
        setLanguage(state,action){
            state.lang = action.payload;
        },
    }
});

export const {setLanguage} = langSlice.actions;

export default langSlice.reducer;

