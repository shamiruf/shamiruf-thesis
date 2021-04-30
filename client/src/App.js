import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import store from "./store";
import { loadUser } from "./actions/authActions";

// Pages
import MainPage from "./pages";
import DialogPage from "./pages/dialog";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

class App extends Component {
  componentDidMount() {
    // store.dispatch(loadUser());
  }
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={MainPage} />
          <Route exact path="/dialog" component={DialogPage} />
        </Switch>
        {/* <Provider store={store}>
          <div className="App">
            <header className="App-header">
              <AppNavbar />
              <HeroSection />
              <Container>
                <ToursList />
              </Container>
            </header>
          </div>
        </Provider> */}
      </Router>
    );
  }
}

export default App;
