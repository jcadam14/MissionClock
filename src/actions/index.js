//MissionClock file
import * as constants from '../constants/action-types';
import fetch from 'cross-fetch';

export const updateTimers = () =>
    ({type:constants.UPDATE_TIMERS});

export const addCustomTimer = (timer) =>
    ({type:constants.ADD_CUSTOM_TIMER,payload:timer});

export const removeCustomTimer = (timer) =>
    ({type:constants.REMOVE_CUSTOM_TIMER,payload:timer});

export const updateContacts = () => 
    ({type:constants.UPDATE_CONTACTS});

export const applyConfigs = (configValues) =>
    ({type:constants.SET_CONFIG,payload:configValues});

export const toggleScheduleModal = () => 
    ({type:constants.TOGGLE_SCHEDULE_MODAL});


export const toggleConfigModal = () => 
    ({type:constants.TOGGLE_CONFIG_MODAL});

export const toggleSaveModal = () => 
    ({type:constants.TOGGLE_SAVE_MODAL});

export const setUsingDefault = (using) =>
    ({type:constants.SET_USING_DEFAULT,payload:using});

export function messageReceived(action,scheduleAutoload,usingDefaultConfig)
{
    switch(action)
    {
        case constants.CONFIG_UPDATE:
            if(usingDefaultConfig)
            {
                return fetchDefaultConfig();
            }
            else
            {
                return function(){};
            }
        case constants.SCHEDULE_UPDATE:
            if(scheduleAutoload)
            {
                return fetchLatestSchedule();
            }
            else
            {
                return function(){};
            }
        default:
            return;
    }
}

export function saveConfig(fileName, data)
{
    const configSaveData = {...data};
    const uri = 'rest/mc/config/save/' + fileName;
    return function(dispatch) {
        console.log("Sending to URI ");
        console.log(configSaveData);
        return fetch(uri, {
                            method: 'PUT',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(configSaveData)
        });
    }
}

export function fetchMode()
{
    const uri = 'rest/mc/mode';
    return function(dispatch){
        return fetch(uri)
            .then(response => response.json().then(body => ({response, body})))
            .then(({response, body}) => {
                dispatch({type: constants.SET_MODE,
                          payload: body});
            });
    }
}

export function fetchConfigs()
{
    
    const uri = 'rest/mc/config/list';
    return function(dispatch){
    return fetch(uri)
        .then(response => response.json().then(body => ({ response, body })))
        .then(({ response, body }) => {
            if (!response.ok) {
            dispatch({
              type: constants.SCHEDULE_REQUEST_FAILURE,
              payload: body.error
            });
          } else {
            dispatch({
              type: constants.SET_CONFIGLIST,
              payload: body
            });
          }
        });
    }
}

export function fetchSchedules()
{
    
    const uri = 'rest/mc/schedule/list';
    return function(dispatch){
    return fetch(uri)
        .then(response => response.json().then(body => ({ response, body })))
        .then(({ response, body }) => {
            if (!response.ok) {
            dispatch({
              type: constants.SCHEDULE_REQUEST_FAILURE,
              payload: body.error
            });
          } else {
            dispatch({
              type: constants.SET_SCHEDULELIST,
              payload: body
            });
          }
        });
    }
}

export function fetchDefaultConfig()
{
    
    const uri = 'rest/mc/config';
    //const uri = 'http://localhost:8585/MissionClockService/rest/config';
    return function(dispatch){
    return fetch(uri)
        .then(response => response.json().then(body => ({ response, body })))
        .then(({ response, body }) => {
            console.log("Default Config response from server");
            console.log(body);
          if (!response.ok) {
            dispatch({
              type: constants.SCHEDULE_REQUEST_FAILURE,
              payload: body.error
            });
          } else {
            dispatch({
              type: constants.SET_CONFIG,
              payload: body
            });
          }
        });
    }
}
export function fetchLatestSchedule()
{
    const uri = 'rest/mc/schedule';
    //const uri = 'http://localhost:8585/MissionClockService/rest/schedule';
    return dispatch => {
        return fetch(uri)
        .then(response => {console.log('Fetching latest schedule'); return response.json();}
        )
        .then(function(data) {
            console.log("Latest schedule response from server");
            console.log(data);
            dispatch({
              type: constants.SET_CONTACTS,
              payload: data
            });
          });
    }
}

export function fetchSchedule(schedule)
{
    const uri = 'rest/mc/schedule/' + schedule;
    //const uri = 'http://localhost:8585/MissionClockService/rest/schedule';
    return dispatch => {
        return fetch(uri)
        .then(response => response.json()
        )
        .then(function(data) {
            dispatch({
              type: constants.SET_CONTACTS,
              payload: data
            });
          });
    }
}

export function fetchConfig(config)
{
    const uri = 'rest/mc/config/' + config;
    return dispatch => {
        return fetch(uri)
        .then(response => {console.log('Fetching config');return response.json();}
        )
        .then(function(data) {
            dispatch({
              type: constants.SET_CONFIG,
              payload: data
            });
          });
    }
}

export function fetchIsAdmin()
{
    const uri = 'rest/mc/isadmin';
    return dispatch => {
        return fetch(uri)
        .then(response => {console.log('Fetching admin');return response.json();}
        )
        .then(function(data) {
            dispatch({
              type: constants.SET_IS_ADMIN,
              payload: data.isAdmin
            });
          });
    }
}