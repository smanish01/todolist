import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import '../App.css';
import _ from 'lodash';
import { Form, Icon } from 'antd';
import { Card, Col, Row } from 'antd';
import Notes1 from './Notes1';
import { Table, Input, Button, Popconfirm } from 'antd';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import axios from 'axios';


class ViewNotes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            notesList: []
        };
    }

    handleClick(id)
    {
        console.log(id);
    }

    componentWillMount() {

        axios.post('http://localhost:3002/viewnotes')
            .then(res => {
                this.setState({ notesList: res.data.message })
            })
            .catch(err => console.log(err));
    }

    render() {
        return (
            this.state.notesList.map((notes,i) => {
                console.log(notes)
                return (
                <div key={i} >
                     <Card title={notes.title} bordered={false}>
                     <Button type="primary" onClick={this.handleClick.bind(this, notes_id)}>Click here to view note</Button></Card>
                </div>
                )
            }
            )

        );
    }
}

export default ViewNotes;
