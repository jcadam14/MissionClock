import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Button, Label, Row, Col, Card, CardBody,CardText, CardTitle, Input} from 'reactstrap';
import {Collapse} from 'react-collapse';
import Toggle from 'react-toggle';
import DateTime from 'react-datetime';
import Clock from 'react-live-clock';
import { types } from 'util';

const mapStateToProps = state => {
    return { time: state.clock.date }; 
  };

const noData = () => {
    return (<Card style={{backgroundColor:'transparent',borderWidth:2, borderColor:'white',borderRadius:10}}>
        <CardBody>
        <CardTitle>
            Count Down
        </CardTitle>
            <CardText>
                No Data
            </CardText>
        </CardBody>
    </Card>);
}

const formatValues = (secondsRemaining) =>
{
    var d = (secondsRemaining === 0 ? secondsRemaining : (secondsRemaining + 1));
    var r = {}; 
    var s = {                                                                  // structure
        //years: 31536000,
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
    const daysString = ('00' + r.days).slice(-3);
    const yearsString = (r.years > 0 ? ('0' + r.years).slice(-2) + ':':'');
    return (yearsString + daysString + ':' + hourString + ':' + minString + ':' + secString);
}

class ConnectedCountDownEvent extends Component
{
    constructor(props)
    {
        super(props);
        this.findLatest = this.findLatest.bind(this);
        this.state = {
            events:this.props.events
        }
    }

    findLatest()
    {
        const filteredEvents = this.state.events.filter(e => new Date(e.start) >= new Date(this.props.time));
        const nextEvent = filteredEvents.slice(0,1).pop();
        return nextEvent;
    }

    render()
    {
        const nextEvent = this.findLatest();
        const elem = (nextEvent ? (<Card style={{backgroundColor:'transparent',borderWidth:2, borderColor:'white',borderRadius:10}}>
            <CardBody>
                <CardTitle>
                    Count Down
                </CardTitle>
                    <Row>
                        <Col>Time</Col>
                        <Col>{formatValues(((Date.parse(nextEvent.start) - this.props.time)/1000))}</Col>
                    </Row>
                    <Row>
                        <Col>Event</Col>
                        <Col>{nextEvent.eventId}</Col>
                    </Row>
                    <Row>
                        <Col>Resources</Col>
                        <Col>{nextEvent.resources}</Col>
                    </Row>
                    <Row>
                        <Col>Event Start</Col>
                        <Col><Clock format={'YYYY-DDD HH:mm:ss'} date={new Date(nextEvent.start)} timezone='UTC'/></Col>
                    </Row>
            </CardBody>
        </Card>) : noData());
        return elem; 
    }
    
}

const CountDownEvent = connect(mapStateToProps, null)(ConnectedCountDownEvent);
export default CountDownEvent