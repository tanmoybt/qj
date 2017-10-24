//Comment.js
import React, { Component } from 'react';

export default class Restaurants extends Component {
    constructor(props) {
        super(props);

        this.handleCommentDelete = this.handleCommentDelete.bind(this);
    }

    handleCommentDelete(e) {
        e.preventDefault();

        let id = this.props.restaurant._id;
        this.props.onRestaurantDelete(id);
        console.log('oops deleted');
    }

    render() {
        return (
                <div>
                    <h3>{this.props.restaurant.name}</h3>
                    <h4>{this.props.restaurant.location}</h4>
                    <h6>{this.props.restaurant.region},{this.props.restaurant.zip_code},
                        {this.props.restaurant.cuisine},{this.props.restaurant.rating}</h6>

                    <button className="btn btn-large btn-success" onClick={this.handleCommentDelete}>Display</button>
                    <button className="btn btn-large btn-danger" onClick={this.handleCommentDelete}>Delete</button>
                </div>
        )
    }
}