import * as constants from "../constants/action-types";

/*
Custom Timer:
{
    id;
	event;
	startTime;
	endTime;
	resources;
	showElapsed;
	showCountDown;
	showCountUp;
}
*/

const initialState = {
    showLocalTime:false,
	showUTCTime:true,
	showElapsedTime:true,
	missionStartTime:new Date(),
	showContacts:true,
	scheduleAutoLoad:true,
	useSimTime:false,
	simTime:new Date(),
	simDiff:0,
	customTimers:[]
};

const configReducer = (state = initialState, action) => {
	switch (action.type) {
		case constants.SET_CONFIG:
			return {...state,...action.payload,simDiff:(action.payload.simTime - Date.now())};
		case constants.UPDATE_SIMTIME:
			return {...state, simTime:state.simTime};
		default:
			return {...state};
    }
};

export default configReducer;