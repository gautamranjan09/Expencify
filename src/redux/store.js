import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./appSlice";
const store = configureStore({reducer:{appSlice: appReducer}});

export default store;