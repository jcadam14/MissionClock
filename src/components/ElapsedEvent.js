import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Button, Label, Row, Col, Card, CardBody,CardText, CardTitle, Input} from 'reactstrap';
import Clock from 'react-live-clock';
import { types } from 'util';

const mapStateToProps = state => {
    return { time: state.clock.date }; 
  };

const noData = () => {
    return (<Card style={{backgroundColor:'transparent',borderWidth:2, borderColor:'white',borderRadius:10}}>
        <CardBody>
        <CardTitle>
            Elapsed
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

class ConnectedElapsedEvent extends Component
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
        const filteredEvents = this.state.events.filter(e => (new Date(e.start) <= new Date(this.props.time) &&
                                                              new Date(e.stop) >= new Date(this.props.time)));
        const currentEvent = filteredEvents.pop();
        return currentEvent;
    }

    render()
    {
        const currentEvent = this.findLatest();
        const elem = (currentEvent ? (<Card style={{backgroundColor:'transparent',borderWidth:2, borderColor:'white',borderRadius:10}}>
            <CardBody>
                <CardTitle>
                    Elapsed
                </CardTitle>
                    <Row>
                        <Col>Time</Col>
                        <Col>{formatValues(((this.props.time - new Date(currentEvent.start))/1000))}</Col>
                    </Row>
                    <Row>
                        <Col>Event</Col>
                        <Col>{currentEvent.eventId}</Col>
                    </Row>
                    <Row>
                        <Col>Resources</Col>
                        <Col>{currentEvent.resources}</Col>
                    </Row>
                    <Row>
                        <Col>Event Start</Col>
                        <Col><Clock format={'YYYY-DDD HH:mm:ss'} date={new Date(currentEvent.start)} timezone='UTC'/></Col>
                    </Row>
            </CardBody>
        </Card>) : noData());
        return elem; 
    }
    
}

const ElapsedEvent = connect(mapStateToProps, null)(ConnectedElapsedEvent);
export default ElapsedEvent