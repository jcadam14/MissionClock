import React, { Component } from 'react';
import {connect} from 'react-redux';
import CustomTimerRow from './CustomTimerRow';
import AddRow from './AddRow';
import Toggle from 'react-toggle';
import TimerCarousel from './TimerCarousel';

const mapStateToProps = state => {
    return {customTimers:state.clock.customTimers,
            showCustomTimers:state.clock.showCustomTimers}
  }; 

class ConnectedCustomTimers extends Component
{
    constructor(props)
    {
        super(props);
        this.buildCustomTimers = this.buildCustomTimers.bind(this);
        this.state = {
            makeList:true
        }
    }

    buildCustomTimers()
    {
        let timerelem = null;
        let timerList = [];
        let index = 0;
        if(this.props.customTimers)
        {
            for(let t of this.props.customTimers)
            {
                timerList.push(<ul><CustomTimerRow key={t.key} timer={t}/></ul>)
            }
        }
        
        return timerList;
    }

    render()
    {
        const addRow = (this.props.customTimers.length < 8 ? <AddRow/>:<span/>);
        const elem = (this.props.showCustomTimers ? <div>
            <div style={{margin:'20px 1em'}}>
            {this.buildCustomTimers()}
            </div>
            {addRow}</div> : <span/>);

        return(
            <div>
                {elem}
            </div>
        )
    }    
}

const CustomTimers = connect(mapStateToProps, null)(ConnectedCustomTimers);
export default CustomTimers