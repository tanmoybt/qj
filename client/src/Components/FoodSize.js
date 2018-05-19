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

        this.handleFoodSizeChange = this.handleFoodSizeChange.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.deleteSize = this.deleteSize.bind(this);

    }

    handleFoodSizeChange(e) {
        this.props.changeSize(this.props.index, e.target.value);
    }

    handlePriceChange(e) {
        this.props.changePrice(this.props.index, e.target.value);
    }

    deleteSize(e){
        this.props.deleteSize(this.props.index);
    }

    render() {
        let deleteItem=
            <div className="col-md-4">

            </div>;
        if(this.props.index){
            deleteItem =
                <div className="col-md-4">
                    <br/>
                    <button className="btn-danger" onClick={this.deleteSize}>remove</button>
                </div>;
        }
        return (
            <div className="row">
                <div className="col-md-8">
                    <label htmlFor="size">Food Size</label>
                    <input type="text" className="form-control" value={this.props.food_size}
                           onChange={this.handleFoodSizeChange} id="size"/>

                    <label htmlFor="price">Price</label>
                    <input type="text" className="form-control" value={this.props.price}
                           onChange={this.handlePriceChange} id="price"/>

                </div>
                {deleteItem}
            </div>
        )
    }
}