import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import '../App.css';
import { Form, Icon, Input, Button, Checkbox } from 'antd';

const FormItem = Form.Item;

class Login extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {

        axios.post('http://localhost:3001/login', values)
        .then(response => {
          console.log(response)
          if(response.data.message == 'connected')
            alert('you are logged in');
          else
            alert('wrong credentials');
        })
        .catch(error => console.log(error));
        
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div id='middlePageDesign'>
        <Form onSubmit={this.handleSubmit} className="login-form">
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
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(Login);
