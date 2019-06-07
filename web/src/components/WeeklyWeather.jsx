import React from 'react'
// import { Button } from 'antd'
// import { Link } from "react-router-dom"
import * as util from '../util';


class WeeklyWeather extends React.Component {
  constructor(props){
    super(props)
    this.state = {
        'weekly':[]
    }
  }

  componentDidMount = () => {
    console.log('WeeklyWeather componentDidMount:')
    
    const {city, country} = this.props

    const base = "http://0.0.0.0:8080/weather/weekly"
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
        let newWeekly = []
        for (const weather of data['list']){
            const addWeather = {
                'timestamp': weather['dt'],
                'dt_txt':weather['dt_txt'],
                'weather':weather['weather'][0]['main'],
                'temp':weather['main']['temp'],
                'temp_min':weather['main']['temp_min'],
                'temp_max':weather['main']['temp_max'],
                'humidity':weather['main']['humidity'],
                'pressure':weather['main']['pressure'],
                'wind_speed':weather['wind']['spped'],
                'clouds':weather['clouds']['all'],
            }
            newWeekly = newWeekly.concat(addWeather)
        }
        this.setState({
            'weekly': newWeekly
        })
        // if data has rain ~~~
      })
      .catch(e=>{
        alert(e)
        console.log(e)
      })
      
  }

    render() {
      const {weekly} = this.state
      return (
        <React.Fragment>
          <div >
            <h1>Weekly Weather api</h1>
            <div>
            {/* {weather}
            {temp}
            {temp_min}
            {temp_max}
            {humidity}
            {pressure}
            {wind_speed}
            {clouds} */}
            {weekly.length}
            </div>
          </div>
        </React.Fragment>
      )
    }
  }
  
  export default WeeklyWeather