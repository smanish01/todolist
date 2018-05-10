import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import _ from 'lodash';
import {Form, Icon} from 'antd';


class Addnotes extends React.Component {
    constructor(props) {
        super(props);
        this.state = { values: [], notes: '' };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    createUI() {
        return this.state.values.map((el, i) =>
            <div key={i}>
                Task #{i+1}: <input type="text" value={ el.content || '' } style={{margin: '10px'}} onChange={this.handleChange.bind(this, i)} />
                <Icon type='minus-circle-o' onClick={this.removeClick.bind(this, i)}  style={{ fontSize: 20, color: '#08c' }}/>
            </div>
        )
    }

    handleChange(i, event) {
            let values = _.clone(this.state.values);
            values[i].content = event.target.value; /*made change here*/
            this.setState({ values });
    }

    addnotestitle(event)
    {
        this.setState({notes: event.target.value})
    }

    addClick() {
        let cloneValue = _.clone(this.state.values)
        cloneValue.push({content: ''}) /*made change here*/
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
                    Notes title: <input type="text" value={this.state.value} style={{margin: '10px'}} onChange={this.addnotestitle.bind(this)} placeholder="Note's title" required />
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

export default Form.create()(Addnotes);