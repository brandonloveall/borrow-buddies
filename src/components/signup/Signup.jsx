import "./Signup.css"
import {useDispatch} from "react-redux"
import {toggleSignup} from "../../store/slices/signupSlice.js"

function Signup(props) {
    const dispatch = useDispatch()

    return (
        <div className="Signup" style={{display: props.display}}>
            <div className="background" onClick={() => {dispatch(toggleSignup())}}>
            </div>

            <div className="signupHolder">
                <form>
                    <h3>Become a buddy!</h3>
                    <input type="text" className="username" placeholder="Username"/>
                    <input type="text" className="username" placeholder="Password"/>
                    <input type="text" className="username" placeholder="Confirm Password"/>
                    <input type="submit" value="Login"/>
                </form>
            </div>
        </div>
    )
    
}

export default Signup