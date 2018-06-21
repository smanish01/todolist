import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Login from './view/Login';
import Signup from './view/Signup';
import Viewnotes from './view/Viewnotes';
import Notes1 from './view/Notes1';
import Addnotes from './view/Addnotes';
import Profile from './view/Profile';
import { Layout, Menu, Breadcrumb, Icon, Button, message, Sider } from 'antd';
import axios from 'axios';
const { Header, Content, Footer } = Layout;


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false
    }

  }

  updateLoggedInState(value) {
    this.setState({ isLoggedIn: value });
  }

  componentWillMount() {
    axios.post('http://localhost:3002/checkuser')
      .then(res => {
        if (res.data.message == 'connected') {
          // message.success('you are connected');
          this.setState({ isLoggedIn: true })
        }
        else if (res.data.message == 'not connected')
          message.error('you are not connected, please login');
      })
  }

  logout() {
    // event.preventDefault();
    axios.post('http://localhost:3002/logout')
      .then(response => {

        if (response.data.message == 'logged out') {

          message.success('You are logged out');

          setTimeout(
            () => {

              this.updateLoggedInState(false);
              window.location = 'http://localhost:3002/';
            }, 1500);
        }
      })
      .catch(error => alert(error));
  }


  render() {
    return (
      <Router basename='/'>
        <div>
          {
            this.state.isLoggedIn ?
              (
                <Layout className="layout">
                  <Header>
                    <Menu
                      theme="dark"
                      mode="horizontal"
                      // defaultSelectedKeys={['1']}
                      style={{ lineHeight: '64px' }}
                    >
                      <Menu.Item key="1"><Link to={'/viewnote'}>Viewnotes</Link></Menu.Item>
                      <Menu.Item key="2"><Link to={'/addnote'}>Addnotes</Link></Menu.Item>
                      <Menu.Item key="3"><Link to={'/profile'}>Profile</Link></Menu.Item>
                      <Menu.Item key="4"><div onClick={this.logout.bind(this)}> Logout</div></Menu.Item>
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
                      defaultSelectedKeys={['1']}
                      style={{ lineHeight: '64px' }}
                    >
                      <Menu.Item key="1"><Link to={'/'}>Login</Link></Menu.Item>
                      <Menu.Item key="2"><Link to={'/signup'}>Signup</Link></Menu.Item>
                    </Menu>
                  </Header>
                </Layout>
              )
          }

          <Switch>

            {/* <Route exact path='/Login' render = { (props) => <Login {...props} updateLog={this.updateLoggedInState.bind(this)} /> } />
            <Route exact path='/Signup' component={Signup} />
            <Route exact path='/Viewnotes' component={Viewnotes} />
            <Route exact path='/Addnotes' component={Addnotes} />
            <Route exact path='/Notes1' component={Notes1} />
            <Route exact path='/Logout' render = { (props) => <Logout {...props} updateLog={this.updateLoggedInState.bind(this)} /> } /> */}

            <Route exact path='/' render={(props) => <Login {...props} updateLog={this.updateLoggedInState.bind(this)} />} />
            <Route exact path='/signup' render={(props) => <Signup {...props} />} />
            <Route exact path='/viewnote' render={(props) => <Viewnotes {...props} />} />
            <Route exact path='/addnote' render={(props) => <Addnotes {...props} />} />
            <Route exact path='/viewnote/:notesId/view' render={(props) => <Notes1 {...props} isEdit={false} />} />
            <Route exact path='/viewnote/:notesId/edit' render={(props) => <Notes1 {...props} isEdit={true} />} />
            <Route exact path='/profile' render={(props) => <Profile {...props} />} />

          </Switch>
        </div>
      </Router >
    );
  }
}
export default App;


