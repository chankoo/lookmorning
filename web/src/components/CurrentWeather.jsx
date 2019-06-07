import React from 'react'
// import { Button } from 'antd'
// import { Link } from "react-router-dom"
import * as util from '../util';


class CurrentWeather extends React.Component {
  constructor(props){
    super(props)
    this.state = {
    }
  }

  componentDidMount = () => {
    console.log('CurrentWeather componentDidMount:')
    
    const {city, country} = this.props

    const base = "http://0.0.0.0:8080/weather/now"
    const url = base+'?'+'city=' + city + '&' + 'country=' + country + 'units=metric'
    fetch(url, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json', 
      }
    })
      .then(util.handleResponse)
      .then(response => {
        const data = JSON.parse(response)
        this.setState({
          'weather': data['weather'][0]['main'],
          'temp': data['main']['temp'],
          'temp_min': data['main']['temp_min'],
          'temp_max': data['main']['temp_max'],
          'humidity': data['main']['humidity'],
          'pressure': data['main']['pressure'],
          'wind_speed': data['wind']['speed'],
          'clouds': data['clouds']['all'],
        })
        // if data has rain ~~~
      })
      .catch(e=>{
        alert(e)
        console.log(e)
      })
      
  }

    render() {
      const {weather, temp, temp_min, temp_max, humidity, pressure, wind_speed, clouds } = this.state
      return (
        <React.Fragment>
          <div >
            <h1>Currunt Weather api</h1>
            <div>
            {weather}
            {temp}
            {temp_min}
            {temp_max}
            {humidity}
            {pressure}
            {wind_speed}
            {clouds}
            </div>
          </div>
        </React.Fragment>
      )
    }
  }
  
  export default CurrentWeather