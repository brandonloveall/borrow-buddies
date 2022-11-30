import { createSlice } from "@reduxjs/toolkit";

export const signupSlice = createSlice({
    name: "signup",
    initialState: {
        display: "none"
    },
    reducers: {
        toggleSignup: (state) => {
            if (state.display === 'none'){
                state.display = "flex"
            }else{
                state.display = "none"
            }
        }
    }
})

export const {toggleSignup} = signupSlice.actions
export default signupSlice.reducer