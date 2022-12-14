import "./GameResult.css"
import { Link } from "react-router-dom"
import test from "../../assets/gow.jpg"

function GameResult(props) {


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
                <button>Request Game</button>
            </div>
        </div>
    )
}

export default GameResult