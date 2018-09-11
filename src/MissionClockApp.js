//MissionClock file
import React, { Component } from 'react';
import NextContactPanel from './NextContactPanel';
import CurrentContactPanel from './CurrentContactPanel';
import ConfigMenu from './components/ConfigMenu';
import ScheduleFileModal from './components/ScheduleFileModal';
import ConfigFileModal from './components/ConfigFileModal';
import SaveConfigModal from './components/SaveConfigModal';
import UTCClock from './components/UTCClock';
import LocalClock from './components/LocalClock';
import ElapsedTimer from './components/ElapsedTimer';
import CustomTimers from './components/CustomTimers';
import UpcomingContacts from './components/UpcomingContacts';
import {fetchDefaultConfig, fetchLatestSchedule, fetchIsAdmin, fetchMode, updateTimers, setUsingDefault} from './actions';
import {connect} from 'react-redux';
import {Row, Col, Container,TabPane,TabContent,Nav,NavItem,NavLink,
        Card, CardTitle, CardText, Button, Label} from 'reactstrap';
import classnames from 'classnames';

const formatValues = (seconds) =>
{
    var d = (Math.abs(seconds)/1000);
    var r = {}; 
    var s = {                                                                  // structure
        years: 31536000,
        //month: 2592000,
        //week: 604800, // uncomment row to ignore
        days: 86400,   // feel free to add your own row
        hours: 3600,
        minutes: 60,
        secs: 1
    };
    
    Object.keys(s).forEach(function(key){
        r[key] = Math.floor(d / s[key]);
        d -= r[key] * s[key];
    });

    const hourString = (r.hours > 0 ? r.hours + ' hours, ' : '');
    const minString = (r.minutes > 0 ? r.minutes + ' minutes, ' : '');
    const secString =  r.secs + ' seconds';
    const daysString = (r.days > 0 ? r.days + ' days, ' : '');
    const yearsString = (r.years > 0 ? r.years + ' years, ' : '');
    return ((seconds < 0 ? '- ':'+ ') + yearsString + daysString + hourString + minString + secString);
}

const mapDispatchToProp = dispatch => {
    return {
        fetchData: () => {
            dispatch(setUsingDefault(true));
            dispatch(fetchMode());
            dispatch(fetchIsAdmin());
            dispatch(fetchDefaultConfig());
            dispatch(fetchLatestSchedule());
        },
        updateTimers:() => {
            dispatch(updateTimers());
        }
    };
  }

const mapStateToProps = state => {
    return { 
        useSimTime:state.clock.useSimTime,
        simDiff:state.clock.simDiff,
        mode:state.clock.mode,
        simTimeDiff:state.clock.simTimeDiff
    }
}

const selectedStyle = {borderColor:'white white #000080 white',marginBottom:'-4px',borderWidth:'medium medium 1px medium',color:'white',background:'#000080'}
const unselectedStyle = {borderColor:'white white #000080 white',color:'white',marginBottom:'0px',background:'#000080'}

class ConnectedMissionClockApp extends Component
{
    constructor(props)
    {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab:'clocks',
            clockStyle:selectedStyle,
            upcomingStyle:unselectedStyle
        }
    }


    toggle(tab)
    {
        if(this.state.activeTab !== tab)
        {
            const clockStyle = (tab === 'clocks' ? selectedStyle : unselectedStyle);
            const upcomingStyle = (tab === 'upcoming' ? selectedStyle : unselectedStyle);
            this.setState({activeTab:tab,clockStyle,upcomingStyle});
        }
    }

    componentDidMount()
    {
        this.props.fetchData();
        setInterval(() => this.props.updateTimers(),1000);
    }

    render()
    {
        const simTimeString = (this.props.useSimTime?' (Sim Time: ' + formatValues(this.props.simTimeDiff) + ')':'');
        return (<div>
            <div><ConfigMenu/></div>
            <div>
            <Row><Label/></Row>
            <Nav tabs style={{borderBottomWidth:'medium'}}>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === 'clocks' })}
              onClick={() => { this.toggle('clocks'); }} style={this.state.clockStyle}>
              Mission Clocks/Timers
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === 'upcoming' })}
              onClick={() => { this.toggle('upcoming'); }} style={this.state.upcomingStyle}>
                        Upcoming Contacts
                    </NavLink>
                </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId='clocks'>
                <Container>
            <Row><Col><div style={{color:'white'}}>Mission Clock - {this.props.mode} {simTimeString}</div></Col></Row>
            <Row>
                <Col><CurrentContactPanel/></Col>
                <Col><NextContactPanel/></Col>
            </Row>
            <Row>
                <Col><UTCClock/></Col>
                <Col><LocalClock/></Col>
            </Row>
            <Row>
                <Col/>
                <Col style={{flexGrow:'2'}}><ElapsedTimer/></Col>
                <Col/>
            </Row>
            <Row>
                <Col><CustomTimers/></Col>
            </Row>
            </Container>
                </TabPane>
            <TabPane tabId='upcoming'>
            <UpcomingContacts/>
            </TabPane>
            </TabContent>
            </div>
            <ScheduleFileModal/>
            <ConfigFileModal/>
            <SaveConfigModal/>
        </div>);
    }
}

const MissionClockApp = connect(mapStateToProps, mapDispatchToProp)(ConnectedMissionClockApp);
export default MissionClockApp