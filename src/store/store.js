import { configureStore } from "@reduxjs/toolkit";
import accountInfoReducer from "./slices/accountInfoSlice.js"
import loginReducer from "./slices/loginSlice.js"
import signupReducer from "./slices/signupSlice.js"

export default configureStore({
    reducer: {
        accountInfo: accountInfoReducer,
        login: loginReducer,
        signup: signupReducer
    }
})