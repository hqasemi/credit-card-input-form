import React from "react";

const SuccessInfo = ({serverResponse}) => {
    return (
        <div>
            <h2 style={{"textDecoration": "underline"}}>Your payment has been successfully done</h2>
            <p><strong>Amount:</strong> {serverResponse.data.amountToBePaid} {serverResponse.data.currency}</p>
            <p><strong>Card Number:</strong> {serverResponse.data.number}</p>
            <p><strong>Card Holder Name:</strong> {serverResponse.data.name}</p>
            <p><strong>Card Expiration Date:</strong> {serverResponse.data.expirationDate}</p>
        </div>
    )
}

export default SuccessInfo