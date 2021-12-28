import InputMask from "react-input-mask";
import TextField from "@mui/material/TextField";
import React from "react";
import {connect, getIn} from 'formik';
import PropTypes from "prop-types";

function DateInput({formik}) {
    return (
        <InputMask
            mask="99/99"
            maskChar=" "
            value={getIn(formik.values, "expirationDate")}
            onChange={formik.handleChange}
            // TODO: fix maxLength
            inputProps={{
                maxLength: 5,
            }}
        >
            {
                () =>
                    <TextField
                        fullWidth
                        size="small"
                        id="expirationDate"
                        name="expirationDate"
                        label="Expiration date (MM/YY)"
                        error={formik.touched.expirationDate && Boolean(formik.errors.expirationDate)}
                        helperText={formik.touched.expirationDate && formik.errors.expirationDate}
                    />
            }
        </InputMask>
    )
}


DateInput.propTypes = {
    formik: PropTypes.object,
};

export default connect(DateInput);
