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
            'is_scrap':this.props.is_scrap,
        }
    }

    handleScrap=(user_id, daily_id) =>{
        console.log('handleScrap')
        const {handleDailysUpdate} = this.props

        this.setState({
            'is_scrap': !this.state.is_scrap
        })

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
            handleDailysUpdate(daily_id)
        })
        .catch(error => {
            alert(error)
        })
    }

    handleSize=()=>{
        console.log('handleSize')


    }

    render(){
        const {daily_id, user_id, datetime, img_path, satis, creater_id} = this.props
        const {is_scrap} = this.state
        const {handleScrap, handleSize} = this

        return(
            <div className="card-container">
                <Card
                    cover={
                        <img
                            className="img"
                            alt="dailylook image"
                            id={daily_id}
                            src={img_path}
                            onClick={(e)=>{
                                const el = document.getElementById({daily_id}.daily_id)
                                if(el.style.maxWidth != "100%"){
                                    el.setAttribute("style", "max-width: 100%")
                                }
                                else{
                                    el.setAttribute("style", "max-width: 300px")
                                }
                                
                                handleSize()
                            }}
                        />
                    }
                    actions= {
                        !this.props.is_mine
                        &&
                        (
                        is_scrap 
                            &&
                            
                                [<Icon 
                                    type="heart" 
                                    theme="filled"
                                    onClick={(e)=>{
                                        e.preventDefault()
                                        e.stopPropagation()
                                        handleScrap(user_id, daily_id)
                                    }}/>]

                            ||
                            !is_scrap
                            &&
                                [<Icon 
                                    type="heart"
                                    onClick={(e)=>{
                                        e.preventDefault()
                                        e.stopPropagation()
                                        handleScrap(user_id, daily_id)
                                    }}
                                />]
                        )
                    }
                > 
                    <Meta
                        title={datetime}
                        description={creater_id}
                        // style={{width:"300px", height:"50px"}}
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