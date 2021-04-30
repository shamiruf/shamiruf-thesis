import React, { Component } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { SiProbot } from "react-icons/si";

import OptionTypeMessage from "./OptionTypeMessage";

export class BotMsg extends Component {
  render() {
    return (
      <div className="from-watson">
        {/* <HiOutlineDotsVertical color="#9855d4" size="1x" /> */}
        <SiProbot color="#9855d4" size="35px" />
        <div className="from-watson-p ">
          {this.props.message.map((item, index) => {
            return (
              <div key={index}>
                {item.type === "option" ? (
                  <OptionTypeMessage option={item.option} />
                ) : (
                  item.innerhtml
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default BotMsg;
