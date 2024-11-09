import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
    name: 'appSlice',
    initialState: {transactions:[], user: null, isInitialFetchDone: false},
    reducers:{
        setTransactions : (state, action)=>{
            state.transactions = action.payload;
        },
        setUser : (state, action)=>{
            state.user = action.payload;
        },
        setInitialFetchDone: (state, action) => {
            state.isInitialFetchDone = action.payload;
        },
    }
});

export const {setTransactions, setUser, setInitialFetchDone } = appSlice.actions;
export default appSlice.reducer;