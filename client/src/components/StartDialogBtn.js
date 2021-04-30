import React, { Component } from "react";
import { Button } from "reactstrap";

export class StartDialogBtn extends Component {
  render() {
    return (
      <div>
        <Button
          href="/dialog"
          style={{ backgroundColor: "#1b2f56", marginTop: "2rem" }}
        >
          Start dialog
        </Button>
      </div>
    );
  }
}

export default StartDialogBtn;
