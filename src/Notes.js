import React, { Component } from 'react';
import { Collapse,Checkbox, Row, Col } from 'antd';
const Panel = Collapse.Panel;
const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;


class Notes extends React.Component {
    callback = (key) => {
        console.log(key);
    }
    onChange = (checkedValues) => {
        console.log('checked = ', checkedValues);
    }
    render() {
        return (

            <Collapse onChange={this.callback}>
                <Panel header="This is panel header 1" key="1">
                    <Checkbox.Group style={{ width: '100%' }} onChange={this.onChange}>
                        <Row>
                            <Col span={8}><Checkbox value="A">A</Checkbox></Col>
                            <Col span={8}><Checkbox value="B">B</Checkbox></Col>
                            <Col span={8}><Checkbox value="C">C</Checkbox></Col>
                            <Col span={8}><Checkbox value="D">D</Checkbox></Col>
                            <Col span={8}><Checkbox value="E">E</Checkbox></Col>
                        </Row>
                    </Checkbox.Group>
                </Panel>
                <Panel header="This is panel header 2" key="2">
                    <p>{text}</p>
                </Panel>
                <Panel header="This is panel header 3" key="3">
                    <p>{text}</p>
                </Panel>
            </Collapse>
        );
    }
}

export default Notes;