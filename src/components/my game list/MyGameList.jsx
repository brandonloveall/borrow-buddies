import "./MyGameList.css"
import { useSearchParams, Link, useLocation } from "react-router-dom"
import axios from "axios"
import {useEffect, useState, useRef, useLayoutEffect} from "react"
import MyGameResult from "../my game result/MyGameResult.jsx"
import { useSelector } from "react-redux"

function MyGameList(){
    //genre, page, 
    let [searchParams, setSearchParams] = useSearchParams()
    let [games, setGames] = useState([{count: "0"}])
    let [pagenums, setPageNums] = useState([])
    const id = useSelector((state) => state.accountInfo.id)

    useLayoutEffect(() => {
        axios.get(`http://localhost:3001/api/usergames/${id}?page=${searchParams.get("page")}`)
        .then(res => {setGames(res.data)})
        
    }, [])

    useLayoutEffect(() => {
        let arr = []
        let num = searchParams.get("page")
        for(let i = 1; i <= Math.ceil(Number(games[0].count)/10); i++){
            arr.push(<button className="pagenum" key={i} style={{backgroundColor: i === num ? "white" : "black", color: i === num ? "black" : "white"}} onClick={() => {setSearchParams({term: searchParams.get("term"), page: i, genre: searchParams.get("genre")})}}><p>{i}</p></button>)
        }

        setPageNums(arr)
    }, [games])

    return(
        <div className="MyGameList">
            <div className="gameresults">
                {(games.map((e, i) => {
                    if(e.id){
                        if(e.user_uuid !== id){
                            return (<MyGameResult color={i % 2 === 0 ? "#A3B18A" : "#588157"} image={e.image} title={e.name} location={e.location} id={e.id} key={i} poster={e.user_uuid}/>)
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