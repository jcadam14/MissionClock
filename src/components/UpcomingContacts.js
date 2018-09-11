//MissionClock file
import React, {Component} from 'react';
import {Table, Row, Label} from 'reactstrap';
import {connect} from 'react-redux';
import 'bootstrap/dist/css/bootstrap.css';
import Clock from 'react-live-clock';

const mapStateToProps = state => {
    return {
            contacts: state.clock.contacts,
            time: state.clock.date
        }
}

class ConnectedUpcomingContacts extends Component
{
    constructor(props)
    {
        super(props);
        this.generateTable = this.generateTable.bind(this)
    }

    generateTable()
    {
        const tableContacts = []
        if(this.props.contacts)
        {
            for(let c of this.props.contacts)
            {
                if(Date.parse(c.aos) > this.props.time)
                {
                    tableContacts.push(
                        <tr>
                            <td>{c.station}</td>
                            <td>{c.terminal}</td>
                            <td><Clock format={'YYYY-DDD HH:mm:ss'} date={new Date(c.aos)}/></td>
                            <td><Clock format={'YYYY-DDD HH:mm:ss'} date={new Date(c.los)}/></td>
                        </tr>
                    );
                }
            }
        }
        return tableContacts;
    }

    render()
    {
        return (<div style={{color:'white'}}>
            <Row><Label/></Row>
            <Table>
                <thead>
                    <tr style={{borderColor:'transparent white'}}>
                        <th>Ground Station</th>
                        <th>Terminal</th>
                        <th>AOS</th>
                        <th>LOS</th>
                    </tr>
                </thead>
                <tbody>
                    {this.generateTable()}
                </tbody>
            </Table>
            </div>
        );
    }
}

const UpcomingContacts = connect(mapStateToProps,null)(ConnectedUpcomingContacts);
export default UpcomingContacts