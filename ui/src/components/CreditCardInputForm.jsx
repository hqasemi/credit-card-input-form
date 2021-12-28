/*
References:
    1) https://formik.org/docs/examples/with-material-ui
    2) https://codesandbox.io/s/formik-material-ui-date-picker-with-yup-validate-3odn7?file=/src/index.js:239-389
    3) https://stackoverflow.com/questions/61822733/module-not-found-cant-resolve-date-io-date-fns -> to fix date picker library installation issues
 */
import React, {useEffect, useRef, useState} from 'react';
import {Form, Formik} from 'formik';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {FormControlLabel, Grid, Paper} from "@mui/material";
import CreditScoreIcon from '@mui/icons-material/CreditScore';

import {makeStyles} from "@mui/styles";

import {validationSchema} from "./validationSchema"
import {startWebsocket} from "../websocket"
import RePaymentIcon from '@mui/icons-material/Autorenew';
import DateInput from './DateInput'
import SecurityCodeInput from './SecurityCodeInput'
import CardNumberInput from './CardNumberInput'
import CurrencyButtonGroup from './CurrencyButtonGroup'
import SaveInfoSwitch from "./SaveInfoSwitch";
import SuccessInfo from "./SuccessInfo";
import ErrorInfo from "./ErrorInfo";

// Websocket events
const POST_PAYMENT_INFO = 'POST_PAYMENT_INFO';
const POST_PAYMENT_INFO_FAILURE = 'POST_PAYMENT_INFO_FAILURE';
const POST_PAYMENT_INFO_SUCCESS = 'POST_PAYMENT_INFO_SUCCESS';

// Websocket configs
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
        [theme.breakpoints.up('md')]: {
            padding: "20px 20px 35px",
        }, [theme.breakpoints.down('sm')]: {
            padding: "0px 0px 35px",
        },
    },
    stickRight: {
        marginRight: "0px!important",
        marginLeft: "auto!important",
    },
}));

const CreditCardInputForm = () => {
    // socket
    let ws = useRef(undefined);

    // choices: doing, finished, failed
    // const [orderStatus, setOrderStatus] = useState("doing")
    const [serverResponse, setServerResponse] = useState({
        event: "",
        data: {},
    })


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
        <Grid container
              component="main"
              className={classes.root}
              alignItems="center"
              justifyContent={"center"}
              justify="center">
            <Grid item
                  xs={12}
                  sm={12} md={6}
                  component={Paper}
                  elevation={6}
                  className={classes.whiteTransparentBG}>
                <div className={classes.paper}>
                    <Grid container
                          alignItems="center"
                          justifyContent={"center"}
                          justify="center">
                        <Grid item>
                            <CreditScoreIcon color={"primary"} style={{fontSize: "54px"}}/>
                        </Grid>
                        <Grid item className={serverResponse && serverResponse.event && classes.stickRight}>
                            {serverResponse && serverResponse.event &&
                                < RePaymentIcon onClick={onRepaymentClickHandler} color={"primary"}/>}
                        </Grid>
                    </Grid>
                    {!serverResponse.event &&

                        <Formik
                            initialValues={{
                                expirationDate: '',
                                cardHolderName: '',
                                cardNumber: '',
                                amountToBePaid: '',
                                currency: 'OMR',
                                areCardDetailsSave: false,
                                securityCode: '',
                            }}
                            validationSchema={validationSchema}
                            onSubmit={(values, {setSubmitting, resetForm}) => {
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
                            }}>
                            {({
                                  values,
                                  errors,
                                  touched,
                                  handleChange,
                                  handleBlur,
                                  handleSubmit,
                                  isSubmitting,
                                  setFieldValue
                              }) => (
                                <Form onSubmit={handleSubmit}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        id="cardHolderName"
                                        name="cardHolderName"
                                        label="Card holder name"
                                        value={values.cardHolderName}
                                        onChange={handleChange}
                                        error={touched.cardHolderName && Boolean(errors.cardHolderName)}
                                        helperText={touched.cardHolderName && errors.cardHolderName}
                                        onInput={focusChange}
                                    />
                                    <CardNumberInput/>
                                    <Grid container spacing={0} direction="row" alignItems="center"
                                          justifyContent="center">
                                        <Grid item xs={12} md={12}>
                                            <DateInput/>
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <SecurityCodeInput/>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={0} direction="column" alignItems="center"
                                          justifyContent="center">
                                        <Grid item xs={3}>
                                            <CurrencyButtonGroup
                                                onClickCallback={(e) => setFieldValue("currency", e.target.value)}/>
                                        </Grid>
                                    </Grid>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        id="amountToBePaid"
                                        name="amountToBePaid"
                                        label={`Amount to be paid (${values.currency})`}
                                        value={values.amountToBePaid}
                                        onChange={handleChange}
                                        error={touched.amountToBePaid && Boolean(errors.amountToBePaid)}
                                        helperText={touched.amountToBePaid && errors.amountToBePaid}
                                        inputProps={{
                                            maxLength: 6,
                                        }}
                                    />
                                    <Grid
                                        container
                                        spacing={0}
                                        direction="column"
                                        alignItems="left"
                                        justifyContent="center"
                                    >
                                        <Grid item xs={3}>
                                            <FormControlLabel
                                                // reference : https://stackoverflow.com/questions/48910869/material-ui-checkbox-label-is-missing
                                                control={
                                                    <SaveInfoSwitch
                                                        checked={values.areCardDetailsSave}
                                                        onChange={() => setFieldValue("areCardDetailsSave",
                                                            !values.areCardDetailsSave)}
                                                    />
                                                }
                                                label="Save card details"/>
                                        </Grid>
                                    </Grid>

                                    <Button size="small" color="primary" variant="contained" fullWidth type="submit">
                                        Submit
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    }
                    {serverResponse && serverResponse.event === POST_PAYMENT_INFO_SUCCESS &&
                        <SuccessInfo serverResponse={serverResponse} setServerResponse={setServerResponse}/>}
                    {serverResponse && serverResponse.event === POST_PAYMENT_INFO_FAILURE &&
                        <ErrorInfo serverResponse={serverResponse} setServerResponse={setServerResponse}/>}
                </div>
            </Grid>
        </Grid>
    )
};

export default CreditCardInputForm
