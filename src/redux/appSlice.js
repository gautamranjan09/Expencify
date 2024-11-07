import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
    name: 'appSlice',
    initialState: {transaction:null, user: null},
    reducers:{
        setTransaction : (state, action)=>{
            state.transaction = action.payload;
        },
        setUser : (state, action)=>{
            state.user = action.payload;
        },
    }
});

export const {setTransaction, setUser} = appSlice.actions;
export default appSlice.reducer;