import React, { Component } from 'react';
import {connect} from 'react-redux';
import Clock from 'react-live-clock';
import moment from 'moment-timezone';
import '../Contacts.css';


const mapStateToProps = state => {
    return { showLocalTime:state.clock.showLocalTime,
             time: state.clock.date,
            timezone:state.clock.timezone}; 
  }; 

class ConnectedLocalClock extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            timezoneMessage:this.props.timezone
        }
    }

    componentWillReceiveProps(nextProps)
    {
        if(this.props.timezone && nextProps.timezone && (this.props.timezone !== nextProps.timezone))
        {
            let message = moment.tz(nextProps.timezone).zoneAbbr();
            message = (message.startsWith('+') || message.startsWith('-') ? 'UTC' + message : message);
            this.setState({timezoneMessage:message})
        }
    }

    render(){
        const clock = (this.props.showLocalTime?<div style={{color:'#42c0f1'}}>Local ({this.state.timezoneMessage})<div className="timerPanel">
        <Clock style={{fontSize:'x-large'}}
    format={'MMM DD, YYYY HH:mm:ss'}
    date={new Date()}
    timezone={this.props.timezone}/></div></div>:<span/>);
        return clock;
    }
}

const LocalClock = connect(mapStateToProps, null)(ConnectedLocalClock);
export default LocalClock;