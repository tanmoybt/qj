//Comment.js
import React, {Component} from 'react';
import axios from 'axios';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

import FoodBox from './FoodBox';
import FoodSize from "./FoodSize";


export default class Foods extends Component {
    constructor(props) {
        super(props);
        this.state = {
            res_id: '',
            food_name: '',
            food_type: '',
            food_size: [{
                size: 'Single',
                price: ''
            }],
            cuisine: '',
            rating: '',
            image: '',
            desc: '',

            removeSelected_f: true,
            disabled_f: false,
            crazy_f: false,
            stayOpen_f: false,
            value_f: [],
            rtl_f: false,
            option_food: '',

            removeSelected_i: true,
            disabled_i: false,
            crazy_i: false,
            stayOpen_i: false,
            value_i: [],
            rtl_i: false,
            option_ing: '',

            removeSelected_c: true,
            disabled_c: false,
            crazy_c: false,
            stayOpen_c: false,
            value_c: [],
            rtl_c: false,
            option_cuisine: '',

        };

        this.handleFoodNameChange = this.handleFoodNameChange.bind(this);
        this.handleFoodTypeChange = this.handleFoodTypeChange.bind(this);
        this.handleFoodSizeChange = this.handleFoodSizeChange.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.handleCuisineChange = this.handleCuisineChange.bind(this);
        this.handleFoodTagChange = this.handleFoodTagChange.bind(this);
        this.handleIngTagChange = this.handleIngTagChange.bind(this);
        this.handleRatingChange = this.handleRatingChange.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.handleDescChange = this.handleDescChange.bind(this);

        this.handleFoodSubmit = this.handleFoodSubmit.bind(this);
        this.handleFoodDelete = this.handleFoodDelete.bind(this);
        this.addSizeFields = this.addSizeFields.bind(this);
        this.deleteSize = this.deleteSize.bind(this);

    }

    // componentDidMount() {
    // 	window.fbAsyncInit = function() {
    // 	    window.FB.init({
    //  			appId            : '1999649983639818',
    //  			autoLogAppEvents : true,
    //  			xfbml            : true,
    //  			version          : 'v2.11'
    // 	});
    // 	};
    //
    // 	(function(d, s, id){
    // 		var js, fjs = d.getElementsByTagName(s)[0];
    // 		if (d.getElementById(id)) {return;}
    // 		js = d.createElement(s); js.id = id;
    // 		js.src = "https://connect.facebook.net/en_US/sdk.js";
    // 		fjs.parentNode.insertBefore(js, fjs);
    // 	}(document, 'script', 'facebook-jssdk'));
    // }

    handleFoodNameChange(e) {
        this.setState({food_name: e.target.value});
    }

    handleDescChange(e){
        this.setState({desc: e.target.value});
    }

    handleFoodTypeChange(e) {
        this.setState({food_type: e.target.value});
    }

    handleFoodSizeChange(i, val) {
        //console.log(i);

        let foods = this.state.food_size;
        foods[i].size = val;

        this.setState({food_size: foods});
    }

    handlePriceChange(i, val) {
        //console.log(i);
        let foods = this.state.food_size;
        foods[i].price = val;

        this.setState({food_size: foods});
    }

    handleCuisineChange(selectedOption) {
        console.log(selectedOption);
        this.setState({option_cuisine: selectedOption});
    }

    handleFoodTagChange(selectedOption) {
        console.log(selectedOption);
        this.setState({option_food: selectedOption});
    }

    handleIngTagChange(selectedOption) {
        console.log(selectedOption);
        this.setState({option_ing: selectedOption});
    }

    handleRatingChange(e) {
        this.setState({rating: e.target.value});
    }

    handleImageChange(e) {
        this.setState({image: e.target.value});
    }

    handleFoodSubmit(e) {
        e.preventDefault();
        let food_name = this.state.food_name.trim();
        let food_sizes = this.state.food_size;

        let cuisine = this.state.option_cuisine.split(",");
        let food_tags = this.state.option_food.split(",");
        let ing_tags = this.state.option_ing.split(",");

        let rating = this.state.rating.trim();
        let image = this.state.image;
        let desc = this.state.desc;

        if (!food_name || !food_sizes[0].price) {
            return;
        }
        let res = 1;
        if (this.props.res_id) res = this.props.res_id;

        console.log(res);
        let food = {
            _id: food_name, res_id: res, food_name: food_name, food_tags: food_tags, ingredient_tags: ing_tags,
            desc: desc, food_size: food_sizes, cuisine: cuisine, rating: rating, image: image
        };

        this.props.handleFoodSubmit(food);
    }

    handleFoodDelete(id) {

        axios.delete('api/foods/' + id)
            .then(res => {
                this.props.displayRes(this.props.res_id, this.props.res_name);
            })
            .catch(err => {
                console.error(err);
            });
    }

    addSizeFields() {
        let foods = this.state.food_size;
        let newFoods = foods.concat([{
            size: 'Single',
            price: ''
        }]);
        this.setState({food_size: newFoods});
    }

    deleteSize(i) {
        console.log(i);
        let foods = this.state.food_size;

        let fruits = foods;
        fruits.splice(i, 1);
        this.setState({food_size: fruits});
    }

    render() {
        let foodNodes = this.props.foods.map(food => {
            return (
                <div key={food._id}>
                    <FoodBox food={food} onFoodDelete={this.handleFoodDelete}/>
                </div>

            )
        });

        let i = -1;
        let that = this;
        let size = this.state.food_size.map(function (size) {
            i++;
            return (
                <FoodSize key={i} food_size={that.state.food_size[i].size} price={that.state.food_size[i].price}
                          changeSize={that.handleFoodSizeChange} changePrice={that.handlePriceChange}
                          index={i} deleteSize={that.deleteSize}/>
            )
        });

        const CUISINES = [];

        this.props.cuisines.forEach(function (cuisine) {
            CUISINES.push({label: cuisine.cuisine, value: cuisine.cuisine});
        });

        const FOOD_TAGS = [];

        this.props.food_tags.forEach(function (tag) {
            FOOD_TAGS.push({label: tag.tag, value: tag.tag});
        });

        const ING_TAGS = [];

        this.props.ing_tags.forEach(function (tag) {
            ING_TAGS.push({label: tag.tag, value: tag.tag});
        });

        return (
            <div className="col-md-8">
                {foodNodes}
                <br/><br/>
                    <div>
                        <label htmlFor="name">Food Name:</label>
                        <input type="text" className="form-control" value={this.state.food_name}
                               onChange={this.handleFoodNameChange} id="name"/>

                        <label htmlFor="food_tag">Food Tags:</label>
                        <Select
                            id="food_tag"
                            closeOnSelect={!this.state.stayOpen_f}
                            disabled={this.state.disabled_f}
                            multi
                            onChange={this.handleFoodTagChange}
                            options={FOOD_TAGS}
                            placeholder="Select Food Tag"
                            removeSelected={this.state.removeSelected_f}
                            rtl={this.state.rtl_f}
                            simpleValue
                            value={this.state.option_food}
                        />

                        <label htmlFor="ing_tag">Ingredient Tags:</label>
                        <Select
                            id="ing_tag"
                            closeOnSelect={!this.state.stayOpen_i}
                            disabled={this.state.disabled_i}
                            multi
                            onChange={this.handleIngTagChange}
                            options={ING_TAGS}
                            placeholder="Select Ingredient Tag"
                            removeSelected={this.state.removeSelected_i}
                            rtl={this.state.rtl_i}
                            simpleValue
                            value={this.state.option_ing}
                        />

                        <label htmlFor="cui">Cuisines:</label>
                        <Select
                            id="cui"
                            closeOnSelect={!this.state.stayOpen_c}
                            disabled={this.state.disabled_c}
                            multi
                            onChange={this.handleCuisineChange}
                            options={CUISINES}
                            placeholder="Select Cuisine"
                            removeSelected={this.state.removeSelected_c}
                            rtl={this.state.rtl_c}
                            simpleValue
                            value={this.state.option_cuisine}
                        />
                    </div>
                    {size}
                    <br/>
                    <button className="btn-success" onClick={this.addSizeFields}>ADD SIZE</button>
                    <div className="form-group">
                        <label htmlFor="desc">Description</label>
<<<<<<< HEAD
                        <textarea className="form-control" rows="2" id="desc" value={this.state.desc}
=======
                        <textarea class="form-control" rows="2" id="desc" value={this.state.desc}
>>>>>>> 96a18f74ab0a1836c4ba15a1844d42b4155bc0b7
                            onChange={this.handleDescChange}></textarea>

                        <label htmlFor="rating">Rating</label>
                        <input type="text" className="form-control" value={this.state.rating}
                               onChange={this.handleRatingChange} id="rating"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="image">Image</label>
                        <input onChange={this.handleImageChange} type="text" className="form-control" id="image"/>
                    </div>

                    <input type='submit' onClick={this.handleFoodSubmit} className="btn-success" value='ADD'/>


                    {/*<div className="fb-customerchat"*/}
                    {/*page_id="1971669279741137"*/}
                    {/*minimized="false">*/}
                    {/*</div>*/}

                </div>

        )
    }
}
