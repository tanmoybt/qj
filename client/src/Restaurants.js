//Comment.js
import React, { Component } from 'react';
import axios from 'axios';

export default class Restaurants extends Component {
    constructor(props) {
        super(props);
        this.state= {
            name: '',
            place: '',
            restaurants: []
        };

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handlePlaceChange = this.handlePlaceChange.bind(this);
        this.handleRestaurantSubmit = this.handleRestaurantSubmit.bind(this);
    }

    handleNameChange(e) {
        this.setState({ name: e.target.value });
    }
    handlePlaceChange(e) {
        this.setState({ place: e.target.value });
    }

    componentDidMount(){
        axios.get('http://localhost:8080/api/restaurants')
            .then(response => {
                this.setState({ restaurants: response.data });
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    handleRestaurantSubmit(e){
        e.preventDefault();
        let name = this.state.name.trim();
        let place = this.state.place.trim();
        if (!name || !place) {
            return;
        }
        let restaurants = this.state.restaurants;
        let restaurant = {name: name, place: place};

        let newRestaurants = restaurants.concat([restaurant]);
        this.setState({ restaurants: newRestaurants }, function () {
            console.log(this.state.restaurants);
        });

        axios.post('http://localhost:8080/api/restaurants', restaurant)
            .catch(err => {
                console.error(err);
                this.setState({ restaurants: restaurants });
            });
    }

    render() {
        let restaurantNodes = this.state.restaurants.map(restaurant => {
            return (
                <div key={restaurant.name}>
                    <h1>{restaurant.name}</h1>
                    <h3>{restaurant.place}</h3>
                </div>

            )
        });

        return (
            <div>
                {restaurantNodes}
                <form onSubmit={ this.handleRestaurantSubmit }>
                    <input type='text' placeholder='Name' value={ this.state.name } onChange= { this.handleNameChange } />
                    <input type='text' placeholder='Place' value={ this.state.place } onChange={ this.handlePlaceChange } />
                    <input type='submit' value='ADD' />
                </form>
            </div>
        )
    }
}