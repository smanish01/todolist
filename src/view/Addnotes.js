import React from 'react';
import '../App.css';
import axios from 'axios';
import _ from 'lodash';
import { Form, Icon, Button, Input, Checkbox, Row, Col, message, Upload, Progress } from 'antd';
const FormItem = Form.Item;

class Addnotes extends React.Component {
    constructor(props) {
        super(props);
        this.state = { values: [], notes: '', selectedFile: null };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validate = this.validate.bind(this);
    }

    uploadFile(e) {

        document.getElementById("hiddeninput").click()
    }

    getFiles(e) {
        e.preventDefault();

        this.setState({ selectedFile: e.target.files })

        message.success('files has been uploaded please submit to complete the process', 5)
    }


    createUI() {
        return this.state.values.map((el, i) =>
            <div key={i}>


                {/* <Input type="checkbox" style={{ margin: '10px' }}
             checked={el.isChecked} onChange={this.handleCheckBox.bind(this, i)} /> */}

                <Row>
                    <Col span={1}>
                        <FormItem><Checkbox onChange={this.handleCheckBox.bind(this, i)}>
                        </Checkbox>
                        </FormItem></Col>
                    <Col span={1}> </Col>
                    <Col span={22}>
                        <FormItem><Input type="text" value={el.content || ''}
                            onChange={this.handleChange.bind(this, i)}
                            placeholder='Enter Task here'
                            suffix={<Icon type='minus-circle-o'
                                onClick={this.removeClick.bind(this, i)} style={{ fontSize: 20, color: '#08c' }} />} />
                        </FormItem>
                    </Col>
                </Row>
            </div>
        )
    }


    handleCheckBox(i, event) {
        let values = _.clone(this.state.values);
        values[i].isChecked = !values[i].isChecked;
        this.setState({ values });
    }

    handleChange(i, event) {
        let values = _.clone(this.state.values);
        values[i].content = event.target.value; /*made change here*/
        this.setState({ values });
    }

    addnotestitle(event) {
        this.setState({ notes: event.target.value })
    }

    addClick() {
        let cloneValue = _.clone(this.state.values)
        cloneValue.push({ content: '' }) /*made change here*/
        this.setState(prevState => ({ values: cloneValue }))
    }

    removeClick(i) {
        let values = _.clone(this.state.values);
        values.splice(i, 1);
        this.setState({ values });
    }

    handleSubmit(event) {
        event.preventDefault();

        var validateState = this.validate();

        // console.log(this.state);

        if (validateState == true) {

            axios.post('http://localhost:3002/addnotes', this.state)
                .then(response => {


                    console.log('add notes id here ->>>>>>>>>>>>>>' + response.data.message)

                    let formData = new FormData();

                    for (var i in this.state.selectedFile) {
                        if (!isNaN(i)) {
                            formData.append('selectedFile', this.state.selectedFile[i]);
                        }
                    }

                    console.log('selectes file here : -----  ', formData)

                    axios.post('http://localhost:3002/fileupload/'+response.data.message, formData)
                        .then((result) => {
                            console.log('imageid result->>>>>>>############$$$$$$$$$$',result.data.message11)
                        })
                        .catch(
                            result => {
                                message.error('error: ', result.data.message11)
                            }
                        )

                })
                .catch(
                    response => {
                        console.log('res here',response.data.message)
                    }
                )
                
            message.success('successfully submitted')

            this.props.history.push('/viewnote');
        }
        else
            message.warn('please fill all the text boxes')

    }

    validate() {
        var counter = 0;

        this.state.values.map(

            content => {
                console.log(content)
                if (content.content.length == 0)
                    counter++;
            }
        )

        if ((this.state.notes.length > 0) && (counter == 0))
            return true;
        else
            return false;


    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div id='middlePageDesign'>
                <Form onSubmit={this.handleSubmit} >
                    <FormItem>
                        <Input type="text" value={this.state.notes} onChange={this.addnotestitle.bind(this)} placeholder="Note's title" />
                    </FormItem>
                    {this.createUI()}

                    <Row>
                        {/* <FormItem>
                            <Col span={11}>

                                <Input type="file" onChange={this.fileChangedHandler.bind(this)} multiple />
                            </Col>
                            <Col span={2}></Col>
                            <Col span={11}>
                                <Button onClick={this.uploadHandler.bind(this)} className="login-form-button">Upload</Button>
                            </Col>
                        </FormItem> */}

                        <FormItem>
                            {/* <Button onClick={this.onSubmit.bind(this)} className="login-form-button">Upload</Button> */}
                            <Button type="primary" onClick={this.uploadFile.bind(this)} className="login-form-button" >
                                <Icon type="upload" />Upload
                                <Input id="hiddeninput" onChange={this.getFiles.bind(this)}
                                    accept='.jpg,.png,.jpeg'
                                    type="file" hidden multiple />
                            </Button>
                        </FormItem>




                    </Row>

                    <FormItem>
                        <Row>
                            <Col span={11}>
                                <Button onClick={this.addClick.bind(this)} className="login-form-button">Add Task</Button>
                            </Col>
                            <Col span={2}></Col>
                            <Col span={11}>
                                <Button type="primary" htmlType="submit" className="login-form-button">Submit</Button>
                            </Col>
                        </Row>
                    </FormItem>

                </Form>
            </div>
        );
    }
}

export default Form.create()(Addnotes);
