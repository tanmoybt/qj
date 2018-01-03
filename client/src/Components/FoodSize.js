import React, {Component} from 'react';

// import Select from 'react-select';
// import 'react-select/dist/react-select.css';

export default class FoodSize extends Component {
    constructor(props) {
        super(props);
        this.state = {
            food_size: '',
            price: ''
        };

        this.handleSizeSubmit = this.handleSizeSubmit.bind(this);

    }

    handleFoodSizeChange(e) {
        this.setState({name: e.target.value});
    }

    handlePriceChange(e) {
        this.setState({zip_code: e.target.value});
    }


    handleSizeSubmit(e) {
        e.preventDefault();

    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSizeSubmit}>
                    <div>
                        <label htmlFor="size">Food Size</label>
                        <input type="text" className="form-control" value={this.state.food_size}
                               onChange={this.handleFoodSizeChange} id="size" />

                        <label htmlFor="price">Price</label>
                        <input type="text" className="form-control" value={this.state.price}
                               onChange={this.handlePriceChange} id="price"/>

                        <input type='submit' className="btn-success" value='ADD'/>

                    </div>
                </form>
            </div>
        )
    }
}