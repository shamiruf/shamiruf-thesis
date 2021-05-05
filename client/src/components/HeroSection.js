import React from "react";
import { Button, Container } from "reactstrap";
import { Link } from "react-router-dom";
import "./responsive.css";

function HeroSection() {
  return (
    <div
      style={{
        backgroundImage: `url(/images/prague_prague2.jpg`,
        backgroundSize: "cover",
        height: "600px",
        width: "auto",
        marginBottom: "3rem",
        paddingTop: "1.5rem",
      }}
    >
      <Container>
        <div
          style={{
            position: "relative",
            textAlign: "center",
            marginLeft: "auto",
            float: "right",
            maxWidth: "500px",
            minWidth: "auto",
          }}
        >
          <div>
            <h3>Choose or create any tour and go through it with chatbot</h3>
          </div>
          <div style={{ marginTop: "1.2rem" }}>
            <Link to={{ pathname: "/dialog", state: "" }}>
              <Button style={{ backgroundColor: "#1b2f56", marginTop: "" }}>
                Start dialog
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default HeroSection;
