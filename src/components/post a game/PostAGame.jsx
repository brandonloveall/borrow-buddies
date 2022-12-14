import "./PostAGame.css"
import { useSelector } from "react-redux"
import upload from "../../assets/upload.svg"
import { useRef, useState } from "react"
import axios from "axios"
import loading from "../../assets/loading.gif"
import { locationToSearch } from "../../moduleexports"


function PostAGame() {
    const id = useSelector((state) => state.accountInfo.id)
    const img = useRef()
    const name = useRef()
    const [locations, setLocations] = useState([])
    const [location, setLocation] = useState("")
    const trueLocation = useRef()
    const imgUUID = useRef()
    const [picture, setPicture] = useState(upload)
    const genres = useRef([])
    console.log(genres.current)
    const debounce = useRef()
    debounce.current = false

    let timer = useRef()
    let [buttonContent, setButtonContent] = useState("Post Game")

    


    if(id === null){window.location.href = "http://localhost:3001/"}

    function handleImgChange() {

        if (debounce.current === true) { window.alert("Please wait for the image to finish uploading."); return }


        setPicture(loading)
        debounce.current = true

        const formData = new FormData()
        formData.append("image", img.current)

        if(imgUUID.current === undefined){
            axios.post("http://localhost:3001/api/setimg", formData)
            .then(res => {
                img.current = res.data.location
                imgUUID.current = res.data.Key
                setPicture(img.current)
                debounce.current = false
            })
        }
        else{
            axios.post(`http://localhost:3001/api/setimg?prev=${imgUUID.current}`, formData)
            .then(res => {
                img.current = res.data.location
                imgUUID.current = res.data.Key
                setPicture(img.current)
                debounce.current = false
            })
        }
    }

    function handleLocations() {
        clearTimeout(timer.current)

        if (location && location !== "") {
            timer.current = setTimeout(() => {
                axios.get(`http://localhost:3001/api/location/:${locationToSearch(location)}`)
                    .then(res => {
                        let arr = []
                        if (res.data.status === "OK") {
                            arr = res.data.predictions.map((e) => {
                                return e.description
                            })

                            setLocations(arr)
                        }
                    })
            }, 1000)
        }


    }

    function handleSubmit() {

        if (picture === upload) { window.alert("Please submit an image."); return }
        if (picture === loading) { window.alert("Please wait for image to finish uploading."); return }
        if (imgUUID === undefined) {window.alert("Something went wrong with the image UUID!"); return}
        if (name === "" || name === null) { window.alert("Please enter a name."); return }
        if(genres.current === undefined || genres.current.length === 0){window.alert("Please select at least 1 genre."); return}
        if (trueLocation.current === null || trueLocation.current === "") { window.alert("Please enter a location."); return }
        if(buttonContent === "Posting game..."){window.alert("Please wait for game to finish posting.")}
        let realName = locationToSearch(name.current)

        if (buttonContent === "Post Game") {
            setButtonContent("Posting game...")
            axios.post("http://localhost:3001/api/postgame", { picture: img.current, name: realName, location: trueLocation.current, genres: genres.current, uuid: imgUUID.current, user_uuid: id })
                .then((res) => {
                    window.alert("Game has been posted!")
                    window.location.href = `http://localhost:3000/`
                })
        }
    }

    function handleGenreclick(genre) {
        if (genres.current.indexOf(genre) === -1) { genres.current.push(genre); console.log(genres.current); return }
        genres.current.splice(genres.current.indexOf(genre), 1)
        console.log(genres.current)
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
                    <input type="text" placeholder="Enter name" onChange={(e) => { name.current = e.target.value; }} />
                    <input type="text" placeholder="Enter location (City, State)" value={location} onChange={(e) => { setLocation(e.target.value); handleLocations() }} />
                    <div className="locationchecker">
                        {locations.map((e, i) => {
                            return (
                                <button className="location" key={i} onClick={() => { setLocation(e); setLocations([]); trueLocation.current = e }}>
                                    <p>{e}</p>
                                </button>
                            )
                        })}
                    </div>
                </div>
                <div className="bottomright">
                    <div className="genreHolder">
                        <div className="checkboxholder">
                            <input type="checkbox" name="Action" onClick={() => { handleGenreclick("Action") }} />
                            <label htmlFor="Action">Action</label>
                        </div>
                        <div className="checkboxholder">
                            <input type="checkbox" name="Adventure" onClick={() => { handleGenreclick("Adventure") }} />
                            <label htmlFor="Adventure">Adventure</label>
                        </div>
                        <div className="checkboxholder">
                            <input type="checkbox" name="Platformer" onClick={() => { handleGenreclick("Platformer") }} />
                            <label htmlFor="Platformer">Platformer</label>
                        </div>
                        <div className="checkboxholder">
                            <input type="checkbox" name="FPS" onClick={() => { handleGenreclick("FPS") }} />
                            <label htmlFor="FPS">FPS</label>
                        </div>
                        <div className="checkboxholder">
                            <input type="checkbox" name="Fighting" onClick={() => { handleGenreclick("Fighting") }} />
                            <label htmlFor="Fighting">Fighting</label>
                        </div>
                        <div className="checkboxholder">
                            <input type="checkbox" name="Stealth" onClick={() => { handleGenreclick("Stealth") }} />
                            <label htmlFor="Stealth">Stealth</label>
                        </div>
                        <div className="checkboxholder">
                            <input type="checkbox" name="Survival" onClick={() => { handleGenreclick("Survival") }} />
                            <label htmlFor="Survival">Survival</label>
                        </div>
                        <div className="checkboxholder">
                            <input type="checkbox" name="Horror" onClick={() => { handleGenreclick("Horror") }} />
                            <label htmlFor="Horror">Horror</label>
                        </div>
                    </div>
                    <button className="submitGameButton" onClick={() => { handleSubmit() }}><p>{buttonContent}</p></button>
                </div>
            </div>
        </div>
    )
}

export default PostAGame