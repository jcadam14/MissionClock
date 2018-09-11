import * as constants from "../constants/action-types";

const initialState = {
    mode:null,
    date:new Date(),
    scheduleModal:false,
    configModal:false,
    saveModal:false,
    contacts:null,
    events:null,
    eventTypes:null,
    currentContact:null,
    nextContact:null,
    showLocalTime:false,
	showUTCTime:true,
	showElapsedTime:true,
	missionStartTime:new Date(),
	showContacts:true,
	scheduleAutoLoad:true,
	useSimTime:false,
	simTime:new Date(),
    simTimeDiff:0,
    showCustomTimers:false,
    maxCustomTimers:0,
    customTimers:[],
    scheduleList:[],
    configList:[],
    timezone:'UTC',
    usingDefaultConfig:true,
    isAdmin:false
};


const clockReducer = (state = initialState, action) => {
	switch (action.type) {
        case constants.ADD_CUSTOM_TIMER:
            const timer = {...action.payload,key:Date.now()};
            return {...state,customTimers:[...state.customTimers,timer]};
        case constants.REMOVE_CUSTOM_TIMER:
            const newTimers = state.customTimers.slice();
            const index = newTimers.findIndex((e) => e.key === action.payload);
            newTimers.splice(index, 1);
            return {...state,customTimers:newTimers};
        case constants.SET_MODE:
            return {...state, mode:action.payload.mode};
        case constants.SET_SCHEDULELIST:
            return {...state, scheduleList:action.payload};
        case constants.SET_CONFIGLIST:
            return {...state, configList:action.payload};
        case constants.SET_CONFIG:
            //JSON lists put a dummy object if an empty list is passed in, so remove that
            console.log('Setting configs in reducer');
            console.log(action.payload);
            var tempState = {...state,...action.payload};
            if(action.payload.customTimers)
            {
                const goodTimers = [];
                const receivedTimers = action.payload.customTimers.slice();
                for(let t of receivedTimers)
                {
                    console.log('timer t: ');
                    console.log(t);
                    if(t && t.eventType)
                    {
                        console.log('adding t: ');
                        console.log(t);
                        goodTimers.push({...t,key:Date.now()});
                    }
                }
                tempState = {...state,...action.payload,customTimers:[...goodTimers]};
                console.log('Custom timers: ');
                console.log(tempState.customTimers);
            }
            //need to reset the contacts if we switch either the useSimTime, or if the sim time
            //offset changes
            if((action.payload.useSimTime !== state.useSimTime) || action.payload.useSimTime)
			{
                if(action.payload.useSimTime)
                {
                    let offset = state.simTimeDiff;
                    if(action.payload.simTimeDiff !== state.simTimeDiff)
                    {
                        offset = action.payload.simTimeDiff;
                    }
                    tempState = {...tempState,date:new Date(Date.now() + offset),simTimeDiff:offset};
                }
                else
                {
                    tempState = {...tempState,date:new Date()};
                }
                
                tempState = updateContacts(tempState);
            }
            return {...tempState};
        case constants.UPDATE_TIMERS:
            var returnDate = null;
            var tempState = {...state};
			if(state.useSimTime)
			{
				returnDate = new Date(Date.now() + state.simTimeDiff);
            }
            else
            {
                returnDate = new Date();
            }
            tempState = {...tempState,date:returnDate};
            if(state.nextContact)
            {
                const secondsRemaining = ((Date.parse(state.nextContact.aos) - returnDate)/1000);
                if(secondsRemaining <= 0)
                {
                    tempState = updateContacts(tempState);
                }   
            }
            return {...tempState};
        case constants.UPDATE_CONTACTS:
            return updateContacts({...state});
        case constants.TOGGLE_SCHEDULE_MODAL:
            return {...state,scheduleModal:!state.scheduleModal};
        case constants.TOGGLE_CONFIG_MODAL:
            return {...state,configModal:!state.configModal};
        case constants.TOGGLE_SAVE_MODAL:
            return {...state,saveModal:!state.saveModal};
        case constants.SET_USING_DEFAULT:
            return {...state,usingDefaultConfig:action.payload};
        case constants.SET_IS_ADMIN:
            return {...state,isAdmin:action.payload};
        case constants.SET_CONTACTS:
            const contactState = {...state,
                contacts:action.payload.contacts,
                events:action.payload.events,
                eventTypes:findEventTypes(action.payload.events)};
            return updateContacts(contactState);
		default:
			return {...state};
    }
}

const findEventTypes = (events) =>
{
    let eventTypes = [];
    for(let e of events)
    {
        if(eventTypes.indexOf(e.eventType) === -1)
        {
            eventTypes.push(e.eventType);
        }
    }
    return eventTypes;
}

const updateContacts = (state) => 
{
    const cContact = findCurrent(state.contacts, state.date);
    var tempState = {...state};
    if(cContact !== null)
    {
        tempState = {...tempState,currentContact:{...cContact}};
    }
    else
    {
        tempState = {...tempState,currentContact:null};
    }
    const nContact = findNext(state.contacts, state.date);
    if(nContact !== null)
    {
        tempState = {...tempState,nextContact:{...nContact}};
    }
    else
    {
        tempState = {...tempState,nextContact:null};
    }
    return tempState;
}

const findCurrent = (contacts, date) =>
{
    let contact = null;
    if(contacts)
    {
        for(let c of contacts){
            const aosTime = Date.parse(c.aos);
            const losTime = Date.parse(c.los);
            if( aosTime <= date)
            {
                contact = {...c,aosTime,losTime};
            }
        }
    }
    return contact;
}

const findNext = (contacts, date) =>
{
    let contact = null;
    if(contacts)
    {
        for(let c of contacts){
            const aosTime = Date.parse(c.aos);
            const losTime = Date.parse(c.los);
            if( aosTime > date)
            {
                contact = c;
                contact = {...contact,aosTime,losTime};
                return c;
            }
        }
    }

    return contact;
}

export default clockReducer;