import React, { Component } from "react";
import { storeFactory } from "./../../services";
import { Provider } from "react-redux";
import Upload from "../Upload/Upload";
import styles from "./App.module.css";

let store = storeFactory({});

class App extends Component {
  render() {
    return (
      <div className={styles.app}>
        <Provider store={store}>
          <Upload />
        </Provider>
      </div>
    );
  }
}

export default App;
