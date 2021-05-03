import React, { Component } from "react";
import { Navbar, NavbarBrand } from "reactstrap";
import { RiRoadMapLine } from "react-icons/ri";

class AppNavbar extends Component {
  // Create render
  render() {
    return (
      <div>
        <Navbar style={{ backgroundColor: "#1b2f56" }} dark expand="sm">
          <NavbarBrand href="/" className="ml-5">
            <RiRoadMapLine className="mr-2" />
            Prague Tour Guide Chatbot
          </NavbarBrand>
        </Navbar>
      </div>
    );
  }
}
export default AppNavbar;
