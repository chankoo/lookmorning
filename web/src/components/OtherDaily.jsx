import React from 'react'
import Daily from './Daily'
import * as util from '../util';


class OtherDaily extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            'dailys':[]
        }
    }

    componentDidMount=()=>{
        console.log('OtherDaily componentDidMount')
        const {cluster} = this.props

        const base = "http://0.0.0.0:8080/daily/"
        const url = base + cluster
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
    }


    render(){
        const {dailys} = this.state

        // dailys 배열을 map 이용해 컴포넌트 배열로 변환
        const otherDailys = dailys.map(
            ({id, datetime, img_path, satis}) => (
                <Daily
                    daily_id={id}
                    datetime={datetime}
                    img_path={img_path}
                    satis={satis}
                    key={id}
                />
            )
        )


        return(
            <React.Fragment>
                {otherDailys}
            </React.Fragment>
        )
    }
}

export default OtherDaily