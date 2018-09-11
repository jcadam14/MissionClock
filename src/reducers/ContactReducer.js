import { UPDATE_CONTACTS, UPDATE_CURRENT_PROGRESS, SET_CONTACTS } from "../constants/action-types";
import { UPDATE_NEXT_STYLE, CURRENT_DONE  } from "../constants/action-types";
import { CURRENT_STYLE, CURRENT_DONE_STYLE } from "../Constants";
import { NEXT_STYLE } from "../Constants";
import { CURRENT_WARN_STYLE } from "../Constants";

/*
{
    aos:<aos string>
    los:<los string>
    aosTime:<date obj of aos>
    losTime:<date obj of los>
    station:<string of station>
    terminal:<string of terminal>
}
*/

const initialState = {
    contacts:null,
    currentContact:null,
    nextContact:null
};

const contactReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CONTACTS:
            state = {...state,contacts:action.payload};
        case UPDATE_CONTACTS:
            var contactState = {...state};
            const cContact = findCurrent(state.contacts, action.payload.date);
            if(cContact !== null)
            {
                contactState = {...contactState,currentContact:{...cContact,color:"success",progress:0}};
            }
            else
            {
                contactState = {...contactState,currentContact:null};
            }
            const nContact = findNext(state.contacts, action.payload.date);
            if(nContact !== null)
            {
                contactState = {...contactState,nextContact:{...nContact,color:"secondary"}};
            }
            else
            {
                contactState = {...contactState,nextContact:null};
            }
            return contactState;
        case UPDATE_NEXT_STYLE:
            return {...state,nextContact:{...state.nextContact,color:action.payload}};
        case CURRENT_DONE:
            return {...state,currentContact:{...state.currentContact,color:"primary",progress:(state.currentContact.losTime - state.currentContact.aosTime)}};
        case UPDATE_CURRENT_PROGRESS:
            const progress = ((state.currentContact.losTime - state.currentContact.aosTime) - action.payload);
            return {...state,currentContact:{...state.currentContact,progress:progress}};
        default:
            return state;
    }
};

const findCurrent = (contacts, date) =>
{
    let contact = null;
    for(let c of contacts){
        const aosTime = Date.parse(c.aos);
        const losTime = Date.parse(c.los);
        if( aosTime <= date && losTime > date)
        {
            contact = c;
            contact = {...contact,aosTime,losTime};
        }
    }
    return contact;
}

const findNext = (contacts, date) =>
{
    let contact = null;
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
    return contact;
}

export default contactReducer;