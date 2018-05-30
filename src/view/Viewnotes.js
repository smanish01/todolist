import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import '../App.css';
import _ from 'lodash';
import { Form, Icon } from 'antd';
import { Card, Col, Row } from 'antd';
import Notes1 from './Notes1';
import { Table, Input, Button, Popconfirm, message } from 'antd';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import axios from 'axios';
const gridStyle = {
    width: '25%',
    textAlign: 'center',
};

class ViewNotes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            notesList: []
        };
    }



    handleClick(id) {
        localStorage.setItem('notesId', id);
    }

    componentWillMount() {

        axios.post('http://localhost:3002/viewnotes')
            .then(res => {
                this.setState({ notesList: res.data.message })
                message.success('click on notes title to view and edit notes',5);
            })
            .catch(err => console.log(err));
    }

    render() {
        return (
            this.state.notesList.map((notes, index) => {
                return (
                    // <div key={index} style={{ background: '#ECECEC', padding: '30px' }}>
                    //     <Card title={notes.title} bordered={false}><Link to={'/Notes1'}>
                    //         <Button type="primary" onClick={this.handleClick.bind(this, notes._id)}>Click here to view note</Button>
                    //     </Link>
                    //     </Card>

                    // </div>

                    <div key={index}>
                        <Card.Grid style={gridStyle}>
                            <Link to={'/Notes1'}>
                                <div onClick={this.handleClick.bind(this, notes._id)}>{notes.title}</div>
                            </Link>
                        </Card.Grid>
                    </div>
                )
            }
            )

        );
    }
}

export default ViewNotes;
