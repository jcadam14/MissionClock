//MissionClock file
import React, {Component} from 'react';
import Websocket from 'react-websocket';
import {messageReceived} from '../actions';
import {connect} from 'react-redux';

const mapPropsToState = state => {
    return {autoloadSchedule:state.clock.scheduleAutoLoad,
            usingDefaultConfig:state.clock.usingDefaultConfig};
}

const mapDispatchToProp = dispatch => {
    return {
        messageReceived: (data,autoloadSchedule,useDefaultConfig) => {
            const socketEvent = JSON.parse(data)
            dispatch(messageReceived(socketEvent.action,autoloadSchedule,useDefaultConfig));
        }
    };
  }

class ConnectedWebsocketConnection extends Component
{
    constructor(props) {
        super(props);
        this.actOnMessage = this.actOnMessage.bind(this);
    }

    actOnMessage(data)
    {
        this.props.messageReceived(data,this.props.autoloadSchedule,this.props.usingDefaultConfig);
    }

    render()
    {
        const host = window.location.host;
        const path = window.location.pathname;
        const protocol = (window.location.protocol === 'http:' ? 'ws' : 'wss');
        const websocketURL = protocol + '://' + host + path + 'websocket';
        //const websocketURL = 'ws://localhost:8585/MissionClockService/websocket';
        return <Websocket url={websocketURL}
                onMessage={(data) => this.actOnMessage(data)}/>;
    }
}

const  WebsocketConnection = connect(mapPropsToState, mapDispatchToProp)(ConnectedWebsocketConnection);    
export default WebsocketConnection