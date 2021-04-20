import React, { Component } from "react";
import AppNavbar from "./components/AppNavbar";
import ToursList from "./components/ToursList";
import TourModal from "./components/tourModal";
import { Container } from "reactstrap";

import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/authActions";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
// import PrahaImage from "./public/prague1.jpg";

class App extends Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <header className="App-header">
            {/* <img src={PrahaImage} alt=" Praha image"></img> */}
            <AppNavbar />
            <Container>
              <TourModal />
              <ToursList />
            </Container>
          </header>
        </div>
      </Provider>
    );
  }
}

export default App;
