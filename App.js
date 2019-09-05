import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="App">
        <form method="POST" action="http://localhost:8001/entry">
          <input type="text" name="aadharno"></input>
          <input type="submit"></input>
        </form>
      </div>
    );
  }
}

export default App;
