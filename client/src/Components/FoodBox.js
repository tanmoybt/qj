//Comment.js
import React, { Component } from 'react';

export default class FoodBox extends Component {
    constructor(props) {
        super(props);

        this.handleFoodDelete = this.handleFoodDelete.bind(this);
    }

    handleFoodDelete(e) {
        e.preventDefault();

        let id = this.props.food._id;
        this.props.onFoodDelete(id);
        console.log('oops deleted');
    }

    render() {
        return (
            <div>
                <h3>{this.props.food.food_name}</h3>
                <h4>Type: {this.props.food.food_type}</h4>
                <h5>Size: {this.props.food.food_size}, Price : {this.props.food.price}tk,
                    Cuisine: {this.props.food.cuisine}, Rating : {this.props.food.rating}</h5>

                <button className="btn btn-large btn-danger" onClick={this.handleFoodDelete}>Delete</button>
            </div>
        )
    }
}