import { createSlice } from "@reduxjs/toolkit";


const profileSlice = createSlice({
    name: "profile",
    initialState:{
        value: false,
    },
    reducers:{
        updater(state){
            state.value = !state.value
        },
    }
})


export const profileActions = profileSlice.actions;
export default profileSlice;
