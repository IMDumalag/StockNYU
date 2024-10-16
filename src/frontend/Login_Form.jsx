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

   

   return (
      <>
         <div className="cont">
            <div className="row justify-content-center">
               <div className="col-6">
                  <div className="imageContainer">
                     <img src="src\assets\LOGO.svg" alt="Stock NYU" className="formimage" style={{marginTop:'45px'}}/>
                  </div>
               </div>

               <div className="col-6 text">
                  <h2 className="title text-center" style={{fontSize:'48px', marginTop:'-10px', marginBottom:'40px'}}>Welcome to Stock NYU</h2>
                  <p className="subtitle text-center">
                  Stock NYU is an inventory management system designed to streamline the process of browsing and reserving stock for users, while providing staff with robust tools to manage inventory efficiently. Whether you are a student, faculty member, or staff, Stock NYU ensures you have real-time access to stock levels and the ability to make reservations seamlessly.
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
