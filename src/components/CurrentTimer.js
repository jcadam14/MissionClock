import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Badge} from 'reactstrap';

const mapStateToProps = state => {
    return { currentContact: state.clock.currentContact,
             time: state.clock.date }; 
  }; 

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

class ConnectedCurrentTimer extends Component
{
    render()
    {

        const secondsRemaining = Math.max(((Date.parse(this.props.currentContact.los) - this.props.time)/1000),0);
        const style = (secondsRemaining === 0 ?
            {color: 'black', backgroundColor: '#B0E0E6', borderStyle:'solid', borderColor:'white'}:
            (secondsRemaining <= 600 ? {color: 'black', borderWidth:4, backgroundColor: '#FBFF00', borderStyle:'solid', borderColor:'red'}:
            {borderStyle:'solid', borderWidth:2, borderColor:'white',backgroundColor: '#00FF00',color:'black'}));
        return (<div><h1>
            <Badge style={style}>
            &Delta;LOS {formatValues(Math.abs(secondsRemaining))}</Badge></h1></div>);
    }
}

const CurrentTimer = connect(mapStateToProps, null)(ConnectedCurrentTimer);           

export default CurrentTimer;