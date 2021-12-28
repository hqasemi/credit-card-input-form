import TextField from "@mui/material/TextField";
import React from "react";
import {connect, getIn} from 'formik';
import PropTypes from "prop-types";

function SecurityCodeInput({formik}) {
    return (
        <TextField
            fullWidth
            type="password"
            id="securityCode"
            name="securityCode"
            label="Security code"
            value={getIn(formik.values, "securityCode")}
            onChange={formik.handleChange}
            error={formik.touched.securityCode && Boolean(formik.errors.securityCode)}
            helperText={formik.touched.securityCode && formik.errors.securityCode}
            inputProps={{maxLength: 3,}}
        />
    )
}


SecurityCodeInput.propTypes = {
    formik: PropTypes.object,
};

export default connect(SecurityCodeInput);

