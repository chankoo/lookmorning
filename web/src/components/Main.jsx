import React from 'react'
import './Main.css'
import Nav from './Nav'
import { Button } from 'antd'
import { Link } from "react-router-dom"
import CurrentWeather from './CurrentWeather'
import WeeklyWeather from './WeeklyWeather'
import MyDaily from './MyDaily'
import MyScrap from './MyScrap'
import OtherDaily from './OtherDaily'
import {getUser} from '../authentication'

class MainPage extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      'city': 'Seoul',
      'country': 'KR',
      'timestamp': Date.now(),
      'USER': getUser()
    }
  }

  render() {
    const {city, country, USER} = this.state
  
    return (
      <React.Fragment>
        <Nav />
        <Link to="/blank">
          <Button type="primary">Go to Blank</Button>
        </Link>

        <section className="weather-wrapper">
          <section className="weather-container">
            <CurrentWeather city={city} country={country}/>
          </section>

          {/* <div className="weather-container">
            <HourlyWeather></HourlyWeather>
          </div> */}

          <section className="weather-container">
            <WeeklyWeather city={city} country={country}/>
          </section>
        </section>

        <section className='daily-wrapper'>
          <section className="myDaily-container">
            <MyDaily user_id={USER.id}></MyDaily>
          </section>

          <section className="myScrap-container">
            <MyScrap user_id={USER.id}></MyScrap>
          </section>

        </section>

        <section className="more-daily-wrapper">
          <div className="otherDaily-container">
            <OtherDaily cluster={3} user_id={USER.id}></OtherDaily>
          </div>
        </section>

      </React.Fragment>
    )
  }
}

export default MainPage
