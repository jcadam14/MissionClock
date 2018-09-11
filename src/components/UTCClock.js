//MissionClock file
import React, { Component } from 'react';
import {connect} from 'react-redux';
import Clock from 'react-live-clock';


const mapStateToProps = state => {
    return { showUTCTime:state.clock.showUTCTime,
        time: state.clock.date}; 
  }; 

class ConnectedUTCClock extends Component
{
    render(){
        const clock = (this.props.showUTCTime?<div style={{color:'#42c0f1'}}>UTC Time<div className="timerPanel">
        <Clock style={{fontSize:'x-large'}}
    format={'YYYY-DDD HH:mm:ss'}
    date={new Date(this.props.time)}
    timezone='UTC'/></div></div>:<span/>);
        return clock;
    }
}

const UTCClock = connect(mapStateToProps, null)(ConnectedUTCClock);
export default UTCClock;