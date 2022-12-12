import "./GameResult.css"
import { Link } from "react-router-dom"
import test from "../../assets/gow.jpg"

function GameResult(props){


    return(
        <div className="GameResult" style={{backgroundColor: props.color}}>
            <Link className="gameresultlink" to={`/c/game/${props.id}`}>
                <img src={props.image} alt="" />
                <div>
                    <p className="title">{props.title}</p>
                    <p className="location">{props.location}</p>
                </div>
            </Link>
        </div>
    )
}

export default GameResult