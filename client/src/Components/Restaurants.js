//Comment.js
import React, {Component} from 'react';
import axios from 'axios';

import Select from 'react-select';
import 'react-select/dist/react-select.css';


import RestaurantBox from './RestaurantBox';
import Foods from './Foods';
import Info from './info'

export default class Restaurants extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            location: '',
            region: '',
            zipCode: '',
            cuisine: [],
            rating: '',
            logo: '',
            image: '',
            desc: '',
            restaurants: [],
            res_id: '',
            res_name: '',
            foods: [],
            cuisines: [],
            food_tags: [],
            ingredient_tags: [],
            selectedOption: 'chocolate',


            removeSelected: true,
            disabled: false,
            crazy: false,
            stayOpen: false,
            value: [],
            rtl: false,
        };

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleLocationChange = this.handleLocationChange.bind(this);
        this.handleRegionChange = this.handleRegionChange.bind(this);
        this.handlezipCodeChange = this.handlezipCodeChange.bind(this);
        this.handleCuisineChange = this.handleCuisineChange.bind(this);
        this.handleRatingChange = this.handleRatingChange.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.handleLogoChange = this.handleLogoChange.bind(this);
        this.handleDescChange = this.handleDescChange.bind(this);

        this.handleRestaurantSubmit = this.handleRestaurantSubmit.bind(this);
        this.handleCuisineSubmit = this.handleCuisineSubmit.bind(this);
        this.handleFoodTagSubmit = this.handleFoodTagSubmit.bind(this);
        this.handleIngredientTagSubmit = this.handleIngredientTagSubmit.bind(this);
        this.handleRestaurantDelete = this.handleRestaurantDelete.bind(this);
        this.loadRestaurants = this.loadRestaurants.bind(this);
        this.loadFoods = this.loadFoods.bind(this);
        this.displayRestaurant = this.displayRestaurant.bind(this);
        this.handleFoodSubmit = this.handleFoodSubmit.bind(this);

        this.loadCuisines = this.loadCuisines.bind(this);
        this.loadFoodTags = this.loadFoodTags.bind(this);
        this.loadIngredientTags = this.loadIngredientTags.bind(this);

        this.handleChange = this.handleChange.bind(this);


    }

    handleChange(selectedOption) {
        //console.log(selectedOption);
        this.setState({selectedOption: selectedOption});
    }

    handleNameChange(e) {
        this.setState({name: e.target.value});
    }
    handleLocationChange(e) {
        this.setState({location: e.target.value});
    }
    handleRegionChange(e) {
        this.setState({region: e.target.value});
    }
    handlezipCodeChange(e) {
        this.setState({zipCode: e.target.value});
    }
    handleCuisineChange(e) {
        this.setState({cuisine: e.target.value});
    }
    handleRatingChange(e) {
        this.setState({rating: e.target.value});
    }

    handleImageChange(e) {
        this.setState({image: e.target.value});
    }

    handleLogoChange(e) {
        this.setState({logo: e.target.value});
    }

    handleDescChange(e) {
        this.setState({desc: e.target.value});
    }


    componentDidMount() {
        this.loadRestaurants();
        this.loadCuisines();
        this.loadFoodTags();
        this.loadIngredientTags();
    }

    loadRestaurants() {
        const that= this;
        axios.get('/api/restaurants')
            .then(response => {
                if(response.data){
                    this.setState({restaurants: response.data, res_id: response.data[0]._id, res_name: response.data[0].name}, function(){
                        that.loadFoods();
                    });
                }
                

            })
            .catch(function (error) {
                console.log(error);
            })
    }

    loadFoods() {
        axios.get('/api/foods/' + this.state.res_id)
            .then(response => {
                this.setState({foods: response.data});
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    loadCuisines() {
        axios.get('/api/cuisines')
            .then(response => {
                this.setState({
                    cuisines: response.data
                });
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    loadFoodTags() {
        axios.get('/api/foodtags')
            .then(response => {
                this.setState({food_tags: response.data});
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    loadIngredientTags() {
        axios.get('/api/ingredienttags')
            .then(response => {
                this.setState({ingredient_tags: response.data});
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    handleFoodSubmit(food){
        let foods = this.state.foods;
        let newFoods = foods.concat([food]);
        this.setState({foods: newFoods}, function () {
            console.log(this.state.foods);
        });

        axios.post('/api/foods', food)
            .catch(err => {
                console.error(err);
                this.setState({foods: foods});
            });

    }

    handleRestaurantSubmit(e) {
        e.preventDefault();
        let name = this.state.name.trim();
        let location = this.state.location.trim();
        let region = this.state.region.trim();
        let zip = this.state.zipCode.trim();
        let cuisine = this.state.cuisine.trim();
        let rating = this.state.rating.trim();
        if (!name || !location) {
            return;
        }
        let restaurants = this.state.restaurants;
        let restaurant = {_id: name, name: name, location: location, region: region,
                            zip: zip, cuisine: cuisine, rating: rating};

        let newRestaurants = restaurants.concat([restaurant]);
        this.setState({restaurants: newRestaurants}, function () {
            console.log(this.state.restaurants);
        });

        axios.post('/api/restaurants', restaurant)
            .catch(err => {
                console.error(err);
                this.setState({restaurants: restaurants});
            });
    }

    handleCuisineSubmit(cuisine) {
        let cuisines = this.state.cuisines;

        let newCuisines = cuisines.concat([cuisine]);
        this.setState({cuisines: newCuisines}, function () {
            console.log(this.state.cuisines);
        });

        axios.post('/api/cuisines', cuisine)
            .catch(err => {
                console.error(err);
                this.setState({cuisines: cuisines});
            });
    }

    handleFoodTagSubmit(FoodTag) {
        let food_tags = this.state.food_tags;

        let newFoodTags = food_tags.concat([FoodTag]);
        this.setState({food_tags: newFoodTags}, function () {
            console.log(this.state.food_tags);
        });

        axios.post('/api/foodtags', FoodTag)
            .catch(err => {
                console.error(err);
                this.setState({food_tags: food_tags});
            });
    }

    handleIngredientTagSubmit(Ing) {
        let ing = this.state.ingredient_tags;

        let newingredient_tags = ing.concat([Ing]);
        this.setState({ingredient_tags: newingredient_tags}, function () {
            console.log(this.state.ingredient_tags);
        });

        axios.post('/api/ingredienttags', Ing)
            .catch(err => {
                console.error(err);
                this.setState({ingredient_tags: ing});
            });
    }


    handleRestaurantDelete(id) {
        axios.delete('api/restaurants/' + id)
            .then(res => {
                this.loadRestaurants();
            })
            .catch(err => {
                console.error(err);
            });
    }

    displayRestaurant(res_id, res_name){
        const that=this;
        this.setState({res_id: res_id, res_name: res_name}, function () {
            that.loadFoods();
        });
    }

    render() {
        let restaurantNodes = this.state.restaurants.map(restaurant => {
            return (
                <div key={restaurant._id}>
                    <RestaurantBox restaurant={restaurant} onRestaurantDelete={this.handleRestaurantDelete}
                    onDisplayClick={this.displayRestaurant}/>
                </div>

            )
        });

        const FLAVOURS  = [];

        this.state.cuisines.forEach(function (cuisine) {
           FLAVOURS.push({label: cuisine.cuisine, value: cuisine.cuisine});
        });

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <h3 className="text-center text-success">
                            WELCOME TO QUIJINN
                        </h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        {restaurantNodes}
                        <br/><br/>
                        <form onSubmit={this.handleRestaurantSubmit}>
                            <div>
                                <label htmlFor="name">Name:</label>
                                <input type="text" className="form-control" value={this.state.name}
                                       onChange={this.handleNameChange} id="name"/>

                                <label htmlFor="location">Location:</label>
                                <input type="text" className="form-control" value={this.state.location}
                                       onChange={this.handleLocationChange} id="location"/>
                            </div>
                            <div>
                                <label htmlFor="region">Region:</label>
                                <input type="text" className="form-control" value={this.state.region}
                                       onChange={this.handleRegionChange} id="region"/>

                                <label htmlFor="zip">ZIP Code</label>
                                <input type="text" className="form-control" value={this.state.zipCode}
                                       onChange={this.handlezipCodeChange}  id="zip"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="cuisine">Cuisine</label>
                                <input type="text" className="form-control" value={this.state.cuisine}
                                       onChange={this.handleCuisineChange} id="cuisine"/>

                                <Select
                                    closeOnSelect={!this.state.stayOpen}
                                    disabled={this.state.disabled}
                                    multi
                                    onChange={this.handleChange}
                                    options={FLAVOURS}
                                    placeholder="Select your favourite(s)"
                                    removeSelected={this.state.removeSelected}
                                    rtl={this.state.rtl}
                                    simpleValue
                                    value={this.state.selectedOption}
                                />

                                <label htmlFor="rating">Rating</label>
                                <input type="text" className="form-control" value={this.state.rating}
                                       onChange={this.handleRatingChange}  id="rating"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="logo">Logo</label>
                                <input type="text" className="form-control" id="logo"/>

                                <label htmlFor="image">Image</label>
                                <input type="text" className="form-control" id="image"/>
                            </div>

                            <input type='submit' className="btn-success" value='ADD'/>
                        </form>

                        <br/>
                        <br/>
                        <Info cuisines={this.state.cuisines} food_tags={this.state.food_tags}
                              ingredient_tags={this.state.ingredient_tags}
                                handleCuisine={this.handleCuisineSubmit}
                                handleFoodTag={this.handleFoodTagSubmit}
                                handleIngredientTag={this.handleIngredientTagSubmit}/>
                    </div>
                    <div className="col-md-6">
                        <h2>{this.state.res_name}</h2>
                        <Foods foods={this.state.foods} res_id={this.state.res_id} handleFoodSubmit={this.handleFoodSubmit}/>
                    </div>
                </div>
            </div>
        )
    }
}