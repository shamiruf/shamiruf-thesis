import { Media } from "react-bootstrap";
import React from "react";
import StartDialogBtn from "../StartDialogBtn";

function HeroSection() {
  return (
    <div
      style={{
        backgroundImage: `url(/images/prague_prague2.jpg`,
        backgroundSize: "cover",
        height: "600px",
        width: "auto",
      }}
      className="mb-5"
    >
      <Media style={{ textAlign: "right" }} className="mb-5 ">
        <Media.Body
          style={{ width: "200px", textAlign: "right" }}
          className="mr-5 mt-5"
        >
          <h2>Choose or create any tour and go through it with chatbot</h2>
          <StartDialogBtn />
        </Media.Body>
      </Media>
    </div>
  );
}

export default HeroSection;
