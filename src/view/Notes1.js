import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import '../App.css';
import _ from 'lodash';
import { Form, Icon } from 'antd';
import axios from 'axios';


class Notes1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = { values: [], DeletedContent: [] };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {

        axios.post('http://localhost:3002/notes1', { notesId: localStorage.getItem('notesId') })
            .then(res => {
                console.log('con here', res.data.message)
                this.setState({ values: res.data.message })
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
                Enter task here: <input type="checkbox" style={{ margin: '10px' }} checked={el.isChecked} onChange={this.handleCheckBox.bind(this, i)} />
                <input value={el.content} type="text" onChange={this.handleChange.bind(this, i)} />
                <Icon type='minus-circle-o' onClick={this.removeClick.bind(this, i, el._id)} style={{ fontSize: 20, color: '#08c' }} />
            </div>
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

    removeClick(i,id) {
     
        //old content id is saved in deletedcontent to delete further
        if (id) {
            let values = _.clone(this.state.values);
            values.splice(i, 1);
            this.setState({ values });
            
            let deleteArr = _.clone(this.state.DeletedContent);
            deleteArr.push(id)
            this.setState(prevState => ({DeletedContent : deleteArr}))


            
        }
        
           //new content can be deleted
        else
        {
            let values = _.clone(this.state.values);
            values.splice(i, 1);
            this.setState({ values });
        }

    }

    handleSubmit(event) {
        event.preventDefault();

        var noteObj = {
            values: this.state.values,
            notesID: localStorage.getItem('notesId')
        }

        console.log(this.state.DeletedContent)

        axios.post('http://localhost:3002/updatenotes', noteObj)
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }

    render() {
        return (
            <div id='middlePageDesign'>
                <form onSubmit={this.handleSubmit} >
                    <br />
                    {this.createUI()}
                    <div id='addFormButtons'>
                        <input type="button" value="add task" onClick={this.addClick.bind(this)} />
                        <input type="submit" value="Submit" />
                    </div>
                </form>
            </div>
        );
    }
}

export default Form.create()(Notes1);