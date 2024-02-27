import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', isError: false, errorMsg: ''}

  onSubmitForm = event => {
    event.preventDefault()
    this.authenticateUser()
  }

  onSubmitSuccess = jwtToken => {
    this.setState({isError: false})
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    console.log(this.props)
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({errorMsg, isError: true})
  }

  authenticateUser = async () => {
    const {username, password} = this.state
    const userDetails = {
      username,
      password,
    }
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  onNameChange = event => {
    this.setState({
      username: event.target.value,
    })
  }

  onPasswordChange = event => {
    this.setState({
      password: event.target.value,
    })
  }

  render() {
    const {username, password, errorMsg, isError} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <div className="form-div">
          <div className="logo-div">
            <img
              className="website-logo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </div>
          <form onSubmit={this.onSubmitForm} className="form-container">
            <div className="input-container">
              <label className="label" htmlFor="username-input">
                USERNAME
              </label>
              <input
                onChange={this.onNameChange}
                type="text"
                id="username-input"
                placeholder="Username"
                className="input"
                value={username}
              />
            </div>
            <div className="input-container">
              <label className="label" htmlFor="password-input">
                PASSWORD
              </label>
              <input
                onChange={this.onPasswordChange}
                type="password"
                id="password-input"
                placeholder="Password"
                className="input"
                value={password}
              />
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
            {isError ? <p className="error-msg">{`*${errorMsg}`}</p> : null}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
