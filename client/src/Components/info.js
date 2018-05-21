//Comment.js
import React, {Component} from 'react';

export default class Info extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cuisine: '',
            food_tag: '',
            ingredient_tag: '',
            cuisines: [],
            food_tags: [],
            ingredient_tags: []
        };

        this.handleCuisineChange = this.handleCuisineChange.bind(this);
        this.handleFoodTagChange = this.handleFoodTagChange.bind(this);
        this.handleIngredientTagChange = this.handleIngredientTagChange.bind(this);

        this.handleCuisineSubmit = this.handleCuisineSubmit.bind(this);
        this.handleFoodTagSubmit = this.handleFoodTagSubmit.bind(this);
        this.handleIngredientTagSubmit = this.handleIngredientTagSubmit.bind(this);
    }


    handleIngredientTagChange(e) {
        this.setState({ingredient_tag: e.target.value});
    }

    handleFoodTagChange(e) {
        this.setState({food_tag: e.target.value});
    }

    handleCuisineChange(e) {
        this.setState({cuisine: e.target.value});
    }


    handleCuisineSubmit(e) {
        e.preventDefault();
        let cuisine = this.state.cuisine.trim();
        if (!cuisine) {
            return;
        }
        let cuis = {
            cuisine: cuisine
        };
        this.props.handleCuisine(cuis);
    }

    handleFoodTagSubmit(e) {
        e.preventDefault();
        let food_tag = this.state.food_tag.trim();
        if (!food_tag) {
            return;
        }
        let food = {
            tag: food_tag
        };
        this.props.handleFoodTag(food);
    }

    handleIngredientTagSubmit(e) {
        e.preventDefault();
        let ing = this.state.ingredient_tag.trim();
        if (!ing) {
            return;
        }
        let ing_tag = {
            tag: ing
        };
        this.props.handleIngredientTag(ing_tag);
    }

    render() {
        let cuisineNodes = this.props.cuisines.map(cuisine => {
            return (
                <div key={cuisine._id}>
                    <h4>{cuisine.cuisine}</h4>
                </div>

            )
        });

        let foodTagNodes = this.props.food_tags.map(food_tag => {
            return (
                <div key={food_tag._id}>
                    <h4>{food_tag.tag}</h4>
                </div>

            )
        });

        let ingredientTagNodes = this.props.ingredient_tags.map(ingredient_tag => {
            return (
                <div key={ingredient_tag._id}>
                    <h4>{ingredient_tag.tag}</h4>
                </div>

            )
        });

        return (
            <div className="row">
                <div className="col-md-12">
                    <div className="col-md-4">
                        {cuisineNodes}
                        <form onSubmit={this.handleCuisineSubmit}>
                            <div>
                                <label htmlFor="name">Cuisine</label>
                                <input type="text" className="form-control" value={this.state.cuisine}
                                       onChange={this.handleCuisineChange} id="name"/>

                            </div>
                            <br/>
                            <input type='submit' className="btn-success" value='ADD' disabled={this.props.cuisineEnabled}/>
                        </form>
                    </div>
                    <div className="col-md-4">
                        {foodTagNodes}
                        <form onSubmit={this.handleFoodTagSubmit}>
                            <div>
                                <label htmlFor="name">Food Tag</label>
                                <input type="text" className="form-control" value={this.state.food_tag}
                                       onChange={this.handleFoodTagChange} id="name"/>
                            </div>
                            <br/>
                            <input type='submit' className="btn-success" value='ADD' disabled={this.props.foodtagEnabled}/>
                        </form>
                    </div>
                    <div className="col-md-4">
                        {ingredientTagNodes}
                        <form onSubmit={this.handleIngredientTagSubmit}>
                            <div>
                                <label htmlFor="name">Ingredient Tag</label>
                                <input type="text" className="form-control" value={this.state.ingredient_tag}
                                       onChange={this.handleIngredientTagChange} id="name"/>
                            </div>
                            <br/>
                            <input type='submit' className="btn-success" value='ADD' disabled={this.props.ingredienttagEnabled}/>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}