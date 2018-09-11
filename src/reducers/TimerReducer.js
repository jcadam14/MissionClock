import * as constants from "../constants/action-types";

const initialState = {
	date:new Date(),
};

const timerReducer = (state = initialState, action) => {
	switch (action.type) {
		case constants.UPDATE_TIMERS:
			if(action.payload.useSimTime)
			{
				const simDiff = action.payload.simDiff;
				return {date:new Date(Date.now() + simDiff)};
			}
			return {date:new Date()};
		default:
			return {...state};
    }
};

export default timerReducer;