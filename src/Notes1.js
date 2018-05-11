import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import _ from 'lodash';
import {Form, Icon} from 'antd';


class Viewnotes extends React.Component {
    constructor(props) {
        super(props);
        this.state = { values: []};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    createUI() {
        return this.state.values.map((el, i) =>
            <div key={i}>
                Enter task here: <input type="checkbox"  style={{margin: '10px'}} onChange={this.handleCheckBox.bind(this, i)} />
                <input type="text" onChange={this.handleChange.bind(this, i)} />
                <Icon type='minus-circle-o' onClick={this.removeClick.bind(this, i)}  style={{ fontSize: 20, color: '#08c' }}/>
            </div>
        )
    }

    handleChange(i, event) {
            let values = _.clone(this.state.values);
            values[i].content = event.target.value; /*made change here*/
            this.setState({ values });
    }

    handleCheckBox(i,event){
        let values = _.clone(this.state.values);
        values[i].checked = !values[i].checked;
        this.setState({values});
    }


    addClick() {
        let cloneValue = _.clone(this.state.values)
        cloneValue.push({content: '',checked: false}) /*made change here*/
        this.setState(prevState => ({ values:cloneValue }))
    }

    removeClick(i) {
        let values = _.clone(this.state.values);
        values.splice(i, 1);
        this.setState({ values });
    }

    handleSubmit(event) {
        console.log(this.state);
        event.preventDefault();
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

export default Form.create()(Viewnotes);