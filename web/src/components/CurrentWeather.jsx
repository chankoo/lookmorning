import React from 'react'
import * as util from '../util';
import Weather from "./Weather";
import { Button } from 'antd'
import { Server } from 'tls';

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
          'description': data['weather'][0]['description'],
          'img_src': 'http://openweathermap.org/img/w/'+data['weather'][0]['icon']+'.png',
          'temp': data['main']['temp'],
          'temp_min': data['main']['temp_min'],
          'temp_max': data['main']['temp_max'],
          'humidity': data['main']['humidity'],
          'pressure': data['main']['pressure'],
          'wind_speed': data['wind']['speed'],
          'clouds': data['clouds']['all'],
        })
        // if data has rain ~~~ 
      //   "rain": {
      //     "3h": 0.185
      // },
      })
      .catch(e=>{
        alert(e)
        console.log(e)
      })
  }

  handleLookNow=()=>{
    const {onClickLookNow} = this.props
    // weather to s3 & fetch cluster
    // cluster to Server( from main to server)
      // onClickLookNow(cluster)
    // fetch other daily
  }

    render() {
      const {weather, temp, temp_min, temp_max, humidity, pressure, wind_speed, clouds, description, img_src } = this.state
      const { city, country, USER} = this.props
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
                    <img 
                      src={img_src}
                      alt="icon"
                      />
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
                  {USER&&
                    (<Button 
                      type="primary" className='btn-looknow' block
                      // onClick={this.handleLookNow}
                    >
                      Look Now
                    </Button>)}
                </div>
              </div>
            </div>
        </React.Fragment>
      )
    }
  }
  
  export default CurrentWeather