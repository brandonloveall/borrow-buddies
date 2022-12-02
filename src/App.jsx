import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import cart from "./assets/cart.svg"
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

//TODO: USE REDUX TO IMPLEMENT ACCOUNT LINK

function App() {
  let [accountDropdown, setAccountDropdown] = useState("none")
  const dispatch = useDispatch()
  const id = useSelector((state) => state.accountInfo.id)
  const displayLogin = useSelector((state) => state.login.display)
  const displaySignup = useSelector((state) => state.signup.display)
  const username = useSelector((state) => state.accountInfo.username)
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className='App'>
      <Login display={displayLogin}/>
      <Signup display={displaySignup} />
      <header>
        <div className='accountinfo'>
          {(() => {return id ? <div className='myaccount'><button className='accountbutton' onClick={() => {accountDropdown === "none" ? setAccountDropdown("flex") : setAccountDropdown("none")}}><p>My Account</p></button>
            <div className='accountdropdownholder'>
              <div className='accountdropdown' style={{display: accountDropdown}}>
                <Link to={`/c/account/${id}`} className='myaccount'><p>View Profile</p></Link>
                <Link to="/c/settings" className='settings'><p>Settings</p></Link>
                <button className='signout' onClick={() => {dispatch(logout())}}><p>Sign Out</p></button>
              </div>
            </div>  
          </div> : null})()}
          {(() => { return id ? <Link className='accountbutton postagame' to="/c/postagame"><p>Post a Game</p></Link> : null})()}

          <Link className='accountbutton postagame' to="/c/postagame"><p>Post a Game</p></Link>

          {(() => {return id === null ? <button className='accountbutton' onClick={() => {dispatch(toggleLogin())}}><p>Login</p></button> : null})()}

          {(() => {return id === null ? <button className='accountbutton' onClick={() => {dispatch(toggleSignup())}}><p>Sign Up</p></button> : null})()}
          
          {(() => {return id ? <Link to="/c/mycart" className='cart'><img src={cart} alt="" /></Link> : null})()}
          
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
            <Link to="/c/search?genre=action" className='link'><p className='firstgenre'>Action</p></Link>
            <Link to="/c/search?genre=adventure" className='link'><p>Adventure</p></Link>
            <Link to="/c/search?genre=platformer" className='link'><p>Platformer</p></Link>
            <Link to="/c/search?genre=fps" className='link'><p>FPS</p></Link>
            <Link to="/c/search?genre=fighting" className='link'><p>Fighting</p></Link>
            <Link to="/c/search?genre=stealth" className='link'><p>Stealth</p></Link>
            <Link to="/c/search?genre=survival" className='link'><p>Survival</p></Link>
            <Link to="/c/search?genre=horror" className='link'><p className='lastgenre'>Horror</p></Link>
          </div>
        </div>


      </nav>

      <Routes>
        <Route exact path="/" element={<HomePage/>} />
        <Route exact path="/c/postagame" element={<PostAGame />} />
      </Routes>
    </div>
  );
}

export default App;
