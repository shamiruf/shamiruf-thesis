import React, { Component } from "react";
import { Provider } from "react-redux";
import { Container } from "reactstrap";
import store from "../store";

import ToursList from "../components/ToursList";
import AppNavbar from "../components/AppNavbar";
import HeroSection from "../components/HeroSection";
import Cards from "../components/Cards";
import Footer from "../components/Footer";
import "../components/responsive.css";

export class MainPage extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <header className="App-header">
            <AppNavbar />
            <HeroSection />
          </header>
          <Container>
            <ToursList />
          </Container>
          <Cards />
          <Footer />
        </div>
      </Provider>
    );
  }
}

export default MainPage;
