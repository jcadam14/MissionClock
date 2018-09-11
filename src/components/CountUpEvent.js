import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Button, Label, Row, Col, Card, CardBody,CardText, CardTitle, Input} from 'reactstrap';
import {Collapse} from 'react-collapse';
import Toggle from 'react-toggle';
import DateTime from 'react-datetime';
import { types } from 'util';
import Clock from 'react-live-clock';

const mapStateToProps = state => {
    return { time: state.clock.date }; 
  };

const noData = () => {
    return (<Card style={{backgroundColor:'transparent',borderWidth:2, borderColor:'white',borderRadius:10}}>
        <CardBody>
        <CardTitle>
            Count Up
        </CardTitle>
            <CardText>
                No Data
            </CardText>
        </CardBody>
    </Card>);
}

const formatValues = (secondsRemaining) =>
{
    var d = secondsRemaining;
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

class ConnectedCountUpEvent extends Component
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
        const filteredEvents = this.state.events.filter(e => new Date(e.stop) <= new Date(this.props.time));
        const lastEvent = filteredEvents.pop();
        return lastEvent;
    }

    render()
    {
        const lastEvent = this.findLatest();
        const elem = (lastEvent ? (<Card style={{backgroundColor:'transparent',borderWidth:2, borderColor:'white',borderRadius:10}}>
            <CardBody>
                <CardTitle>
                    Count Up
                </CardTitle>
                    <Row>
                        <Col>Time</Col>
                        <Col>{formatValues(((this.props.time - Date.parse(lastEvent.stop))/1000))}</Col>
                    </Row>
                    <Row>
                        <Col>Event</Col>
                        <Col>{lastEvent.eventId}</Col>
                    </Row>
                    <Row>
                        <Col>Resources</Col>
                        <Col>{lastEvent.resources}</Col>
                    </Row>
                    <Row>
                        <Col>Event End</Col>
                        <Col><Clock format={'YYYY-DDD HH:mm:ss'} date={new Date(lastEvent.stop)} timezone='UTC'/></Col>
                    </Row>
            </CardBody>
        </Card>) : noData());
        return elem; 
    }
    
}

const CountUpEvent = connect(mapStateToProps, null)(ConnectedCountUpEvent);
export default CountUpEvent