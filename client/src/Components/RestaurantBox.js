//Comment.js
import React, { Component } from 'react';

export default class RestaurantBox extends Component {
    constructor(props) {
        super(props);

        this.handleRestaurantDelete = this.handleRestaurantDelete.bind(this);
        this.handleDisplayClick = this.handleDisplayClick.bind(this);
    }

    handleRestaurantDelete(e) {
        e.preventDefault();

        let id = this.props.restaurant._id;
        this.props.onRestaurantDelete(id);
        console.log('oops deleted');
    }

    handleDisplayClick(e){
        e.preventDefault();
        this.props.onDisplayClick(this.props.restaurant._id, this.props.restaurant.name);
    }

    render() {
        return (
                <div>
                    <h3>{this.props.restaurant.name}</h3>
                    <h4>{this.props.restaurant.location}</h4>
                    <h5>Region: <strong>{this.props.restaurant.region}</strong>, ZIP code: {this.props.restaurant.zip_code},
                        Cuisine: {this.props.restaurant.cuisine.join()}, Rating {this.props.restaurant.rating}</h5>
                    <h5><strong>{this.props.restaurant.email}, </strong>{this.props.restaurant.phone}, {}
                        {this.props.restaurant.start_time}, {this.props.restaurant.close_time}
                    </h5>

                    <button className="btn btn-large btn-success" onClick={this.handleDisplayClick}>Display</button>
                    <button className="btn btn-large btn-danger" onClick={this.handleRestaurantDelete}>Delete</button>
                </div>
        )
    }
}