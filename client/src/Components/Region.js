import React, {Component} from 'react';

// import Select from 'react-select';
// import 'react-select/dist/react-select.css';

export default class Region extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            zip_code: '',
            zip_codes: '',
            sub_regions: '',

            regions: [],


            removeSelected_z: true,
            disabled_z: false,
            crazy_z: false,
            stayOpen_z: false,
            value_z: [],
            rtl_z: false,
            options_z: '',


            removeSelected_r: true,
            disabled_r: false,
            crazy_r: false,
            stayOpen_r: false,
            value_r: [],
            rtl_r: false,
            options_r: ''
        };

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleZipCodeChange = this.handleZipCodeChange.bind(this);

        this.handleRegionSubmit = this.handleRegionSubmit.bind(this);

        this.handleChange_z = this.handleChange_z.bind(this);
        this.handleChange_r = this.handleChange_r.bind(this);
    }

    handleChange_z(e) {
        //console.log(selectedOption);
        this.setState({options_z: e.target.value});
    }

    handleChange_r(e) {
        //console.log(selectedOption);
        this.setState({options_r: e.target.value});
    }

    handleNameChange(e) {
        this.setState({name: e.target.value});
    }

    handleZipCodeChange(e) {
        this.setState({zip_code: e.target.value});
    }


    handleRegionSubmit(e) {
        e.preventDefault();
        let name = this.state.name.trim();
        let zip_code = this.state.zip_code.trim();
        let zip_codes = this.state.options_z.trim();
        let sub_reg = this.state.options_r.trim();
        //console.log(sub_reg);
        if (!name || !zip_code) {
            return;
        }
        let regi= {};
        //console.log(regi);
        regi = {
            name: name,
            zip_code: zip_code,
            zip_codes: zip_codes,
            sub_reg: sub_reg
        };
        // console.log(sub_reg);
        // console.log(regi);
        // console.log(sub_reg);
        this.props.handleRegion(regi);
    }

    render() {
        let regionNodes = this.props.regions.map(region => {
            //console.log(region.sub_zip_codes);
            return (
                <div key={region.name}>
                    <h3>{region.name + " -" + region.zip_code}</h3>
                    <h6>{region.sub_zip_codes.join() + " " + region.sub_regions.join()}</h6>
                </div>

            )
        });

        //const ZIP_CODES  = [];
        //const SUB_REGIONS = [];

        // this.state.regions.forEach(function (region) {
        //     ZIP_CODES.push({label: region.name, value: region.});
        //     SUB_REGIONS.push({label: region.name, value: region.name});
        // });
        //


        return (
            <div className="row">
                <div className="col-md-12">
                    <div className="col-md-8">
                        {regionNodes}
                        <form onSubmit={this.handleRegionSubmit}>
                            <div>
                                <label htmlFor="name">Name</label>
                                <input type="text" className="form-control" value={this.state.name}
                                       onChange={this.handleNameChange} id="name"/>

                                <label htmlFor="name">Zip Code</label>
                                <input type="text" className="form-control" value={this.state.zip_code}
                                       onChange={this.handleZipCodeChange} id="name"/>

                            </div>

                            <div>
                                <label htmlFor="zip">Sub Zip Codes</label>
                                <input type="text" className="form-control" value={this.state.options_z}
                                       onChange={this.handleChange_z} id="zip"/>

                                <label htmlFor="reg">Sub Regions</label>
                                <input type="text" className="form-control" value={this.state.options_r}
                                       onChange={this.handleChange_r} id="reg"/>
                            </div>

                            <br/>
                            <input type='submit' className="btn-success" value='ADD'/>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}