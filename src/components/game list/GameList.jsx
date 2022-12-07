import "./GameList.css"
import { useSearchParams } from "react-router-dom"
import axios from "axios"

function GameList(props){
    //genre, page, 
    let [searchParams, setSearchParams] = useSearchParams()
    console.log(searchParams.get("genre"))

    axios.get(`http://localhost:3001/api/gamesearch?name=${searchParams.get("term")}&location=${searchParams.get("location")}&genre=${searchParams.get("genre")}&page=${props.page}`)

    return(
        <div className="GameList">

        </div>
    )
}

export default GameList