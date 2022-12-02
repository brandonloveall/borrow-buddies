import "./Login.css"
import {useDispatch} from "react-redux"
import {toggleLogin} from "../../store/slices/loginSlice.js"
import axios from "axios"
import { useRef } from "react"
import {setLogin} from "../../store/slices/accountInfoSlice.js"

function Login(props) {
    const dispatch = useDispatch()
    const username = useRef()
    const password = useRef()

    function handleSubmit() {
        if(username.current === undefined || password.current === undefined){
            window.alert("Please input your login information.")
        }else {
            axios.get(`http://localhost:3000/api/login?username=${username}&password=${password}`)
            .then(res => {
                if (res.status === 404){
                    window.alert("Username or password is incorrect.")
                }else{
                    dispatch(setLogin({id: res.body.id, username: res.body.username}))
                }
            })
        }
        
    }

    return (
        <div className="Login" style={{display: props.display}}>
            <div className="background" onClick={() => {dispatch(toggleLogin())}}>
            </div>

            <div className="loginHolder">
                <form onSubmit={(e) => {e.preventDefault(); handleSubmit()}}>
                    <h3>Welcome back!</h3>
                    <input type="text" className="username" placeholder="Username" onChange={(e) => {username.current = e.target.value}}/>
                    <input type="text" className="username" placeholder="Password" onChange={(e) => {password.current = e.target.value}}/>
                    <input type="submit" value="Login"/>
                </form>
            </div>
        </div>
    )
    
}

export default Login