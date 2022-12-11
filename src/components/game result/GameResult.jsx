import "./GameResult.css"
import { Link } from "react-router-dom"
import test from "../../assets/gow.jpg"

function GameResult(props){


    return(
        <div className="GameResult" style={{backgroundColor: props.color}}>
            <Link className="gameresultlink">
                <img src={test} alt="" />
            </Link>
        </div>
    )
}

export default GameResult