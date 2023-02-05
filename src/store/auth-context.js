// Component to create authentication with createContext API, ensuring global logged in / logged out functionality
import React, {useEffect, useState} from "react";

const AuthContext = React.createContext({
  isLoggedIn: false,
  onLogout: () => {
  },
  onLogin: (email, password) => {
  }
});

// function for logging in / logging out
export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // check local storage if user is logged in
  useEffect(() => {
    const storedUserLoggedInInformation = localStorage.getItem('isLoggedIn');

    if (storedUserLoggedInInformation === '1') {
      setIsLoggedIn(true);
    }
  }, []);

  // handler to remove isLoggedIn item from local storage -> logout user
  const logoutHandler = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  // handler to set isLoggedIn item in local storage to true -> login user
  const loginHandler = () => {
    localStorage.setItem('isLoggedIn', '1');
    setIsLoggedIn(true);
  };

  return (
      // Provider component for useContext authentication
      <AuthContext.Provider
          value={{
            isLoggedIn: isLoggedIn,
            onLogout: logoutHandler,
            onLogin: loginHandler,
          }}
      >
        {props.children}
      </AuthContext.Provider>
  );
}

export default AuthContext;