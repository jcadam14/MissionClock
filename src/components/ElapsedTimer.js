import React, { Component } from 'react';
import ElapsedCountdown from './ElapsedCountdown';
import {connect} from 'react-redux';
import {updateNextStyle} from '../actions';
import {updateContacts} from '../actions';
import { NEXT_WARN_STYLE, NEXT_STYLE } from '../Constants';
import {Badge, Row, Col, Card, CardBody} from 'reactstrap';

const mapStateToProps = state => {
      return { missionStartTime: state.clock.missionStartTime,
               showElapsedTime: state.clock.showElapsedTime,
               time: state.clock.date }; 
    }; 

    const formatValues = (secondsRemaining) =>
    {
        var d = Math.abs(secondsRemaining);
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
    
        const colonElem = <Col style={{margin:'0 -20px'}}><div>:</div><div><span/></div></Col>;
        const hourString = <Col><div>{('0' + r.hours).slice(-2)}</div><div style={{marginTop:'-5px',fontSize:'medium',fontWeight:'normal'}}>Hrs</div></Col>;
        const minString = <Col><div>{('0'+ r.minutes).slice(-2)}</div><div style={{marginTop:'-5px',fontSize:'medium',fontWeight:'normal'}}>Min</div></Col>;
        const secString = <Col><div>{('0' + r.seconds).slice(-2)}</div><div style={{marginTop:'-5px',fontSize:'medium',fontWeight:'normal'}}>Sec</div></Col>;
        const daysString = <Col><div>{('00' + r.days).slice(-3)}</div><div style={{marginTop:'-5px',fontSize:'medium',fontWeight:'normal'}}>Days</div></Col>;
        const yearsString = (r.years > 0 ? <Col><div>{('0' + r.years).slice(-2)}</div><div style={{marginTop:'-5px',fontSize:'medium',fontWeight:'normal'}}>Yrs</div></Col>:<span/>);
        const yearColon = (r.years > 0 ? colonElem : <span/>);
        const plusMinus = (secondsRemaining > 0 ? <Col><div>-</div><div><span/></div></Col> : <Col><div>+</div><div><span/></div></Col>);
        return <Row>{plusMinus}{yearsString}{yearColon}{daysString}{colonElem}{hourString}{colonElem}{minString}{colonElem}{secString}</Row>;
    }

class ConnectedElapsedTimer extends Component
{
    render()
    {
        const endTime = Date.parse(this.props.missionStartTime);
        const secondsRemaining = ((endTime - this.props.time)/1000);
        const timer = (this.props.showElapsedTime?<div style={{color:'#42c0f1'}}>Mission Elapsed Time
        <div><Card style={{background:'linear-gradient(black, blue)',boxShadow:'10px 10px 5px black',color:'white'}}><CardBody className='text-center'><h2>{formatValues(secondsRemaining)}</h2></CardBody></Card></div></div>:<span/>)
        return timer;
    }
}

const ElapsedTimer = connect(mapStateToProps, null)(ConnectedElapsedTimer);           

export default ElapsedTimer;