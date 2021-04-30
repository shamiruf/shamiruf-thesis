import React, { Component } from "react";

import ChatWindow from "./ChatWindow";
import ReturnBtn from "./ReturnBtn";
import BotMsg from "./BotMsg";
import UserMsg from "./UserMsg";
import { sendMessage } from "../../apiRequests";

import "./style.css";

class ChatContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      conversation: [],
      firstMessage: false,
    };
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  };

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  handleMessageChange = (e) => {
    this.setState({ message: e.target.value });
  };

  keyPress = async (e) => {
    if (e.keyCode === 13) {
      this.setState({
        conversation: [
          ...this.state.conversation,
          { isUser: true, message: this.state.message },
        ],
      });

      const watsonMessage = await sendMessage(this.state.message);
      // CHANGE clear input after send message
      this.setState({
        message: "",
      });

      this.setState({
        conversation: [...this.state.conversation, watsonMessage],
      });
    }
  };

  cancelCourse = () => {
    this.setState({
      message: "",
    });
  };

  getFirstMessageFromWatson = async () => {
    const watsonMessage = await sendMessage("");
    this.setState({
      conversation: [...this.state.conversation, watsonMessage],
      firstMessage: true,
    });
  };

  render() {
    return (
      <div
        style={{
          height: "100vh",
        }}
        className="chat-container"
      >
        <ReturnBtn />
        <div>
          <div style={{ height: "80vh" }} className="scrollingChat">
            {this.state.conversation.map((item, index) => {
              return (
                <div key={index}>
                  {item.isUser ? (
                    <UserMsg className="mb-1" message={item.message} />
                  ) : (
                    <BotMsg message={item.message} />
                  )}
                </div>
              );
            })}
            <div
              ref={(el) => {
                this.messagesEnd = el;
              }}
            ></div>
          </div>
          <p className="user-typing"></p>
          {/* Chat Input */}
          <div>
            <label htmlFor="textInput" className="inputOutline">
              <input
                id="textInput"
                className="input responsive-column textInput"
                placeholder="Type something"
                type="text"
                value={this.state.message}
                onChange={this.handleMessageChange}
                onKeyDown={this.keyPress}
              />
            </label>
          </div>
        </div>

        {/* <ChatWindow /> */}
      </div>
    );
  }
}

export default ChatContainer;
