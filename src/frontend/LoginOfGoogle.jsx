import React from "react";
import "./LoginOfGoogle.css";
import Login_Form from "./Login_Form.jsx";

export default function Login() {
  return (
    <>
      <div className="parentCont">
        <img src="src\assets\Nu bulldogs store 3.png" alt="logo image" className="backgroundImage" />
        <div className="topContainer">
          <div className="logoTextContainer">
            <img src="src\assets\NU-logo.png" alt="NU Logo" className="logoImage" />
            <h3>NU DASMARIÑAS</h3>
          </div>
        </div>

        <div className="loginCont">
          <Login_Form />
        </div>
      </div>
    </>
  );
}
