import React, { Component, Fragment } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
} from "reactstrap";
import { RiRoadMapLine } from "react-icons/ri";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import RegisterModal from "../auth/RegisterModal";
import LoginModal from "../auth/LoginModal";
import Logout from "../auth/Logout";

// import { auth } from "../../../middleware/auth";

class AppNavbar extends Component {
  // we can create state withou a constructor
  state = {
    isOpen: false,
  };

  //
  static propTypes = {
    auth: PropTypes.object.isRequired,
  };

  // we need toggle to change isOpen
  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };
  // Create render
  render() {
    const { isAuthenticated, user } = this.props.auth;
    const authLinks = (
      <Fragment>
        <NavItem>
          <span className="navbar-text mr-3">
            <strong>{user ? `Welcome ${user.name}` : ""}</strong>
          </span>
        </NavItem>
        <NavItem>
          <Logout />
        </NavItem>
      </Fragment>
    );

    const guestLinks = (
      <Fragment>
        {" "}
        <NavItem>
          <RegisterModal />
        </NavItem>
        <NavItem>
          <LoginModal />
        </NavItem>
      </Fragment>
    );
    return (
      <div>
        <Navbar style={{ backgroundColor: "#1b2f56" }} dark expand="sm">
          <NavbarBrand href="/" className="ml-5">
            <RiRoadMapLine className="mr-2" />
            Prague Tour Giude Chatbot
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle}></NavbarToggler>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto mr-5" navbar>
              {isAuthenticated ? authLinks : guestLinks}
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, null)(AppNavbar);