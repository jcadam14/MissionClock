import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {connect} from 'react-redux';
import CurrentTimer from './components/CurrentTimer';
import { Progress } from 'reactstrap';
import { Card, Row, Col, CardBody, CardFooter, Label} from 'reactstrap';
import Clock from 'react-live-clock';

const mapStateToProps = state => {
    return { currentContact: state.clock.currentContact,
             showContacts: state.clock.showContacts,
             time: state.clock.date
            }; 
  }; 

  const formatValues = (secondsRemaining) =>
  {
      var d = secondsRemaining;
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

const calcProgress = (currentContact,time) =>
{
    return (((time - currentContact.aosTime)  / (currentContact.losTime - currentContact.aosTime)) * 100);
}

class ConnectedCurrentContactPanel extends Component
{
    constructor(props)
    {
        super(props);
        this.generateLabels = this.generateLabels.bind(this);
    }

    generateLabels()
    {
        let labels = {label:'',percentDone:0,barClasses:"progress-bar progress-bar-striped progress-bar-animated"};
        if(this.props.time && this.props.currentContact)
        {
            if(this.props.time <= this.props.currentContact.losTime)
            {
                labels.label = formatValues(((this.props.time - this.props.currentContact.aosTime)/1000));
                labels.percentDone = (calcProgress(this.props.currentContact,this.props.time) + '%');
            }
            else
            {
                labels.label = formatValues(((this.props.currentContact.losTime - this.props.currentContact.aosTime)/1000));
                labels.percentDone = '100%';
                labels.barClasses = "progress-bar progress-bar-striped";
            }
        }
        return labels;
    }

    // style={{position:'absolute',top:'20%',left:'15%'}}
    render()
    {
        let title = "";
        if(this.props.currentContact)
        {
            title = (this.props.currentContact.losTime < this.props.time?'Previous Contact':'Current Contact');
        }
        const paddingStyle = {
            padding: 5
        };
        const labels = this.generateLabels();
        const elem = (!this.props.showContacts ? <span/> :
        (this.props.currentContact ?
            <div style={{color:'white'}}>
            <div style={{color:'#42c0f1'}}>{title}</div>
            <div><Card style={{background:'linear-gradient(black, blue)',boxShadow:'10px 10px 5px black'}}>
                <CardBody className='text-center'>
                    <CurrentTimer/>
                    <Row>
                        <Col><div><h3>LOS</h3></div></Col>
                        <Col><div><h3><Clock format={'YYYY-DDD HH:mm:ss'} date={new Date(this.props.currentContact.losTime)} timezone='UTC'/></h3></div></Col>
                    </Row>
                    <Row>
                        <Col><div><h3>{this.props.currentContact.station}</h3></div></Col>
                        <Col><div><h3>[{this.props.currentContact.terminal}]</h3></div></Col>                        
                    </Row>
                </CardBody>
                <CardFooter style={{borderTop:0,backgroundColor:'transparent'}}>
                <div className="progress position-relative" style={{height:'2rem', fontSize:'2rem'}}>
    <div className={labels.barClasses} role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style={{width:labels.percentDone}}>
    <small className="justify-content-center d-flex position-absolute w-100">{labels.label}</small>
    </div>
  </div>
                </CardFooter>
                </Card></div></div>:
                <div style={{color:'white'}}>
                <div style={{color:'#42c0f1'}}>Previous Contact</div>
                <div><Card style={{background:'linear-gradient(black, blue)',boxShadow:'10px 10px 5px black'}}>
                <CardBody className='text-center'>
                <h1>No data</h1>
                </CardBody>
                </Card></div></div>));
        return elem;
    }
}

const CurrentContactPanel = connect(mapStateToProps, null)(ConnectedCurrentContactPanel);    
export default CurrentContactPanel