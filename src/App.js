import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Notes from './Notes';
import Twitter from './Twitter';
import Addnotes from './Addnotes';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
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
                <Menu.Item key="3"><Link to={'/Twitter'}>Signin with <Icon type="twitter" /></Link></Menu.Item>
                <Menu.Item key="4"><Link to={'/Notes'}>Notes</Link></Menu.Item>
                <Menu.Item key="5"><Link to={'/Addnotes'}><Icon type="plus-circle" /></Link></Menu.Item>
              </Menu>
            </Header>
          </Layout>
          <Switch>
            <Route exact path='/Login' component={Login} />
            <Route exact path='/Signup' component={Signup} />
            <Route exact path='/Twitter' component={Twitter} />
            <Route exact path='/Notes' component={Notes} />
            <Route exact path='/Addnotes' component={Addnotes} />
          </Switch>
        </div>
      </Router >
    );
  }
}
export default App;


