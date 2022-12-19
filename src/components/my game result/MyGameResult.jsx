import "./MyGameResult.css"
import axios from "axios"
import { useSelector, useDispatch } from "react-redux"
import {toggleLogin} from "../../store/slices/loginSlice.js"
import { useState } from "react"

function MyGameResult(props) {

    const id = useSelector((state) => state.accountInfo.id)
    const dispatch = useDispatch()
    const [gameStatus, setGameStatus] = useState("Delete Posting")
    

    function handleRequest(){
        if(id === null || id === undefined || id === ""){dispatch(toggleLogin()); return}
        if(gameStatus === "Posting Deleted!"){window.alert("Game has already been deleted."); return}

        axios.delete(`http://localhost:3001/api/usergames/${id}?gameid=${props.id}`)
        .then(setGameStatus("Posting Deleted!"))
    }

    return (
        <div className="GameResult" style={{ backgroundColor: props.color }}>
            <div className="leftside">
                    <img src={props.image} alt="" />
                    <div>
                        <p className="title">{props.title}</p>
                        <p className="location">{props.location}</p>
                    </div>
            </div>
            <div className="rightside">
                <button onClick={() => {handleRequest()}}>{gameStatus}</button>
            </div>
        </div>
    )
}

export default MyGameResult