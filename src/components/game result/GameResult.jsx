import "./GameResult.css"
import axios from "axios"
import { useSelector, useDispatch } from "react-redux"
import {toggleLogin} from "../../store/slices/loginSlice.js"
import { useState } from "react"

function GameResult(props) {

    const id = useSelector((state) => state.accountInfo.id)
    const dispatch = useDispatch()
    const [gameStatus, setGameStatus] = useState("Request Game")
    

    function handleRequest(){
        if(id === null || id === undefined || id === ""){dispatch(toggleLogin()); return}

        axios.post(`http://localhost:3001/api/gamerequest?gameid=${props.id}&ownerid=${props.poster}&requesterid=${id}`)
        .then(setGameStatus("Game Requested!"))
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

export default GameResult