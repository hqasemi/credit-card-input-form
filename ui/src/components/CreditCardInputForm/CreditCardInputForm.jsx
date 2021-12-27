/*
References:
    1) https://formik.org/docs/examples/with-material-ui
    2) https://codesandbox.io/s/formik-material-ui-date-picker-with-yup-validate-3odn7?file=/src/index.js:239-389
    3) https://stackoverflow.com/questions/61822733/module-not-found-cant-resolve-date-io-date-fns -> to fix date picker library installation issues
 */
import React, {useEffect, useRef, useState} from 'react';
import {useFormik} from 'formik';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {ButtonGroup, Checkbox, FormControlLabel, Grid, Paper} from "@mui/material";
import CreditScoreIcon from '@mui/icons-material/CreditScore';

import {makeStyles} from "@mui/styles";

import {validationSchema} from "./validationSchema"
import {startWebsocket} from "../../websocket"
import AutorenewIcon from '@mui/icons-material/Autorenew';

const POST_PAYMENT_INFO = 'POST_PAYMENT_INFO';
const POST_PAYMENT_INFO_FAILURE = 'POST_PAYMENT_INFO_FAILURE';
const POST_PAYMENT_INFO_SUCCESS = 'POST_PAYMENT_INFO_SUCCESS';

const WEBSOCKET_RECONNECT_INTERVAL_IN_MS = process.env.REACT_APP_WEBSOCKET_RECONNECT_INTERVAL_IN_MS


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
    },
    stickRight: {
        marginRight: "0px!important",
        marginLeft: "auto!important",
    },
}));

const SuccessInfo = ({serverResponse}) => {
    return (
        <div>
            <h2 style={{"textDecoration": "underline"}}>Your payment has been successfully done</h2>
            <p><strong>Amount:</strong> {serverResponse.data.amountToBePaid} {serverResponse.data.currency}</p>
            <p><strong>Card Number:</strong> {serverResponse.data.number}</p>
            <p><strong>Card Holder Name:</strong> {serverResponse.data.name}</p>
            <p><strong>Card Expiration Date:</strong> {serverResponse.data.expirationDate}</p>
        </div>
    )
}
const ErrorInfo = ({serverResponse}) => {
    return (
        <div>
            <h2 style={{"textDecoration": "underline", "color":"#c52e2e"}}>Error during payment</h2>
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

        // TODO: move onclose function to `src/websocket.js`
        ws.current.onclose = function () {
            // connection closed, discard old websocket and create a new one in 1s
            console.debug('websocket has been closed.')
            ws.current = null
            setTimeout(configureWebsocket, WEBSOCKET_RECONNECT_INTERVAL_IN_MS)
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


                    <div className={classes.paper}>
                        {/*                        <Grid*/}
                        {/*    container*/}
                        {/*    spacing={0}*/}
                        {/*    direction="column"*/}
                        {/*    alignItems="center"*/}
                        {/*    justifyContent="center"*/}
                        {/*    // style={{minHeight: '100vh'}}*/}
                        {/*>*/}
                        {/*    <Grid item xs={3} class={"ButtonGroupContainer"}>*/}
                        <Grid container
                              alignItems="center"
                              justifyContent={"center"}
                              justify="center">
                            <Grid item>
                                <CreditScoreIcon color={"primary"} style={{fontSize: "54px"}}/>
                            </Grid>
                            <Grid item className={serverResponse && serverResponse.event && classes.stickRight}>
                                {serverResponse && serverResponse.event &&
                                    < AutorenewIcon onClick={onRepaymentClickHandler} color={"primary"}/>}
                            </Grid>
                        </Grid>
                        {!serverResponse.event && <form onSubmit={formik.handleSubmit}>
                            <TextField
                                fullWidth
                                id="name"
                                name="name"
                                label="Card holder name"
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
                                label="Card number"
                                inputProps={{
                                    maxLength: 16,
                                }}
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
                                label="Expiration date (MM/YY)"
                                value={formik.values.expirationDate}
                                onChange={formik.handleChange}
                                error={formik.touched.expirationDate && Boolean(formik.errors.expirationDate)}
                                helperText={formik.touched.expirationDate && formik.errors.expirationDate}
                                // TODO: fix maxLength
                                inputProps={{maxLength: 5,}}
                            />
                            <TextField
                                fullWidth
                                inputProps={{
                                    maxLength: 3,
                                }}
                                type="password"
                                id="securityCode"
                                name="securityCode"
                                label="Security code"
                                value={formik.values.securityCode || ''}
                                onChange={formik.handleChange}
                                error={formik.touched.securityCode && Boolean(formik.errors.securityCode)}
                                helperText={formik.touched.securityCode && formik.errors.securityCode}
                            />
                            <Grid
                                container
                                spacing={0}
                                direction="column"
                                alignItems="center"
                                justifyContent="center"
                                // style={{minHeight: '100vh'}}
                            >
                                <Grid item xs={3} class={"ButtonGroupContainer"}>
                                    <ButtonGroup>
                                        <Button
                                            color="primary"
                                            variant={formik.values.currency === "OMR" ? "contained" : "standard"}
                                            className="Form_active__1W_zB"
                                            onClick={() => {
                                                formik.setFieldValue("currency", "OMR");
                                            }}
                                        >
                                            OMR
                                        </Button>
                                        <Button
                                            color="primary"
                                            variant={formik.values.currency !== "OMR" ? "contained" : "standard"}
                                            className=""
                                            onClick={() => {
                                                formik.setFieldValue("currency", "USD");
                                            }}
                                        >
                                            USD
                                        </Button>
                                    </ButtonGroup>
                                </Grid>

                            </Grid>

                            <TextField
                                fullWidth
                                id="amountToBePaid"
                                name="amountToBePaid"
                                label={`Amount to be paid (${formik.values.currency})`}
                                value={formik.values.amountToBePaid}
                                onChange={formik.handleChange}
                                error={formik.touched.amountToBePaid && Boolean(formik.errors.amountToBePaid)}
                                helperText={formik.touched.amountToBePaid && formik.errors.amountToBePaid}
                                inputProps={{
                                    maxLength: 6,
                                }}
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
