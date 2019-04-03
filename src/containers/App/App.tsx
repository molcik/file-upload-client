import { MuiThemeProvider } from "@material-ui/core";
import React, { Component } from "react";
import { Provider } from "react-redux";
import Upload from "../Upload/Upload";
import { storeFactory } from "./../../services";
import styles from "./App.module.css";
import theme from "./theme";

const store = storeFactory();

class App extends Component {
  public render() {
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
