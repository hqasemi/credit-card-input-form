import InputMask from "react-input-mask";
import TextField from "@mui/material/TextField";
import React from "react";
import {connect, getIn} from 'formik';

function DateInput({formik}) {
    return (
        <InputMask
            mask="99/99"
            maskChar=" "
            value={getIn(formik.values, "expirationDate")}
            onChange={formik.handleChange}
            // TODO: fix maxLength
            inputProps={{maxLength: 5,}}
        >
            {
                () =>
                    <TextField
                        fullWidth
                        id="expirationDate"
                        name="expirationDate"
                        label="Expiration date (MM/YY)"
                        error={formik.touched.expirationDate && Boolean(formik.errors.expirationDate)}
                        helperText={formik.touched.expirationDate && formik.errors.expirationDate}

                    />}
        </InputMask>
    )
}

export default connect(DateInput);
