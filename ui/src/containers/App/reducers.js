/**
 * Reducers handles the actions created by our action creator
 */
import * as Actions from './actions'; // Import our actions
const initialState = {
  people: {},
  isFetching: true, // Default to fetching..
  error: null
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action) => {
  switch (action.type) {
    case Actions.POST_PAYMENT_INFO:
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case Actions.POST_PAYMENT_INFO_SUCCESS:
      return {
        ...state,
        paymentResponse: action.data.results,
        isFetching: false
      };
    case Actions.POST_PAYMENT_INFO_FAILURE:
      console.log('Error: ', action.error);
      return {
        ...state,
        error: action.error,
        isFetching: false
      };
    default:
      return state;
  }
};