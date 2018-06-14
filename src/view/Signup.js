import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import '../App.css';
import axios from 'axios';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, message } from 'antd';
const FormItem = Form.Item;

class Signup extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {

                if(values.password === values.confirmPassword){

                axios.post('http://localhost:3002/checkemailid', { emailId: values.emailId })
                    .then(res => {


                        if (res.data.message == 'already')
                            message.warn('Email ID is already registered please enter new Email ID');
                        else if (res.data.message == 'not there') {
                            axios.post('http://localhost:3002/createaccount', values)
                                .then(response => console.log(response))
                                .catch(error => console.log(error));
                            message.success('Signed Up successfully!')
                            this.props.history.push('/')
                        }

                    })
                    .catch(
                        res => {
                            message.error('error: ',res.data.message)
                        }
                    )
            }
            else
                message.warn('Your password and confirm password is not matching')
        }

        
        }
    );
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
                            rules: [ { required: true, message: 'Please input your email!' }],
                        })(
                            <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} type='email' placeholder="Email" />
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
                        {getFieldDecorator('confirmPassword', {
                            rules: [{ required: true, message: 'Please confirm your Password!' }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder=" Confirm Password" />
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
