import React, { Component } from "react";
import { Navbar, NavbarBrand, Container } from "reactstrap";
import { RiRoadMapLine } from "react-icons/ri";
import "./responsive.css";

class AppNavbar extends Component {
  render() {
    return (
      <div>
        <Navbar style={{ backgroundColor: "#1b2f56" }} dark expand="sm">
          <Container>
            <NavbarBrand href="/">
              <RiRoadMapLine className="mr-2" />
              Prague Tour Guide Chatbot
            </NavbarBrand>
          </Container>
        </Navbar>
      </div>
    );
  }
}
export default AppNavbar;
