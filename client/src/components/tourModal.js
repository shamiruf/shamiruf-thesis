import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { connect } from "react-redux";
import { addTour } from "../actions/tourActions";
import PropTypes from "prop-types";

class TourModal extends Component {
  state = { modal: false, name: "" };
  toggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // TODO
  // START DIALOG WITH WATSON
  onSubmit = (e) => {
    e.preventDefault();
    const newTour = {
      name: this.state.nameTour,
    };
    //Add itemtour via addTour action
    this.props.addTour(newTour);

    // Close modal
    this.toggle();
  };
  render() {
    return (
      <div>
        {this.props.isAuthenticated ? (
          <Button color="dark" style={{ margin: "2rem" }} onClick={this.toggle}>
            Add tour
          </Button>
        ) : null}
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Add to Tours List</ModalHeader>
          <ModalBody>
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <Label for="tour">Tour</Label>
                <Input
                  type="text"
                  name="name"
                  id="tour"
                  placeholder="Add tour ..."
                  onChange={this.onChange}
                ></Input>
                <Button color="dark" style={{ marginTop: "2rem" }} block>
                  {" "}
                  Add Tour
                </Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  tour: state.tour,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { addTour })(TourModal);
