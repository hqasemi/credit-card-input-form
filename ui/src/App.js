import './App.css';
import 'react-credit-cards/es/styles-compiled.css';
import {lightTheme,} from "./theme";
import {Box, CssBaseline, ThemeProvider} from "@mui/material";
import CreditCardInputForm from "./components/CreditCardInputForm";
import Container from '@mui/material/Container';
import {AnimatedBackground} from "./components/AnimatedBackground/AnimatedBackground";

function App() {
    // const [isThemeLight, setIsThemeLight] = useState(true);
    return (
        // TODO: Support dark theme.
        // <ThemeProvider theme={isThemeLight ? lightTheme : darkTheme}>
        <ThemeProvider theme={lightTheme}>
            <AnimatedBackground/>
            <Container style={{paddingTop: "40px", paddingBottom: "40px"}}>
                {/*<Box >*/}
                <CssBaseline/>
                <CreditCardInputForm/>

                {/*</Box>*/}
            </Container>
        </ThemeProvider>
    )
}

export default App;
