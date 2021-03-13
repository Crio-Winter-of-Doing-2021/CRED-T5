import React, { useState, useEffect } from "react";

import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import Login from "./components/Login";
import Signup from "./components/Signup";
import Cards from "./components/Cards";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const checkAuthenticated = async () => {
    try {
      const response = await fetch("http://localhost:8080/verify", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.token
        }
      });
      const parseRes = await response.json();
      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
    } catch (err) {
      console.error(err.message);
    }
  };
  useEffect(() => {
    const pathname = window.location.pathname;
    console.log(pathname);
    if(pathname!=="/login" || localStorage.getItem("token")!==null){
      console.log(localStorage.getItem("token"));
      checkAuthenticated();
    }
  }, []);

  const setAuth = boolean => {
    setIsAuthenticated(boolean);
  };

  const logout = boolean => {
    setIsAuthenticated(false);
    localStorage.removeItem("token");
  }
  return (
    <>
      <Router>
        <Switch>
          <Route
            exact path={["/", "/login"]} render={props =>
              !isAuthenticated ? (
                <Login {...props} setAuth={setAuth} />
              ) : (
                <Redirect to="/cards" />
              )
            }
          />
          <Route
            exact path="/signup" render={props =>
              !isAuthenticated ? (
                <Signup {...props} setAuth={setAuth} />
              ) : (
                <Redirect to="/cards" />
              )
            }
          />
          <Route exact path="/cards" render={props =>
            isAuthenticated ? (
              <Cards {...props} logout={logout} />
            ) : (
              <Redirect to="/login" />
            )
          }
          />
        </Switch>
      </Router>
    </>
  );
}

export default App;