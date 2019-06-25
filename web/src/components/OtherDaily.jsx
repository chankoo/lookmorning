import React from 'react'
import Daily from './Daily'

class OtherDaily extends React.Component {
    constructor(props){
        super(props)
    }

    handleDailysUpdate=(daily_id)=>{
        let put_dailys = this.state.dailys
        this.setState({
            'dailys': put_dailys
        })
    }

    render(){
        const {dailys, user_id} = this.props
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