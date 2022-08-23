import { createSlice } from "@reduxjs/toolkit";


const devicesSlice = createSlice({
    name: "devices",
    initialState:{
        value: false,
    },
    reducers:{
        updater(state){
            state.value = !state.value
            console.log("Everything is working");
        },
    }
})


export const devicesActions = devicesSlice.actions;
export default devicesSlice;
