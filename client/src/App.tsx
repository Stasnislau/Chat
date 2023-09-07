import { ThemeProvider, createTheme } from "@mui/material";
import HomePage from "./pages/homePage";
import Store from "./store";
import { createContext } from "react";
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
});

const store = new Store();
export const Context = createContext(store);

function App() {
  return (
    <div className="App">
      <Context.Provider value={store}>
        <ThemeProvider theme={theme}>
          <HomePage />
        </ThemeProvider>
      </Context.Provider>
    </div>
  );
}

export default App;
