import "./PostAGame.css"
import { useSelector } from "react-redux"
import upload from "../../assets/upload.svg"
import { useRef, useState } from "react"
import axios from "axios"
import loading from "../../assets/loading.gif"
import {locationToSearch} from "../../moduleexports"



function PostAGame() {
    const id = useSelector((state) => state.accountInfo.id)
    const img = useRef()
    const name = useRef()
    const [locations, setLocations] = useState([])
    const [location, setLocation] = useState("")
    const [picture, setPicture] = useState(upload)
    let timer


    //if(id === null){window.location.href = "http://localhost:3000/"}

    function handleImgChange() {
        

        setPicture(loading)

        const formData = new FormData()
        formData.append("image", img.current)

        axios.post("http://localhost:3001/api/setimg", formData)
            .then(res => {
                img.current = res.data
                setPicture(img.current)
            })
    }

    function handleLocations(){
        clearTimeout(timer)

        if(location && location !== ""){
            timer = setTimeout(() => {
                axios.get(`http://localhost:3001/api/location/:${locationToSearch(location)}`)
                .then(res => {
                    let arr = []
                    if(res.data.status === "OK"){
                        arr = res.data.predictions.map((e) => {
                            return e.description
                        })
                        setLocations(arr)
                    }
                })
            }, 500)
        }
        
        
    }

    return (
        <div className="PostAGame">
            <div className="leftside">
                <div className="imgupload">
                    <div className="imgholder"><img src={picture} alt="Game Picture" /></div>
                    <input type="file" className="imguploadbutton" name="image" onChange={(e) => { img.current = (e.target.files[0]); handleImgChange() }} />
                </div>
            </div>

            <div className="rightside">
                <div className="topright">
                    <input type="text" placeholder="Enter name" onChange={(e) => {name.current = e.target.value}}/>
                    <input type="text" placeholder="Enter location (City, State)" value={location} onChange={(e) => {setLocation(e.target.value); handleLocations()}}/>
                    <div className="locationchecker">
                        {locations.map((e) => {
                            return(
                                <button className="location" onClick={() => {setLocation(e); setLocations([])}}>
                                    <p>{e}</p>
                                </button>
                            )
                        })}
                    </div>
                </div>
                <div className="bottomright">
                    <input type="submit" value="Post Game" onSubmit={() => {  }} />
                </div>
            </div>
        </div>
    )
}

export default PostAGame