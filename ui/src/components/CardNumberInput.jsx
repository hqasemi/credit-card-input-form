import InputMask from "react-input-mask";
import TextField from "@mui/material/TextField";
import React from "react";
import {connect} from 'formik';


function CardNumberInput({formik}) {
    return (
        <InputMask
            mask="9999 9999 9999 9999"
            maskChar=" "
            value={formik.values.cardNumber || ''}
            onChange={formik.handleChange}
            inputProps={{
                maxLength: 16,
            }}
        >
            {
                () =>
                    <TextField
                        id="cardNumber"
                        name="cardNumber"
                        label="Card number"
                        fullWidth
                        error={formik.touched.cardNumber && Boolean(formik.errors.cardNumber)}
                        helperText={formik.touched.cardNumber && formik.errors.cardNumber}
                    />
            }

        </InputMask>
    )
}

export default connect(CardNumberInput);
