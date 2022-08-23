import { configureStore } from "@reduxjs/toolkit";
import devicesSlice from "./devicesSlice";
import profileSlice from "./userProfileEdit";
import loginSlice from "./loginSlice";

const store = configureStore({
    reducer: {
        devices: devicesSlice.reducer,
        userProfile: profileSlice.reducer,
        login: loginSlice.reducer
    }
})

export default store;