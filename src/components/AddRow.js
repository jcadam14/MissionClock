import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Button, Label, Row, Col, Card, CardBody,Input,Tooltip} from 'reactstrap';
import {Collapse} from 'react-collapse';
import Toggle from 'react-toggle';
import DateTime from 'react-datetime';
import {addCustomTimer} from '../actions';

const mapStateToProps = state => {
    return {eventTypes:state.clock.eventTypes}
  }; 

const mapDispatchToProps = dispatch => {
    return {addTimer: (values) => {
        dispatch(addCustomTimer(values));
    }}
}

const buttonStyle = {
    margin: '20 5 0 5'
}

class ConnectedAddRow extends Component
{
    constructor(props)
    {
        super(props);
        this.buildOptions = this.buildOptions.bind(this);
        this.buildCustomTimer = this.buildCustomTimer.bind(this);
        this.reset = this.reset.bind(this);
        this.validateData = this.validateData.bind(this);
        this.validateTextInput = this.validateTextInput.bind(this);
        this.createInputRenderer = this.createInputRenderer.bind(this);
        this.state = {
            eventOpen:false,
            countUp:false,
            countDown:false,
            elapsed:false,
            eventSelection:'None',
            eventId:'',
            resources:'',
            eventStart:'',
            eventEnd:'',
            valid:false,
            errorMessage:'Must select an event type or provide a custom event ID',
            tooltipOpen:false,
            addTooltipOpen:false
        }
    }

    reset()
    {
        this.setState({eventOpen:false,eventId:'',resources:'',
            eventSelection:'None',eventStart:null,eventEnd:null,countUp:false,countDown:false,elapsed:false});
    }

    buildOptions()
    {
        let typeList = [];
        typeList.push(<option key='None' value='None'>None</option>);
        if(this.props.eventTypes)
        {
            for(let t of this.props.eventTypes)
            {
                typeList.push(<option key={t} value={t}>{t}</option>);
            }
        }
        return typeList;
    }

    buildCustomTimer()
    {
        const values = {
            eventId: this.state.eventId,
            eventType: (this.state.eventSelection === 'None'? this.state.eventId : this.state.eventSelection),
            resources:this.state.resources,
            eventStart: this.state.eventStart,
            eventEnd: this.state.eventEnd,
            countUp: this.state.countUp,
            countDown: this.state.countDown,
            elapsed: this.state.elapsed,
        }
        this.props.addTimer(values);
        this.reset();
    }

    validateData()
    {
        let errorMessage = null;
        if(this.state.eventSelection === 'None' && !this.state.eventId)
        {
            errorMessage = 'Must enter a valid Event ID'
        }
        else if(!this.state.countUp && !this.state.countDown && !this.state.elapsed)
        {
            errorMessage = 'At least one timer type (Count Down, Count Up, Elapsed) must be selected'
        }
        else if(this.state.eventSelection === 'None')
        {
            if((this.state.eventStart && this.state.eventEnd) && (this.state.eventStart <= this.state.eventEnd))
            {
                errorMessage = null;
            }
            else if(isNaN(this.state.eventStart) || isNaN(this.state.eventEnd))
            {
                errorMessage = 'Event start and end times must be in the format YYYY:DDD HH:mm:ss'
            }
            else
            {
                errorMessage = 'Event Start must be equal to or before Event End'
            }
        }
        return errorMessage;
    }

    validateTextInput(data, field) {
        var element = document.getElementById(field);
        element.value = element.value.replace(/[^a-zA-Z]+/, '');
    }

    createInputRenderer(props, openCalendar, closeCalendar){
        const inputProps = {...props, id:'startTime', type:'text', onkeypress:(e) => this.validateTextInput(e, 'startTime')}
        return (
            <input  inputProps />
        );
    }

    render()
    {
        const message = this.validateData();
        const toolTip = (message ?
            <Tooltip placement='right' isOpen={this.state.tooltipOpen} target='ApplyButton' toggle={() => this.setState({tooltipOpen:!this.state.tooltipOpen})}>
          {message}
        </Tooltip> : <span/>)
        const buttonImage = (this.state.eventOpen?'remButton.png':'addButton.png');
        return(
            <div>
                <Button id='addCustomTimer' style={{background: '0 0 transparent', color:'transparent', border: 'transparent'}} onClick={() => this.setState({eventOpen:!this.state.eventOpen})}><img src={buttonImage}/></Button>
                <Tooltip placement="right" isOpen={this.state.addTooltipOpen} target="addCustomTimer" 
                        toggle={() => this.setState({addTooltipOpen: !this.state.addTooltipOpen})}>
                    {(this.state.eventOpen ? 'Hides the Custom Timer entry fields.' : 'Display the Custom Timer fields.')}
                </Tooltip>
                    <Collapse isOpened={this.state.eventOpen}>
                    <Card style={{width:'50%'}}>
                        <CardBody style={{borderStyle:'groove',background:'#C58ADE',borderWidth:3,borderRadius:5}}>
                            <Row>
                                <Col><span>Event Type</span>
                            <div><Input type="select" value={this.state.eventSelection} onChange={(selection) => {this.setState({eventSelection:selection.target.value})}}>
                                {this.buildOptions()}
                            </Input></div>
        {(this.state.eventSelection === 'None'?
            <div>
                <Row>
                    <Col><span>Custom Timer ID</span><Input type='text' value={this.state.eventId} onChange={(event) => {this.setState({eventId:event.target.value})}}/></Col>
                </Row>
                <Row>
                    <Col><span>Resource</span><Input type='text' value={this.state.resources} onChange={(event) => {this.setState({resources:event.target.value})}}/></Col>
                </Row>
                <Row>
                    <Col>
                    <span>Start Time:<DateTime onBlur={(datetime) => {this.setState({eventStart:datetime})}}
                              utc={true} 
                              dateFormat="YYYY:DDD" timeFormat="HH:mm:ss"/></span>
                    </Col>
                    <Col>
                    <span>End Time:<DateTime onBlur={(datetime) => {this.setState({eventEnd:datetime})}}
                              utc={true} 
                              dateFormat="YYYY:DDD" timeFormat="HH:mm:ss"/></span>
                    </Col>
                </Row>
            </div>:
            <span/>)}
            </Col>
            <Col>
                <Row><Col><Label/></Col></Row>
                <Row>
                    <Col>
                <div><Toggle
                            id='countDown'
                            checked={this.state.countDown}
                            onChange={() => {this.setState({countDown:!this.state.countDown})}}/><span>Count Down</span>
                    </div>
                    <div><Toggle
                            id='countUp'
                            checked={this.state.countUp}
                            onChange={() => {this.setState({countUp:!this.state.countUp})}}/><span>Count Up</span>
                    </div>
                    <div><Toggle
                            id='elapsed'
                            checked={this.state.elapsed}
                            onChange={() => {this.setState({elapsed:!this.state.elapsed})}}/><span>Elapsed</span>
                    </div>
                    </Col>
                </Row>
                <Row>
                    <Col><span/><Input type='text' style={{visibility:'hidden'}}/></Col>
                </Row>
                <Row>
                    <div style={{marginTop:45,marginLeft:50}}>
                    <span><Button disabled={(message?true:false)} id='ApplyButton' onClick={() => this.buildCustomTimer()} color='primary' style={{marginRight:5}}>Add</Button>
                    {toolTip}
                    </span>
                    <Button onClick={() => this.reset()}>Cancel</Button>
                    </div>
                </Row>
            </Col>
                    
                </Row>
                        </CardBody>
                    </Card>
                    </Collapse>
                </div>
        )
    }
}

const AddRow = connect(mapStateToProps, mapDispatchToProps)(ConnectedAddRow);
export default AddRow