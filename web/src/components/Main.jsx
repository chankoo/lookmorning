import React from 'react'
import './Main.css'
import Nav from './Nav'
import { Button, Select } from 'antd'
import { Link } from "react-router-dom"
import CurrentWeather from './CurrentWeather'
import WeeklyWeather from './WeeklyWeather'
import MyDaily from './MyDaily'
import MyScrap from './MyScrap'
import OtherDaily from './OtherDaily'
import {getUser} from '../authentication'

const { Option } = Select;

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

  onSelectChange=(value)=>{this.setState({city:value})}

  render() {
    const {city, country, USER} = this.state
  
    return (
      <React.Fragment>
        <Nav currentPath={this.props.location.pathname}/>
        <Link to="/upload">
          <Button type="default" className="btn-upload" block>Upload</Button>
        </Link>

        <section className='daily-wrapper'>
          <section className="myDaily-container">
            <MyDaily user_id={USER.id}></MyDaily>
          </section>

          <section className="myScrap-container">
            <MyScrap user_id={USER.id}></MyScrap>
          </section>
        </section>

        <section className="weather-wrapper">
          <div className='city-selector'>
                      <Select
                          showSearch
                          style={{ width: 200 }}
                          placeholder="Seoul"
                          optionFilterProp="children"
                          onChange={this.onSelectChange}
                          filterOption={
                              (input, option) =>
                              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                      >
                          <Option value="Seoul">Seoul</Option>
                      </Select>
          </div>
          {!USER&&
          (<Link to="/login">
              <Button type="primary" className='btn-login'>Login</Button>
          </Link>)}

          {USER&&
          (<Link to="/login">
              <Button type="primary" className='btn-login'>Logout</Button>
          </Link>)}

          <section className="weather-container">
            <CurrentWeather city={city} country={country}/>
            {USER&&
                (<Button 
                  type="primary" className='btn-looknow' block
                  // onClick={}
                >
                  Look Now
                </Button>)}
          </section>
        </section>

        {/* <section className="more-daily-wrapper">
          <div className="otherDaily-container">
            <OtherDaily cluster={3} user_id={USER.id}></OtherDaily>
          </div>
        </section> */}

      </React.Fragment>
    )
  }
}

export default MainPage
