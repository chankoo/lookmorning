import React from 'react'
import Daily from './Daily'
import * as util from '../util'
import { getAToken, getRToken } from "../authentication"

class MyDaily extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            'dailys':[]
        }
    }

    componentDidMount=()=>{
        console.log('MyDaily componentDidMount')
        const {user_id} = this.props
        const base = "http://0.0.0.0:8080/user/"
        const url = base + user_id + '/mydaily'
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
            console.log(data.message)
            this.setState({
                'dailys': data['dailys']
            })
        })
        .catch(error=>{
            console.log(error)
        })
    }

    render(){
        const {dailys} = this.state
        const {user_id} = this.props

        // dailys 배열을 map 이용해 컴포넌트 배열 myDailys로 변환
        const myDailys = dailys.map(
            ({daily_id, datetime, img_path, satis}) => (
                <Daily
                    daily_id={daily_id}
                    user_id={user_id}
                    datetime={datetime}
                    img_path={img_path}
                    satis={satis}
                    creater_id={null}
                    is_scrap={false}
                    is_mine={true}
                    key={daily_id}
                />
            )
        )

        return(
            <React.Fragment>
                {myDailys}
            </React.Fragment>
        )
    }
}

export default MyDaily