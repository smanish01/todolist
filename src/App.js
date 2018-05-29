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

  updateLoggedInState(value) {
    this.setState({ isLoggedIn: value });
  }

  componentWillMount() {
    axios.post('http://localhost:3002/checkuser')
      .then(res => {
        if (res.data.message == 'connected') {
          alert('you are connected');
          this.setState({isLoggedIn: true})
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
                      defaultSelectedKeys={['1']}
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
                      defaultSelectedKeys={['1']}
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
            
          {/* <Route exact path='/Login' render = { (props) => <Login {...props} updateLog={this.updateLoggedInState.bind(this)} /> } />
            <Route exact path='/Signup' component={Signup} />
            <Route exact path='/Viewnotes' component={Viewnotes} />
            <Route exact path='/Addnotes' component={Addnotes} />
            <Route exact path='/Notes1' component={Notes1} />
            <Route exact path='/Logout' render = { (props) => <Logout {...props} updateLog={this.updateLoggedInState.bind(this)} /> } /> */}

            <Route exact path='/Login' render = { (props) => <Login {...props} updateLog={this.updateLoggedInState.bind(this)} /> } />
            <Route exact path='/Signup' render = {(props) => <Signup {...props}/>} />
            <Route exact path='/Viewnotes' render = {(props) => <Viewnotes {...props}/>} />
            <Route exact path='/Addnotes' render = {(props) => <Addnotes {...props}/>} />
            <Route exact path='/Notes1' render = {(props) => <Notes1 {...props}/>} />
            <Route exact path='/Logout' render = { (props) => <Logout {...props} updateLog={this.updateLoggedInState.bind(this)} /> } />
          
          </Switch>
        </div>
      </Router >
    );
  }
}
export default App;


