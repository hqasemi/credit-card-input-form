import React from "react";
import PropTypes from "prop-types";

const SuccessInfo = ({serverResponse}) => {
    return (
        <div>
            <h2 style={{"textDecoration": "underline"}}>Your payment has been successfully done</h2>
            <p><strong>Amount:</strong> {serverResponse.data.amountToBePaid} {serverResponse.data.currency}</p>
            <p><strong>Card Number:</strong> {serverResponse.data.cardNumber}</p>
            <p><strong>Card Holder Name:</strong> {serverResponse.data.cardHolderName}</p>
            <p><strong>Card Expiration Date:</strong> {serverResponse.data.expirationDate}</p>
        </div>
    )
}


SuccessInfo.propTypes = {
    serverResponse: PropTypes.object,
};

export default SuccessInfo