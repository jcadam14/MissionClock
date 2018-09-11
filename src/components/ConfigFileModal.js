
//MissionClock file
import React,{Component} from 'react';
import {Modal,ModalHeader,ModalBody,FormGroup,Label,Input,Button,ModalFooter} from 'reactstrap';
import {connect} from 'react-redux';
import {toggleConfigModal,fetchConfigs,fetchConfig,setUsingDefault} from '../actions';

const mapStateToProps = state => {
    return { configModal: state.clock.configModal,
             configs: state.clock.configList }; 
  }; 
  
  const mapDispatchToProp = dispatch => {
  return {
      toggleConfigModal: () => {
          dispatch(toggleConfigModal());
      },
      fetchConfigs: () => {
          dispatch(fetchConfigs());
      },
      loadConfig: (config,key) => {
          dispatch(setUsingDefault((!key || key.startsWith('*'))));
          console.log('Key: ' + key + ' Config: ' + config);
          console.log('Set using default: ' + (!key || key.startsWith('*')));
          dispatch(fetchConfig(config));
      }
  };
  };

class ConnectedConfigFileModal extends Component
{
    constructor(props)
    {
        super(props);
        this.buildOptions = this.buildOptions.bind(this);
        this.loadConfig = this.loadConfig.bind(this);
        this.setSelection = this.setSelection.bind(this);
        this.state = {
            selection:null,
            key:'*'
        }
    }

    componentWillReceiveProps(nextProps)
    {
        let defaults = {value:'',key:''};
        for(let s of nextProps.configs)
        {
            if(s.startsWith('*'))
            {
                defaults.value = s.replace('*','');
                defaults.key = s;
                break;
            }
        }
        this.setState({selection:defaults.value,key:defaults.key});
    }

    setSelection(selection)
    {
        const key = selection.target.selectedOptions[0].text;
        this.setState({selection:selection.target.value,
                       key:key});
    }

    loadConfig()
    {
        this.props.loadConfig(this.state.selection,this.state.key);
        this.props.toggleConfigModal();
    }

    buildOptions()
    {
        let configList = [];
        for(let s of this.props.configs)
        {
            configList.push(<option key={s} value={s.replace('*','')}>{s}</option>);
        }
        return configList;
    }

    render()
    {
        return(
            <Modal isOpen={this.props.configModal} toggle={this.props.toggleConfigModal} onOpened={() => this.props.fetchConfigs()}>
            <ModalHeader toggle={this.props.toggleConfigModal}>Import Config</ModalHeader>
            <ModalBody>
            <FormGroup>
                <Label for="configSelect">Clock Config Select</Label>
                <Input value={this.state.selection} type="select" name="configSelect" id="configSelect" onChange={(selection) => this.setSelection(selection)}>
                    {this.buildOptions()}
                </Input>
                <Label>* denotes default config</Label>
            </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={() => this.loadConfig()}>Import</Button>{' '}
              <Button color="secondary" onClick={this.props.toggleConfigModal}>Cancel</Button>
            </ModalFooter>
          </Modal>
        );
    }
}

const ConfigFileModal = connect(mapStateToProps, mapDispatchToProp)(ConnectedConfigFileModal); 

export default ConfigFileModal