//Comment.js
import React, {Component} from 'react';
import axios from 'axios';

export default class Notification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgLink: 'https://yt3.ggpht.com/a-/AJLlDp3wYX5t60ur_Jn4hcf9RS-9F1N98zE6mHMGVg=s900-mo-c-c0xffffffff-rj-k-no',
            adText: '',
            sendState: false
        };

        this.handleImgLinkChange = this.handleImgLinkChange.bind(this);
        this.handleAdTextChange = this.handleAdTextChange.bind(this);
        this.handleNotificationSubmit = this.handleNotificationSubmit.bind(this);

    }

    handleImgLinkChange(e){
        this.setState({imgLink: e.target.value});
    }

    handleAdTextChange(e){
        this.setState({adText: e.target.value});
    }

    handleNotificationSubmit(e){
        console.log(this.state.imgLink);
        console.log(this.state.adText);
        //this.setState({sendState: true});
        let noti = {imgLink : this.state.imgLink, adText: this.state.adText};

        axios.post('/api/notification', noti)
            .catch(err => {
                console.error(err);
            })
            .then(doc => {
                console.log("front");
                console.log(doc);
            })
    }


    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <h1> Notification </h1>
                        <div className="col-md-8">
                            <br/><br/>
                            <div>
                                <label htmlFor="image">Image link</label>
                                <br/>
                                <img src={this.state.imgLink} alt= "Notification"
                                  style = {{
                                  width: '200px',
                                  height: 'auto'}}/>
                                <br/> <br/>

                                 <input type="text" className="form-control" value={this.state.imgLink}
                                       onChange={this.handleImgLinkChange} id="image"/>

                            </div>
                            <br/>
                            <div className="form-group">

                                <label htmlFor="adText">Text</label>
                                <input type="text" className="form-control" value={this.state.adText}
                                       onChange={this.handleAdTextChange} id="adText"/>
                            </div>
                            
                            <input type='button' onClick={this.handleNotificationSubmit} className="btn-success" 
                            value='Send' disabled={this.state.sendState}/>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}