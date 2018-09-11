import React,{Component} from 'react';
import Menu from '../configMenu';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import {Button, Label, Input} from 'reactstrap';
import {Navbar} from 'reactstrap';
import {toggleSaveModal,toggleScheduleModal,toggleConfigModal,applyConfigs,setUsingDefault} from '../actions';
import {connect} from 'react-redux';
import {action as toggleMenu} from 'redux-burger-menu';
import DateTime from 'react-datetime';
import moment from 'moment-timezone';
import TimezonePicker from 'react-timezone';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip} from 'reactstrap';
import { FETCH_LATEST_SCHEDULE } from '../constants/action-types';

const getTimezones = () =>
{
  const zones = moment.tz.names();
  const zoneOptions = [];
  for(let z of zones)
  {
    zoneOptions.push(<option key={z} value={z}>{z}</option>);
  }
  return zoneOptions;
}

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

const mapStateToProps = state => {
  return { menuOpen: state.burgerMenu.isOpen,
           showLocalTime: state.clock.showLocalTime,
           showUTCTime: state.clock.showUTCTime,
           scheduleAutoLoad: state.clock.scheduleAutoLoad,
           useSimTime: state.clock.useSimTime,
           showElapsedTime: state.clock.showElapsedTime,
           showContacts: state.clock.showContacts,
           showCustomTimers: state.clock.showCustomTimers,
           simTimeDiff: state.clock.simTimeDiff,
           timezone:state.clock.timezone }; 
}; 

const mapDispatchToProp = dispatch => {
return {
    toggleScheduleModal: () => {
        dispatch(toggleScheduleModal());
    },
    toggleConfigModal: () => {
      dispatch(toggleConfigModal());
    },
    toggleSaveModal: () => {
      dispatch(toggleSaveModal());
    },
    applyConfigs: (configValues) => {
      dispatch(setUsingDefault(false));
      dispatch(applyConfigs(configValues));
    },
    closeMenu: () => {
      dispatch(toggleMenu(false));
    }
};
};


var styles = {
    bmBurgerButton: {
      position: 'absolute',
      width: '36px',
      height: '30px',
      right: '36px',
      top: '10px'
    },
    bmBurgerBars: {
      background: '#373a47'
    },
    bmCrossButton: {
      height: '24px',
      width: '24px'
    },
    bmCross: {
      background: '#bdc3c7'
    },
    bmMenu: {
      background: '#373a47',
      padding: '2.5em 1.5em 0',
      fontSize: '1.0em'
    },
    bmMorphShape: {
      fill: '#373a47'
    },
    bmItemList: {
      color: '#b8b7ad',
      padding: '0.8em'
    },
    bmItem: {
      display: 'inline-block'
    },
    bmOverlay: {
      background: 'rgba(0, 0, 0, 0.3)'
    }
  }  

class ConnectedConfigMenu extends Component
{
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.grabData = this.grabData.bind(this);
    this.validateData = this.validateData.bind(this);
    this.state = {
      dropdownOpen: false,
      showLocal: this.props.showLocalTime,
      showContacts: this.props.showContacts,
      showElapsed: this.props.showElapsedTime,
      showUTC: this.props.showUTCTime,
      showCustomTimers: this.props.showCustomTimers,
      autoload: this.props.scheduleAutoLoad,
      useSim: this.props.useSimTime,
      simTime: null,
      timezone:this.props.timezone,
      tooltipOpen:false
    };
  }

    showSettings (event) {
        event.preventDefault();
      }

      toggle() {
        this.setState({
          dropdownOpen: !this.state.dropdownOpen
        });
      }

      grabData(){
        let offset = this.props.simTimeDiff;
        if(this.state.simTime && this.state.useSim)
        {
          offset = (this.state.simTime - new Date());
        }
        const appliedProps = {
          showLocalTime: this.state.showLocal,
          showUTCTime: this.state.showUTC,
          showElapsedTime: this.state.showElapsed,
          showContacts: this.state.showContacts,
          showCustomTimers: this.state.showCustomTimers,
          useSimTime: this.state.useSim,
          scheduleAutoLoad: this.state.autoload,
          simTimeDiff: offset,
          timezone:this.state.timezone
        }
        this.props.closeMenu();
        return appliedProps;
      }

    componentWillReceiveProps(nextProps)
    {
      console.log('Showing config props ');
      console.log(nextProps);
      const newState = {showLocal:nextProps.showLocalTime,
                      showUTC:nextProps.showUTCTime,
                      showElapsed:nextProps.showElapsedTime,
                      showContacts:nextProps.showContacts,
                      showCustoms:nextProps.showCustomTimers,
                      useSim:nextProps.useSimTime,
                      autoload:nextProps.scheduleAutoLoad,
                      timezone:nextProps.timezone};
      this.setState(newState);
    }

    validateData()
    {
        let errorMessage = null;

            if(this.state.useSim)
            {
              if(this.state.useSim && isNaN(this.state.simTime))
              {
                  errorMessage = 'Sim Time must be in the format YYYY:DDD HH:mm:ss'
              }
            }
        return errorMessage;
    }

    render(){
      const message = this.validateData();
      const toolTip = (message ?
          <div><Label style={{fontSize:'small',color:'red'}}>
        {message}
      </Label></div> : <span/>)
      const simComponent = (this.state.useSim ? 
        <div className="simTime"><Label>Sim Time</Label>
        <DateTime onChange={(datetime) => {this.setState({simTime:datetime})}}
                  utc={true} 
                  dateFormat="YYYY:DDD" timeFormat="HH:mm:ss" /></div>:<span/>);
      const diffLabel = (this.state.useSim ? 
        <div className="diffLabel"><h6>Previously saved sim time offset of {formatValues(this.props.simTimeDiff)} will be applied unless changed below.</h6></div>:
        <span/>
      );
        return(
            <div><Navbar color="light" light>
            <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle caret>
          File
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick={this.props.toggleScheduleModal}>Import Schedule</DropdownItem>
          <DropdownItem divider />
          <DropdownItem onClick={this.props.toggleConfigModal}>Import Configuration</DropdownItem>
          <DropdownItem onClick={this.props.toggleSaveModal}>Save Configuration</DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>
        </Navbar>
        <Menu right slide styles={styles} isOpen={this.props.menuOpen}>
                <div className="toggleGroup">
                    <div className="localToggle">
                    <Toggle
                            id='local-time'
                            checked={this.state.showLocal}
                            onChange={() => {this.setState({showLocal:!this.state.showLocal})}}/>
                            <span>Local Time</span>
                    </div>
                    <div className="utcToggle">
                    <Toggle
                            id='utc-time'
                            checked={this.state.showUTC}
                            onChange={() => {this.setState({showUTC:!this.state.showUTC})}}/>
                            <span>UTC Time</span>
                    </div>
                    <div className="elapsedToggle">
                    <Toggle
                            id='elapsed-time'
                            checked={this.state.showElapsed}
                            onChange={() => {this.setState({showElapsed:!this.state.showElapsed})}}/>
                            <span>Mission Elapsed Time</span>
                    </div>
                    <div className="contactsToggle">
                    <Toggle
                            id='contacts'
                            checked={this.state.showContacts}
                            onChange={() => {this.setState({showContacts:!this.state.showContacts})}}/>
                            <span>Current/Next Contacts</span>
                    </div>
                    <div className="customToggle">
                    <Toggle
                            id='customTimers'
                            checked={this.state.showCustomTimers}
                            onChange={() => {this.setState({showCustomTimers:!this.state.showCustomTimers})}}/>
                            <span>Custom Timers</span>
                    </div>
                    <div className="autoloadToggle">
                    <Toggle
                            id='autoload'
                            checked={this.state.autoload}
                            onChange={() => {this.setState({autoload:!this.state.autoload})}}/>
                            <span>Schedule Autoload</span>
                    </div>
                    <div className="simTimeToggle">
                    <Toggle
                            id='simToggle'
                            checked={this.state.useSim}
                            onChange={() => {this.setState({useSim:!this.state.useSim,simTime:null})}}/>
                            <span>Use Sim Time</span>
                    </div>
                    {diffLabel}
                    {simComponent}
                </div>
                <div>
                  <Label>Timezone</Label>
                  <Input type="select" name="select" id="timezoneSelect" value={this.state.timezone} 
                        onChange={(selection) => {this.setState({timezone:selection.target.value})}}>
                        {getTimezones()}
                  </Input>
                </div>
                <div/>
                <div className="applyButton" style={{margin:2}}><Button className='text-center' disabled={(message?true:false)} id='ApplyButton' onClick={() => this.props.applyConfigs(this.grabData())}>Apply</Button>
                  {toolTip}
                </div>
            </Menu>
            </div>
        );
    }
}

const ConfigMenu = connect(mapStateToProps, mapDispatchToProp)(ConnectedConfigMenu); 
export default ConfigMenu;