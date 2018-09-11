//MissionClock file
import React,{Component} from 'react';
import {Modal,ModalHeader,ModalBody,FormGroup,Label,Input,Button,ModalFooter} from 'reactstrap';
import {connect} from 'react-redux';
import {toggleScheduleModal,fetchSchedules,fetchSchedule} from '../actions';

const mapStateToProps = state => {
    return { scheduleModal: state.clock.scheduleModal,
             schedules: state.clock.scheduleList }; 
  }; 
  
  const mapDispatchToProp = dispatch => {
  return {
      toggleScheduleModal: () => {
          dispatch(toggleScheduleModal());
      },
      fetchSchedules: () => {
          dispatch(fetchSchedules());
      },
      loadSchedule: (schedule) => {
          dispatch(fetchSchedule(schedule.replace('*','')));
      }
  };
  };

class ConnectedScheduleFileModal extends Component
{
    constructor(props)
    {
        super(props);
        this.buildOptions = this.buildOptions.bind(this);
        this.loadSchedule = this.loadSchedule.bind(this);
        this.setSelection = this.setSelection.bind(this);
        this.state = {
            selection:null
        }
    }

    componentWillReceiveProps(nextProps)
    {
        let value = '';
        for(let s of nextProps.schedules)
        {
            if(s.startsWith('*'))
            {
                value = s.replace('*','');
                break;
            }
        }
        if(value.length == 0)
        {
            for(let s of nextProps.schedules)
            {
                value = s.replace('*','');
                break;
            }
        }
        this.setState({selection:value});
    }

    setSelection(selection)
    {
        this.setState({selection:selection.target.value});
    }

    loadSchedule()
    {
        this.props.loadSchedule(this.state.selection);
        this.props.toggleScheduleModal();
    }

    buildOptions()
    {
        let scheduleList = [];
        for(let s of this.props.schedules)
        {
            scheduleList.push(<option key={s} value={s.replace('*','')}>{s}</option>);
        }
        return scheduleList;
    }

    render()
    {
        return(
            <Modal isOpen={this.props.scheduleModal} toggle={this.props.toggleScheduleModal} onOpened={() => this.props.fetchSchedules()}>
            <ModalHeader toggle={this.props.toggleScheduleModal}>Import Schedule</ModalHeader>
            <ModalBody>
            <FormGroup>
                <Label for="scheduleSelect">Schedule Select</Label>
                <Input value={this.state.selection} type="select" name="scheduleSelect" id="scheduleSelect" onChange={(selection) => this.setSelection(selection)}>
                    {this.buildOptions()}
                </Input>
                <Label>* denotes latest (default) schedule</Label>
            </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={() => this.loadSchedule()}>Import</Button>{' '}
              <Button color="secondary" onClick={this.props.toggleScheduleModal}>Cancel</Button>
            </ModalFooter>
          </Modal>
        );
    }
}

const ScheduleFileModal = connect(mapStateToProps, mapDispatchToProp)(ConnectedScheduleFileModal); 

export default ScheduleFileModal