import React, { Component } from 'react';
import {connect} from 'react-redux';
import {updateContacts} from '../actions';
import {Badge} from 'reactstrap';

const mapStateToProps = state => {
      return { nextContact: state.clock.nextContact,
               time: state.clock.date}; 
    }; 

const mapDispatchToProps = dispatch => {
    return {
        updateContacts: () => {
            dispatch(updateContacts());
        }
    }
}

const formatValues = (secondsRemaining) =>
{
    var d = (secondsRemaining === 0 ? secondsRemaining : (secondsRemaining + 1));
    var r = {}; 
    var s = {                                                                  // structure
        years: 31536000,
        //month: 2592000,
        //week: 604800, // uncomment row to ignore
        days: 86400,   // feel free to add your own row
        hours: 3600,
        minutes: 60,
        seconds: 1
    };
    
    Object.keys(s).forEach(function(key){
        r[key] = Math.floor(d / s[key]);
        d -= r[key] * s[key];
    });

    const hourString = ('0' + r.hours).slice(-2);
    const minString = ('0'+ r.minutes).slice(-2);
    const secString = ('0' + r.seconds).slice(-2);
    const daysString = (r.days > 0 ? (('00' + r.days).slice(-3) + ':' ) : '');
    const yearsString = (r.years > 0 ? r.years + ':':'');
    return (yearsString + daysString + hourString + ':' + minString + ':' + secString);
}

class ConnectedNextTimer extends Component
{
    render()
    {
        const secondsRemaining = ((Date.parse(this.props.nextContact.aos) - this.props.time)/1000);
        const color = (secondsRemaining <= 3600 ? 'danger' : 'secondary');
        return (<div><h1>
            <Badge color={color} style={{borderStyle:'solid', borderWidth:2, borderColor:'white',color:'black'}}>
            &Delta;AOS {formatValues(Math.abs(secondsRemaining))}</Badge></h1></div>);
    }
}

const NextTimer = connect(mapStateToProps, null)(ConnectedNextTimer);           

export default NextTimer;