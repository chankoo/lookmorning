import React from 'react'
import { Card, Icon } from 'antd'
import './Daily.css'
import { history } from './history'
import * as util from '../util'

const { Meta } = Card;

class Daily extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            'is_scrap':this.props.scrap
        }
    }

    handleScrap=(user_id, daily_id) =>{
        console.log('handleScrap')
        this.setState = {
            'is_scrap': !this.state.is_scrap
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                daily_id: daily_id,
            })
        }
        const base = 'http://0.0.0.0:8080/user/'
        fetch(base+user_id+'/myscrap', requestOptions)
        .then(util.handleResponse)
        .then(response => {
            console.log(response.message)
            history.push('/main')
        })
        .catch(error => {
            console.log(error)
        })
    }

    render(){
        const {daily_id, user_id, datetime, img_path, satis, creater_id} = this.props
        const {is_scrap} = this.state
        const {handleScrap} = this

        return(
            <div className="card-container">
                <Card
                    size="default"
                    cover={
                    <img
                        className="img"
                        alt="dailylook image"
                        daily_id={daily_id}
                        src={img_path}
                    />
                    }
                    // actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
                    actions= {
                        is_scrap 
                        && 
                        [<Icon 
                            type="heart" 
                            theme="filled"
                            onClick={(e)=>{
                                e.preventDefault()
                                handleScrap(user_id, daily_id)
                            }}
                        />]
                        ||
                        !is_scrap
                        &&
                        [<Icon 
                            type="heart"
                            onClick={(e)=>{
                                e.preventDefault()
                                handleScrap(user_id, daily_id)
                            }}
                        />]
                    }
                > 
                    <Meta
                    title={datetime}
                    description={creater_id}
                    />
                </Card>
            </div>
        )
    }
}

export default Daily;

// ReactDOM.render(
//   <Card
//     style={{ width: 300 }}
//     cover={
//       <img
//         alt="example"
//         src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
//       />
//     }
//     actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
//   >
//     <Meta
//       avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
//       title="Card title"
//       description="This is the description"
//     />
//   </Card>,
//   mountNode,
// );