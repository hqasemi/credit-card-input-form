// import Cards from 'react-credit-cards';
import React, {useState} from "react";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import {useFormik} from 'formik';
import * as yup from 'yup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {Card, CardContent, Grid, Input} from "@mui/material";

const validationSchema = yup.object({
    name: yup
        .string('Enter your email')
        .email('Enter a valid email')
        .required('Email is required'),
    number: yup
        .string('Enter your password')
        .min(8, 'Password should be of minimum 8 characters length')
        .required('Password is required'),
    expiry: yup
        .string('Enter your password')
        .min(8, 'Password should be of minimum 8 characters length')
        .required('Password is required'),
    securityCode: yup
        .string('Enter your password')
        .min(8, 'Password should be of minimum 8 characters length')
        .required('Password is required'),
    amountToBePaid: yup
        .string('Enter your password')
        .min(8, 'Password should be of minimum 8 characters length')
        .required('Password is required'),
});

const WithMaterialUI = () => {
    const formik = useFormik({
        initialValues: {
            name: '',
            number: '',
            expiry: '',
            securityCode: '',
            amountToBePaid: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            alert(JSON.stringify(values, null, 2));
        },
    });

    return (
        <div>
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
                />
                <TextField
                    fullWidth
                    id="expiry"
                    name="expiry"
                    label="Expiry"
                    value={formik.values.expiry}
                    onChange={formik.handleChange}
                    error={formik.touched.expiry && Boolean(formik.errors.expiry)}
                    helperText={formik.touched.expiry && formik.errors.expiry}
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
                <TextField
                    fullWidth
                    id="amountToBePaid"
                    name="amountToBePaid"
                    label="Amount to be paid"
                    value={<formik className="values amountToBePaid"></formik>}
                    onChange={formik.handleChange}
                    error={formik.touched.amountToBePaid && Boolean(formik.errors.amountToBePaid)}
                    helperText={formik.touched.amountToBePaid && formik.errors.amountToBePaid}
                />
                <Button color="primary" variant="contained" fullWidth type="submit">
                    Submit
                </Button>
            </form>
        </div>
    );
};

// ReactDOM.render(<WithMaterialUI/>, document.getElementById('root'));


const CreditCardInputForm = () => {
    const [state, setState] = useState({
        cvc: '',
        expiry: '',
        focus: '',
        name: '',
        number: '',
        amountToBePaid: '',
    })

    // const handleInputFocus = (e) => {
    //     setState({focus: e.target.name});
    // }

    // const handleInputChange = (e) => {
    //     const {name, value} = e.target;
    //
    //     setState({[name]: value});
    // }

    const formik = useFormik({
        initialValues: {
            expiry: '1',
            focus: '1',
            name: '1',
            number: '1',
            amountToBePaid: '1',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            alert(JSON.stringify(values, null, 2));
        },
    });

    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{minHeight: '100vh'}}
        >
            <Grid item xs={3}>
                <Card sx={{minWidth: 275, maxWidth: 500}}>
                    <CardContent>
                        <div id="PaymentForm">
                            {/*<Cards*/}
                            {/*    cvc={state.cvc}*/}
                            {/*    expiry={state.expiry}*/}
                            {/*    focused={state.focus}*/}
                            {/*    name={state.name}*/}
                            {/*    number={state.number}*/}
                            {/*/>*/}
                            <form onSubmit={formik.handleSubmit}>

                                <Input
                                    type="text"
                                    name="name"
                                    placeholder="Card holder name"
                                    // onChange={handleInputChange}
                                    //onFocus={handleInputFocus}
                                />
                                <Input
                                    type="text"
                                    name="number"
                                    placeholder="Card number"
                                    // onChange={handleInputChange}
                                    // onFocus={handleInputFocus}
                                />
                                <Input
                                    type="date"
                                    name="expiry"
                                    placeholder="Expiration Date"
                                    // onChange={handleInputChange}
                                    // onFocus={handleInputChangeInputFocus}
                                />
                                <Input
                                    type="text"
                                    name="securityCode"
                                    placeholder="Security Code"
                                    // onChange={handleInputChange}
                                    // onFocus={handleInputFocus}
                                />
                                <Input
                                    type="text"
                                    name="amountToBePaid"
                                    placeholder="Amount to be paid"
                                    // onChange={handleInputChange}
                                    // onFocus={handleInputFocus}
                                />
                                <Select>
                                    <MenuItem value={'OMR'}> OMR</MenuItem>
                                    <MenuItem value={'USD'}> USD</MenuItem>
                                </Select>
                                <Button color="primary" variant="contained" fullWidth type="submit">
                                    Submit
                                </Button>
                            </form>

                        </div>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}


export default CreditCardInputForm