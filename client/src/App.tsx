import { Breakpoint, Breakpoints, ThemeProvider, createTheme, styled } from "@mui/material";
import HomePage from "./pages/homePage";
import Store from "./store";
import { createContext, useEffect, useState } from "react";
import WrapperComponent from "./components/wrapperComponent";
declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: false; 
    sm: false;
    md: false;
    lg: false;
    xl: false;
    mobile: true; 
    tablet: true;
    laptop: true;
    desktop: true;
  }
}
const theme = createTheme({
  palette: {
    primary: {
      main: "#f5f5f5",
    },
    secondary: {
      main: "#a372ca",
    },
    text: {
      primary: "#969696",
    },
  },

  breakpoints: {
    values: {
      mobile: 0,
      tablet: 640,
      laptop: 1024,
      desktop: 1280,
    },
  }
});

const store = new Store();
export const Context = createContext(store);

function App() {

  return (
    <div className="App">
      <Context.Provider value={store}>
        <ThemeProvider theme={theme}>
          <WrapperComponent>
            <HomePage />
          </WrapperComponent>
        </ThemeProvider>
      </Context.Provider>
    </div>
  );
}

export default App;
