import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import '../App.css';
import { Avatar } from 'antd';
import { Form, Icon, Input, Button, Checkbox,message } from 'antd';
import axios from 'axios';
const FormItem = Form.Item;


class Logout extends React.Component {

    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
    }

    logout(event) {

        event.preventDefault();
        axios.post('http://localhost:3002/logout')
            .then(response => {

                if (response.data.message == 'logged out') {
                    message.success('You are logged out');
                    this.props.updateLog(false);
                    this.props.history.push('/login');
                }
            })
            .catch(error => alert(error));
    }

    render() {
        return (
            <div id='middlePageDesign'>
                <Button type="primary" onClick={this.logout}>Click here to Logout</Button>
            </div>
        );
    }
}

export default Logout;

// export default withRouter(Logout)

