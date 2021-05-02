import React, { Component } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { SiProbot } from "react-icons/si";

export class BotMsg extends Component {
  render() {
    return (
      <div className="from-watson">
        {/* <HiOutlineDotsVertical color="#9855d4" size="1x" /> */}
        <SiProbot color="#9855d4" size="35px" />
        <div className="from-watson-p ">
          {this.props.message.map((item, index) => {
            if (item.type === "image") {
              return (
                <div key={index}>
                  <img src={item.image.source}></img>
                </div>
              );
            } else if (item.type === "option") {
              const { description, list, title } = item.option;
              return (
                <div key={index}>
                  <div>
                    <p>{title}</p>
                    <p>{description}</p>
                    <ul>
                      {list.map((item, index) => {
                        return (
                          <div key={index}>
                            <li>
                              <div className="options-list">{item.label}</div>
                            </li>
                          </div>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              );
            } else if (item.type === "text") {
              return <div key={index}>{item.innerhtml}</div>;
            }
          })}
        </div>
      </div>
    );
  }
}

export default BotMsg;
