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
            food_size: [{
                size: 'Single',
                price: ''
            }],
            cuisine: '',
            rating: '',
            image: ''

        };

        this.handleFoodNameChange = this.handleFoodNameChange.bind(this);
        this.handleFoodTypeChange = this.handleFoodTypeChange.bind(this);
        this.handleFoodSizeChange = this.handleFoodSizeChange.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.handleCuisineChange = this.handleCuisineChange.bind(this);
        this.handleRatingChange = this.handleRatingChange.bind(this);
        this.handleFoodSubmit = this.handleFoodSubmit.bind(this);
        this.handleFoodDelete = this.handleFoodDelete.bind(this);
        this.addSizeFields = this.addSizeFields.bind(this);


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

    handleFoodTypeChange(e) {
        this.setState({food_type: e.target.value});
    }

    handleFoodSizeChange(i, e) {
        console.log(i);

        let foods= this.state.food_size;
        foods[i].size = e.target.value;

        this.setState({food_size: foods});
    }

    handlePriceChange(i, e) {
        console.log(i);
        let foods= this.state.food_size;
        foods[i].price = e.target.value;

        this.setState({food_size: foods});
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

            })
            .catch(err => {
                console.error(err);
            });
    }

    addSizeFields() {
        let foods= this.state.food_size;
        let newFoods = foods.concat([{size: 'Single',
            price: ''}]);
        this.setState({food_size: newFoods});
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
                <div key={i} className="row">


                    <div className="col-md-6">
                        <label htmlFor={"size" + i}>Food Size</label>
                        <input type="text" className="form-control" value={that.state.food_size[i].size}
                               onChange={(e) => that.handleFoodSizeChange(i, e)} id={"size" + i}/>

                        <label htmlFor={"price" + i}>Price</label>
                        <input type="text" className="form-control" value={that.state.food_size[i].price}
                               onChange={(e) => that.handlePriceChange(i, e)} id={"price" + i}/>

                    </div>
                    <div className="col-md-6">

                    </div>
                </div>

            )
        });

        // size += (
        //     <input type="button" className="btn btn-success" onClick={this.addSizeFields}/>
        // );

        return (
            <div className="col-md-8">
                {foodNodes}
                <br/><br/>
                <div>
                    <label htmlFor="name">Food Name:</label>
                    <input type="text" className="form-control" value={this.state.food_name}
                           onChange={this.handleFoodNameChange} id="name"/>

                    <label htmlFor="type">Food Type:</label>
                    <input type="text" className="form-control" value={this.state.food_type}
                           onChange={this.handleFoodTypeChange} id="type"/>
                </div>
                {size}
                <button className="btn-success" onClick={this.addSizeFields}>ADD SIZE</button>
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

                <input type='submit' onClick={this.handleFoodSubmit} className="btn-success" value='ADD'/>


                {/*<div className="fb-customerchat"*/}
                {/*page_id="1971669279741137"*/}
                {/*minimized="false">*/}
                {/*</div>*/}

            </div>

        )
    }
}
