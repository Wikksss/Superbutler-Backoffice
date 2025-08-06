import React, { Component } from 'react';
import {Link } from 'react-router-dom';
import Labels from '../../containers/language/labels';
import Constants from '../../helpers/Constants';



class Settings extends Component {

    loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>
    state = { 
        searchString: '',
        IsSearching: false
    
    }
    handleChange = (e) => {
        
        var value = e.target.value;
        this.setState({ searchString: value,IsSearching: value.toString().trim() !== "" });


    }

    CancelSearch(){

        this.setState({ searchString: "",IsSearching: false});

    }

    render() {

        // var libraries = this.props.items,

        var searchString = this.state.searchString.trim().toLowerCase();
        var libraries = Constants.SetingsOptions;
        if (searchString.length > 0) {
            libraries = libraries.filter(function (i) {
                return i.name.toLowerCase().match(searchString);
            });
        }

        return (

            <div className="card" id="settingsWrapper">
  

              
  <h3 className="card-title card-new-title ">{Labels.Overview}</h3>
               
                <div className="card-body  align-items-center">
                <div className="titleSearchDiv">
                <h3 className="card-title ">{Labels.Settings}</h3>
                    <div className="search-item-wrap searchCustomModifications">
                        <input type="text" className="form-control common-serch-field" value={this.state.searchString} onChange={this.handleChange} placeholder="Search in settings" />
                        <i className="fa fa-search" aria-hidden="true"></i>
                    {this.state.IsSearching ?   <span className="cross-add-search" onClick={() => this.CancelSearch()}>
                    	<i className="fa fa-times" aria-hidden="true" ></i>
                 </span> :""}
                    </div>
                </div>
                <p >This section is for setting your business info, working hours, delivery hours, delivery areas, multiple addresses and your business media.</p>
                    <div className="cardwrapperdv">
                        <div className="d-flex flex-wrap settingsFlexDv">
                            {
                                libraries.map(function (i) {
                                    return <div className="" key={i+'-' + i.name}>
                                        <Link to={i.url}>
                                            <div className="wrimagecard wrimagecard-topimage">
                                                <div className="wrimagecard-topimage_header" >
                                                    <div className="text-center">
                                                        <i className={i.icon} ></i>
                                                        <h4 className="textHeading"> {i.name}</h4>
                                                    </div>
                                                </div>

                                            </div>
                                        </Link>

                                    </div>
                                    //<li>{i.name} <a href={i.url}>{i.url}</a></li>;
                                })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

// Constant, library


export default Settings;
