import React, { Component } from 'react';
import * as Utilities from '../../helpers/Utilities';
import Config from '../../helpers/Config';
import Constants from '../../helpers/Constants';
import * as VoucherService from '../../service/voucher';
import Loader from 'react-loader-spinner';
import { AppSwitch } from '@coreui/react';
const $ = require("jquery");
const moment = require('moment-timezone');
$.DataTable = require("datatables.net");

class Voucher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userObj: [],
      Vouchers: [],
      FilterVouchers: [],
      ShowLoader: true,
    }


    this.renderData = this.renderData.bind(this);

  }

  GetVouchers = async () => {

    this.setState({ ShowLoader: true });
    var data = await VoucherService.Get();
    this.setState({ Vouchers: data, FilterVouchers: data });
    this.setState({ ShowLoader: false });
    this.bindDataTable();

  }

  
  AddNewVoucher(){

    this.props.history.push('/voucher/add-new')
  }
  
  EditVoucher(id){

    this.props.history.push(`/voucher/${id}`)
  }

  componentDidMount() {
    this.GetVouchers();

  }

  bindDataTable() {
    $("#tblOrders").DataTable().destroy();
    $('#tblOrders').DataTable({
      "paging": false,
      "ordering": false,
      "info": false,
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



  loading = () => <div className="allorders-loader">
    <div className="loader-menu-inner">
      <Loader type="Oval" color="#ed0000" height={50} width={50} />
      <div className="loading-label">Loading.....</div>
    </div>
  </div>

  renderData(voucher) {

    if (this.state.ShowLoader === true) {
      return this.loading()
    }

    return (

      <tbody>
        {voucher.length > 0 ? voucher.map(data =>
        <tr onClick={()=> this.EditVoucher(data.Id)}>
          <td>
            <div className="Vouchers-wrap">
              <div className="voucher-title-row">
                <div className="voucher-offer-wrap">
                  <div className="voucher-heading">{data.Label}</div>
                <div className="voucher-active-wrap"> 
                <span className={data.IsActive ? "v-active" : "d-active"}>Active</span>
                </div>
                </div>
              <div className="voucher-code-wrap">
                <span>Code:</span>
                 <div className="voucher-code">
                  {data.Code}
                </div>
                </div> 

              </div>

              <div className="voucher-detail-row">
                <div className="voucher-left-section">
                  <div className="voucher-detail">
                    <div className="voucher-common-label">
                      Min Order
                    </div>
                    <div className="voucher-common-data">{Utilities.GetCurrencySymbol()}{data.MinimumOrderAmount}</div>
                  </div>
                  <div className="voucher-detail">
                    <div className="voucher-common-label">
                     Available
                    </div>
                    <div className="voucher-common-data">{data.Quantity - data.RedemptionCount}/{data.Quantity}</div>
                  </div>
                </div>
                <div className="voucher-right-section">
                  <div className="voucher-detail">
                    <div className="voucher-common-label">
                      Multiple USe
                    </div>
                    <div className="voucher-common-data">{data.AllowMultipleUse ? "Yes" : "No"}</div>
                  </div>
                  <div className="voucher-detail">
                    <div className="voucher-common-label">
                     Expiry
                    </div>
                    <div className="voucher-common-data">{data.ExpiryDate}</div>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
         ) : ""}
      </tbody>

    );

  }

  render() {

    return (
      <div className="card" id="orderWrapper">
        <div className="m-b-20 card-new-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="card-title ">Vouchers
          
          </h3>
          <span className="btn btn-primary-plus btn btn-primary" onClick={(e)=> this.AddNewVoucher()}><i className="fa fa-plus" aria-hidden="true"></i> New Voucher</span>
     
        </div>
        <div className="card-body card-body-res">


          <div className="vouchers-main-wrap">
            <table className='table table-striped' id="tblOrders">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}></th>
                  
                  {/* <th style={{width:'200px'}} >Order ID</th>
                    <th style={{width:'180px'}}>Order Time</th>
                    <th>Customer</th>
                    <th>Status</th> */}

                </tr>
              </thead>

              {this.renderData(this.state.FilterVouchers)}

            </table>
          </div>

        </div>
      </div>

    );
  }
}

export default Voucher;