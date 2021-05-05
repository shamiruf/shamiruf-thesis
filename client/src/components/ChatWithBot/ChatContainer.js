import React, { Component } from "react";
import parse from "html-react-parser";

import ReturnBtn from "./ReturnBtn";
import { sendMessage, getSessionId } from "../../apiRequests";
import { SiProbot } from "react-icons/si";

import "./style.css";

class ChatContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      conversation: [],
    };
  }

  getFirstMessageFromWatson = async (message) => {
    const watsonMessage = await sendMessage(message);
    this.setState({
      conversation: [...this.state.conversation, watsonMessage],
    });
  };

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  };

  componentDidMount() {
    // this.scrollToBottom();
    getSessionId().then(() => {
      this.getFirstMessageFromWatson(this.props.message);
    });
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  handleMessageChange = (e) => {
    this.setState({ message: e.target.value });
  };

  keyPress = async (e) => {
    if (e.keyCode === 13) {
      this.sendMessageFunc(this.state.message);
    }
  };

  sendMessageFunc = async (message) => {
    this.setState({
      conversation: [
        ...this.state.conversation,
        { isUser: true, message: message },
      ],
    });

    const watsonMessage = await sendMessage(message);
    // CHANGE clear input after send message
    this.setState({
      message: "",
    });

    this.setState({
      conversation: [...this.state.conversation, watsonMessage],
    });
  };

  cancelCourse = () => {
    this.setState({
      message: "",
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
                    <div key={index} className="from-user mb-3">
                      <div className="from-user-text">
                        <p className="from-user-p">{item.message}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="from-watson">
                      <SiProbot color="#9855d4" size="35px" />
                      <div className="from-watson-p ">
                        {item.message.map((botMsg, index) => {
                          if (botMsg.type === "image") {
                            let src = botMsg.image.source;
                            return (
                              <div key={index}>
                                <img src={src} width="300px" alt="Tour"></img>
                              </div>
                            );
                          } else if (botMsg.type === "option") {
                            const { description, list, title } = botMsg.option;
                            return (
                              <div key={index}>
                                <div>
                                  <p>{title}</p>
                                  <p>{description}</p>
                                  <ul>
                                    {list.map((option, index) => {
                                      return (
                                        <div key={index}>
                                          <li>
                                            <div
                                              onClick={() => {
                                                this.sendMessageFunc(
                                                  option.valueToSendFromUser
                                                );
                                              }}
                                              className="options-list"
                                            >
                                              {option.label}
                                            </div>
                                          </li>
                                        </div>
                                      );
                                    })}
                                  </ul>
                                </div>
                              </div>
                            );
                          } else if (botMsg.type === "text") {
                            return (
                              <div key={index}>{parse(botMsg.innerhtml)}</div>
                            );
                          } else {
                            return <div>Sorry</div>;
                          }
                        })}
                      </div>
                    </div>
                    // <BotMsg message={item.message} />
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
      </div>
    );
  }
}

export default ChatContainer;
