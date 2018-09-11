//MissionClock file
import React, { Component } from 'react';
import WebsocketConnection from './components/WebsocketConnection';
import MissionClockApp from './MissionClockApp';

class ConnectedMC extends Component
{
    render()
    {
        return (
            <div>
                <WebsocketConnection/>
                <MissionClockApp/>
            </div>
        )
    }
}

export default ConnectedMC