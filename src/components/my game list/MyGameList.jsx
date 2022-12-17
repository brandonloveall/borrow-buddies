import "./MyGameList.css"
import { useSearchParams, Link, useLocation } from "react-router-dom"
import axios from "axios"
import {useEffect, useState, useRef, useLayoutEffect} from "react"
import GameResult from "../game result/GameResult.jsx"
import { useSelector } from "react-redux"

function MyGameList(){
    //genre, page, 
    let [searchParams, setSearchParams] = useSearchParams()
    let [games, setGames] = useState([{count: "0"}])
    let [pagenums, setPageNums] = useState([])
    const location = useLocation()
    const id = useSelector((state) => state.accountInfo.id)

    useLayoutEffect(() => {
        axios.get(`http://localhost:3001/api/gamesearch?name=${searchParams.get("term")}&location=${searchParams.get("location")}&genre=${searchParams.get("genre")}&page=${searchParams.get("page")}`)
        .then(res => {setGames(res.data)})
        
    }, [location])

    useLayoutEffect(() => {
        let arr = []
        for(let i = 1; i <= Math.ceil(Number(games[0].count)/10); i++){
            arr.push(<button className="pagenum" key={i} onClick={() => {setSearchParams({term: searchParams.get("term"), page: i, genre: searchParams.get("genre")})}}><p>{i}</p></button>)
        }

        setPageNums(arr)
    }, [games])

    return(
        <div className="MyGameList">
            <div className="gameresults">
                {(games.map((e, i) => {
                    if(e.id){
                        if(e.user_uuid !== id){
                            return (<GameResult color={i % 2 === 0 ? "#A3B18A" : "#588157"} image={e.image} title={e.name} location={e.location} id={e.id} key={i} poster={e.user_uuid}/>)
                        }
                        
                    }
                }))}
            </div>
            <footer className="pagenums">
                {pagenums}
            </footer>
        </div>
    )
}

export default MyGameList