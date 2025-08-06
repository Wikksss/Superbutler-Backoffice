import React, { Component } from 'react';
import * as Utilities from '../../helpers/Utilities';
import Config from '../../helpers/Config';
import Constants from '../../helpers/Constants';
import * as VoucherService from '../../service/VoucherBatch';
import Loader from 'react-loader-spinner';
import { AppSwitch } from '@coreui/react';
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';
const $ = require("jquery");
const moment = require('moment-timezone');
$.DataTable = require("datatables.net");

class GroupVoucher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userObj: [],
      Vouchers: [],
      FilterVouchers: [],
      ShowLoader: true,
      deleteAlert: false,
      suspendAlert: false,
      activateAlert: false,
      batchData: {}
    }


    this.renderData = this.renderData.bind(this);

  }

  GetVouchers = async (bind) => {

    this.setState({ ShowLoader: true });
    var data = await VoucherService.GetBatches();
    this.setState({ Vouchers: data, FilterVouchers: data });
    this.setState({ ShowLoader: false });
    if (bind == true) {
      this.bindDataTable();
    }

  }


  getVoucherDetails = async (data) => {
    let response = await VoucherService.GetBatchDetail(data.Id)
    if (response != undefined && response != null) {
      
      this.navigateToBatchDetails(response, data)
    }
  }

  navigateToBatchDetails(response, data) {

    this.props.history.push('/Group-voucher/batchDetails', { batchDetails: response, voucherData: data })
  }
  AddNewVoucher() {

    this.props.history.push('/Group-voucher/add-new', { IsEdit: false })
  }

  EditVoucher(id, data) {

    this.props.history.push(`/Group-voucher/${id}`, { IsEdit: true, voucherData: data })
  }

  componentDidMount() {
    this.GetVouchers(true);

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
        "search": ""
      }

    });
  }



  loading = () => <div className="allorders-loader">
    <div className="loader-menu-inner">
      <Loader type="Oval" color="#ed0000" height={50} width={50} />
      <div className="loading-label">Loading.....</div>
    </div>
  </div>

  ActiveBatchVoucher = async (batch) => {
    let response = await VoucherService.activateBatchVoucher(batch.Id)
    
    if (!response.HasError) {
      this.GetVouchers(false)
      Utilities.notify(`'${batch.Name}'` + " batch voucher activated successfully ", "s");
      this.setState({
        activateAlert: false
      })
    } else {
      Utilities.notify("Something went wrong while activating the " + `'${batch.Name}'` + " batch voucher", "e");
      this.setState({
        activateAlert: false
      })
    }
  }
  suspendBatchVoucher = async (batch) => {
    let response = await VoucherService.suspendBatchVoucher(batch.Id)
    
    if (!response.HasError) {
      Utilities.notify(`'${batch.Name}'` + " batch voucher suspended successfully", "s");
      this.GetVouchers(false)
      this.setState({
        suspendAlert: false
      })
    }
    else {
      Utilities.notify("Something went wrong while suspending the " + `'${batch.Name}'` + " batch voucher", "e");
      this.setState({
        suspendAlert: false
      })
    }
  }
  deleteBatchVoucher = async (batch) => {
    let response = await VoucherService.deleteBatchVoucher(batch.Id)
    
    if (!response.HasError) {
      Utilities.notify(`'${batch.Name}'` + " batch voucher deleted successfully", "s");
      this.GetVouchers(false)
      this.setState({
        deleteAlert: false
      })
    } else {
      Utilities.notify("Something went wrong while deleting the " + `'${batch.Name}'` + " batch voucher", "e");
      this.setState({
        suspendAlert: false
      })
    }
  }

  renderData(voucher) {

    if (this.state.ShowLoader === true) {
      return this.loading()
    }

    return (

      <tbody >
        {voucher.length > 0 ? voucher.map(data =>
          <tr >

            <td data-column="Name">
              <div style={{ color: '#00BCD4', fontWeight: 'bold', cursor: 'pointer', }}
                onClick={() => this.getVoucherDetails(data)}
              >
                {data.Name}
              </div>
            </td>
            <td data-column="Type">
              <div >
                {data.HasUniqueVoucher == true ? 'Unique Vouchers' : 'Voucher Group'}
              </div>
            </td>
            <td data-column="Total Vouchers">
              <div >
                {data.HasUniqueVoucher ? data.Quantity : data.GroupVoucherQuantity}
              </div>
            </td>
            <td data-column="Available">
              <div>

                {data.HasUniqueVoucher ? data.AvailableCount : data.AvailableCount > 0 ? data.AvailableCount : '--'}
              </div>
            </td>


            <td data-column="Expiry Date">
              <div >
                {data.ExpiryDate == '' ? '--' : data.ExpiryDate}
              </div>
            </td>
            <td data-column="Source">
              <div >
                {data.IsExternal ? 'SuperWeb' : 'Platform'}
              </div>
            </td>
            <td data-column="Actions">
              <div className="action-voucher-btn-wrap ">
              {
                  data.IsDeleted ?
                    <>
                      <p>Deleted</p>
                    </> :
                    <>
                      {
                        data.IsActive == true ?
                          <>
                            <span className='m-b-0 statusChangeLink m-r-20' onClick={(e) => {
                              e.stopPropagation()
                              this.setState({
                                batchData: data,
                                deleteAlert: true
                              })
                            }}><span><i class="fa fa-trash-o font-18 delete"></i>Delete</span></span>
                            {
                              data.HasUniqueVoucher == true &&
                              <span className='m-b-0 statusChangeLink m-r-20' onClick={(e) => {
                                e.stopPropagation()
                                this.setState({
                                  batchData: data,
                                  suspendAlert: true
                                })
                              }}><span><i class="fa fa-ban "></i>Suspend</span> </span>
                            }
                            <span className='m-b-0 statusChangeLink m-r-20' onClick={(e) => {
                              e.stopPropagation()
                              this.EditVoucher(data.Id, data)
                            }}><span><i class="fa fa-edit font-18"></i>Edit</span></span>
                          </>
                          :
                          <>
                            <span className='m-b-0 statusChangeLink m-r-20' onClick={(e) => {
                              e.stopPropagation()
                              this.setState({
                                batchData: data,
                                activateAlert: true
                              })
                            }}><span><i className="fa fa-check" aria-hidden="true" ></i>Activate</span></span>
                          </>
                      }
                    </>
                }
              </div>

            </td>

          </tr>
        ) : ""}
      </tbody>

    );

  }

  suspendAlert() {
    return (
      <SweetAlert
        show={this.state.suspendAlert}
        title="Confirm"
        text={'Are you sure you want to suspend ' + this.state.batchData.Name + '?'}
        onConfirm={() => this.suspendBatchVoucher(this.state.batchData)}
        confirmButtonText="Yes"
        onEscapeKey={() => this.setState({ suspendAlert: false })}
        showCancelButton
        onCancel={() => {
          this.setState({ suspendAlert: false });
        }}
      />
    )
  }
  activateAlert() {
    return (
      <SweetAlert
        show={this.state.activateAlert}
        title="Confirm"
        text={'Are you sure you want to activate ' + this.state.batchData.Name + '?'}
        onConfirm={() => this.ActiveBatchVoucher(this.state.batchData)}
        confirmButtonText="Yes"
        onEscapeKey={() => this.setState({ activateAlert: false })}
        showCancelButton
        onCancel={() => {
          this.setState({ activateAlert: false });
        }}
      />
    )
  }
  deleteAlert() {
    return (
      <SweetAlert
        show={this.state.deleteAlert}
        title="Confirm"
        text={'Are you sure you want to delete ' + this.state.batchData.Name + '?'}
        onConfirm={() => this.deleteBatchVoucher(this.state.batchData)}
        confirmButtonText="Yes"
        onEscapeKey={() => this.setState({ deleteAlert: false })}
        showCancelButton
        onCancel={() => {
          this.setState({ deleteAlert: false });
        }}
      />
    )
  }

  render() {
    return (
      <div className="group-voucher card" id="orderWrapper">
          <div className="m-b-20 card-new-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="card-title ">Vouchers
          </h3>
            <span className="btn btn-primary cursor-pointer btn btn-secondary" onClick={(e) => this.AddNewVoucher()}><i className="fa fa-plus" aria-hidden="true"></i> Add Batch Voucher</span>
          </div>
        <div className="card-body card-body-res">
        
          <div className="vouchers-main-wrap new-res-data-table" style={{ marginTop: '20px' }}>
            <table className='table table-striped v-group' id="tblOrders">
              <thead>
                <tr>

                  <th>
                    Name
                      </th>
                  <th>
                    Type
                        </th>
                  <th className="total-v">
                    Total Vouchers
                        </th>
                  <th>
                    Available
                        </th>

                  <th className="expiry-date-1">
                    Expiry Date
                        </th>
                  <th>
                    Source
                        </th>
                  <th className="action-3">
                    Actions
                        </th>

                </tr>
              </thead>

              {this.renderData(this.state.FilterVouchers)}

            </table>
          </div>

          {this.activateAlert()}
          {this.suspendAlert()}
          {this.deleteAlert()}
        </div>
      </div>

    );
  }
}

export default GroupVoucher;