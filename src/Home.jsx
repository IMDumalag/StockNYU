import React from 'react';
import { Link } from 'react-router-dom';

function Home(){
      return(
         <div>
               <h1>Home</h1>
               
               <button>
                  <Link to="/register">Register</Link>
               </button>

               <button>
                  <Link to="/login">Login</Link>
               </button>
         </div>
      )
   }

export default Home;   