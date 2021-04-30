import React, { Component } from "react";
import "./style.css";

export class UserMsg extends Component {
  render() {
    return (
      <div className="from-user mb-3">
        <div className="from-user-text">
          <p className="from-user-p">{this.props.message}</p>
        </div>
      </div>
    );
  }
}

export default UserMsg;
