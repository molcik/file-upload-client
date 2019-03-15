import { createMuiTheme } from "@material-ui/core/styles";

export const koala42 = {
  50: "#e0fcf8",
  100: "#b3f8ec",
  200: "#80f3e0",
  300: "#4deed4",
  400: "#26eaca",
  500: "#00e6c1",
  600: "#00e3bb",
  700: "#00dfb3",
  800: "#00dbab",
  900: "#00d59e",
  A100: "#fcfffe",
  A200: "#c9ffef",
  A400: "#96ffe0",
  A700: "#7dffd9",
  contrastDefaultColor: "dark"
};

const theme = createMuiTheme({
  palette: {
    primary: {
      light: koala42[300],
      main: koala42[500],
      dark: koala42[700]
    }
  }
});

export default theme;
