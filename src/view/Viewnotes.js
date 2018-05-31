import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import '../App.css';
import _ from 'lodash';
import { Form, Icon } from 'antd';
import { Card, Col, Row } from 'antd';
import notes1 from './Notes1';
import addnotes from './Addnotes';
import { Table, Input, Button, Popconfirm, message } from 'antd';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import axios from 'axios';
const dateFormat = require('dateformat');
const gridStyle = {
    width: '25%',
    textAlign: 'center',
};

class ViewNotes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            notesList: [],
            noNotesToDisplay: false,
        };
    }

    deleteNotes(id) {
        // e.preventDefault();

        console.log(id);

        var tempNotesArr = _.clone(this.state.notesList)

        var index = -1;

        tempNotesArr.map(
            (value, i) => {
                if (value._id == id)
                    index = i
            }
        )

        //removing notes from notesList

        console.log(index)
        if (index > -1) {
            tempNotesArr.splice(index, 1);
        }

        this.setState({ notesList: tempNotesArr })


        axios.delete('http://localhost:3002/deletenotes/' + id)
            .then(res => console.log(res))
        message.success('Successfully Deleted');
    }

    handleClick(id) {
        localStorage.setItem('notesId', id);
    }

    componentWillMount() {

        axios.post('http://localhost:3002/viewnotes')
            .then(res => {
                if (res.data.message.length == 0) {
                    this.setState({ noNotesToDisplay: true })
                }
                else {
                    this.setState({ notesList: res.data.message })

                    console.log(this.state.notesList)
                }
            })
            .catch(err => console.log(err));
    }

    render() {
        return (
            <div>
                {
                    this.state.noNotesToDisplay
                        ?
                        (
                            <div id='middlePageDesignIcon'>

                                <Link to={'/addnotes'}>
                                    <Icon type="plus-circle-o" style={{ fontSize: 150, color: '#08c' }} />
                                </Link>
                                    <h2 style={{ color: '#08c' }}>Click on add icon <br/> to add notes</h2>
                        

                            </div>
                        )
                        :
                        (
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
                                            <Link to={'/notes1'}>
                                                <div onClick={this.handleClick.bind(this, notes._id)}>{notes.title}</div>
                                            </Link>
                                            <Row>
                                                <Col span={9}>
                                                </Col>
                                                <Col span={2}>
                                                    <Popconfirm title="Are you sure delete this notes?" onConfirm={this.deleteNotes.bind(this, notes._id)} okText="Yes">
                                                        <Icon type="delete" style={{ fontSize: 18, color: '#f5222d' }} />
                                                    </Popconfirm>
                                                </Col>

                                                <Col span={2}>
                                                </Col>

                                                <Link to={'/Notes1'}>
                                                    <div onClick={this.handleClick.bind(this, notes._id)}>
                                                        <Col span={2}>
                                                            <Icon type="edit" style={{ fontSize: 18, color: '#08c' }} />
                                                        </Col>
                                                    </div>
                                                </Link>


                                                <Col span={9}>
                                                </Col>
                                            </Row>
                                            {dateFormat(notes.date,"dddd, mmmm dS, yyyy, h:MM")}
                                        </Card.Grid>
                                    </div>
                                )
                            })
                        )
                }
            </div>
        );
    }
}

export default ViewNotes;
