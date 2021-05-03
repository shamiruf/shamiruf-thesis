import React, { Component } from "react";
import ChatContainer from "../components/ChatWithBot/ChatContainer";

import "./style.css";

export class DialogPage extends Component {
  render() {
    return (
      <div className="responsive-columns-wrapper">
        <div className="chat-column-holder responsive-column">
          <ChatContainer message={this.props.location.state} />
        </div>
      </div>
    );
  }
}

export default DialogPage;
