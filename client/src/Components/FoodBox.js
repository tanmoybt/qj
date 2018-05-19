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
        console.log(id);
        this.props.onFoodDelete(id);
        console.log('oops deleted');
    }

    render() {
        let sizes = this.props.food.food_size.map(size => {
            return (
                <div key={size.price}>
                    <h6> -- {size.size}, <strong>{size.price} tk</strong></h6>
                </div>
            )
        });

        return (
            <div>
                <h4>{this.props.food.food_name}</h4>
                <h5>Food Tags: <strong>{this.props.food.food_tags.join()}</strong>; Ingredient Tags:<strong>
                    {this.props.food.ingredient_tags.join()}</strong></h5>
                {sizes}
                <h6> Cuisine: {this.props.food.cuisine.join()}, Rating : {this.props.food.rating}</h6>
                <h6> Description: {this.props.food.desc}</h6>

                <button className="btn btn-large btn-danger" onClick={this.handleFoodDelete}>Delete</button>
            </div>
        )
    }
}