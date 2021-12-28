import React from "react";
import {connect} from 'formik';
import Button from "@mui/material/Button";
import {ButtonGroup} from "@mui/material";
import PropTypes from "prop-types";

function CurrencyButtonGroup({formik, onClickCallback}) {
    return (
        <ButtonGroup >
            <Button
                color="primary"
                size="small"
                variant={formik.values.currency === "OMR" ? "contained" : "standard"}
                value={"OMR"}
                onClick={onClickCallback}
            >
                OMR
            </Button>
            <Button
                color="primary"
                size="small"
                variant={formik.values.currency !== "OMR" ? "contained" : "standard"}
                value={"USD"}
                onClick={onClickCallback}
            >
                USD
            </Button>
        </ButtonGroup>
    )
}


CurrencyButtonGroup.propTypes = {
    formik: PropTypes.object,
    onClickCallback: PropTypes.func,
};

export default connect(CurrencyButtonGroup);
