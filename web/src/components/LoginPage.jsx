import React from 'react'
import { Form, Divider } from 'antd'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { history } from './history'

class LoginPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoginPage: history.location.pathname === '/login',
      isRegisterPage: history.location.pathname === '/register',
    }
    this.WrappedLoginForm = Form.create()(LoginForm)
    this.WrappedRegisterForm = Form.create()(RegisterForm)
  }
  render() {
    const WrappedLoginForm = this.WrappedLoginForm
    const WrappedRegisterForm = this.WrappedRegisterForm
    return (
      <React.Fragment>
        {this.state.isLoginPage && (
          <div className='login'>
            <h1>Login</h1>
            <h2>Look Morning!!</h2>
            <Divider style={{ margin: '10px 0' }} />
            <WrappedLoginForm />
          </div>
        )}
        {this.state.isRegisterPage && (
          <div className='login'>
            <h1>REGISTER</h1>
            <h2>Look Morning!!</h2>
            <Divider style={{ margin: '10px 0' }} />
            <WrappedRegisterForm />
          </div>
        )}
      </React.Fragment>
    )
  }
}

// const withMiddleLoginPage = withMiddle(LoginPage, {
//   styles: {
//     backgroundImage: 'linear-gradient(180deg,#2b2f48,#1d1f31)',
//     backgroundRepeat: 'no-repeat',
//     backgroundPosition: 'center',
//   },
// })

export default LoginPage 
