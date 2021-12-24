/*
References:
    1) https://formik.org/docs/examples/with-material-ui
    2) https://codesandbox.io/s/formik-material-ui-date-picker-with-yup-validate-3odn7?file=/src/index.js:239-389
    3) https://stackoverflow.com/questions/61822733/module-not-found-cant-resolve-date-io-date-fns -> to fix date picker library installation issues
 */
// import { alpha } from '@material-ui/core/styles'
// --- Material Ui Picker Imports --- //
import React from 'react';
import {useFormik} from 'formik';
import * as yup from 'yup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {Checkbox, Grid, Paper} from "@mui/material";
import CreditScoreIcon from '@mui/icons-material/CreditScore';

import {makeStyles} from "@mui/styles";

/**
 *  Gets yy/MM format and convert it to a Date object
 *  @param  {String} value   value is invalid because yup tries to convert user input to a Date object,
 *  but it cannot (e.g. 22/03 is not a meaningful date).
 *  @param  {String} originalValue  originalValue is the actual value that user enters in text box.
 *  @return {Date}  Properly converted originalValue to Date object.
 **/
function parseDateString(value, originalValue) {
    const parts = originalValue.split("/")
    const mm = parts[0]
    const yy = parts[1]
    console.log(`mm: ${mm}, yy: ${yy}`)
    //e.g: 22/12 -> 12 01 2022 -> Thu Dec 01 2022 00:00:00
    return new Date(`${mm} 01 20${yy}`)
}

const validationSchema = yup.object({
        name: yup
            .string("Enter the name")
            .required("Name is required"),
        expirationDate: yup
            .date()
            .required('Expiration date is required')
            // TODO: The following validation does not work yet, check it later
            .test('check expiration date', 'Date format needs to be MM/YY',
                (value, info) => {
                    const originalValue = info.originalValue
                    const isValid = /^\d\d\/\d\d$/.test(originalValue)
                    return isValid
                })
            // .min(new Date('01-01-2019')),
            .min(new Date((new Date()).setDate((new Date()).getDate() + 30)),
                "The expiration date should be 1 month later or more.")
            .transform(parseDateString),
        number: yup
            .number('Enter your Card Number')
            .required('Card Number is required')
            //reference: https://stackoverflow.com/questions/49886881/validation-using-yup-to-check-string-or-number-length
            .test('len', 'Card Number needs to be exactly 16 digits', val => val.toString().length === 16),
        securityCode: yup
            .number('Enter your Security Code')
            .required('Security Code is required')
            .test('len', 'Security Code needs to be exactly 3 digits', val => val.toString().length === 3),
        amountToBePaid: yup
            .number('Enter the amount that you want to be paid')
            .required('Amount is required')
            .min(0.01, 'Amount needs to be more than 0.01')
            .max(999.99, 'Amount needs to be less than 1000.00')
            .test('len fds', 'Amount needs to be a digit with at most two decimal places',
                val => {
                    if (!val) {
                        return false
                    }
                    let parts = val.toString().split(".")

                    // e.g.: 789.
                    // TODO: it doesn't work, ask whether it is important to handle this case or not?
                    if (val.toString().includes(".") && parts.length === 1) {
                        console.log("false")
                        return false
                    }

                    // e.g.: empty input
                    if (parts.length === 0) {
                        return false
                    }

                    // e.g.: 12
                    if (parts.length === 1 && Math.floor(val) === val) {
                        return true
                    }

                    let decimalPart = parts[1]
                    // e.g. 12.09
                    if (decimalPart) {
                        return decimalPart.length <= 2;
                    }
                    return false
                }
            ),
    }
)

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: 'url(https://source.unsplash.com/random)',
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        alignItems: 'center',
        padding: theme.spacing(2),
        margin: 'auto 20px',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
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

const WithMaterialUI = () => {
    const formik = useFormik({
        initialValues: {
            expirationDate: '',
            name: '',
            number: 0,
            amountToBePaid: '',
            areCardDetailsSave: false,
            securityCode: 0,
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            alert(JSON.stringify(values, null, 2));
        },
    });

    // const theme = createTheme();
    const classes = useStyles();
    const focusChange = (e) => {
        console.log(e)
        e.target.nextElementSibling.focus();
        if (e.target.value.length >= e.target.getAttribute("maxlength")) {
            e.target.nextElementSibling.focus();
        }
    }
    return (
        <>
            <Grid container
                  component="main"
                  className={classes.root}
                  alignItems="center"
                  justifyContent={"center"}
                  justify="center">
                {/*<AnimatedBackground/>*/}

                {/* <Grid item xs={false} sm={4} md={7} className={classes.image} /> */}
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
                        {/*<Grid container alignItems="center" justify="center" justifyContent="center">*/}
                        {/*    <Grid item xs={12}>*/}
                        {/*        <Avatar className={`${classes.avatar} ${classes.center}`}>*/}
                        {/*            <LockOutlinedIcon/>*/}
                        {/*        </Avatar>*/}
                        {/*    </Grid>*/}
                        {/*    <Grid item xs={12}>*/}
                        {/*        <Typography component="h1" variant="h5" style={{textAlign: "center"}}>*/}
                        {/*            Sign up*/}
                        {/*        </Typography>*/}

                        {/*    </Grid>*/}

                        {/*</Grid>*/}
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
                                value={formik.values.number}
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
                            <TextField
                                fullWidth
                                id="securityCode"
                                name="securityCode"
                                label="Security Code"
                                value={formik.values.securityCode}
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
                            {/*<ToggleButton*/}
                            {/*    id="areCardDetailsSave"*/}
                            {/*    name="areCardDetailsSave"*/}
                            {/*    label="Save Details"*/}
                            {/*    type="checkbox"*/}
                            {/*    value={"Save Details"}*/}
                            {/*    selected={formik.values.areCardDetailsSave}*/}
                            {/*    onChange={*/}
                            {/*        () => formik.setFieldValue("areCardDetailsSave",*/}
                            {/*            !formik.values.areCardDetailsSave)}*/}
                            {/*>*/}
                            {/*    <CheckIcon/>*/}
                            {/*</ToggleButton>*/}

                            <Button color="primary" variant="contained" fullWidth type="submit">
                                Submit
                            </Button>
                        </form>
                    </div>
                </Grid>
            </Grid>
        </>
        // <ThemeProvider theme={theme}>
        //     <Container component="main" maxWidth="xs">
        //         <CssBaseline/>
        //         <Box
        //             sx={{
        //                 marginTop: 8,
        //                 display: 'flex',
        //                 flexDirection: 'column',
        //                 alignItems: 'center',
        //             }}>
        //             <form onSubmit={formik.handleSubmit}>
        //                 <TextField
        //                     fullWidth
        //                     id="name"
        //                     name="name"
        //                     label="Name"
        //                     value={formik.values.name}
        //                     onChange={formik.handleChange}
        //                     error={formik.touched.name && Boolean(formik.errors.name)}
        //                     helperText={formik.touched.name && formik.errors.name}
        //                 />
        //                 <TextField
        //                     fullWidth
        //                     id="number"
        //                     name="number"
        //                     label="Number"
        //                     value={formik.values.number}
        //                     onChange={formik.handleChange}
        //                     error={formik.touched.number && Boolean(formik.errors.number)}
        //                     helperText={formik.touched.number && formik.errors.number}
        //                 />
        //                 <TextField
        //                     fullWidth
        //                     id="expirationDate"
        //                     name="expirationDate"
        //                     label="Expiration Date (MM/YY)"
        //                     value={formik.values.expirationDate}
        //                     onChange={formik.handleChange}
        //                     error={formik.touched.expirationDate && Boolean(formik.errors.expirationDate)}
        //                     helperText={formik.touched.expirationDate && formik.errors.expirationDate}
        //                     // TODO: fix maxLength
        //                     inputProps={{maxLength: 6,}}
        //                 />
        //                 {/*<LocalizationProvider dateAdapter={AdapterDateFns}>*/}
        //                 {/*    <DesktopDatePicker*/}
        //                 {/*        label="Date desktop"*/}
        //                 {/*        inputFormat="MM/yyyy"*/}
        //                 {/*        value={formik.values.expirationDate}*/}
        //                 {/*        // onChange={formik.handleChange}*/}
        //                 {/*        onChange={value => formik.setFieldValue("expirationDate", value)}*/}
        //                 {/*        onError={error => {*/}
        //                 {/*            // formik.setFieldError('expirationDate', error);*/}
        //                 {/*            console.log(error)*/}
        //                 {/*        }}*/}
        //                 {/*        renderInput={(params) => <TextField {...params} />}*/}
        //                 {/*    />expirationDate*/}
        //                 {/*</LocalizationProvider>*/}
        //                 {/*<MuiPickersUtilsProvider utils={DateFnsUtils}>*/}
        //                 {/*    <KeyboardDatePicker*/}
        //                 {/*        id="date-picker-dialog"*/}
        //                 {/*        label="Date picker dialog"*/}
        //                 {/*        inputVariant="outlined"*/}
        //                 {/*        format="MM/dd/yyyy"*/}
        //                 {/*        value={formik.values.expirationDate}*/}
        //                 {/*        onChange={value => formik.setFieldValue("expirationDate", value)}*/}
        //                 {/*        KeyboardButtonProps={{*/}
        //                 {/*            "aria-label": "change date"*/}
        //                 {/*        }}*/}
        //                 {/*    />*/}
        //                 {/*</MuiPickersUtilsProvider>*/}
        //
        //                 <TextField
        //                     fullWidth
        //                     id="amountToBePaid"
        //                     name="amountToBePaid"
        //                     label="Amount to be paid"
        //                     value={formik.values.amountToBePaid}
        //                     onChange={formik.handleChange}
        //                     error={formik.touched.amountToBePaid && Boolean(formik.errors.amountToBePaid)}
        //                     helperText={formik.touched.amountToBePaid && formik.errors.amountToBePaid}
        //                 />
        //                 {/*<Switch*/}
        //                 {/*    checked={formik.values.areCardDetailsSave}*/}
        //                 {/*    onChange={() => formik.setFieldValue("areCardDetailsSave", !formik.values.areCardDetailsSave)}*/}
        //                 {/*/>*/}
        //                 <Button color="primary" variant="contained" fullWidth type="submit">
        //                     Submit
        //                 </Button>
        //             </form>
        //
        //         </Box>
        //     </Container>
        // </ThemeProvider>
    )
};

export default WithMaterialUI

