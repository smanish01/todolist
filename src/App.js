import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Login from './view/Login';
import Signup from './view/Signup';
import Viewnotes from './view/Viewnotes';
import Notes1 from './view/Notes1';
import Addnotes from './view/Addnotes';
import Logout from './view/Logout';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import axios from 'axios';
const { Header, Content, Footer } = Layout;


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false
    };
  }

  componentDidMount() {
    axios.post('http://localhost:3002/checkuser')
      .then(res => {
        if (res.data.message == 'connected') {
          this.setState({ isLoggedIn: true })
          alert('you are connected');

        }
        else
          alert('you are not connected, please login');
      })
      .catch(err => console.log(err))
  }


  render() {
    return (
      <Router>
        <div>
          {
            this.state.isLoggedIn ?
          (
          <Layout className="layout">
            <Header>
              <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['2']}
                style={{ lineHeight: '64px' }}
              >
                      <Menu.Item key="1"><Link to={'/Viewnotes'}>Viewnotes</Link></Menu.Item>
                      <Menu.Item key="2"><Link to={'/Addnotes'}><Icon type="plus-circle" /></Link></Menu.Item>
                      <Menu.Item key="3"><Link to={'/Logout'}>Logout</Link></Menu.Item>
              </Menu>
            </Header>
          </Layout>
          )
          :

          (
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
              </Menu>
            </Header>
          </Layout>
          )
        }

          <Switch>
            <Route exact path='/Login' component={Login} />
            <Route exact path='/Signup' component={Signup} />
            <Route exact path='/Viewnotes' component={Viewnotes} />
            <Route exact path='/Addnotes' component={Addnotes} />
            <Route exact path='/Notes1' component={Notes1} />
            <Route exact path='/Logout' component={Logout} />
          </Switch>
        </div>
      </Router >
    );
  }
}
export default App;


