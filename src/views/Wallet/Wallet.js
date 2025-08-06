import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
//import { Link } from 'react-router-dom';
import { actionCreators } from '../../store/Statement';
import * as Utilities from '../../helpers/Utilities';
import Config from '../../helpers/Config';
import Constants from '../../helpers/Constants';
import Loader from 'react-loader-spinner';
const $ = require('jquery');
$.DataTable = require('datatables.net');

class Wallet extends Component {
  loading = () => <div className="allorders-loader">  
  <div className="loader-menu-inner"> 
  <div> 
    <Loader type="Oval" color="#ed0000" height={50} width={50}/>  
    <div className="loading-label">Loading.....</div>
    </div>   </div>   </div> 
  
  constructor(props){
    super(props);
    this.state = { userObj : [],  selectListOption: [], selectedMonth: 6, accountStatement: [], enterpriseId: 0, showLoader:true, }
    if(!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))){
      this.state.userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
      this.state.enterpriseId = this.state.userObj.Enterprise.Id
      this.fillMonthPicker();
   }
    else{
      this.props.history.push('/Dashboard')
    }
  }
  componentDidMount() {
    // This method is called when the component is first added to the document
     this.getAccountStatement(Utilities.GetDate().toDate().getTime());
   }

  getAccountStatement(fromDate) {

     this.props.requestAccountStatement(this.state.enterpriseId, fromDate , Utilities.GetDate().toDate().getTime());
     this.setState({showLoader:false})
  }
  fillMonthPicker = () => {

    var momentDate = Utilities.GetDate();
    var userCreatedOn = Utilities.FormatDate(this.state.userObj.CreatedOn);
    var year = userCreatedOn.format('YYYY')
    var month = userCreatedOn.format('MMMM')
    var monthsDiff = momentDate.diff(userCreatedOn,'months'); 

    this.state.selectListOption.push({ month: momentDate.toDate().getTime(), displayMonth: "This month" });
    if(monthsDiff > 1){
      this.state.selectListOption.push({ month: momentDate.add(-3, 'M').toDate().getTime(), displayMonth: "3 months" });
    }
    if(monthsDiff > 3){
      this.state.selectListOption.push({ month: momentDate.add(-6, 'M').toDate().getTime(), displayMonth: "6 months" });
    }
    if(monthsDiff > 6){
      this.state.selectListOption.push({ month: momentDate.add(-12, 'M').toDate().getTime(), displayMonth: "1 year" });
    }
    if(monthsDiff > 12)
    {
      this.state.selectListOption.push({ month: momentDate.add(-24, 'M').toDate().getTime(), displayMonth: "2 years" });
    }
    this.state.selectListOption.push({ month: momentDate.add(-monthsDiff, 'M').toDate().getTime(), displayMonth: "Since " + month + " " + year });
  }

   renderData = (props)=> {
     
    return (
    <div className="all-order-res-scroll">
      <table className='table table-striped wallet' id="tblStatement">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Debit {Config.Setting.currency}</th>
            <th>Credit {Config.Setting.currency}</th>
            <th>Balance {Config.Setting.currency}</th>
          </tr>
        </thead>
        { this.state.showLoader ? this.loading() :

        <tbody>
          {props.statement.map(data =>
           
           <tr>
              <td>{data.Date}</td>
              <td>{data.Description}</td>
              <td>{data.Debit}</td>
              <td>{data.Credit}</td>
              <td>{data.Balance}</td>
            </tr>
          )}
        </tbody>
        }
      </table>
   </div>
    );
    
  }

  bindDataTable = () => { 
  $("#tblStatement").DataTable().destroy();
  $('#tblStatement').DataTable({
      "paging": true,
      "ordering": false,
      "info": true,
      "lengthChange": false,
      "search": {
          "smart": false
      },
      "language": {
        "searchPlaceholder": "Search",
        "search":""
    }
  });
}

  render() {
    
    return (
      <div className="card">
                            <div className="card-body">
                                <h3 className="card-title m-b-0">Wallet</h3>
                                  <div className="form-group wallet-left-select m-t-30">
                                    <div className="control-label">Select from</div>
                                    <select className="custom-select" onChange={(e) => this.getAccountStatement(e.target.value)}>
                                      {this.state.selectListOption.map((option, key) => <option key={key} value={option.month}>{option.displayMonth}</option>)}
                                    </select>
                                  </div>
                                  {this.renderData(this.props)}
                                  
                             </div>
                        </div>
   );
   
  }
}

export default connect(
  state => state.statement,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(Wallet);
