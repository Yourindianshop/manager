import React, { useContext, useEffect, useState } from "react";
import "../stylesheet/Login.css"; // Import your CSS styles here
import LoginIcon from "@mui/icons-material/Login";
import { Link, useNavigate } from "react-router-dom"; // Import Link from 'react-router-dom' if you are using React Router
import { fetchreq, jwtauth } from "../Helper/fetch";
import { MyContext } from "../App";

const SignIn = () => {
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const nav = useNavigate();
  const {setMg,setIsLogin}=useContext(MyContext);
  const [access,setAccess]=useState(false);
  const [run,setRun]=useState(false);
  const login = async (e)=>{
    
    e.preventDefault();
    if(!run && email!="" && pass != ""){
      setRun(true);
      const out = await fetchreq("POST","loginManager",{email,password:pass});
      if(out){
        window.localStorage.setItem("JWTM", JSON.stringify(out.token));
        const manager =out.user;
        if(manager.Wid!=null){
          setIsLogin(true);
          setMg(manager);
          nav("/dashboard");
        }else{
          alert("No warehouse allocated to you...");
        }
      }else{
        alert("wrong id or password");
        setEmail("");
        setPass("");
      }
    }else{
      alert("invalid credentials...");
    }
    setRun(false);
  }
  const onstart = async ()=>{
    const dt = await jwtauth();
    if(dt){
      const manager = dt.result[0];
      if(manager.Wid!=null){
        setIsLogin(true);
        setMg(manager);
        nav("/dashboard");
      }else{
        alert("No warehouse allocated to you...");
      }
    }else{
      setAccess(true);
    }
  }
  useEffect(()=>{
    onstart();
  },[])
  return (
    <>
      <section className="signup">
        <div className="wrapper">
          {access && <form onSubmit={login} className="form">
            <div className="title">
              <div className="line"></div>
              <div className="uline">
                Welcome to <span id="org">Your Indin Shop</span>
              </div>
            </div>
            <label htmlFor="username">Username:</label>
            <input value={email} onChange={(e)=>{setEmail(e.target.value)}} type="text" id="username" />
            <label htmlFor="password">Password:</label>
            <input value={pass} onChange={(e)=>{setPass(e.target.value)}} type="password" id="password" />
            <br />
            <div>
              <button type="submit" className="btn btn-o">
                <LoginIcon />
                {!run ?"Sign In": "Sign In..."}
              </button>
            </div>
          </form>}
          {!access && <h1>Please Wait...</h1> }
        </div>
      </section>
    </>
  );
};

export default SignIn;
