import logo from "./logo.svg";
import "./App.css";

import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";
import Account from "./Account";
import LoginScreen from "./LoginScreen";
import HomeScreen from "./HomeScreen";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

export default function App() {

 return (
    <Router>
      <div className="container px-md-2 mt-5">
        <h1 className="text-center title-font mb-5"><i>CONTAINERS BATTLEGROUND</i></h1>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/account">
            <LoginScreen />
          </Route>
          <Route path="/">
            <HomeScreen />
          </Route>
        </Switch>
      </div>
    </Router>
  );

}

// export default App;
