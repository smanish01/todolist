import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { Form, Icon, Button, Input, Checkbox, Row, Col, message, Card } from 'antd';
import axios from 'axios';
const FormItem = Form.Item;
const gridStyle = {
    width: '50%',
    textAlign: 'center',
};

class Notes1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = { values: [], deletedContent: [], notes: '', notesId: '', imageContentIds: [] };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    uploadFile(e) {

        document.getElementById("hiddeninput").click()

    }

    getFiles(e) {
        e.preventDefault();

        let formData = new FormData();

        for (var i in e.target.files) {
            if (!isNaN(i)) {
                formData.append('selectedFile', e.target.files[i]);
            }
        }

        console.log('selectes file here : -----  ', formData)

        axios.post('http://localhost:3002/fileupload/' + this.props.match.params.notesId, formData)
            .then((result) => {

                this.setState({ imageContentIds: result.data.message11 })
            })
            .catch(
                res => {
                    message.error('error: ',res.data.message)
                }
            )

    }


    componentWillMount() {

        axios.get('http://localhost:3002/notes1/' + this.props.match.params.notesId)
            .then(res => {
                this.setState({ values: res.data.message, notes: res.data.message1.title, imageContentIds: res.data.message2 })

            })
            .catch(
                res => {
                    message.error('error: ',res.data.message)
                }
            )
    }



    deleteImageIds(id) {

        var tempNotesArr = _.clone(this.state.imageContentIds)

        var index = -1;

        tempNotesArr.map(
            (value, i) => {
                if (value.imageId == id)
                    index = i
            }
        )

        if (index > -1) {
            tempNotesArr.splice(index, 1);
        }

        this.setState({ imageContentIds: tempNotesArr })

        axios.delete('http://localhost:3002/deleteimage/' + id)
            .then(
                res => {
                    console.log('deleted image here ->>>>>>>>>>>>>>>>>>>>' + res.data.message)
                }
            )
            .catch(
                res => {
                    message.error('error: ',res.data.message)
                }
            )
    }

    createUI() {
        return this.state.values.map((el, i) =>

            <div key={i}>

                <FormItem>

                    <Row>
                        <Col span={1}><Checkbox checked={el.isChecked} onChange={this.handleCheckBox.bind(this, i)}>
                        </Checkbox></Col>
                        <Col span={1}> </Col>
                        <Col span={22}><Input type="text" value={el.content}
                            onChange={this.handleChange.bind(this, i)}
                            placeholder='Enter Task here'
                            suffix={<Icon type='minus-circle-o'
                                onClick={this.removeClick.bind(this, i, el._id)} style={{ fontSize: 20, color: '#08c' }} />} />
                        </Col>
                    </Row>



                </FormItem>
            </div>

           
        )
    }

    handleChange(i, event) {
        let values = _.clone(this.state.values);
        values[i].content = event.target.value; /*made change here*/
        this.setState({ values });
    }

    handleCheckBox(i, event) {
        let values = _.clone(this.state.values);
        values[i].isChecked = !values[i].isChecked;
        this.setState({ values });
    }


    addClick() {
        let cloneValue = _.clone(this.state.values)
        cloneValue.push({ content: '', isChecked: false }) /*made change here*/
        this.setState(prevState => ({ values: cloneValue }))
    }

    addnotestitle(event) {
        this.setState({ notes: event.target.value })
    }

    removeClick(i, id) {

        //old content id is saved in deletedcontent to delete further
        if (id) {
            let values = _.clone(this.state.values);
            values.splice(i, 1);
            this.setState({ values });

            let deleteArr = _.clone(this.state.deletedContent);
            deleteArr.push(id)
            this.setState(prevState => ({ deletedContent: deleteArr }))
        }

        //new content can be deleted
        else {
            let values = _.clone(this.state.values);
            values.splice(i, 1);
            this.setState({ values });
        }

    }

    handleSubmit(event) {
        event.preventDefault();

        var validateState = this.validate();


        if (validateState) {

            var noteObj = {
                values: this.state.values,
                notesID: this.props.match.params.notesId,
                deletedContent: this.state.deletedContent,
                notesTitle: this.state.notes
            }

            // console.log(this.state.deletedContent)

            axios.put('http://localhost:3002/updatenotes', noteObj)
                .then(res => console.log(res))
                .catch(
                    res => {
                        message.error('error: ',res.data.message)
                    }
                )

            message.success('notes updated successfully')
            this.props.history.push('/viewnote')
        }
        else
            message.warn('please fill all the textboxes')
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

    createNotes() {

        return this.state.values.map((el, i) =>

            <div key={i}>
                <Row>
                    <Col span={11}>
                        <center>
                            {el.content}
                        </center>
                    </Col>
                    <Col span={2}>
                        :
                    </Col>
                    <Col span={11}>
                        <center>
                            <Checkbox defaultChecked={el.isChecked} disabled />
                        </center>
                    </Col>
                </Row>
            </div>
        )
    }

    handleDelete(event) {
        event.preventDefault();
        axios.delete('http://localhost:3002/deletenotes/' + this.props.match.params.notesId)
            .then(res => console.log(res))
            .catch(
                res => {
                    message.error('error: ',res.data.message)
                }
            )

        message.success('notes deleted successfully')
        this.props.history.push('/viewnote')
    }

    render() {
        return (

            <div>
                {

                    this.props.isEdit
                        ?
                        (
                            <div id='middlePageDesign'>
                                <Form onSubmit={this.handleSubmit} >
                                    <FormItem>
                                        <Input type="text" value={this.state.notes} onChange={this.addnotestitle.bind(this)} placeholder="Note's title" />
                                    </FormItem>
                                    {this.createUI()}
                                    <FormItem>
                                        <Row>
                                            <Col span={11}>
                                                <Button onClick={this.addClick.bind(this)} className="login-form-button">Add Task</Button>
                                            </Col>
                                            <Col span={2}></Col>
                                            <Col span={11}>
                                                <Button onClick={this.uploadFile.bind(this)} className="login-form-button" >
                                                    <Icon type="plus" />Add Images
                                                                    <Input id="hiddeninput" onChange={this.getFiles.bind(this)}
                                                        accept='.jpg,.png,.jpeg'
                                                        type="file" hidden multiple />
                                                </Button>
                                            </Col>
                                        </Row>
                                    </FormItem>

                                    <FormItem>
                                        <Button type="primary" htmlType="submit" className="login-form-button">Update</Button>
                                    </FormItem>

                                    {
                                        (this.state.imageContentIds.length > 0)
                                            ?
                                            (


                                                <FormItem>
                                                    <Card>
                                                        <Row>
                                                            <h3><center>Uploads here:</center></h3>
                                                        </Row>
                                                        {
                                                            this.state.imageContentIds.map(
                                                                (image, index) => {

                                                                    return (
                                                                        <div key={index} >
                                                                            <Card.Grid style={gridStyle}>
                                                                            
                                                                                    <Icon type="delete" style={{ fontSize: 18, color: '#f5222d' }} onClick={this.deleteImageIds.bind(this, image.imageId)} />
                                                                                
                                                                                <a href={'http://localhost:3002/assets/' + image.imageId} download={image.originalName}>
                                                                                    <img src={'http://localhost:3002/assets/' + image.imageId} height={100} width={100} />
                                                                                </a>


                                                                            </Card.Grid>
                                                                        </div>
                                                                    )

                                                                }
                                                            )
                                                        }
                                                    </Card>
                                                </FormItem>

                                            )
                                            :
                                            (
                                                <div>
                                                </div>
                                            )
                                    }
                                    <FormItem>
                                        <Button type='danger' onClick={this.handleDelete.bind(this)} className="login-form-button">Delete Notes</Button>
                                    </FormItem>
                                </Form>

                            </div >
                        )
                        :

                        (
                            <div id='middlePageDesign'>
                                <Card title={this.state.notes} extra={<Link to={`/viewnote/${this.props.match.params.notesId}/edit`}><Icon type="edit" style={{ fontSize: 20, color: '#08c' }} /> </Link>}>

                                    <Row>
                                        <Col span={11}>
                                            <center>
                                                <b>Task Name</b>
                                            </center>
                                        </Col>
                                        <Col span={2}>
                                        </Col>
                                        <Col span={11}>
                                            <center>
                                                <b>Task Status</b>
                                            </center>
                                        </Col>
                                    </Row>
                                    {
                                        this.createNotes()
                                    }

                                </Card>
                                {
                                    (this.state.imageContentIds.length > 0)
                                        ?
                                        (
                                            <Card>
                                                <Row>
                                                    <h3><center>Uploads here:</center></h3>
                                                </Row>
                                                {
                                                    this.state.imageContentIds.map(
                                                        (image, index) => {

                                                            return (
                                                                <div key={index} >
                                                                    <Card.Grid style={gridStyle}>

                                                                        {console.log('mbcsdghvs#####################', image.imageId)}

                                                                        <a href={'http://localhost:3002/assets/' + image.imageId} download>
                                                                            <img src={'http://localhost:3002/assets/' + image.imageId} height={100} width={100} />
                                                                        </a>
                                                                    </Card.Grid>
                                                                </div>
                                                            )

                                                        }
                                                    )
                                                }
                                            </Card>
                                        )
                                        :
                                        (
                                            <div>
                                            </div>
                                        )
                                }

                            </div>
                        )
                }
            </div>

        );
    }
}

export default Form.create()(Notes1);