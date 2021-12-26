import {createTheme} from "@mui/material";
import {green} from "@mui/material/colors";

export const lightTheme = createTheme({
    palette: {
        primary: {500: "#5d1899"},
        secondary: green,
        background: {
            default: "#efeff4"
        },
    },
    components: {
        MuiFormControl: {
            styleOverrides: {
                root: {
                    marginBottom: 20,
                },
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 15,
                    padding: 12,
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                label: {
                    fontSize: '1.2rem',
                },
                root: {
                    borderRadius: 15,
                },
                // containedPrimary: {
                //     backgroundColor: "#5d1899",
                // }
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                label: {
                    fontSize: '1.2rem',
                },
                root: {
                    borderRadius: 15,
                },
                // containedPrimary: {
                //     backgroundColor: "#5d1899",
                // }
            },
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: {},
            },
        },
    }
});

export const darkTheme = createTheme({
    palette: {
        background: {
            default: "#222222"
        },
        text: {
            primary: "#ffffff"
        }
    },
})