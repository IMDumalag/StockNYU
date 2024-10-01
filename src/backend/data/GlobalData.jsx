import React, { createContext, useContext, useState } from 'react';

// Create the context
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
   const [userData, setUserData] = useState({
      user_id: null,
      user_type: null,
   });

   return (
      <UserContext.Provider value={{ userData, setUserData }}>
         {children}
      </UserContext.Provider>
   );
};

// Create a custom hook for using the context
export const useUser = () => {
   return useContext(UserContext);
};
