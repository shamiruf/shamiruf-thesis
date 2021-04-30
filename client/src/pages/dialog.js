import React, { Component } from "react";
import ChatContainer from "../components/ChatWithBot/ChatContainer";
import { getSessionId, sendMessage } from "../apiRequests";

import "./style.css";

export class DialogPage extends Component {
  componentDidMount() {
    getSessionId();
  }

  render() {
    return (
      <div className="responsive-columns-wrapper">
        <div className="chat-column-holder responsive-column">
          <ChatContainer />
        </div>
      </div>
    );
  }
}

export default DialogPage;
