import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import '../App.css';

import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';
const FormItem = Form.Item;

class Signup extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {

                axios.post('http://localhost:3001/signup', values) 
                .then(response => console.log(response))
                .catch(error => console.log(error));
            }
        });
    }
    
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div id="middlePageDesign">
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <FormItem>
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: 'Please input your Name!' }],
                        })(
                            <Input prefix={<Icon type="smile-o" style={{ color: 'rgba(0,0,0,.25)' }} />} type="text" placeholder="Name" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('emailId', {
                            rules: [{ required: true, message: 'Please input your email!' }],
                        })(
                            <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} type="email" placeholder="Email" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('userName', {
                            rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                        )}
                    </FormItem>

                    <FormItem>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Sign Up
                        </Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

export default Form.create()(Signup);
