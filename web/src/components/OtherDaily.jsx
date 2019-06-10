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
        const {cluster, user_id} = this.props
        
        const base = "http://0.0.0.0:8080/daily/"
        const url = base + user_id + '/' + cluster
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

    handleDailysUpdate=(daily_id)=>{
        console.log('handleDailysUpdate')
        let put_dailys = this.state.dailys
        
        // 일단 하트만 바꾸기
        // let arr_idx = 0
        // for(let daily of put_dailys){
        //     if(daily.id === daily_id){
        //         put_dailys.splice(arr_idx, 1)
        //         break
        //     }
        //     arr_idx += 1
        // }

        this.setState({
            'dailys': put_dailys
        })
    }

    render(){
        const {dailys} = this.state
        const {user_id} = this.props
        const {handleDailysUpdate} = this

        // dailys 배열을 map 이용해 컴포넌트 배열로 변환
        const otherDailys = dailys.map(
            ({id, datetime, img_path, satis}) => (
                <Daily
                    daily_id={id}
                    user_id={user_id}
                    datetime={datetime}
                    img_path={img_path}
                    satis={satis}
                    is_scrap={false}
                    key={id}
                    handleDailysUpdate={handleDailysUpdate}
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