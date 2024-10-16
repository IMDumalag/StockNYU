import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode
import globalVariable from "/src/backend/data/GlobalVariable"; // Import globalVariable

export default function LoginGoogle() {
   const [user, setUser] = useState(null);
   const navigate = useNavigate();
   const [cookies, setCookie, removeCookie] = useCookies(["user_token"]);

   useEffect(() => {
      if (cookies.user_token) {
         // Decode the JWT token to extract the payload before setting it to the global variable
         const decodedPayload = jwtDecode(cookies.user_token);
         console.log(decodedPayload);
         globalVariable.setUserData(decodedPayload); // Set decoded payload in global variable
         
         // Navigate based on access_id
         if (decodedPayload.access_id === 1) {
            navigate("/login/user_dashboard");
         } else if (decodedPayload.access_id === 2) {
            navigate("/login/staff_dashboard");
         }
      }
   }, [cookies.user_token]);

   const handleLoginSuccess = async (response) => {
      const { credential } = response;
      try {
         const res = await axios.post("http://localhost/stock-nyu/src//backend/google/google.php", { token: credential });
         const { user, isNewUser } = res.data;

         if (res.status === 201) {
            setCookie("user_token", res.data.data, {
               path: "/",
               expires: res.data.expires_at,
               secure: true,
               sameSite: "strict",
            });

            // Decode the JWT token after login to get the payload and set it to the global variable
            const decodedPayload = jwtDecode(res.data.data);
            globalVariable.setUserData(decodedPayload); // Set decoded payload in global variable
            
            // Navigate based on access_id
            if (decodedPayload.access_id === 1) {
               navigate("/login/user_dashboard");
            } else if (decodedPayload.access_id === 2) {
               navigate("/login/staff_dashboard");
            } else if (decodedPayload.access_id === 3) {
               navigate("/login/admin_accountcreation");
            }
            
         }
      } catch (error) {
         console.log(error);
      }
   };

   const handleLoginFailure = (error) => {
      console.error("Login failed", error);
   };

   return (
      <GoogleLogin
         buttonText="Login with Google"
         onSuccess={handleLoginSuccess}
         onFailure={handleLoginFailure}
         width={323}
      />
   );
}
