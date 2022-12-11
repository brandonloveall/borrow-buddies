import "./GameList.css"
import { useSearchParams, Link, useLocation } from "react-router-dom"
import axios from "axios"
import {useEffect, useState} from "react"
import GameResult from "../game result/GameResult.jsx"

function GameList(){
    //genre, page, 
    let [searchParams, setSearchParams] = useSearchParams()
    let [games, setGames] = useState([])
    const location = useLocation()

    useEffect(() => {
        axios.get(`http://localhost:3001/api/gamesearch?name=${searchParams.get("term")}&location=${searchParams.get("location")}&genre=${searchParams.get("genre")}&page=${searchParams.get("page")}`)
        .then(res => {setGames(res.data)})
        
    }, [location])

    return(
        <div className="GameList">
            <div className="gameresults">
                {(games.map((e, i) => {
                    return (<GameResult color={i % 2 === 0 ? "#A3B18A" : "#588157"}/>)
                }))}
            </div>
            <footer className="pagenums">
                {(() => {
                    for(let i = 0; i < games.length; i++){
                        return (<button className="pagenum" key={i} onClick={() => {setSearchParams({page: i + 1}); console.log(searchParams)}}><p>{i + 1}</p></button>)
                    }
                })()}
            </footer>
        </div>
    )
}

export default GameList