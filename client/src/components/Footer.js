import React, { Component } from "react";
import { RiRoadMapLine } from "react-icons/ri";

export class Footer extends Component {
  render() {
    return (
      <div>
        <div
          style={{
            backgroundColor: "#1b2f56",
            color: "white",
            height: "auto",
            textAlign: "left",
            padding: "0.5rem 1rem ",
          }}
        >
          <div style={{ textAlign: "center", fontSize: "20px" }}>
            <RiRoadMapLine className="mr-2" />
            Prague Tour Guide Chatbot
          </div>
          <hr style={{ backgroundColor: "white" }} />
          <div style={{ color: "white", marginLeft: "50px" }}>
            <p>
              Photos from <a href="https://www.pexels.com/">pexels.com</a>.{" "}
              <br />
              Photo authors: Pierre Blaché, Viesturs Davidčuks,
              <p>Andrey Merkulev, Dimitry Anikin.</p>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;
