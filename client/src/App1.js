import React, { useEffect, useState } from "react";
import Axios from 'axios';
import './App1.css';
 
function App() {
 
 const [usernameReg, setUernameReg] = useState("");
 const [passwordReg, setPasswordReg] = useState ("");
 
 const [username, setUername] = useState("");
 const [password, setPassword] = useState ("");
 
 const [loginStatus, setLoginStatus] = useState("");
 
 Axios.defaults.withCredentials = true;
 const register = () => {
    Axios.post("http://localhost:3001/register", {
      username: usernameReg,
      password: passwordReg,
    }).then((response) => {
      console.log(response);
    });
 };
 
 const login = () => {
 Axios.post("http://localhost:3001/login", {
    email_address: username,
    password: password,
 }).then((response) => {
    if (!response.data.message) {
       setLoginStatus( response.data.message);
    } else {
       setLoginStatus (response.data[0].message);
    }
 });
 };
useEffect(() => {
    Axios.get("http://localhost:3001/login").then((response) => {
      if (response.data.loggedIn === true) {
        // setRole(response.data.user[0].role);
        console.log("Logged In");
      }
    });
  }, []);
 
 return (
    <div className="App">
       <div className="registration">
          <h1>Registration</h1>
          <label>Username</label>
          <input
             type="text"
             onChange={(e) => {
                setUernameReg(e.target.value);
             }}
          /><br/>
          <label>password</label>
          <input 
            type="text"
            onChange={(e) =>{
               setPasswordReg(e.target.value);
            }}
          /> <br />
          <button onClick={register} > Register</button>
       </div>
 
       <div className="login">
           <h1>Login</h1>
           <input
              type="text"
              placeholder="Username…"
              onChange = { (e) => {
                 setUername (e.target.value);
              }}
              /> <br/>
           <input
              type="password"
              placeholder="Password…"
              onChange = { (e) => {
                 setPassword (e.target.value);
              }}
           />
           <button onClick={login}>Login</button>
       </div>
       <h1> {loginStatus}</h1>
    </div>
 );
}
export default App;