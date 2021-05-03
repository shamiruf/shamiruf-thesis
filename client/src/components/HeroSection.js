import React from "react";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";

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
      <div
        style={{
          position: "relative",
          width: "350px",
          textAlign: "center",
          marginLeft: "auto",
          marginRight: "5rem",
        }}
      >
        <div>
          <h2>Choose or create any tour and go through it with chatbot</h2>
        </div>
        <div>
          <Link to={{ pathname: "/dialog", state: "" }}>
            <Button style={{ backgroundColor: "#1b2f56", marginTop: "2rem" }}>
              Start dialog
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
