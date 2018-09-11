import React,{Component} from 'react';
import {Modal,ModalHeader,ModalBody,FormGroup,Label,Input,Button,ModalFooter,CustomInput} from 'reactstrap';
import {connect} from 'react-redux';
import {toggleSaveModal,fetchConfigs,saveConfig} from '../actions';

const mapStateToProps = state => {
    return { saveModal: state.clock.saveModal,
             configs: state.clock.configList,
             showLocalTime: state.clock.showLocalTime,
             showUTCTime: state.clock.showUTCTime,
             scheduleAutoLoad: state.clock.scheduleAutoLoad,
             useSimTime: state.clock.useSimTime,
             showElapsedTime: state.clock.showElapsedTime,
             showContacts: state.clock.showContacts,
             showCustomTimers: state.clock.showCustomTimers,
             simTimeDiff: state.clock.simTimeDiff,
             missionStartTime: state.clock.missionStartTime,
             customTimers: state.clock.customTimers,
             timezone: state.clock.timezone,
             isAdmin: state.clock.isAdmin,
             isChecked: false }; 
  }; 
  
  const mapDispatchToProp = dispatch => {
  return {
      toggleSaveModal: () => {
          dispatch(toggleSaveModal());
      },
      fetchConfigs: () => {
          dispatch(fetchConfigs());
      },
      saveConfig: (config, data) => {
          dispatch(saveConfig(config, data));
      }
  };
  };

class ConnectedSaveConfigModal extends Component
{
    constructor(props)
    {
        super(props);
        this.buildOptions = this.buildOptions.bind(this);
        this.saveConfig = this.saveConfig.bind(this);
        this.grabData = this.grabData.bind(this);
        this.setSelection = this.setSelection.bind(this);
        this.defaultFile = '';
        this.state = {
            selection:null,
            saveDefault:false
        }
    }

    setSelection(selection)
    {
        this.setState({selection:selection.target.value});
    }

    saveConfig()
    {
        const file = (this.state.saveDefault ?  this.defaultFile : this.state.selection);
        this.props.saveConfig(file, this.grabData());
        this.props.toggleSaveModal();
    }

    grabData(){
        let appliedProps = {
          showLocalTime: this.props.showLocalTime,
          showUTCTime: this.props.showUTCTime,
          showElapsedTime: this.props.showElapsedTime,
          showContacts: this.props.showContacts,
          showCustomTimers: this.props.showCustomTimers,
          useSimTime: this.props.useSimTime,
          scheduleAutoLoad: this.props.scheduleAutoLoad,
          simTimeDiff: this.props.simTimeDiff,
          missionStartTime: this.props.missionStartTime,
          timezone: this.props.timezone
        }
        if(this.props.showCustomTimers)
        {
            const timerCopy = this.props.customTimers.slice();
            for(let t of timerCopy)
            {
                delete t.key;
            }
            appliedProps = {...appliedProps, customTimers:[...timerCopy]};
        }
        return appliedProps;
      }

    buildOptions()
    {
        let configList = [<option key='empty'/>];
        for(let s of this.props.configs)
        {
            if(!s.startsWith('*'))
            {
                configList.push(<option key={s} value={s}>{s}</option>);
            }
            else
            {
                this.defaultFile = s.replace('*','');
            }
        }
        return configList;
    }

    render()
    {
        const defaultElem = (this.props.isAdmin ? 
        <CustomInput type="checkbox" id="saveDefault" label="Save as Default Config" onChange={() => this.setState({saveDefault:!this.state.saveDefault})} />
         : <span/>);
         const fileElems = (this.state.saveDefault ? <div/> : <div><Label for="configSelect">Clock Config Select</Label>
         <Input type="select" name="configSelect" id="configSelect" onChange={(selection) => this.setSelection(selection)}>
             {this.buildOptions()}
         </Input>
         <Label>Save Config Name: </Label><Input value={this.state.selection} type="text" onChange={(selection) => this.setSelection(selection)}/>
         </div>);
         const allowSave = (this.state.saveDefault || this.state.selection);
        return( 
            <Modal isOpen={this.props.saveModal} toggle={this.props.toggleSaveModal} onOpened={() => this.props.fetchConfigs()}>
            <ModalHeader toggle={this.props.toggleSaveModal}>Save Current Config</ModalHeader>
            <ModalBody>
            <FormGroup>
                {fileElems}
                {defaultElem}
            </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button disabled={!allowSave} color="primary" onClick={() => this.saveConfig()}>Save</Button>{' '}
              <Button color="secondary" onClick={this.props.toggleSaveModal}>Cancel</Button>
            </ModalFooter>
          </Modal>
        );
    }
}

const SaveConfigModal = connect(mapStateToProps, mapDispatchToProp)(ConnectedSaveConfigModal); 

export default SaveConfigModal