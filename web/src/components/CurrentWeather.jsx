import React from 'react'
import * as util from '../util';
import Weather from "./Weather";
import { Button } from 'antd'

class CurrentWeather extends React.Component {
  constructor(props){
    super(props)
    this.state = {
    }
  }

  componentDidMount = () => {
    console.log('CurrentWeather getWeather:')
    
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
          'description': data['weather'][0]['description']
        })
        // if data has rain ~~~
      })
      .catch(e=>{
        alert(e)
        console.log(e)
      })
      
  }

    render() {
      const {weather, temp, temp_min, temp_max, humidity, pressure, wind_speed, clouds, description } = this.state
      const { city, country} = this.props
      return (
        <React.Fragment>
            <div className="cw-wrapper">
              <div className="cw-main">
                <div className="cw-container">
                  <div className="cw-row">
                    <div className="cw-col-xs-5 title-container">
                      <h1>Current Weather</h1>
                    </div>
                    <div className="cw-col-xs-7 form-container">
                      <Weather 
                        temperature={temp}
                        temp_min={temp_min}
                        temp_max={temp_max}
                        humidity={humidity}
                        city={city}
                        country={country}
                        description={description}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </React.Fragment>
      )
    }
  }
  
  export default CurrentWeather