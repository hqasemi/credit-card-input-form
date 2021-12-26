import React, {Component} from 'react';
import {connect} from 'react-redux';
// import './App.css';
import openSocket from 'socket.io-client';
import store from '../../store';
import * as Actions from './actions';
import ReactLoading from 'react-loading';

// A connected component will have it's props mapped to the
// state, making it utilize React's updating functionality.
class App extends Component {
    constructor(props) {
        super(props);
        this.socket = openSocket('<ADDRESS_TO_BACK_END_HERE>');
        this.socket.on(Actions.POST_PAYMENT_INFO_SUCCESS, data => {
            store.dispatch(Actions.postPaymentInfoSuccessCommand(data));
        });
        this.socket.on(Actions.POST_PAYMENT_INFO_FAILURE, err => {
            store.dispatch(Actions.postPaymentInfoFailureCommand(err));
        });
    }

    componentDidMount() {
        // Accessible because we 'connected'
        this.props.postPaymentInfoToServer({socket: this.socket});
    }

    render() {
        if (this.props.isFetching) {
            return <ReactLoading type="bars"/>;
        }
        return (
            <ul className="list-unstyle">
                {this.props.paymentResponse.map(
                    person => <li key={person.name}>{person.name}</li>
                )}
            </ul>
        );
    }
}

export default connect(
    state => state,
    {postPaymentInfoToServer: Actions.postPaymentInfoToServer}
)(App);