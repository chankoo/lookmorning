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
import * as util from '../util';

const { Option } = Select;

class MainPage extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      'city': 'Seoul',
      'country': 'KR',
      'timestamp': Date.now(),
      'USER': getUser(),
      'lookNow': false,
      'dailys': []
    }
  }

  onSelectChange=(value)=>{this.setState({city:value})}

  // looknow 눌렀을때 fetch cluster 
  onClickLookNow=(cluster)=>{
    const {USER} = this.state

    const base = "http://0.0.0.0:8080/daily"
        const url = base + '/' + USER.id + '/' + cluster
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
                'dailys': data
            })
        })
        .catch(e=>{
            alert(e)
            console.log(e)
        })

        this.setState({
          'lookNow': true,
          // 'cluster': cluster
        })

  }

  render() {
    const {city, country, USER, lookNow} = this.state
  
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
            <CurrentWeather city={city} country={country} USER={USER} onClickLookNow={this.onClickLookNow}/>
          </section>
        </section>

        {lookNow&&
        (<section className="more-daily-wrapper">
          <div className="otherDaily-container">
            <OtherDaily cluster={this.state.cluster} user_id={USER.id}></OtherDaily>
          </div>
        </section>)}

      </React.Fragment>
    )
  }
}

export default MainPage
