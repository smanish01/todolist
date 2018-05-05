import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Notes from './Notes';
import { Button } from 'antd';
import { Layout, Menu, Breadcrumb } from 'antd';
const { Header, Content, Footer } = Layout;


class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Layout className="layout">
            <Header>
              <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['2']}
                style={{ lineHeight: '64px' }}
              >
                <Menu.Item key="1"><Link to={'/Login'}>Login</Link></Menu.Item>
                <Menu.Item key="2"><Link to={'/Signup'}>Signup</Link></Menu.Item>
                <Menu.Item key="3">Signup with twitter</Menu.Item>
                <Menu.Item key="4"><Link to={'/Notes'}>Notes</Link></Menu.Item>
              </Menu>
            </Header>
          </Layout>
          <Switch>
            <Route exact path='/Login' component={Login} />
            <Route exact path='/Signup' component={Signup} />
            <Route exact path='/Notes' component={Notes} />
          </Switch>
        </div>
      </Router >
    );
  }
}
export default App;


