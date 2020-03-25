import React, { Component } from 'react';
import placeholderImage from './images/icon-no-image.png';
import './App.css';
import NavBar from './components/navbar'
import io from 'socket.io-client';

const ENDPOINT = 'https://object-detection-kzsher-demo.herokuapp.com/';
const FILETYPES = ['jpg', 'jpeg', 'png']; 

class App extends Component {
    state = { 
        selectedImg: null,
        imgFile: null,
        previewImgSrc: placeholderImage,
        imgClasses: [],
        showLoading: false
    }

    socket = io(ENDPOINT);

    componentDidMount(){
        this.socket.on('image classes', imgClasses => {
            this.setState({ 
                showLoading: false,
                imgClasses: imgClasses
            });
        });

        this.socket.on('error', err => {
            alert(err);
        });
    }

    fileSelectedHandler = e => {
        const input = e.target;
        if (input.files && input.files[0]) {
            var fileExtention = input.files[0].name.split('.').pop().toLowerCase()
            var isSuccess = FILETYPES.indexOf(fileExtention) > -1;
        }

        if(isSuccess){
            let reader = new FileReader();
            let img = input.files[0];
            
            reader.onloadend = () => {
                this.setState({
                    imgFile: img,
                    previewImgSrc: reader.result
                });
            }

            reader.readAsDataURL(img);
        }
        else{
            alert("Only file extensions 'jpg', 'jpeg' & 'png' are accepted.");
        }
    }

    fileUploadHandler = () => {
        if(this.state.previewImgSrc === placeholderImage){
           alert('Please upload an image');
           return;
        }

        this.setState({ 
            imgClasses: [],
            showLoading: true
        });
        this.socket.emit('upload image', this.state.imgFile);
    }

    render() { 
        return ( 
            <React.Fragment>
                <NavBar />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="img-section">
                                <div className="embed-responsive embed-responsive-1by1 placeholder-img mb-2">
                                    <img className="embed-responsive-item" src={this.state.previewImgSrc} />
                                </div>
                                <div className="btn-group">
                                    <button className="btn btn-primary btn-lg btn-upload">
                                        Upload <input refs="img" type="file" name="file" onChange={ (e) => this.fileSelectedHandler(e)} />
                                        </button>
                                    <button className="btn btn-success btn-lg btn-submit" onClick={ this.fileUploadHandler }>Submit</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="info-section">
                                <button className="btn btn-secondary btn-lg info-title mb-2 disabled">Object(s) Detected:</button>
                                <div className="result-area">
                                    {this.state.imgClasses.map(imgClass => (
                                        <span className="badge badge-pill badge-warning p-2">{imgClass}</span>    
                                    ))}
                                    <div className="loading-overlay">
                                        {this.state.showLoading && <div className="loading-spinner spinner-border text-secondary" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
         );
    }
}

export default App;