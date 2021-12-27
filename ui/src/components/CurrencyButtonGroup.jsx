import React from "react";
import {connect} from 'formik';
import Button from "@mui/material/Button";
import {ButtonGroup} from "@mui/material";

function CurrencyButtonGroup({formik, onClickCallback}) {
    return (
        <ButtonGroup>
            <Button
                color="primary"
                variant={formik.values.currency === "OMR" ? "contained" : "standard"}
                value={"OMR"}
                onClick={onClickCallback}
            >
                OMR
            </Button>
            <Button
                color="primary"
                variant={formik.values.currency !== "OMR" ? "contained" : "standard"}
                value={"USD"}
                onClick={onClickCallback}
            >
                USD
            </Button>
        </ButtonGroup>
    )
}

export default connect(CurrencyButtonGroup);
