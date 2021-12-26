// Remember these from our backend?
export const POST_PAYMENT_INFO = 'POST_PAYMENT_INFO';
export const POST_PAYMENT_INFO_FAILURE = 'POST_PAYMENT_INFO_FAILURE';
export const POST_PAYMENT_INFO_SUCCESS = 'POST_PAYMENT_INFO_SUCCESS';

export const postPaymentInfoCommand = data => {
    return {
        type: POST_PAYMENT_INFO,
        data
    };
};

export const postPaymentInfoSuccessCommand = data => {
  return {
    type: POST_PAYMENT_INFO_SUCCESS,
    data
  };
};

export const postPaymentInfoFailureCommand = err => ({
    type: POST_PAYMENT_INFO_FAILURE,
    err
});

// This method has one required option which is the reference to
// socket being utilized.  That connection happens somewhere else.
// Assume we're connected when this function is called.
export const postPaymentInfoToServer = options => async dispatch => {
    // Notify our state that we're doing something asynchronous.
    dispatch(postPaymentInfoCommand());
    // Sanity, don't need to pass the socket itself down the wire.
    const {socket} = options;
    delete options.socket;
    try {
        // Emit the request to the back-end via the socket.
        socket.emit(POST_PAYMENT_INFO, options);
    } catch (err) {
        dispatch(postPaymentInfoFailureCommand(err));
    }
};