import React, { Component } from "react";
import parse from "html-react-parser";

import { Link } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { sendMessage, getSessionId, deleteSessionId } from "../../apiRequests";
import { SiProbot } from "react-icons/si";
import AppNavbar from "../AppNavbar";
import "./style.css";

class ChatContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      conversation: [],
    };
  }

  getMessageFromWatson = async (message) => {
    const watsonMessage = await sendMessage(message);
    this.setState({
      conversation: [...this.state.conversation, watsonMessage],
    });
  };

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  };

  componentDidMount() {
    getSessionId().then(() => {
      this.getMessageFromWatson(this.props.message);
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

    this.getMessageFromWatson(message);

    this.setState({
      message: "",
    });
  };

  render() {
    return (
      <div>
        <AppNavbar />
        <div className="chat-container">
          <div style={{ textAlign: "right" }} onClick={() => deleteSessionId()}>
            <Link to="/">
              <MdClose color="#1b2f56" size="30px" />
            </Link>
          </div>
          <div>
            <div className="scrolling-chat">
              {this.state.conversation.map((item, index) => {
                return (
                  <div key={index}>
                    {item.isUser ? (
                      <div key={index} className="from-user">
                        <div className="from-user-text">
                          <div className="from-user-p">{item.message}</div>
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
                                  <img
                                    src={src}
                                    width="300px"
                                    alt="Waypoint"
                                  ></img>
                                </div>
                              );
                            } else if (botMsg.type === "option") {
                              const {
                                description,
                                list,
                                title,
                              } = botMsg.option;
                              return (
                                <div key={index}>
                                  <div>
                                    <div className="mb-2">{title}</div>
                                    <div>{description}</div>
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
                                                <div
                                                  style={{
                                                    marginBottom: "7px",
                                                  }}
                                                >
                                                  {option.label}
                                                </div>
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
              <label htmlFor="textInput" className="input-outline">
                <input
                  id="textInput"
                  className="input responsive-column text-input"
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
      </div>
    );
  }
}

export default ChatContainer;
