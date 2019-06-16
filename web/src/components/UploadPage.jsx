import React from 'react'
// import { Upload, Button, Icon, message } from 'antd';
import { getAToken, getRToken, getUser } from "../authentication"
import * as util from '../util' 
import {history } from './history'


class UploadPage extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            user: getUser(),
            loading: false,
        }
    }


    render(){
        console.log("UploadPage render") 
        return(
            // <div className="img-uploader">
            //     <Button className="upload-btn">
            //         Upload
            //     </Button>
            // </div>

            <div className="container">
                <div className="row">
                    <div className="col">
                        <h1>Upload an image</h1>

                        <form action="http://localhost:8080/daily/1/image-upload" method="POST" enctype="multipart/form-data">
                            <div className="form-group">
                                <label>Select image</label>
                                <div className="custom-file">
                                    <input type="file" className="custom-file-input" name="image" id="image"/>
                                    <label className="custom-file-label" for="image">Select image...</label>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary">Upload</button>

                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default UploadPage