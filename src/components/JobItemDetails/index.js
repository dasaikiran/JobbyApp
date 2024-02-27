import {Component} from 'react'
import Cookies from 'js-cookie'
import {FaExternalLinkAlt, FaStar} from 'react-icons/fa'
import {MdLocationOn, MdWork} from 'react-icons/md'
import Loader from 'react-loader-spinner'
import SimilarJobsItem from '../SimilarJobsItem'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobObj: {},
    skillsList: [],
    similarJobsList: [],
    lifeAtCompanyObj: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount = () => {
    this.getJobObj()
  }

  getJobObj = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      const obj = data.job_details

      const jobObj = {
        companyLogoUrl: obj.company_logo_url,
        companyWebsiteUrl: obj.company_website_url,
        employmentType: obj.employment_type,
        id: obj.id,
        jobDescription: obj.job_description,
        location: obj.location,
        packagePerAnnum: obj.package_per_annum,
        rating: obj.rating,
        title: obj.title,
      }

      const skillsList = obj.skills.map(item => ({
        imageUrl: item.image_url,
        name: item.name,
      }))

      const lifeObj = obj.life_at_company
      const lifeAtCompanyObj = {
        description: lifeObj.description,
        lifeImageUrl: lifeObj.image_url,
      }

      const similarJobsList = data.similar_jobs.map(item => ({
        companyLogoUrl: item.company_logo_url,
        employmentType: item.employment_type,
        id: item.id,
        jobDescription: item.job_description,
        location: item.location,
        rating: item.rating,
        title: item.title,
      }))

      this.setState({
        jobObj,
        skillsList,
        lifeAtCompanyObj,
        similarJobsList,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  getSimilarJobs = () => {
    const {similarJobsList} = this.state
    return similarJobsList.map(item => (
      <SimilarJobsItem item={item} key={item.id} />
    ))
  }

  getJobsObjContainer = () => {
    const {jobObj, lifeAtCompanyObj, skillsList} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobObj
    const {description, lifeImageUrl} = lifeAtCompanyObj

    return (
      <>
        <div className="job-details-item-container">
          <div className="job-details-container">
            <div className="job-logo-container">
              <img
                className="job-logo"
                src={companyLogoUrl}
                alt="job details company logo"
              />
              <div className="job-name-rating">
                <h1 className="job-title">{title}</h1>
                <div className="job-rating-container">
                  <FaStar className="icon star-icon" />
                  <p>{rating}</p>
                </div>
              </div>
            </div>
            <div className="location-package">
              <div className="locint-container">
                <MdLocationOn className="icon location-icon" />
                <p className="location-name">{location}</p>
              </div>
              <div className="locint-container">
                <MdWork className="icon work-icon" />
                <p className="internship-name">{employmentType}</p>
              </div>
              <p className="package">{packagePerAnnum}</p>
            </div>
          </div>
          <div className="job-description-container">
            <div className="desc-visit">
              <h1 className="job-description-heading">Description</h1>
              <div className="visit-icon-container">
                <a
                  href={companyWebsiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <p className="visit-icon-name">Visit</p>
                  <FaExternalLinkAlt />
                </a>
              </div>
            </div>
            <p className="job-descritption-para">{jobDescription}</p>
            <h1 className="skills-heading">Skills</h1>
            <ul className="skills-container">
              {skillsList.map(item => (
                <li key={item.name} className="skill-item">
                  <img
                    className="skill-image"
                    src={item.imageUrl}
                    alt={item.name}
                  />
                  <p className="skill-name">{item.name}</p>
                </li>
              ))}
            </ul>
            <h1 className="life-at-company-heading">Life at Company</h1>
            <div className="life-at-company-container">
              <p className="life-at-company-desc">{description}</p>
              <img
                className="life-at-image"
                src={lifeImageUrl}
                alt="life at company"
              />
            </div>
          </div>
        </div>
        <h1 className="similar-jobs-heading">Similar Jobs</h1>
        <ul className="similar-jobs-container">{this.getSimilarJobs()}</ul>
      </>
    )
  }

  retryForJobObj = () => {
    this.getJobObj()
  }

  renderFailure = () => (
    <div className="failure-container">
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        onClick={this.retryForJobObj}
        className="retry-button"
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

  getApiStatus = apiStatus => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.getJobsObjContainer()
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
    return (
      <>
        <Header />
        {this.getApiStatus(apiStatus)}
      </>
    )
  }
}

export default JobItemDetails
