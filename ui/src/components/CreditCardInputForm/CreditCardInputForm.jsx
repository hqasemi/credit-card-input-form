/*
References:
    1) https://formik.org/docs/examples/with-material-ui
    2) https://codesandbox.io/s/formik-material-ui-date-picker-with-yup-validate-3odn7?file=/src/index.js:239-389
    3) https://stackoverflow.com/questions/61822733/module-not-found-cant-resolve-date-io-date-fns -> to fix date picker library installation issues
 */
import FormControl from '@mui/material/FormControl';
import React, {useEffect, useRef, useState} from 'react';
import {useFormik} from 'formik';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {Checkbox, FormControlLabel, Grid, InputLabel, Paper, Select} from "@mui/material";
import CreditScoreIcon from '@mui/icons-material/CreditScore';

import {makeStyles} from "@mui/styles";
import MenuItem from "@mui/material/MenuItem";

import {validationSchema} from "./validationSchema"
import {startWebsocket} from "../../websocket"
import AutorenewIcon from '@mui/icons-material/Autorenew';

export const POST_PAYMENT_INFO = 'POST_PAYMENT_INFO';
export const POST_PAYMENT_INFO_FAILURE = 'POST_PAYMENT_INFO_FAILURE';
export const POST_PAYMENT_INFO_SUCCESS = 'POST_PAYMENT_INFO_SUCCESS';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    paper: {
        alignItems: 'center',
        padding: theme.spacing(2),
        margin: 'auto 20px',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    center: {
        margin: "auto",
    },
    whiteTransparentBG: {
        backgroundColor: "#ffffffcf",
    }
}));

const SuccessInfo = ({serverResponse}) => {
    return (
        <div>
            <h2>Your payment has been successfully done</h2>
            <p>Amount: {serverResponse.data.amountToBePaid} R.O.</p>
            <p>Card Number: {serverResponse.data.number}</p>
            <p>Card Holder Name: {serverResponse.data.name}</p>
            <p>Card Expiration Date: {serverResponse.data.expirationDate}</p>
        </div>
    )
}
const ErrorInfo = ({serverResponse}) => {
    return (
        <div>
            <h2>Error during payment</h2>
            <p>More info: {serverResponse.data.error ?? "Unknown Issue"}</p>
        </div>
    )
}

const CreditCardInputForm = () => {
    // socket
    let ws = useRef(undefined);

    // choices: doing, finished, failed
    // const [orderStatus, setOrderStatus] = useState("doing")
    const [serverResponse, setServerResponse] = useState({
        event: "",
        data: {},
    })

    const formik = useFormik({
        initialValues: {
            expirationDate: '',
            name: '',
            number: 0,
            amountToBePaid: '',
            currency: 'OMR',
            areCardDetailsSave: false,
            securityCode: 0,
        },
        validationSchema: validationSchema,
        onSubmit: (values, {setSubmitting, resetForm}) => {
            // alert(JSON.stringify(values, null, 2));

            const messageToServer = {
                event: POST_PAYMENT_INFO,
                data: values,
            };

            console.debug("here")
            if (ws.current.readyState === WebSocket.CLOSED) {
                configureWebsocket()
            }
            ws.current.send(JSON.stringify(messageToServer));

            // Make sure that for is clear when we click on rePaymentButton
            resetForm()
        },
    });

    const classes = useStyles();

    // TODO: Fix me
    const focusChange = (e) => {
        e.target.nextElementSibling.focus();
        if (e.target.value.length >= e.target.getAttribute("maxlength")) {
            e.target.nextElementSibling.focus();
        }
    }

    // reference : https://dev.to/robmarshall/how-to-use-componentwillunmount-with-functional-components-in-react-2a5g
    useEffect(() => {
        // Anything in here is fired on component mount.
        if (ws.current === undefined) {
            // preventing to start multiple websocket connections to server
            configureWebsocket()
        }
        return () => {
            // Anything in here is fired on component unmount.
            ws.current.close()
        }
    }, [])

    const configureWebsocket = () => {
        console.debug("Configuring a new websocket")
        ws.current = startWebsocket()

        ws.current.onclose = function () {
            // connection closed, discard old websocket and create a new one in 1s
            console.debug('websocket "onclose"')
            ws.current = null
            setTimeout(configureWebsocket, 1000)
        }

        ws.current.onopen = (event) => {
            console.debug('websocket "onopen"')
        };

        ws.current.addEventListener("message", function (event) {
            try {
                const json = JSON.parse(event.data);
                if ((json.event === POST_PAYMENT_INFO_SUCCESS)) {
                    // setOrderStatus("done")
                    setServerResponse({...serverResponse, ...json})
                    console.debug(json.data)
                } else if ((json.event === POST_PAYMENT_INFO_FAILURE)) {
                    // setOrderStatus("done")
                    setServerResponse({...serverResponse, ...json})
                    console.error(json.data)
                }
            } catch (err) {
                // setOrderStatus("finished")
                console.error(`error occurred during parsing server response: ${err}`);
            }
        });
    }

    const onRepaymentClickHandler = () => {
        setServerResponse({...serverResponse, event: ""})
    }

    return (
        <>
            <Grid container
                  component="main"
                  className={classes.root}
                  alignItems="center"
                  justifyContent={"center"}
                  justify="center">

                <Grid item
                      xs={11}
                      sm={11} md={6}
                      component={Paper}
                      elevation={6}
                      className={classes.whiteTransparentBG}>
                    <Grid container
                          alignItems="center"
                          justifyContent={"center"}
                          justify="center">
                        <Grid item>
                            <CreditScoreIcon color={"primary"} style={{fontSize: "54px"}}/>
                        </Grid>
                        <Grid item style={{marginRight:"0px", marginLeft:"auto"}}>
                            {serverResponse && serverResponse.event &&
                                < AutorenewIcon onClick={onRepaymentClickHandler}/>}
                        </Grid>
                    </Grid>

                    <div className={classes.paper}>
                        {!serverResponse.event && <form onSubmit={formik.handleSubmit}>
                            <TextField
                                fullWidth
                                id="name"
                                name="name"
                                label="Name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                                onInput={focusChange}
                            />
                            <TextField
                                fullWidth
                                id="number"
                                name="number"
                                label="Number"
                                value={formik.values.number || ''}
                                onChange={formik.handleChange}
                                error={formik.touched.number && Boolean(formik.errors.number)}
                                helperText={formik.touched.number && formik.errors.number}
                                onInput={focusChange}
                            />
                            <TextField
                                fullWidth
                                id="expirationDate"
                                name="expirationDate"
                                label="Expiration Date (MM/YY)"
                                value={formik.values.expirationDate}
                                onChange={formik.handleChange}
                                error={formik.touched.expirationDate && Boolean(formik.errors.expirationDate)}
                                helperText={formik.touched.expirationDate && formik.errors.expirationDate}
                                // TODO: fix maxLength
                                inputProps={{maxLength: 6,}}
                            />
                            <Grid container
                                  alignItems="center"
                                  justifyContent={"center"}
                                  justify="center">
                                <Grid item xs={8} sm={8} md={8} elevation={6}>
                                    <TextField
                                        fullWidth
                                        id="amountToBePaid"
                                        name="amountToBePaid"
                                        label="Amount to be paid"
                                        value={formik.values.amountToBePaid}
                                        onChange={formik.handleChange}
                                        error={formik.touched.amountToBePaid && Boolean(formik.errors.amountToBePaid)}
                                        helperText={formik.touched.amountToBePaid && formik.errors.amountToBePaid}
                                    />
                                </Grid>
                                <Grid item xs={4} sm={4} md={4} elevation={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="currency-label">Currency</InputLabel>
                                        <Select
                                            labelId="currency-label"
                                            id="currency"
                                            name="currency"
                                            value={formik.values.currency}
                                            label="Currency"
                                            onChange={formik.handleChange}
                                            error={formik.touched.currency && Boolean(formik.errors.currency)}
                                            // TODO: Fix me
                                            // helperText={formik.touched.currency && formik.errors.currency}
                                        >
                                            <MenuItem value={"OMR"}>OMR</MenuItem>
                                            <MenuItem value={"USD"}>USD</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>


                            <TextField
                                fullWidth
                                id="securityCode"
                                name="securityCode"
                                label="Security Code"
                                value={formik.values.securityCode || ''}
                                onChange={formik.handleChange}
                                error={formik.touched.securityCode && Boolean(formik.errors.securityCode)}
                                helperText={formik.touched.securityCode && formik.errors.securityCode}
                            />

                            <FormControlLabel
                                // reference : https://stackoverflow.com/questions/48910869/material-ui-checkbox-label-is-missing
                                control={
                                    <Checkbox
                                        checked={formik.values.areCardDetailsSave}
                                        onChange={() => formik.setFieldValue("areCardDetailsSave",
                                            !formik.values.areCardDetailsSave)}
                                        inputProps={{'aria-label': 'controlled'}}
                                    />
                                }
                                label="Save card"/>
                            <Button color="primary" variant="contained" fullWidth type="submit">
                                Submit
                            </Button>
                        </form>}
                        {serverResponse && serverResponse.event === POST_PAYMENT_INFO_SUCCESS &&
                            <SuccessInfo serverResponse={serverResponse} setServerResponse={setServerResponse}/>}
                        {serverResponse && serverResponse.event === POST_PAYMENT_INFO_FAILURE &&
                            <ErrorInfo serverResponse={serverResponse} setServerResponse={setServerResponse}/>}
                    </div>
                </Grid>
            </Grid>
        </>
    )
};


export default CreditCardInputForm
