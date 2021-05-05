import React, { Component } from "react";
import { Button, Container } from "reactstrap";
import { Link } from "react-router-dom";

export class Cards extends Component {
  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <h3>Do you want more?</h3>
        <Container>
          <div
            style={{
              display: "inline-block",
              marginBottom: "3rem",
              marginTop: "1.5rem",
            }}
          >
            <div
              style={{
                background:
                  "linear-gradient(180deg, rgba(27, 47, 86, 0.3) 0%, rgba(27, 47, 86, 0.111) 100%)",
                borderRadius: "20px",
                marginBottom: "1.2rem",
                padding: "1.7rem",
              }}
            >
              <h2 style={{ marginBottom: "1rem" }}>Create your own tour</h2>
              <p>
                With the chatbot, you can create your own tour. To do this, you
                need a start point, an end point, and the rest of the points you
                want to visit. The chatbot will create a path for you, and guide
                you along it, telling you information about each point along the
                way!
              </p>
              <div style={{ marginTop: "1.2rem" }}>
                <Link to={{ pathname: "/dialog", state: "Create own path" }}>
                  <Button style={{ backgroundColor: "#1b2f56" }}>
                    Create tour
                  </Button>
                </Link>
              </div>
            </div>
            <div
              style={{
                background:
                  "linear-gradient(180deg, rgba(27, 47, 86, 0.3) 0%, rgba(27, 47, 86, 0.111) 100%)",
                borderRadius: "20px",
                padding: "1.7rem",
              }}
            >
              <h2>Find interesting places nearby</h2>
              <p>
                If you want to find something interesting near you, use this
                chatbot. Provide your address and select the category of your
                interest, and the chatbot will find open places for you to
                visit.
              </p>
              <div style={{ marginTop: "1.2rem" }}>
                <Link to={{ pathname: "/dialog", state: "Find places nearby" }}>
                  <Button style={{ backgroundColor: "#1b2f56" }}>
                    Find places
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }
}

export default Cards;
