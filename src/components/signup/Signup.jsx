import "./Signup.css"
import {useDispatch} from "react-redux"
import {toggleSignup} from "../../store/slices/signupSlice.js"
import {setLogin} from "../../store/slices/accountInfoSlice.js"
import { useRef } from "react"
import axios from "axios"

function Signup(props) {
    const dispatch = useDispatch()
    let username = useRef()
    let password = useRef()
    let passwordConfirm = useRef()

    

    function handleSubmit(e){
        e.preventDefault()
        
        if(username.current === undefined || username.current === "" || username.current === null){window.alert("Please enter a username."); return}
        if(password.current === undefined || password.current === "" || password.current === null){window.alert("Please enter a password."); return}
        if(passwordConfirm.current !== password.current){window.alert("Passwords do not match."); return}

        axios.post(`http://localhost:3001/api/signup?username=${username.current}&password=${password.current}`)
        .then((res) => {
            if(res.data !== "user already exists"){dispatch(toggleSignup()); console.log(res.data); dispatch(setLogin({id: res.data[0].id, username: res.data[0].username}))}
            else{window.alert("Username is taken.")}
        })
    }

    return (
        <div className="Signup" style={{display: props.display}}>
            <div className="background" onClick={() => {dispatch(toggleSignup())}}>
            </div>

            <div className="signupHolder">
                <form onSubmit={(e) => {handleSubmit(e)}}>
                    <h3>Become a buddy!</h3>
                    <input type="text" className="username" placeholder="Username" onChange={(e) => {username.current = e.target.value}}/>
                    <input type="password" className="username" placeholder="Password" onChange={(e) => {password.current = e.target.value}}/>
                    <input type="password" className="username" placeholder="Confirm Password" onChange={(e) => {passwordConfirm.current = e.target.value}}/>
                    <input type="submit" value="Sign up" />
                </form>
            </div>
        </div>
    )
    
}

export default Signup