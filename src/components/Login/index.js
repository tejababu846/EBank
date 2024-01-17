import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class Login extends Component {
  state = {
    userId: '',
    pin: '',
    successorError: false,
    errormsg: '',
  }

  one = event => {
    this.setState({
      userId: event.target.value,
    })
  }

  two = event => {
    this.setState({
      pin: event.target.value,
    })
  }

  success = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {
      expires: 600,
      path: '/',
    })

    history.replace('/')
  }

  fail = errormsg => {
    this.setState({
      successorError: true,
      errormsg,
    })
  }

  BankLogin = async event => {
    event.preventDefault()
    const {userId, pin} = this.state
    const trimmedUserId = userId.trim()
    const trimmedPin = pin.trim()
    const userDetails = {user_id: trimmedUserId, pin: trimmedPin}
    const url = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    }

    try {
      const response = await fetch(url, options)
      const data = await response.json()

      if (response.ok) {
        this.success(data.jwt_token)
      } else {
        this.fail(data.error_msg)
      }
    } catch (error) {
      console.error('Error occurred:', error)
      this.fail('An unexpected error occurred')
    }
  }

  render() {
    const {userId, pin, successorError, errormsg} = this.state
    const token = Cookies.get('jwt_token')

    if (token !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="main-con">
        <div className="ct-con">
          <div className="im-con">
            <img
              src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
              alt="website login"
              className="ima"
            />
          </div>
          <form className="form-el" onSubmit={this.BankLogin}>
            <h1 className="header"> Welcome Back! </h1>
            <h3 className="header"> User ID: 142420 PIN: 231225</h3>
            <div className="inp-con">
              <label htmlFor="user" className="lab">
                User ID
              </label>
              <input
                id="user"
                placeholder="Enter User ID"
                className="inp"
                type="text"
                value={userId}
                onChange={this.one}
              />
            </div>
            <div className="inp-con">
              <label htmlFor="pin" className="lab">
                PIN
              </label>
              <input
                placeholder="Enter Pin"
                id="pin"
                className="inp"
                type="password"
                value={pin}
                onChange={this.two}
              />
            </div>
            <button className="but" type="submit">
              Login
            </button>
            <div className="ct">
              {successorError && <p className="ep"> {errormsg} </p>}
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Login
