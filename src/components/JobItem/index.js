import {FaStar} from 'react-icons/fa'
import {MdLocationOn, MdWork} from 'react-icons/md'
import {Link} from 'react-router-dom'

import './index.css'

const JobItem = props => {
  const {item} = props
  const {
    employmentType,
    id,
    companyLogoUrl,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = item
  return (
    <li className="list-item">
      <Link to={`/jobs/${id}`}>
        <div className="li-item-details-container">
          <div className="logo-container">
            <img className="li-logo" src={companyLogoUrl} alt="company logo" />
            <div className="li-name-rating">
              <h1 className="li-title">{title}</h1>
              <div className="rating-container">
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
        <div className="description-container">
          <h1 className="description-heading">Description</h1>
          <p className="descritption-para">{jobDescription}</p>
        </div>
      </Link>
    </li>
  )
}

export default JobItem
