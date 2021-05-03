import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// Pages
import MainPage from "./pages";
import DialogPage from "./pages/dialog";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={MainPage} />
          <Route exact path="/dialog" component={DialogPage} />
        </Switch>
      </Router>
    );
  }
}

export default App;
