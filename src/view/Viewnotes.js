import React from 'react';
import '../App.css';
import _ from 'lodash';
import { Card, Col, Row } from 'antd';
import { Icon, Popconfirm, message } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Moment from 'react-moment';
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
            .catch(
                res => {
                    message.error('error: ', res.data.deleteNotes)
                }
            )
        message.success('Successfully Deleted');
    }


    componentWillMount() {

        axios.get('http://localhost:3002/viewnotes')
            .then(res => {
                if (res.data.message.length == 0) {
                    this.setState({ noNotesToDisplay: true })
                }
                else {
                    this.setState({ notesList: res.data.message })

                    console.log(this.state.notesList)
                }
            })


    }

    render() {
        return (
            <div>
                {
                    this.state.noNotesToDisplay
                        ?
                        (
                            <div id='middlePageDesignIcon'>

                                <Link to={'/addnote'}>
                                    <Icon type="plus-circle-o" style={{ fontSize: 150, color: '#08c' }} />
                                </Link>
                                <div id='middlePageDesignIconText'>
                                    <h2 style={{ color: '#08c' }}>Click on add icon to add notes</h2>
                                </div>

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
                                            {notes.title}
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

                                                <Link to={`/viewnote/${notes._id}/view`}>
                                                        <Col span={2}>
                                                            <Icon type="edit" style={{ fontSize: 18, color: '#08c' }} />
                                                        </Col>
                                                </Link>

                                                
                                                <Col span={9}>
                                                </Col>
                                            </Row>

                                            <Row>
                                                {
                                                    (this.state.notesList[index].createdAt === this.state.notesList[index].updatedAt)
                                                        ?
                                                        (
                                                            // <div> Created At : {dateFormat(this.state.notesList[index].createdAt, 'dddd, mmmm dS, yyyy, h:MM')}</div>
                                                            <div> Created At : {<Moment fromNow>{this.state.notesList[index].createdAt}</Moment>}</div>
                                                        )
                                                        :
                                                        (
                                                            <div> Updated At : {<Moment fromNow>{this.state.notesList[index].updatedAt}</Moment>}</div>
                                                            // <div> Updated At : {dateFormat(this.state.notesList[index].updatedAt, 'dddd, mmmm dS, yyyy, h:MM')}</div>
                                                        )
                                                }
                                            </Row>

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
