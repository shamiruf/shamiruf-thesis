import { Button } from "reactstrap";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { MdClose } from "react-icons/md";

export class ReturnBtn extends Component {
  render() {
    return (
      <div style={{ textAlign: "right" }} className="mt-1 mb-3 ">
        <Link to="/">
          <MdClose color="#1b2f56" size="30px" />
        </Link>
      </div>
    );
  }
}

export default ReturnBtn;
