import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import { Avatar } from 'antd';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import Signup from './Signup'
import { Row, Col } from 'antd';

const FormItem = Form.Item;

class App extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (

      <Form onSubmit={this.handleSubmit} className="login-form">
        <center><Avatar src="http://www.sitepronews.com/wp-content/uploads/2013/06/Any.DO-Logo-e1370535243254.png" size="large" shape="square" /></center>
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
            Log in
          </Button>
          <center>OR</center>
          <Button className="login-form-button">
            Sign in with <Icon type="twitter" />
          </Button>
          <Button type="primary" className="login-form-button">Signup now</Button>
        </FormItem>
      </Form>

    );
  }
}


export default Form.create()(App);
