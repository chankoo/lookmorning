import React from 'react'
import { Card, Icon, Avatar } from 'antd';
const { Meta } = Card;

class Daily extends React.Component {
    constructor(props){
        super(props)
    }

    render(){
        const {daily_id, datetime, img_path, satis} = this.props
        return(
            <div className="Card-container">
                <Card
                    title={datetime}
                    style={{ width: 300 }}
                    size="small" // doesnt work
                    cover={
                    <img
                        alt={daily_id}
                        src={img_path}
                    />
                    }
                    actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
                > 
                    Card Content
                    {/* <Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    title="Card title"
                    description="This is the description"
                    /> */}
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