import React from 'react'
import './Main.css'
import Nav from './Nav'
// import Articles from './Articles'
import { Button } from 'antd'
import { Link } from "react-router-dom"
import CurrentWeather from './CurrentWeather'
import WeeklyWeather from './WeeklyWeather'

import MyDaily from './MyDaily'
import MyScrap from './MyScrap'
import OtherDaily from './OtherDaily'

class MainPage extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      'city': 'Seoul',
      'country': 'KR',
      'timestamp': Date.now()
    }
  }

  render() {
    const {city, country} = this.state
  
    return (
      <React.Fragment>
        <Nav />
        <Link to="/blank">
          <Button type="primary">Go to Blank</Button>
        </Link>

        <div className="main-wrapper">
          <div className="CurrentWeather-container">
            <CurrentWeather city={city} country={country}/>
          </div>

          {/* <div className="HourlyWeather-container">
            <HourlyWeather></HourlyWeather>
          </div> */}

          <div className="WeeklyWeather-container">
            <WeeklyWeather city={city} country={country}/>
          </div>

          <div className="MyDaily-container">
            <MyDaily user_id={1}></MyDaily>
          </div>

          <div className="MyScrap-container">
            <MyScrap user_id={1}></MyScrap>
          </div>

        </div>

        <div className="main-more-wrapper">
          <div className="OtherDaily-container">
            <OtherDaily cluster={3}></OtherDaily>
          </div>
        </div>

      </React.Fragment>
    )
  }
}

export default MainPage
