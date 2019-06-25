import React from 'react'
import Daily from './Daily'
import * as util from '../util'
import { getAToken, getRToken } from "../authentication"
import { message } from 'antd'

class MyScrap extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            'dailys':[]
        }
    }

    componentDidMount=()=>{
        const {user_id} = this.props
        const base = "http://54.180.147.246:8080/user/"
        const url = base + user_id + '/myscrap'
        const AToken = getAToken()
        const RToken = getRToken()

        fetch(url, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + AToken,
            'refreshToken': RToken
        }
        })
        .then(util.handleResponse)
        .then(response => {
            const data = response

            this.setState({
                'dailys': data['dailys']
            })
        })
        .catch(error=>{
            message.error(error)
        })
    }

    handleDailysUpdate=(daily_id)=>{
        this.setState({
            'dailys': this.state.dailys
        })
    }

    shouldComponentUpdate(nextProps, nextState) {return true}

    render(){
        const {dailys} = this.state
        const {user_id} = this.props
        const {handleDailysUpdate} =this

        // dailys 배열을 map 이용해 컴포넌트 배열로 변환
        const myScraps = dailys.map(
            ({daily_id, datetime, img_path, satis, creater_id}) => (
                <Daily
                    daily_id={daily_id}
                    user_id={user_id}
                    datetime={datetime}
                    img_path={img_path}
                    satis={satis}
                    creater_id={creater_id}
                    is_scrap={true}
                    key={daily_id}
                    handleDailysUpdate={handleDailysUpdate}
                />
            )
        )
        return(
            <React.Fragment>
                {myScraps}
            </React.Fragment>
        )
    }
}

export default MyScrap