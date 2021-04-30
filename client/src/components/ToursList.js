import React, { Component } from "react";
import { Container, ListGroup, ListGroupItem, Button } from "reactstrap";
import { CSSTransition, TransitionGroup } from "react-transition-group";
// to get state from redux into react component
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { getTours, deleteTour } from "../actions/tourActions.js";
class ToursList extends Component {
  //action from redux stored as a prop
  static propTypes = {
    getTours: PropTypes.func.isRequired,
    tour: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool,
  };

  // react lifecycle method that run when the component mounts (when making API request)
  componentDidMount() {
    this.props.getTours();
  }

  onDeleteClick = (id) => {
    this.props.deleteTour(id);
  };

  render() {
    const { tours } = this.props.tour;
    return (
      <Container className="mb-5">
        <ListGroup>
          <TransitionGroup className="tours-list">
            {" "}
            {this.props.isAuthenticated ? (
              <h4 style={{ textAlign: "center" }} className="mb-5">
                All ready tours
              </h4>
            ) : (
              <h4 style={{ textAlign: "center" }} className="mb-5">
                All ready tours
              </h4>
            )}
            {tours.map(({ _id, nameTour }) => (
              <CSSTransition key={_id} timeout={500} classNames="fade">
                <ListGroupItem>
                  {this.props.isAuthenticated ? (
                    <Button
                      className="remove-btn"
                      color="danger"
                      size="sm"
                      onClick={this.onDeleteClick.bind(this, _id)}
                    >
                      &times;
                    </Button>
                  ) : null}
                  {nameTour}
                </ListGroupItem>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </ListGroup>
      </Container>
    );
  }
}

// tour because we had it in root reducer (reducers/index.js)
const mapStateToProps = (state) => ({
  tour: state.tour,
  isAuthenticated: state.auth.isAuthenticated,
});

// mapsStateToProps - take tours state and map it to component property
export default connect(mapStateToProps, { getTours, deleteTour })(ToursList);
