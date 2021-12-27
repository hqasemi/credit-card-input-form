import React from "react";

const ErrorInfo = ({serverResponse}) => {
    return (
        <div>
            <h2 style={{"textDecoration": "underline", "color": "#c52e2e"}}>Error during payment</h2>
            <p>More info: {serverResponse.data.error ?? "Unknown Issue"}</p>
        </div>
    )
}

export default ErrorInfo