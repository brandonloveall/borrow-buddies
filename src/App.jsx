import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import bell from "./assets/bell.svg"
import search from "./assets/search.svg"
import {useSelector, useDispatch} from "react-redux"
import {logout} from "./store/slices/accountInfoSlice.js"
import HomePage from "./components/home page/HomePage.jsx"
import {termToSearch} from "./moduleexports"
import Login from "./components/login/Login.jsx"
import {toggleLogin} from "./store/slices/loginSlice.js"
import Signup from './components/signup/Signup';
import {toggleSignup} from "./store/slices/signupSlice.js"
import PostAGame from "./components/post a game/PostAGame.jsx"
import GameList from './components/game list/GameList.jsx';
import axios from "axios"
import MyGameList from "./components/my game list/MyGameList.jsx"

//TODO: USE REDUX TO IMPLEMENT ACCOUNT LINK

function App() {
  let [accountDropdown, setAccountDropdown] = useState("none")
  const dispatch = useDispatch()
  const id = useSelector((state) => state.accountInfo.id)
  const displayLogin = useSelector((state) => state.login.display)
  const displaySignup = useSelector((state) => state.signup.display)
  const username = useSelector((state) => state.accountInfo.username)
  const [searchTerm, setSearchTerm] = useState("")
  const [alerts, setAlerts] = useState(0)

  useEffect(() => {
    axios.get("http://localhost:3001/api/").then(res => {setAlerts(res.data)})
  }, [])

  return (
    <div className='App'>
      <Login display={displayLogin}/>
      <Signup display={displaySignup} />
      <header>
        <div className='accountinfo'>
          {(() => {return id ? <div className='myaccount'><button className='accountbutton' onClick={() => {accountDropdown === "none" ? setAccountDropdown("flex") : setAccountDropdown("none")}}><p>My Account</p></button>
            <div className='accountdropdownholder'>
              <div className='accountdropdown' style={{display: accountDropdown}}>
                <Link to={`/c/mygames`} className='myaccount' onClick={() => {setAccountDropdown("none")}}><p>View My Games</p></Link>
                <Link to="/c/settings" className='settings' onClick={() => {setAccountDropdown("none")}}><p>Settings</p></Link>
                <button className='signout' onClick={() => {dispatch(logout()); setAccountDropdown("none")}}><p>Sign Out</p></button>
              </div>
            </div>  
          </div> : null})()}
          {(() => { return id ? <Link className='accountbutton postagame' to="/c/postagame"><p>Post a Game</p></Link> : null})()}

          {(() => {return !id ? <button className='accountbutton' onClick={() => {dispatch(toggleLogin())}}><p>Login</p></button> : null})()}

          {(() => {return !id ? <button className='accountbutton' onClick={() => {dispatch(toggleSignup())}}><p>Sign Up</p></button> : null})()}
          
          {(() => {return id ? <Link to="/c/myalerts" className='cart'><img src={bell} alt="" /><p className='messagecount'>{alerts}</p></Link> : null})()}
          
        </div>
      </header>

      <nav>
        <Link className='borrowbuddies' to="/"><h1>Borrow Buddies!</h1></Link>
        <div className='searchholder'>
          <div className='searchbarholder'>
            <input type="text" className='searchBar' placeholder='Search for a game...' onChange={(e) => {setSearchTerm(e.target.value); console.log(searchTerm)}}/>
            <Link className='searchbutton' to={`/c/${termToSearch(searchTerm)}`}><img src={search} alt="" /></Link>
          </div>

          <div className='genreHolder'>
            <Link to="/c/search?genre=Action&page=1" className='link'><p className='firstgenre'>Action</p></Link>
            <Link to="/c/search?genre=Adventure&page=1" className='link'><p>Adventure</p></Link>
            <Link to="/c/search?genre=Platformer&page=1" className='link'><p>Platformer</p></Link>
            <Link to="/c/search?genre=Fps&page=1" className='link'><p>FPS</p></Link>
            <Link to="/c/search?genre=Fighting&page=1" className='link'><p>Fighting</p></Link>
            <Link to="/c/search?genre=Stealth&page=1" className='link'><p>Stealth</p></Link>
            <Link to="/c/search?genre=Survival&page=1" className='link'><p>Survival</p></Link>
            <Link to="/c/search?genre=Horror&page=1" className='link'><p className='lastgenre'>Horror</p></Link>
          </div>
        </div>


      </nav>

      <Routes>
        <Route exact path="/" element={<HomePage/>} />
        <Route path="/c/postagame" element={<PostAGame />} />
        <Route path="/c/search" element={<GameList />}/>
        <Route path="/c/mygames" element={<MyGameList />}/>
      </Routes>
    </div>
  );
}

export default App;
