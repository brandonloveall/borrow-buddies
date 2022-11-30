import "./Login.css"
import {useDispatch} from "react-redux"
import {toggleLogin} from "../../store/slices/loginSlice.js"

function Login(props) {
    const dispatch = useDispatch()

    return (
        <div className="Login" style={{display: props.display}}>
            <div className="background" onClick={() => {dispatch(toggleLogin())}}>
            </div>

            <div className="loginHolder">
                <form>
                    <h3>Welcome back!</h3>
                    <input type="text" className="username" placeholder="Username"/>
                    <input type="text" className="username" placeholder="Password"/>
                    <input type="submit" value="Login"/>
                </form>
            </div>
        </div>
    )
    
}

export default Login