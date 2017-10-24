//Comment.js
import React, {Component} from 'react';
import axios from 'axios';

import FoodBox from './FoodBox';

export default class Foods extends Component {
    constructor(props) {
        super(props);
        this.state = {
            res_id: '',
            food_name: '',
            food_type: '',
            food_size: '',
            cuisine: '',
            rating: '',
            image: '',
            price: ''
        };

        this.handleFoodNameChange = this.handleFoodNameChange.bind(this);
        this.handleFoodTypeChange = this.handleFoodTypeChange.bind(this);
        this.handleFoodSizeChange = this.handleFoodSizeChange.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.handleCuisineChange = this.handleCuisineChange.bind(this);
        this.handleRatingChange = this.handleRatingChange.bind(this);
        this.handleFoodSubmit = this.handleFoodSubmit.bind(this);
        this.handleFoodDelete = this.handleFoodDelete.bind(this);

    }

    handleFoodNameChange(e) {
        this.setState({food_name: e.target.value});
    }

    handleFoodTypeChange(e) {
        this.setState({food_type: e.target.value});
    }

    handleFoodSizeChange(e) {
        this.setState({food_size: e.target.value});
    }

    handlePriceChange(e) {
        this.setState({price: e.target.value});
    }

    handleCuisineChange(e) {
        this.setState({cuisine: e.target.value});
    }

    handleRatingChange(e) {
        this.setState({rating: e.target.value});
    }

    handleFoodSubmit(e) {
        e.preventDefault();
        let food_name = this.state.food_name.trim();
        let food_type = this.state.food_type.trim();
        let food_size = this.state.food_size.trim();
        let price = this.state.price.trim();
        let cuisine = this.state.cuisine.trim();
        let rating = this.state.rating.trim();
        if (!food_name || !price) {
            return;
        }
        let food = {
            _id: food_name, res_id: this.props.res_id, food_name: food_name, food_type: food_type, food_size: food_size,
            price: price, cuisine: cuisine, rating: rating
        };

        this.props.handleFoodSubmit(food);
    }

    handleFoodDelete(id) {
        axios.delete('api/foods/' + id)
            .then(res => {
                this.loadRestaurants();
            })
            .catch(err => {
                console.error(err);
            });
    }

    render() {
        let foodNodes = this.props.foods.map(food => {
            return (
                <div key={food._id}>
                    <FoodBox food={food} onFoodDelete={this.handleFoodDelete}/>
                </div>

            )
        });

        return (
            <div className="col-md-12">
                {foodNodes}
                <br/><br/>
                <form onSubmit={this.handleFoodSubmit}>
                    <div>
                        <label htmlFor="name">Food Name:</label>
                        <input type="text" className="form-control" value={this.state.food_name}
                               onChange={this.handleFoodNameChange} id="name"/>

                        <label htmlFor="type">Food Type:</label>
                        <input type="text" className="form-control" value={this.state.food_type}
                               onChange={this.handleFoodTypeChange} id="type"/>
                    </div>
                    <div>
                        <label htmlFor="size">Food Size</label>
                        <input type="text" className="form-control" value={this.state.food_size}
                               onChange={this.handleFoodSizeChange} id="size"/>

                        <label htmlFor="price">Price</label>
                        <input type="text" className="form-control" value={this.state.price}
                               onChange={this.handlePriceChange} id="price"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="cuisine">Cuisine</label>
                        <input type="text" className="form-control" value={this.state.cuisine}
                               onChange={this.handleCuisineChange} id="cuisine"/>

                        <label htmlFor="rating">Rating</label>
                        <input type="text" className="form-control" value={this.state.rating}
                               onChange={this.handleRatingChange} id="rating"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="image">Image</label>
                        <input type="file" className="form-control" id="image"/>
                    </div>

                    <input type='submit' className="btn-success" value='ADD'/>
                </form>

            </div>

        )
    }
}