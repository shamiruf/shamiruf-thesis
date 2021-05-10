import React, { Component } from "react";
import { Container } from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import "./responsive.css";
import { getTours } from "../actions/tourActions.js";

class ToursList extends Component {
  //action from redux stored as a prop
  static propTypes = {
    getTours: PropTypes.func.isRequired,
    tour: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.getTours();
  }

  renderImage(nameTour) {
    switch (nameTour) {
      case "Little Quarter tour":
        return "/images/little_quarter.jpg";
      case "Holesovice tour":
        return "/images/holesovice.jpg";
      case "Old Town tour":
        return "/images/old_town2.jpg";
      case "From Vinohrady to Zizkov tour":
        return "/images/zizkov.jpg";
      default:
        return "";
    }
  }

  render() {
    const { tours } = this.props.tour;
    return (
      <div>
        <Container>
          <h1 style={{ textAlign: "center" }} className="mb-5">
            Ready tours
          </h1>
          {tours.map((tour, index) => {
            let src = this.renderImage(tour.nameTour);
            return (
              <div key={index} className="mb-4 sm">
                <hr />
                <div key={index} style={{ display: "flex" }}>
                  <img
                    style={{ borderRadius: "20px", marginRight: "48px" }}
                    src={src}
                    width="300px"
                    alt="Tour"
                  />
                  <div>
                    <h2
                      style={{ marginBottom: "1.25rem", textAlign: "center" }}
                    >
                      {tour.nameTour}
                    </h2>
                    <p style={{ marginBottom: "1.25rem", textAlign: "center" }}>
                      <b>Rating: </b>
                      {Math.round(tour.totalRating * 10) / 10} <br />
                      <b>Duration:</b> {tour.duration} <br />
                      <b>Waypoints:</b> {tour.waypoints.length}
                    </p>
                    <p className="p-style">{tour.tourDescription}</p>
                    <p className="p-style">
                      <b>What you will see:</b> {tour.waypoints.join(" - ")}
                    </p>
                    <div style={{ textAlign: "center" }}>
                      <Link
                        to={{
                          pathname: "/dialog",
                          state: tour.nameTour,
                        }}
                      >
                        <Button style={{ backgroundColor: "#1b2f56" }}>
                          Start tour
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
                <hr />
              </div>
            );
          })}
        </Container>
      </div>
    );
  }
}

// tour because we had it in root reducer (reducers/index.js)
const mapStateToProps = (state) => ({
  tour: state.tour,
});

// mapsStateToProps - take tours state and map it to component property
export default connect(mapStateToProps, { getTours })(ToursList);
