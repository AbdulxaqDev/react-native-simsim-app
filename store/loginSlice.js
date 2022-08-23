import { createSlice } from "@reduxjs/toolkit";


const loginSlice = createSlice({
    name: "login",
    initialState:{
        isLoggedIn: false,
    },
    reducers:{
        checkUserLoggedIn(state){
            state.value = !state.value
        },
    }
})


export const loginActions = loginSlice.actions;
export default loginSlice;
