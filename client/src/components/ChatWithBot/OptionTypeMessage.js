import React, { Component } from "react";

export class OptionTypeMessage extends Component {
  render() {
    const { description, list, title } = this.props.option;
    return (
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
    );
  }
}

export default OptionTypeMessage;
