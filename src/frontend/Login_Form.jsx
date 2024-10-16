import React, { useState } from "react";
import "./Login_Form.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoginGoogle from './LoginGoogle';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function Login_Form() {
   const navigate = useNavigate();
   const [login, setLogin] = useState({
      email: "",
      password: "",
   });

   const handleInput = (event) => {
      setLogin((login) => ({
         ...login,
         [event.target.name]: event.target.value,
      }));
   };

   const handleClick = () => {
      navigate("/homepage");
   };

   function handleSubmit(event) {
      event.preventDefault();
      axios
         .post("http://localhost/nud-hub/API/login_user.php/", login, {
            headers: {
               "Content-Type": "application/json",
            },
         })
         .then(function (response) {
            if (response.data === "Success") {
               navigate("/loginhome");
            } else {
               alert("Failed");
            }
         })
         .catch((error) => console.log(error));
   }

   return (
      <>
         <div className="cont">
            <div className="row justify-content-center">
               <div className="col-6">
                  <div className="imageContainer">
                     <img src="" alt="NU-D Hub" className="formimage" />
                  </div>
               </div>

               <div className="col-6 text">
                  <h2 className="title text-center">Welcome to Stock NYU</h2>
                  <p className="subtitle text-center">
                     The NU-D inventory management system offers real-time updates on stock changes, a feedback platform, event calendars, and access to exclusive promotions for NU Dasmariñas students, faculty, and staff.
                  </p>

                  <hr className="border border-custom border-1 opacity-90" />
                  
                  <div className="d-flex justify-content-center">
                     <LoginGoogle />
                  </div>
               </div>
            </div>
         </div>
      </>
   );
}
