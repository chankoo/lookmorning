import React from 'react'
// import { Button } from 'antd'
// import { Link } from "react-router-dom"
import * as util from '../util';
import Weather from "./Weather";
// import WeatherSimple from './WeatherSimple'

import { Table, Divider, Tag } from 'antd';

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
                // 'timestamp': weather['dt'],
                'dt_txt':weather['dt_txt'],
                'weather':weather['weather'][0]['main'],
                // 'description':weather['weather'][0]['description'],
                'temp':weather['main']['temp'],
                // 'temp_min':weather['main']['temp_min'],
                // 'temp_max':weather['main']['temp_max'],
                'humidity':weather['main']['humidity'],
                // 'pressure':weather['main']['pressure'],
                // 'wind_speed':weather['wind']['spped'],
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
      const columns = [
        {
          title: 'DateTime',
          dataIndex: 'dt_txt',
          key: 'dt_txt',
        },
        {
          title: 'Weather',
          dataIndex: 'weather',
          key: 'weather',
        },
        {
          title: 'Temperature',
          dataIndex: 'temp',
          key: 'temp',
        },
        {
          title: 'Humidity',
          dataIndex: 'humidity',
          key: 'humidity',
        },
        {
          title: 'Clouds',
          dataIndex: 'clouds',
          key: 'clouds',
        }
      ]

      return (
        <React.Fragment>
          <div >
            <h1>Weekly Weather</h1>
            <Table columns={columns} dataSource={weekly} />
          </div>
        </React.Fragment>
      )
    }
  }
  
  export default WeeklyWeather