import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Login from './view/Login';
import Signup from './view/Signup';
import Viewnotes from './view/Viewnotes';
import Notes1 from './view/Notes1';
import Addnotes from './view/Addnotes';
import Logout from './view/Logout';
import { Layout, Menu, Breadcrumb, Icon,Button,message } from 'antd';
import axios from 'axios';
const { Header, Content, Footer } = Layout;


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false
    };

  }

  updateLoggedInState(value) {
    this.setState({ isLoggedIn: value });
  }

  componentWillMount() {
    axios.post('http://localhost:3002/checkuser')
      .then(res => {
        if (res.data.message == 'connected') {
          message.success('you are connected');
          this.setState({ isLoggedIn: true })
        }
        else
          message.error('you are not connected, please login');
      })
      .catch(err => console.log(err))
  }


  // logout() {

  //   // event.preventDefault();
  //   axios.post('http://localhost:3002/logout')
  //     .then(response => {

  //       if (response.data.message == 'logged out') {
  //         this.updateLoggedInState(false);
  //         window.location = 'http://localhost:3002/login';
  //       }
  //     })
  //     .catch(error => alert(error));
  // }


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
                      defaultSelectedKeys={['1']}
                      style={{ lineHeight: '64px' }}
                    >
                      <Menu.Item key="1"><Link to={'/viewnotes'}>Viewnotes</Link></Menu.Item>
                      <Menu.Item key="2"><Link to={'/addnotes'}><Icon type="plus-circle" /></Link></Menu.Item>
                      {/* <Menu.Item key="3"><div onClick={this.logout.bind(this)}> Logout</div></Menu.Item> */}
                      <Menu.Item key="3"><Link to={'/logout'}>Logout</Link></Menu.Item>
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
            <Route exact path='/viewnotes' render={(props) => <Viewnotes {...props} />} />
            <Route exact path='/addnotes' render={(props) => <Addnotes {...props} />} />
            <Route exact path='/notes1' render={(props) => <Notes1 {...props} />} />
            <Route exact path='/logout' render={(props) => <Logout {...props} updateLog={this.updateLoggedInState.bind(this)} />} />

          </Switch>
        </div>
      </Router >
    );
  }
}
export default App;


