/*
References:
    1) https://formik.org/docs/examples/with-material-ui
    2) https://codesandbox.io/s/formik-material-ui-date-picker-with-yup-validate-3odn7?file=/src/index.js:239-389
    3) https://stackoverflow.com/questions/61822733/module-not-found-cant-resolve-date-io-date-fns -> to fix date picker library installation issues
 */
import FormControl from '@mui/material/FormControl';
import React, {useState} from 'react';
import {useFormik} from 'formik';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {Checkbox, Grid, InputLabel, Paper, Select} from "@mui/material";
import CreditScoreIcon from '@mui/icons-material/CreditScore';

import {makeStyles} from "@mui/styles";
import MenuItem from "@mui/material/MenuItem";

import {validationSchema} from "./validationSchema"

const ws = new WebSocket("ws://127.0.0.1:8081");

const apiCall = {
    event: "bts:subscribe",
    data: {channel: "order_book_btcusd"},
};

ws.onopen = (event) => {
    console.debug('websocket "onopen"')
};


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
    // choices: doing, done
    const [orderStatus, setOrderStatus] = useState("doing")
    const [serverResponse, setServerResponse] = useState({
        event: "",
        success: false,
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
        onSubmit: (values) => {
            alert(JSON.stringify(values, null, 2));
            ws.send(JSON.stringify(apiCall));
            const messageToServer = {
                event: "payment_info",
                data: values,
            };
            ws.send(JSON.stringify(messageToServer));
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

    ws.onmessage = function (event) {
        const json = JSON.parse(event.data);
        try {
            if ((json.event = "payment_info")) {
                setOrderStatus("done")
                setServerResponse({...serverResponse, ...json})
                console.debug(json.data)
            }
        } catch (err) {
            setOrderStatus("done")
            console.error(err);
            setServerResponse({
                ...serverResponse,
                success: false
            })
        }
    };

    return (
        <>
            <Grid container
                  component="main"
                  className={classes.root}
                  alignItems="center"
                  justifyContent={"center"}
                  justify="center">

                <Grid item xs={12} sm={12} md={4} component={Paper} elevation={6}
                      className={classes.whiteTransparentBG}>
                    <Grid container
                          alignItems="center"
                          justifyContent={"center"}
                          justify="center">
                        <Grid item>
                            <CreditScoreIcon color={"primary"} style={{fontSize: "54px"}}/>

                        </Grid>
                    </Grid>

                    <div className={classes.paper}>
                        {orderStatus === "doing" ?
                            <form onSubmit={formik.handleSubmit}>
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
                                <Checkbox
                                    checked={formik.values.areCardDetailsSave}
                                    onChange={() => formik.setFieldValue("areCardDetailsSave",
                                        !formik.values.areCardDetailsSave)}
                                    inputProps={{'aria-label': 'controlled'}}
                                />
                                <Button color="primary" variant="contained" fullWidth type="submit">
                                    Submit
                                </Button>
                            </form>
                            : orderStatus === "done" && serverResponse && serverResponse.success ?
                                <SuccessInfo serverResponse={serverResponse}/> :
                                <ErrorInfo serverResponse={serverResponse}/>
                        }
                    </div>
                </Grid>
            </Grid>
        </>
    )
};


export default CreditCardInputForm
