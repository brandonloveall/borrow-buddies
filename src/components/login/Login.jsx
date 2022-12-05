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

    function handleSubmit(e) {
        e.preventDefault()

        if(username.current === undefined || password.current === undefined){
            window.alert("Please input your login information.")
        }else {
            axios.get(`http://localhost:3001/api/login?username=${username.current}&password=${password.current}`)
            .then(res => {
                console.log(res)
                if (res.data === false){
                    window.alert("Username or password does not match.")
                }else{
                    console.log(res.data)
                    dispatch(setLogin({id: res.data.id, username: res.data.username}))
                    dispatch(toggleLogin())
                }
            })
        }
        
    }

    return (
        <div className="Login" style={{display: props.display}}>
            <div className="background" onClick={() => {dispatch(toggleLogin())}}>
            </div>

            <div className="loginHolder">
                <form onSubmit={(e) => {handleSubmit(e)}}>
                    <h3>Welcome back!</h3>
                    <input type="text" className="username" placeholder="Username" onChange={(e) => {username.current = e.target.value}}/>
                    <input type="password" className="username" placeholder="Password" onChange={(e) => {password.current = e.target.value}}/>
                    <input type="submit" value="Login"/>
                </form>
            </div>
        </div>
    )
    
}

export default Login