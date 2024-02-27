import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN PROGRESS',
}

class Profile extends Component {
  state = {profileObj: {}, apiStatus: apiStatusConstants.initial}

  componentDidMount = () => {
    this.getProfileObj()
  }

  getProfileObj = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const url = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      const item = data.profile_details
      const profileObj = {
        name: item.name,
        profileImageUrl: item.profile_image_url,
        shortBio: item.short_bio,
      }

      this.setState({
        profileObj,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  getProfileContainer = () => {
    const {profileObj} = this.state
    const {name, profileImageUrl, shortBio} = profileObj

    return (
      <div className="profile-container">
        <img className="profile-image" src={profileImageUrl} alt="profile" />
        <h1 className="profile-heading">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  renderFailure = () => (
    <div className="failure-profile-container">
      <button
        onClick={this.getProfileObj}
        className="retry-button"
        type="button"
      >
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  getProfileApiStatus = apiStatus => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.getProfileContainer()
      case apiStatusConstants.failure:
        return this.renderFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    const {apiStatus} = this.state
    return <>{this.getProfileApiStatus(apiStatus)}</>
  }
}

export default Profile
