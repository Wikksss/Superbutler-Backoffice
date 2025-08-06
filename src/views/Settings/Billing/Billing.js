import React, { Component } from 'react';
import * as Utilities from '../../../helpers/Utilities';
import Config from '../../../helpers/Config';
import Constants from '../../../helpers/Constants';

class Billing extends Component {

    constructor(props) {
       super(props);
       this.state = { 
        userObj : [],  
        EnterpriseOrders: [],
        FilterOrders: [],
        ShowLoader: true,
      }
  
  
    //   this.renderData = this.renderData.bind(this);
    //   this.GetOrdersByStatus = this.GetOrdersByStatus.bind(this);
      if(!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))){
        this.state.userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
     }
      else{
        this.props.history.push('/login')
      }
        
      }
    

// #region api calling

 




    render() {

    
        return (
            <div className="card" id="billingPage">
            		     <h3 className="card-title card-new-title">Billing</h3>
                <div className="card-body">
           
                <div>
                <div className="main-area center-text" >

<div className="display-table">
    <div className="display-table-cell">

        <h1 className="title font-white"><b>Comming Soon</b></h1>
        <p className="desc font-white">Our website is currently undergoing scheduled maintenance.
            We Should be back shortly. Thank you for your patience.
        </p>
    </div>
</div>
</div>

                </div>
                   
                </div>
            </div>
        );
    }
}

export default Billing;
