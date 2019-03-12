import React, { Component } from "react";
import { storeFactory } from "./../../services";
import { Provider } from "react-redux";
import Upload from "../Upload/Upload";

let store = storeFactory({});

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Upload />
      </Provider>
    );
  }
}

export default App;
