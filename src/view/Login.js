import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import { Form, Icon, Input, Button, message } from 'antd';
const FormItem = Form.Item;

class Login extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /* testing purpose
  getData(){
    fetch('http://localhost:3002/hello?' + Date.now(),{
      credentials: "same-origin"
    })
    .then(response => {
      console.log(response)      
    })
    .catch(error => console.log(error));
  }
  */

  // handleSubmit(e){
  //   e.preventDefault();
  //   this.props.form.validateFields((err, values) => {
  //     if (!err) {

  //       postData('http://localhost:3002/login', values)
  // // .then(data => console.log(data)) // JSON from `response.json()` call
  // // .catch(error => console.error(error))
  //       // window.request({url:'http://localhost:3002/login', data:values, withCredentials: true,method: 'post'})
  //         .then(response => {

  //           console.log(response)
  //           if (response.message == 'connected')
  //             alert('you are logged in');
  //           if(response.message == 'wrong credentials')
  //             alert('please enter correct credentials');
  //         })
  //         .catch(error => console.log(error));

  //     }
  //   });
  // }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {

        axios.post('http://localhost:3002/login', values)
          .then(response => {
            if (response.data.message == 'connected') {
              message.success('you are logged in');
              // alert('you are logged in');
              // console.log('before updatelog')
              // console.log('here is this props his',this.props.history);
              this.props.updateLog(true);
              // console.log('after updatelog')
              // console.log('here is this props his',this.props);

              this.props.history.push('/viewnote');

            }
            if (response.data.message == 'wrong credentials')
              message.error('please enter correct credentials')
          })
          .catch(
            res => {
              message.error('error: ', res.data.message)
            }
          )

      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div id='middlePageDesign'>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem>
            {getFieldDecorator('emailId', {
              rules: [{ required: true, message: 'Please input your email!' }],
            })(
              <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} type="email" placeholder="Email" />
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
              Log In
          </Button>
          </FormItem>
          <FormItem>
            <a href="/auth/twitter">
              <Button className="login-form-button">
                Sign In with <Icon type='twitter' />
              </Button>
            </a>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(Login);

// export default withRouter(Login)



// function postData(url, data) {
//   // Default options are marked with *
//   return fetch(url, {

//     body: JSON.stringify(data), // must match 'Content-Type' header
//     cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//     credentials: 'same-origin', // include, same-origin, *omit
//     headers: {
//       'user-agent': 'Mozilla/4.0 MDN Example',
//       'content-type': 'application/json'
//     },
//     method: 'POST', // *GET, POST, PUT, DELETE, etc.
//     mode: 'cors', // no-cors, cors, *same-origin
//     redirect: 'follow', // manual, *follow, error
//     referrer: 'no-referrer', // *client, no-referrer
//   })
//   //.then(response => response.json()) // parses response to 
// }