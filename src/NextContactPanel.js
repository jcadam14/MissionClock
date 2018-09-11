//MissionClock file
import React, { Component } from 'react';
import { Progress } from 'reactstrap';
import { Card, Row, Col, CardBody,CardFooter } from 'reactstrap';
import {connect} from 'react-redux';
import NextTimer from './components/NextTimer';
import Clock from 'react-live-clock';

const mapStateToProps = state => {
    return { nextContact: state.clock.nextContact,
        showContacts: state.clock.showContacts }; 
  }; 

class ConnectedNextContactPanel extends Component
{
    //,position:'absolute',top:'20%',right:'25%'}
    render()
    {
        const nextStyle = {
            width: 300,
            height: 100,
            right: 144,
            top: 72
        };
        return (!this.props.showContacts ? <span/> :
            (this.props.nextContact ? <div style={{color:'white'}}>
                <div style={{color:'#42c0f1'}}>Next Contact</div>
                <div><Card style={{background:'linear-gradient(black, blue)',boxShadow:'10px 10px 5px black'}}>
                    <CardBody className='text-center'>
                    <Row><Col><NextTimer/></Col></Row>
                    <Row>
                        <Col><div><h3>AOS</h3></div></Col>
                        <Col><div><h3><Clock format={'YYYY-DDD HH:mm:ss'} date={new Date(Date.parse(this.props.nextContact.aos))} timezone='UTC'/></h3></div></Col>
                    </Row>
                    <Row>
                        <Col><div><h3>{this.props.nextContact.station}</h3></div></Col>
                        <Col><div><h3>[{this.props.nextContact.terminal}]</h3></div></Col>                        
                    </Row>
                    </CardBody>
                    <CardFooter style={{borderTop:0,backgroundColor:'transparent'}}><Progress style={{height:'2rem',visibility:'hidden'}} /></CardFooter>
                    </Card></div></div> 
                    :
                    <div style={{color:'white'}}>
                    <div style={{color:'#42c0f1'}}>Next Contact</div>
                    <div><Card style={{background:'linear-gradient(black, blue)',boxShadow:'10px 10px 5px black'}}>
                    <CardBody className='text-center'>
                    <h1>No data</h1>
                    </CardBody>
                    </Card></div></div>));
    }
}

const NextContactPanel = connect(mapStateToProps, null)(ConnectedNextContactPanel); 
export default NextContactPanel
