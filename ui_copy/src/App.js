import './App.css';
// import CreditCardInputForm from "./components/CreditCardInputForm";
import 'react-credit-cards/es/styles-compiled.css';
import WithMaterialUI from "./components/TmpComponent";
import {lightTheme,} from "./theme";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {useState} from "react";


function App() {
    const [isThemeLight, setIsThemeLight] = useState(true);
    return (
        // <ThemeProvider theme={isThemeLight ? lightTheme : darkTheme}>
        <ThemeProvider theme={lightTheme}>
            <CssBaseline/>
            <WithMaterialUI/>
        </ThemeProvider>

    );
}

export default App;
