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
                    // paddingBottom: 35,
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
                    marginBottom: 35,
                },
                // containedPrimary: {
                //     backgroundColor: "#5d1899",
                // }
            },
        },
    }
    // overrides: {
    //     // Style sheet name ⚛️
    //     MuiPaper: {
    //         root: {
    //             borderRadius: 15,
    //         }
    //     },
    //     MuiGrid: {
    //         root: {
    //             borderRadius: 15,
    //         },
    //     },
    //     MuiFormControl: {
    //         root: {
    //             paddingBottom: 8,
    //         },
    //     },
    //     MuiButton: {
    //         label: {
    //             fontSize: '1.2rem',
    //         },
    //         root: {
    //             borderRadius: 8,
    //         },
    //         containedPrimary: {
    //             backgroundColor: "#5d1899",
    //         }
    //     },
    //     MuiAlert: {
    //         root: {
    //             borderRadius: 8,
    //         },
    //         message: {
    //             fontSize: '0.9rem',
    //         },
    //     },
    //     MuiDataGrid: {
    //         root: {
    //             textAlign: "center!important",
    //         },
    //         cell: {
    //             textAlign: "center!important",
    //         },
    //         columnHeaderTitle: {
    //             textAlign: "center!important",
    //         },
    //     },
    //     MuiInput: {
    //         root: {
    //             marginBottom: "12px!important"
    //         }
    //     }
    // },
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