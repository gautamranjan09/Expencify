import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
    name: 'appSlice',
    initialState: {transactions:[], user: null},
    reducers:{
        setTransactions : (state, action)=>{
            state.transactions = action.payload;
        },
        setUser : (state, action)=>{
            state.user = action.payload;
        },
    }
});

export const {setTransactions, setUser} = appSlice.actions;
export default appSlice.reducer;