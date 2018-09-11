//MissionClock file
import {reducer as burgerMenu} from "redux-burger-menu";
import clockReducer from './ClockReducer';

const reducers = {
    burgerMenu:burgerMenu,
    clock:clockReducer
};

export default reducers;