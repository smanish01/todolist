import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';
const FormItem = Form.Item;

class Addnotes extends React.Component {
    constructor(props) {
        super(props);
        this.state = { values: [], notes: '' };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    createUI() {
        return this.state.values.map((el, i) =>
            <div key={i}>
                <input type="text" value={el || ''} onChange={this.handleChange.bind(this, i)} />
                <input type='button' value='remove' onClick={this.removeClick.bind(this, i)} />
            </div>
        )
    }

    handleChange(i, event) {
            let values = [...this.state.values];
            values[i] = event.target.value;
            this.setState({ values });
    }

    addnotestitle(event)
    {
        this.setState({notes: event.target.value})
    }

    addClick() {
        this.setState(prevState => ({ values: [...prevState.values, ''] }))
    }

    removeClick(i) {
        let values = [...this.state.values];
        values.splice(i, 1);
        this.setState({ values });
    }

    handleSubmit(event) {
        alert('notes title: ' + this.state.notes + ' and task submitted' + this.state.values.join(', '));
        event.preventDefault();
    }

    render() {
        return (
            <div id='middlePageDesign'>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" value={this.state.value} onChange={this.addnotestitle.bind(this)} placeholder="Note's title" required />
                    <br />
                    {this.createUI()}
                    <input type="button" value="add task" onClick={this.addClick.bind(this)} />
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}

export default Form.create()(Addnotes);