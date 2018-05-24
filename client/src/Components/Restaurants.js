//Comment.js
import React, {Component} from 'react';
import axios from 'axios';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

import RestaurantBox from './RestaurantBox';
import Foods from './Foods';
import Info from './info';
import Region from './Region';

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
            startTime: '10.00 AM',
            closeTime: '10.00 PM',
            email: '',
            phone: '',

            restaurants: [],
            res_id: '',
            res_name: '',
            foods: [],
            cuisines: [],
            food_tags: [],
            ingredient_tags: [],

            regions: [],


            removeSelected: true,
            disabled: false,
            crazy: false,
            stayOpen: false,
            value: [],
            rtl: false,
            option_cuisine: '',

            removeSelected_r: true,
            disabled_r: false,
            crazy_r: false,
            stayOpen_r: false,
            value_r: [],
            rtl_r: false,
            option_region: '',

            cuisineEnabled: false,
            foodtagEnabled: false,
            ingredienttagEnabled: false
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

        this.handleStartTimeChange = this.handleStartTimeChange.bind(this);
        this.handleCloseTimeChange = this.handleCloseTimeChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);

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
        this.loadRegions = this.loadRegions.bind(this);
        this.loadFoodTags = this.loadFoodTags.bind(this);
        this.loadIngredientTags = this.loadIngredientTags.bind(this);
        this.handleRegionSubmit = this.handleRegionSubmit.bind(this);

        this.handleCuisineChange = this.handleCuisineChange.bind(this);
        this.handleRegionChange = this.handleRegionChange.bind(this);

    }

    handleCuisineChange(selectedOption) {
        //console.log(selectedOption);
        this.setState({option_cuisine: selectedOption});
    }

    handleRegionChange(selectedOption) {
        //console.log(selectedOption);
        let zip= '';
        this.state.regions.forEach(function (reg) {
            //console.log(reg);
            //console.log(selectedOption);
           if(reg.name === selectedOption.label){
               zip= reg.zip_code;
           }
        });
        this.setState({option_region: selectedOption.label, zipCode: zip});
    }

    handleNameChange(e) {
        this.setState({name: e.target.value});
    }
    handleLocationChange(e) {
        this.setState({location: e.target.value});
    }
    handlezipCodeChange(e) {
        this.setState({zipCode: e.target.value});
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

    handleStartTimeChange(e) {
        this.setState({startTime: e.target.value});
    }

    handleCloseTimeChange(e) {
        this.setState({closeTime: e.target.value});
    }

    handleEmailChange(e) {
        this.setState({email: e.target.value});
    }

    handlePhoneChange(e) {
        this.setState({phone: e.target.value});
    }


    componentDidMount() {
        this.loadRestaurants();
        this.loadRegions();
        this.loadCuisines();
        this.loadIngredientTags();
        this.loadFoodTags();

    }

    loadRestaurants() {
        const that= this;
        axios.get('/api/restaurants')
            .then(response => {
                console.log("data");
                console.log(response.data);

                this.setState({restaurants: [], res_id: '', res_name: ''});

                if(response.data.length){
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

    loadRegions() {
        axios.get('/api/regions')
            .then(response => {
                this.setState({regions: response.data});
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    handleFoodSubmit(food){
        axios.post('/api/foods', food)
            .catch(err => {
                console.error(err);
            })
            .then(doc => {
                let foods = this.state.foods;
                let newFoods = foods.concat([doc.data]);
                this.setState({foods: newFoods}, function () {
                    console.log(this.state.foods);
                });
            })

    }

    handleRestaurantSubmit(e) {
        e.preventDefault();
        let name = this.state.name.trim();
        let location = this.state.location.trim();
        let region = this.state.option_region.trim();
        let zip = this.state.zipCode.trim();
        let cuisine = this.state.option_cuisine.trim();
        let rating = this.state.rating.trim();

        let startTime = this.state.startTime.trim();
        let closeTime = this.state.closeTime.trim();
        let email = this.state.email.trim();
        let phone = this.state.phone.trim();


        if (!name || !location || !region || !email) {
            return;
        }
        let restaurant = {name: name, location: location, region: region, startTime:startTime, closeTime:closeTime,
                            zip: zip, cuisine: cuisine, rating: rating, email: email, phone:phone};

        axios.post('/api/restaurants', restaurant)
            .catch(err => {
                console.log("error");
                console.error(err);
            })
            .then(doc => {
                let restaurants = this.state.restaurants;

                let newRestaurants = restaurants.concat([doc.data]);
                console.log(doc.data);

                this.setState({restaurants: newRestaurants}, function () {
                    console.log(this.state.restaurants);
                });

            })
    }

    handleCuisineSubmit(cuisine) {
        this.setState({cuisineEnabled: true});
        axios.post('/api/cuisines', cuisine)
            .catch(err => {
                console.error(err);
            })
            .then(doc => {
                let cuisines = this.state.cuisines;

                let newCuisines = cuisines.concat([doc.data]);
                this.setState({cuisines: newCuisines, cuisineEnabled: false}, function () {
                    console.log(this.state.cuisines);
                });
            })
    }

    handleFoodTagSubmit(FoodTag) {
        this.setState({foodtagEnabled: true});
        axios.post('/api/foodtags', FoodTag)
            .catch(err => {
                console.error(err);
            })
            .then(doc=> {
                let food_tags = this.state.food_tags;

                let newFoodTags = food_tags.concat([doc.data]);
                this.setState({food_tags: newFoodTags, foodtagEnabled: false}, function () {
                    console.log(this.state.food_tags);
                });
            })
    }

    handleIngredientTagSubmit(Ing) {
        this.setState({ingredienttagEnabled: true});
        axios.post('/api/ingredienttags', Ing)
            .catch(err => {
                console.error(err);
            })
            .then(doc=>{
                let ing = this.state.ingredient_tags;

                let newingredient_tags = ing.concat([doc.data]);
                this.setState({ingredient_tags: newingredient_tags, ingredienttagEnabled: false}, function () {
                    console.log(this.state.ingredient_tags);
                });

            })
    }

    handleRegionSubmit(reg) {
        axios.post('/api/regions', reg)
            .catch(err => {
                console.error(err);

            })
            .then(doc=>{
                let regions = this.state.regions;
                let newRegions = regions.concat([doc.data]);
                this.setState({regions: newRegions}, function () {
                    console.log(this.state.regions);
                });
            })
    }


    handleRestaurantDelete(id) {
        console.log(id);
        axios.delete('api/restaurants/' + id)
            .then(res => {
                console.log(res);
                this.loadRestaurants();
            })
            .catch(err => {
                console.error(err);
            });
    }

    displayRestaurant(res_id, res_name){
        console.log('here');
        const that=this;
        this.setState({foods: []});
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

        const CUISINES = [];

        this.state.cuisines.forEach(function (cuisine) {
           CUISINES.push({label: cuisine.cuisine, value: cuisine.cuisine});
        });

        const REGIONS = [];

        this.state.regions.forEach(function (region) {
            REGIONS.push({label: region.name, value: region.name});
        });

        let food_module = <div className="col-md-6"></div>

        if(this.state.res_id && this.state.res_name){
            food_module =   <div className="col-md-6">
                                <h2>{this.state.res_name}</h2>
                                <Foods foods={this.state.foods} res_id={this.state.res_id} res_name={this.state.res_name}
                                    handleFoodSubmit={this.handleFoodSubmit}
                                    food_tags={this.state.food_tags} ing_tags={this.state.ingredient_tags}
                                    cuisines={this.state.cuisines} displayRes={this.displayRestaurant}/>
                            </div>
        }

        return (
            <div className="App container-fluid">
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
                            <h3>RESTAURANTS</h3>
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
                                    <Select
                                        id="region"
                                        onChange={this.handleRegionChange}
                                        options={REGIONS}
                                        placeholder="Select Region"
                                        value={this.state.option_region}
                                    />

                                    <label htmlFor="zip">ZIP Code</label>
                                    <input type="text" className="form-control" value={this.state.zipCode}
                                           onChange={this.handlezipCodeChange}  id="zip"/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="cuisine">Cuisine</label>
                                    <Select
                                        id="cuisine"
                                        closeOnSelect={!this.state.stayOpen}
                                        disabled={this.state.disabled}
                                        multi
                                        onChange={this.handleCuisineChange}
                                        options={CUISINES}
                                        placeholder="Select Cuisines"
                                        removeSelected={this.state.removeSelected}
                                        rtl={this.state.rtl}
                                        simpleValue
                                        value={this.state.option_cuisine}
                                    />
                                </div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <label htmlFor="rating">Rating</label>
                                        <input placeholder="Rating" type="text" className="form-control" value={this.state.rating}
                                               onChange={this.handleRatingChange}  id="rating"/>
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="start">Start Time</label>
                                        <input placeholder="Start time" onChange={this.handleStartTimeChange} type="text"
                                               className="form-control" id="start" value={this.state.startTime}/>

                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="close">Close time</label>
                                        <input onChange={this.handleCloseTimeChange} type="text" className="form-control"
                                               id="close" value={this.state.closeTime}/>

                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col-md-8">
                                        <label htmlFor="email">Email Address</label>
                                        <input placeholder="Email" onChange={this.handleEmailChange} type="text" className="form-control"
                                               value={this.state.email} id="email"/>

                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="phone">Phone No.</label>
                                        <input placeholder="Phone No." onChange={this.handlePhoneChange} type="text" className="form-control"
                                               value={this.state.phone} id="phone"/>

                                    </div>

                                </div>
                                <div className="form-group">
                                    <label htmlFor="logo">Logo</label>
                                    <input onChange={this.handleImageChange} type="text" className="form-control" id="logo"/>

                                    <label htmlFor="image">Image</label>
                                    <input onChange={this.handleLogoChange} type="text" className="form-control" id="image"/>
                                </div>

                                <input type='submit' className="btn-success" value='ADD'/>
                            </form>

                            <br/>
                            <br/>
                            <Info cuisines={this.state.cuisines} food_tags={this.state.food_tags}
                                  ingredient_tags={this.state.ingredient_tags}
                                  cuisineEnabled={this.state.cuisineEnabled}
                                  foodtagEnabled={this.state.foodtagEnabled}
                                  ingredienttagEnabled={this.state.ingredienttagEnabled}
                                    handleCuisine={this.handleCuisineSubmit}
                                    handleFoodTag={this.handleFoodTagSubmit}
                                    handleIngredientTag={this.handleIngredientTagSubmit}/>

                            <br/>
                            <br/>

                            <Region regions={this.state.regions} handleRegion={this.handleRegionSubmit}/>
                            <br/>
                            <br/>

                        </div>
                        {food_module}

                    </div>
                </div>
            </div>
        )
    }
}