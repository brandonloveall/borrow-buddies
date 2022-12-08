import "./GameList.css"
import { useSearchParams, Link, useLocation } from "react-router-dom"
import axios from "axios"
import {useEffect, useState} from "react"

function GameList(){
    //genre, page, 
    let [searchParams, setSearchParams] = useSearchParams()
    let [games, setGames] = useState([])
    const location = useLocation()

    useEffect(() => {
        axios.get(`http://localhost:3001/api/pagecount?name=${searchParams.get("term")}&location=${searchParams.get("location")}&genre=${searchParams.get("genre")}&page=${searchParams.get("page")}`)
        .then(res => {setGames(res.data)})
        
    }, [searchParams])

    return(
        <div className="GameList">
            <div className="gameresults">
                {(games.map(() => {
                    return (<div></div>)
                }))}
            </div>
            <footer className="pagenums">
                {(() => {
                    for(let i = 0; i < games.length; i++){
                        console.log(i)
                        return (<button className="pagenum"><p>{i + 1}</p></button>)
                    }
                })()}
            </footer>
        </div>
    )
}

export default GameList