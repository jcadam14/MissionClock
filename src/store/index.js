//MissionClock file
import {createStore, combineReducers, applyMiddleware} from 'redux';
import reducers from '../reducers/index';
import thunk from 'redux-thunk';

const reducer = combineReducers(reducers);
const store = createStore(reducer, applyMiddleware(thunk));

export default store;