import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import '../App.css';
import _ from 'lodash';
import { Form, Icon, Button, Input, Checkbox, Row, Col, message } from 'antd';
import axios from 'axios';
const FormItem = Form.Item;

class Notes1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = { values: [], deletedContent: [], notes: '' };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {

        console.log(localStorage.getItem('notesId'))
        axios.post('http://localhost:3002/notes1/' + localStorage.getItem('notesId'))
            .then(res => {
                console.log('con here', res.data.message)
                console.log('notes title here', res.data.message1.title);
                this.setState({ values: res.data.message, notes: res.data.message1.title })
            })
            .catch(err => console.log(err));

    }


    // createNotes() {
    //     return this.state.contentList.map((content, i) =>
    //         <div key={i}>
    //             Enter task here: <input type="checkbox" style={{ margin: '10px' }} checked={content.isChecked} onChange={this.handleCheckBox.bind(this, i)} />
    //             <input type="text" value={content.content} onChange={this.handleChange.bind(this, i)} />
    //             <Icon type='minus-circle-o' onClick={this.removeClick.bind(this, i)} style={{ fontSize: 20, color: '#08c' }} />
    //         </div>
    //     )
    // }


    createUI() {
        return this.state.values.map((el, i) =>

            <div key={i}>

                <FormItem>

                    <Row>
                        <Col span={1}><Checkbox checked={el.isChecked} onChange={this.handleCheckBox.bind(this, i)}>
                        </Checkbox></Col>
                        <Col span={1}> </Col>
                        <Col span={22}><Input type="text" value={el.content}
                            onChange={this.handleChange.bind(this, i)}
                            placeholder='Enter Task here'
                            suffix={<Icon type='minus-circle-o'
                                onClick={this.removeClick.bind(this, i,el._id)} style={{ fontSize: 20, color: '#08c' }} />} />
                        </Col>
                    </Row>



                </FormItem>
            </div>

            // <div key={i}>
            //     Enter task here: <input type="checkbox" style={{ margin: '10px' }} checked={el.isChecked} onChange={this.handleCheckBox.bind(this, i)} />
            //     <input value={el.content} type="text" onChange={this.handleChange.bind(this, i)} />
            //     <Icon type='minus-circle-o' onClick={this.removeClick.bind(this, i, el._id)} style={{ fontSize: 20, color: '#08c' }} />
            // </div>
        )
    }

    handleChange(i, event) {
        let values = _.clone(this.state.values);
        values[i].content = event.target.value; /*made change here*/
        this.setState({ values });
    }

    handleCheckBox(i, event) {
        let values = _.clone(this.state.values);
        values[i].isChecked = !values[i].isChecked;
        this.setState({ values });
    }


    addClick() {
        let cloneValue = _.clone(this.state.values)
        cloneValue.push({ content: '', isChecked: false }) /*made change here*/
        this.setState(prevState => ({ values: cloneValue }))
    }

    addnotestitle(event) {
        this.setState({ notes: event.target.value })
    }

    removeClick(i, id) {

        //old content id is saved in deletedcontent to delete further
        if (id) {
            let values = _.clone(this.state.values);
            values.splice(i, 1);
            this.setState({ values });

            let deleteArr = _.clone(this.state.deletedContent);
            deleteArr.push(id)
            this.setState(prevState => ({ deletedContent: deleteArr }))



        }

        //new content can be deleted
        else {
            let values = _.clone(this.state.values);
            values.splice(i, 1);
            this.setState({ values });
        }

    }

    handleSubmit(event) {
        event.preventDefault();

        var validateState = this.validate();


        if (validateState) {

            var noteObj = {
                values: this.state.values,
                notesID: localStorage.getItem('notesId'),
                deletedContent: this.state.deletedContent,
                notesTitle: this.state.notes
            }

            // console.log(this.state.deletedContent)

            axios.put('http://localhost:3002/updatenotes', noteObj)
                .then(res => console.log(res))
                .catch(err => console.log(err))

            message.success('notes updated successfully')
            this.props.history.push('/viewnotes')
        }
        else
            message.warn('please fill all the textboxes')
    }

    validate() {
        var counter = 0;

        this.state.values.map(

            content => {
                console.log(content)
                if (content.content.length == 0)
                    counter++;
            }
        )

        if ((this.state.notes.length > 0) && (counter == 0))
            return true;
        else
            return false;


    }

    handleDelete(event) {
        event.preventDefault();
        console.log(localStorage.getItem('notesId'))
        axios.delete('http://localhost:3002/deletenotes/' + localStorage.getItem('notesId'))
            .then(res => console.log(res))

        message.success('notes deleted successfully')
        this.props.history.push('/viewnotes')
    }

    render() {
        return (
            <div id='middlePageDesign'>
                <Form onSubmit={this.handleSubmit} >
                    <FormItem>
                        <Input type="text" value={this.state.notes} onChange={this.addnotestitle.bind(this)} placeholder="Note's title" />
                    </FormItem>
                    {this.createUI()}
                    <FormItem>
                        <Row>
                            <Col span={11}>
                                <Button onClick={this.addClick.bind(this)} className="login-form-button">Add Task</Button>
                            </Col>
                            <Col span={2}></Col>
                            <Col span={11}>
                                <Button type="primary" htmlType="submit" className="login-form-button">Update</Button>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem>
                        <Button type='danger' onClick={this.handleDelete.bind(this)} className="login-form-button">Delete Notes</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

export default Form.create()(Notes1);