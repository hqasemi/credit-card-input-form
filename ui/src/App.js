import './App.css';
import 'react-credit-cards/es/styles-compiled.css';
import {lightTheme,} from "./theme";
import {CssBaseline, ThemeProvider} from "@mui/material";
import CreditCardInputForm from "./components/CreditCardInputForm";


function App() {
    // const [isThemeLight, setIsThemeLight] = useState(true);
    return (
        // TODO: Support dark theme.
        // <ThemeProvider theme={isThemeLight ? lightTheme : darkTheme}>
        <ThemeProvider theme={lightTheme}>
            <CssBaseline/>
            <CreditCardInputForm/>
        </ThemeProvider>
    );
}

export default App;
