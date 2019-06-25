import React from 'react'
import * as util from '../util';
import { Table } from 'antd';

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

    const base = "http://54.180.147.246:8080/weather/weekly"
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
                'dt_txt':weather['dt_txt'],
                'weather':weather['weather'][0]['main'],
                'temp':weather['main']['temp'],
                'humidity':weather['main']['humidity'],
                'clouds':weather['clouds']['all'],
                'key':weather['dt']
            }
            newWeekly = newWeekly.concat(addWeather)
        }
        this.setState({
            'weekly': newWeekly
        })
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