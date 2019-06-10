import React from 'react'
import './Main.css'
import Nav from './Nav'
import { Button } from 'antd'
import { Link } from "react-router-dom"
import CurrentWeather from './CurrentWeather'
import WeeklyWeather from './WeeklyWeather'
import OtherDaily from './OtherDaily'

class WelcomePage extends React.Component {
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
            <Link to="/login">
                <Button type="primary">Login</Button>
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
            </div>

        </React.Fragment>
    )
  }
}

export default WelcomePage