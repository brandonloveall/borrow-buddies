import "./HomePage.css"
import testgame from "../../assets/testgame.jpg"
import gow from "../../assets/gow.jpg"
import eldenring from "../../assets/eldenring.jpg"
import arrow from "../../assets/imgarrow.svg"
import { useState } from "react"
import {termToSearch} from "../../moduleexports"
import { Link } from "react-router-dom"
import { current } from "@reduxjs/toolkit"

function HomePage() {
    let games = [
        {name: "Call of Duty: Modern Warfare II", img: testgame},
        {name: "God of War: Ragnarok", img: gow},
        {name: "Elden Ring", img: eldenring}
    ]

    const [currentGame, setCurrentGame] = useState(0)

    function nextImg() {
        if(currentGame === games.length - 1){
            setCurrentGame(0)
        }else{
            setCurrentGame(currentGame + 1)
        }
    }

    function prevImg() {
        if(currentGame === 0){
            setCurrentGame(games.length - 1)
        }else{
            setCurrentGame(currentGame - 1)
        }
    }

    return (
        <div className="HomePage">
            <div className="featuredgames"><h2>Featured Games</h2></div>
            
            <div className="imgscroll">
                <div className="leftarrow"><img src={arrow} alt="" onClick={() => {prevImg()}}/></div>
                
                <div className="imageholder">
                    <Link to={`/c/${termToSearch(games[currentGame].name)}`} className="imglink">
                        <img src={games[currentGame].img} alt="" /> 
                        <div className="imgdescription">
                            <p>{games[currentGame].name}</p>
                        </div>
                    </Link>
                </div>

                <div className="rightarrow"><img src={arrow} alt="" onClick={() => {nextImg()}}/></div>
            </div>
        </div>
    )
    
}

export default HomePage