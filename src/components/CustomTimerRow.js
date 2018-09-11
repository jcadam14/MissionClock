//MissionClock file
import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Button, Row, Col, Tooltip} from 'reactstrap';
import CountUpEvent from './CountUpEvent';
import CountDownEvent from './CountDownEvent';
import ElapsedEvent from './ElapsedEvent';
import {removeCustomTimer} from '../actions';

const mapStateToProps = state => {
    return {events:state.clock.events}
  }; 

const mapDispatchToProps = dispatch => {
    return {
        removeTimer: (index) => {
            dispatch(removeCustomTimer(index));
        }
    }
}

class ConnectedCustomTimerRow extends Component
{
    constructor(props)
    {
        super(props);
        this.filterList = this.filterList.bind(this);
        this.createTimers = this.createTimers.bind(this);
        this.state = {
            timer:{...this.props.timer},
            eventList:[],
            key: this.props.number,
            tooltipOpen:false
        }
    }

    filterList()
    {
        const eventList = [];
        if(this.state.timer.eventType === this.state.timer.eventId)
        {
            const event = {
                eventType: this.state.timer.eventId,
                eventId: this.state.timer.eventId,
                start: this.state.timer.eventStart,
                stop: this.state.timer.eventEnd,
                resources: this.state.timer.resources
            }
            eventList.push(event);
        }
        else
        {
            const filtered = this.props.events.filter(e => (e.eventType === this.state.timer.eventType));
            eventList.push(...filtered);
        }
        return eventList;
    }

    createTimers()
    {
        const eventList = this.filterList();
        const timers = {
            countUp:(this.state.timer.countUp ? <CountUpEvent events={eventList}/> : <span/>),
            countDown:(this.state.timer.countDown ? <CountDownEvent events={eventList}/> : <span/>),
            elapsed:(this.state.timer.elapsed ? <ElapsedEvent events={eventList}/> : <span/>)
        }
        return timers;
    }

    render()
    {
        const foundTimers = this.createTimers();
        return (<div style={{padding:'5px',color:'white',background:'linear-gradient(black, blue)',boxShadow:'10px 10px 5px black'}}>
            <div><h3>Custom Timer - {this.state.timer.eventType}</h3></div>
            <Row>
                    <Col>{foundTimers.countDown}</Col>
                    <Col>{foundTimers.countUp}</Col>
                    <Col>{foundTimers.elapsed}</Col>
                </Row>
                <Button id='closeTimerButton' style={{background: '0 0 transparent', color:'transparent', border: 'transparent'}} onClick={() => this.props.removeTimer(this.props.timer.key)}><img src='closeButton.png'/></Button>
                <Tooltip placement="right" isOpen={this.state.tooltipOpen} target="closeTimerButton" 
                        toggle={() => this.setState({tooltipOpen: !this.state.tooltipOpen})}>
                    Removes the custom timer.
                </Tooltip>
                </div>);
    }
    
}

const CustomTimerRow = connect(mapStateToProps, mapDispatchToProps)(ConnectedCustomTimerRow);
export default CustomTimerRow