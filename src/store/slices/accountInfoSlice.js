import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

export const accountInfoSlice = createSlice({
    name: "accountInfo",
    initialState: {
        id: Cookies.get("id") ? Cookies.get("id") : null,
        username: Cookies.get("username") ? Cookies.get("id") : null
    },
    reducers: {
        setLogin: (state, action) => {
            state.id = action.payload.id
            state.username = action.payload.username
            Cookies.set("id", action.payload.id)
            Cookies.set("username", action.payload.username)
        },
        logout: (state, action) => {
            state.id = undefined
            state.username = undefined
            Cookies.remove("id")
            Cookies.remove("username")
        }
    }
})

export const {setLogin, logout} = accountInfoSlice.actions
export default accountInfoSlice.reducer