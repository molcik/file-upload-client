import React, { Component } from "react";
import { storeFactory } from "./../../services";
import { Provider } from "react-redux";
import Upload from "../Upload/Upload";
import styles from "./App.module.css";
import { MuiThemeProvider } from "@material-ui/core";
import theme from "./theme";

const store = storeFactory({});

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <div className={styles.app}>
            <Upload />
          </div>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
