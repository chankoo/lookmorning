import React from 'react'
import Daily from './Daily'
import * as util from '../util';


class MyScrap extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            'dailys':[]
        }
    }

    componentDidMount=()=>{
        console.log('MyScrap componentDidMount')
        const {user_id} = this.props

        const base = "http://0.0.0.0:8080/user/"
        const url = base + user_id + '/myscrap'
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
                'dailys': data['dailys']
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
        const myScraps = dailys.map(
            ({daily_id, datetime, img_path, satis}) => (
                <Daily
                    daily_id={daily_id}
                    datetime={datetime}
                    img_path={img_path}
                    satis={satis}
                    key={daily_id}
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