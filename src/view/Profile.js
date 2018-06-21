import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import '../App.css';
import { Avatar } from 'antd';
import { Form, Icon, Input, Button, Card, Checkbox, message, Row, Col, Table, Modal } from 'antd';
import axios from 'axios';
import { userInfo } from 'os';
const FormItem = Form.Item;

const ChangePassword = Form.create()(
    class extends React.Component {
        render() {
            const { visible, onCancel, onCreate, form } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Modal
                    visible={visible}
                    title="Change Password"
                    okText="Change Password"
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form layout="vertical">
                        <FormItem label="Current Password">
                            {getFieldDecorator('currentPassword', {
                                rules: [{ required: true, message: 'Please input the current password!' }],
                            })(
                                <Input type="password" />
                            )}
                        </FormItem>
                        <FormItem label="New Password">
                            {getFieldDecorator('newPassword', {
                                rules: [{ required: true, message: 'Please input the new password!' }],
                            })(
                                <Input type="password" />
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            );
        }
    }
);




class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = { userInfo: [], visible: false, }
    }

    showModal() {
        this.setState({ visible: true });
    }
    handleCancel() {
        this.setState({ visible: false });
    }
    handleChangePassword() {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            console.log('Received values of form: ', values);

            console.log(this.state.userInfo)

            var Obj = {
                values: values,
                userInfo: this.state.userInfo
            }

            console.log(Obj)
            axios.post('http://localhost:3002/changepassword', Obj)
                .then(
                    res => {
                        if (res.data.message == 'changed')
                            message.success('password changed successfully')
                        else if (res.data.message == 'not changed')
                            message.warn('something went wrong password not changed')
                        else 
                            message.error('something went wrong')
                    }
                )
                .catch(
                    err => {
                        message.error('error: ',res.data.message)
                    }
                )

            form.resetFields();
            this.setState({ visible: false });
        });
    }
    saveFormRef(formRef) {
        this.formRef = formRef;
    }

    componentWillMount() {
        
        axios.get('http://localhost:3002/userinfo')
            .then(
                res => {

                    console.log('userinfo here - >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.',res.data.message)
                    this.setState({ userInfo: res.data.message })
                }
            )
            .catch(
                res => {
                    message.error('error: ',res.data.message)
                }
            )
    }

    render() {
        return (
            <div id='middlePageDesign'>
                <Card title="User Information">
                    <Row>
                        <Col span={11}>
                            <big>Name</big>
                        </Col>
                        <Col span={2}>
                            :
                    </Col>
                        <Col span={11}>
                            <big>{this.state.userInfo.name}</big>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={11}>
                            <big>User Name</big>
                        </Col>
                        <Col span={2}>
                            :
                    </Col>
                        <Col span={11}>
                            <big>{this.state.userInfo.userName}</big>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={11}>
                            <big>Email Id</big>
                        </Col>
                        <Col span={2}>
                            :
                    </Col>
                        <Col span={11}>
                            <big>{this.state.userInfo.emailId}</big>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={11}>
                            <big>Password</big>
                        </Col>
                        <Col span={2}>
                            :
                    </Col>
                        <Col span={11}>


                            <Button type="primary" onClick={this.showModal.bind(this)}>Change Password</Button>
                            <ChangePassword
                                wrappedComponentRef={this.saveFormRef.bind(this)}
                                visible={this.state.visible}
                                onCancel={this.handleCancel.bind(this)}
                                onCreate={this.handleChangePassword.bind(this)}
                            />


                        </Col>
                    </Row>
                </Card>
            </div>
        );
    }
}

export default Profile;

// export default withRouter(Logout)