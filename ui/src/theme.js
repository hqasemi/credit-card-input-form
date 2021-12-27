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
        MuiFormControlLabel: {
            styleOverrides: {
                root: {
                    marginLeft: 0,
                },
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 15,
                }
            }
        },
        MuiButtonGroup: {
            styleOverrides: {
                root: {
                    border: "1px solid #5d1899",
                    borderRadius: 15,
                },
                // containedPrimary: {
                //     backgroundColor: "#5d1899",
                // }
            },
        },
        MuiButton: {
            styleOverrides: {
                label: {
                    fontSize: '1.2rem',
                },
                root: {
                    borderRadius: 15,
                    padding: "10px 15px",
                    fontWeight: 700,
                    transition: "background-color .2s ease-in-out",
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
        MuiGrid: {
            styleOverrides: {
                container: {
                    marginBottom: 20,
                },
            },
        },
        // MuiSvgIcon: {
        //     styleOverrides: {
        //         root: {
        //             color: "primary"
        //         },
        //     },
        // }
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