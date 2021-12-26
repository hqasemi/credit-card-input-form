import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk'; //allows us to use functions as actions
import Reducers from './containers/App/reducers';

const store = createStore(Reducers, applyMiddleware(thunk));
export default store;