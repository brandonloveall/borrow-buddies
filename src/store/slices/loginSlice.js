import { createSlice } from "@reduxjs/toolkit";

export const loginSlice = createSlice({
    name: "login",
    initialState: {
        display: "none"
    },
    reducers: {
        toggleLogin: (state) => {
            if (state.display === 'none'){
                state.display = "flex"
            }else{
                state.display = "none"
            }
        }
    }
})

export const {toggleLogin} = loginSlice.actions
export default loginSlice.reducer