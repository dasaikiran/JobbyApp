import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import JobItem from '../JobItem'
import Profile from '../Profile'

import './index.css'
import Header from '../Header'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN PROGRESS',
}

class Jobs extends Component {
  state = {
    jobsList: [],
    apiStatus: apiStatusConstants.initial,
    employmentType: '',
    minPackage: '',
    searchVal: '',
  }

  componentDidMount = () => {
    this.getJobsList()
  }

  getJobsList = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {employmentType, minPackage, searchVal} = this.state
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${minPackage}&search=${searchVal}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      const jobsList = data.jobs.map(item => ({
        companyLogoUrl: item.company_logo_url,
        employmentType: item.employment_type,
        id: item.id,
        jobDescription: item.job_description,
        location: item.location,
        packagePerAnnum: item.package_per_annum,
        rating: item.rating,
        title: item.title,
      }))
      this.setState({
        jobsList,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  getJobsListContainer = () => {
    const {jobsList} = this.state
    const count = jobsList.length
    return count ? (
      <ul className="jobsList-container">
        {jobsList.map(item => (
          <JobItem item={item} key={item.id} />
        ))}
      </ul>
    ) : (
      <div className="no-jobs-container">
        <img
          className="no-jobs-image"
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1 className="no-jobs-heading">No Jobs Found</h1>
        <p className="no-jobs-para">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    )
  }

  retryForJobsList = () => {
    this.getJobsList()
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
        onClick={this.retryForJobsList}
        className="retry-button"
      >
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div className="jobs-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  getApiStatus = apiStatus => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.getJobsListContainer()
      case apiStatusConstants.failure:
        return this.renderFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  onSearchInputChange = event => {
    this.setState({
      searchVal: event.target.value,
    })
  }

  getSearchListFromApi = () => {
    this.getJobsList()
  }

  onEmpTypeChange = val => {
    this.setState(
      {
        employmentType: val,
      },
      this.getJobsList,
    )
  }

  onSalChange = val => {
    this.setState(
      {
        minPackage: val,
      },
      this.getJobsList,
    )
  }

  onEmpChange = () => {
    const empTypeinputs = document.getElementsByName('empType')
    const selectedEmpTypes = Array.from(empTypeinputs)
      .filter(input => input.checked)
      .map(input => input.value)
    const empTypesString = selectedEmpTypes.join(',')
    this.onEmpTypeChange(empTypesString)
  }

  salChange = event => {
    if (event.target.checked) {
      const salVal = event.target.value
      this.onSalChange(salVal)
    }
  }

  render() {
    const {apiStatus, searchVal} = this.state
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="profile-items-container">
            <Profile />
            <div>
              <hr />
            </div>
            <h1 className="li-heading">Type of Employment</h1>
            <ul className="employment-type-container">
              {employmentTypesList.map(item => (
                <li key={item.employmentTypeId} className="emp-li-item">
                  <input
                    onChange={this.onEmpChange}
                    className="emp-li-input"
                    type="checkbox"
                    id={item.employmentTypeId}
                    name="empType"
                    value={item.employmentTypeId}
                  />
                  <label htmlFor={item.employmentTypeId}>{item.label}</label>
                </li>
              ))}
            </ul>
            <div>
              <hr />
            </div>
            <h1 className="li-heading">Salary Range</h1>
            <ul className="salary-type-container">
              {salaryRangesList.map(item => (
                <li key={item.salaryRangeId} className="sal-li-item">
                  <input
                    onChange={this.salChange}
                    className="sal-li-input"
                    type="radio"
                    id={item.salaryRangeId}
                    name="salary"
                    value={item.salaryRangeId}
                  />
                  <label htmlFor={item.salaryRangeId}>{item.label}</label>
                </li>
              ))}
            </ul>
          </div>
          <div className="jobs-search-container">
            <div className="search-input-container">
              <input
                onChange={this.onSearchInputChange}
                value={searchVal}
                type="search"
                id="search-input-icon"
                className="search-input"
                placeholder="Search"
              />
              <button
                onClick={this.getSearchListFromApi}
                className="search-button"
                type="button"
                data-testid="searchButton"
                aria-label="Search Jobs"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.getApiStatus(apiStatus)}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
