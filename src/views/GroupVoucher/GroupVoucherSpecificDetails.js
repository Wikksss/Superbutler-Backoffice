import React, { Component } from 'react';
import * as Utilities from '../../helpers/Utilities';
import Config from '../../helpers/Config';
import Constants from '../../helpers/Constants';
import * as VoucherService from '../../service/VoucherBatch';
import * as revertVoucherService from '../../service/voucher';
import Loader from 'react-loader-spinner';
import { AppSwitch } from '@coreui/react';
import { FormGroup, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { AvForm, AvField, AvInput, AvGroup } from 'availity-reactstrap-validation';
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const $ = require("jquery");
const moment = require('moment-timezone');
$.DataTable = require("datatables.net");

class GroupVoucherDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            batchDetails: props.location.state.voucherData,
            batchList: props.location.state.details,
            voucherValue: props.location.state.details.length > 0 ? props.location.state.details[0].VoucherValue : 0,
            revertObj: {},
            message: '',
            dataSet: []
        }
        this.setExcelSheetDataSet()
    }



    setExcelSheetDataSet = () => {
        this.state.dataSet = []
        for (let index = 0; index < this.state.batchList.length; index++) {
            this.state.dataSet.push({
                username: this.state.batchList[index].DisplayName,
                email: this.state.batchList[index].PrimaryEmail,
                redeemDate: this.state.batchList[index].RedeemDate,
                ip: this.state.batchList[index].IP,
                deviceId: this.state.batchList[index].DeviceId != undefined ? this.state.batchList[index].DeviceId: '',
                os: this.state.batchList[index].OperatingSystem,
                version: this.state.batchList[index].OsVersion,
                modal: this.state.batchList[index].Model,
                source: this.state.batchList[index].RedemptionSource,
                walletBalance: this.state.batchList[index].UserWalletBalance,
                revert: this.state.batchList[index].StatusID > 1 ? 'Reverted' : ''
            })

        }

    }

    ShowCode(token) {
        let params = 'scrollbars=no,resizable=no,status=no,titlebar=no,location=no,toolbar=no,menubar=no,width=350,titlebar=no,height=350,left=-500,top=-200';

        window.open(Config.Setting.baseUrl + '/admin/voucherBatches/qr-bar-generation.aspx?code=' + token, token, params);
    }

    GetVouchers = async () => {

        // this.setState({ ShowLoader: true });
        // var data = await VoucherService.GetBatches();
        // this.setState({ Vouchers: data, FilterVouchers: data });
        // this.setState({ ShowLoader: false });
        this.bindDataTable();

    }

    getVoucherDetailsBy = async () => {
        let response = await VoucherService.GetVoucherDetailBy(this.state.batchDetails.Id)
        
        if (response != undefined) {
            this.setState({
                batchList: response
            }, () => {
                this.setExcelSheetDataSet()
            })
        }
    }


    getVoucherDetails = async (Id) => {
        let response = await VoucherService.GetBatchDetail(Id)
        if (response != undefined && response != null) {
            
        }
    }

    AddNewVoucher() {

        // this.props.history.push('/Group-voucher/add-new')
    }

    // EditVoucher(id) {

    //     this.props.history.push(`/Group-voucher/${id}`)
    // }

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
                "search": ""
            }

        });
    }

    onRevertClick = (data) => {
        
        var balanceAfterRollBack = Number(data.UserWalletBalance) - Number(data.VoucherValue);
        var hasEnoughBalance = balanceAfterRollBack > 0;
        var revertMessage = `Do you want "${data.DisplayName} " to redeem voucher from this batch again? `;
        revertMessage += !hasEnoughBalance ? "This user's current wallet balance is " + Utilities.GetCurrencySymbol() + data.UserWalletBalance + ", if you proceed with rollback, their wallet balance will be " + Utilities.GetCurrencySymbol() + balanceAfterRollBack : "";
        this.setState({
            validateRevertModal: true,
            revertObj: data,
            message: revertMessage
        })
    }

    revertVoucher = async (status) => {
        try {
            this.setState({
                validateRevertModal: false
            })
            
            let response = await revertVoucherService.Revert(this.state.revertObj.VoucherId, this.state.revertObj.Id, status)
            if (response) {
                this.getVoucherDetailsBy()
            } else {
                Utilities.notify("Something went wrong while reverting this voucher", "e");
            }
        } catch (error) {
            Utilities.notify("Something went wrong while reverting this voucher", "e");
            console.log('error', error.message)
        }
    }

    GenerateValidTimeModalModel() {

        return (
            <Modal isOpen={this.state.validateRevertModal} className={this.props.className}>
                <ModalHeader>Confirm</ModalHeader>
                <ModalBody className="padding-0 ">
                    <AvForm>
                        <div className="padding-20 scroll-model-web">
                            <FormGroup className="modal-form-group">
                                <Label className="control-label">
                                    {
                                        this.state.message
                                    }
                                </Label>
                            </FormGroup>
                        </div>
                        <FormGroup className="modal-footer" >
                            <Button color="secondary" onClick={() => this.setState({
                                validateRevertModal: false
                            })}>Cancel</Button>
                            <Button color="success" onClick={() => this.revertVoucher(3)}>No</Button>
                            <Button color="success" onClick={() => this.revertVoucher(2)}>Yes</Button>
                            {/* <Button color="success" onClick={() => this.UpdateValidDeliveryHour() }>
                  {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                    : <span className="comment-text">Update</span>} */}

                            {/* </Button> */}

                        </FormGroup>
                    </AvForm>
                </ModalBody>
            </Modal>

        )
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
                    <tr>

                        <td data-column="UserName">
                            <div >
                                {data.DisplayName}
                            </div>
                        </td>
                        <td data-column="Email">
                            <div >
                                {data.PrimaryEmail != undefined ? data.PrimaryEmail : ''}
                            </div>

                        </td>
                        <td data-column="IP ">
                            <div>
                                {data.IP}
                            </div>
                        </td>
                        <td data-column="Date">
                            <div>

                                {data.StartDate}
                            </div>
                        </td>


                        <td data-column="Mobile Details">
                            <div >
                                {data.OperatingSystem != "" ? data.OperatingSystem + " v" + data.OsVersion + " " + data.Model : '--'}
                            </div>
                        </td>
                        <td data-column="Source">
                            <div >
                                {data.RedemptionSource != "" ? data.RedemptionSource : '--'}
                            </div>
                        </td>
                        <td data-column="Wallet Balance">
                            <div >
                                {data.UserWalletBalance != '' ? Utilities.GetCurrencySymbol() + data.UserWalletBalance : '--'}
                            </div>
                        </td>
                        <td data-column="Action">
                            <div >
                                {
                                    data.StatusID > 1 ?
                                        <label>Reverted</label> :

                                        <button className='btn btn-primary' style={{ zIndex: 2 }} onClick={(e) => {
                                            e.stopPropagation()
                                            this.onRevertClick(data)

                                        }}>Revert</button>
                                }

                            </div>

                        </td>

                    </tr>
                ) : ""}
            </tbody>

        );

    }

    render() {
        return (
            <div className="card group-voucher" id="orderWrapper">
                 <div className="m-b-20 card-new-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 className="card-title ">{this.state.batchDetails.Title + ' ' + 'Details'}
                        </h3>
                        {/* {
                            this.state.batchDetails.HasUniqueVoucher == false &&
                            <span className="btn btn-primary-plus btn btn-secondary" onClick={(e) => this.AddNewVoucher()}><i className="fa fa-plus" aria-hidden="true"></i>Add new Voucher</span>
                        } */}
                        <span>
                            <ExcelFile filename={this.state.batchDetails.Title} element={<span className="btn btn-primary-plus btn btn-secondary" ><i className="fa fa-plus" aria-hidden="true"></i>Download Excel sheet</span>}>
                                <ExcelSheet data={this.state.dataSet} name="Vouchers">
                                    <ExcelColumn label="UserName" value="username" />
                                    <ExcelColumn label="Email" value="email" />
                                    <ExcelColumn label="Redeem Date" value="redeemDate" />
                                    <ExcelColumn label="IP" value="ip" />
                                    <ExcelColumn label="DeviceID" value="deviceId" />
                                    <ExcelColumn label="Operating System" value="os" />
                                    <ExcelColumn label="OS Version" value="version" />
                                    <ExcelColumn label="Model" value="modal" />
                                    <ExcelColumn label="Source" value="source" />
                                    <ExcelColumn label="Wallet Balance" value="walletBalance" />
                                    <ExcelColumn label="Revert" value="revert" />
                                </ExcelSheet>
                            </ExcelFile>
                        </span>
                    </div>
                <div className="card-body card-body-res">
                   
                    <div className="v-d-wrap">
                        <span>Voucher Value:</span>
                        <span>{Utilities.GetCurrencySymbol()}{this.state.voucherValue}</span>
                    </div>


                    <div className="v-d-wrap">
                        <span>Qualtity:</span>
                        <span>{this.state.batchDetails.Quantity}</span>
                    </div>

                    <div className="v-d-wrap">
                        <span>Available:</span>
                        <span>{this.state.batchDetails.Quantity - this.state.batchDetails.RedemptionCount}</span>
                    </div>

                    <div className="v-d-wrap">
                        <span>Expiry Date:</span>
                        <span>{this.state.batchDetails.ExpiryDate}</span>
                    </div>
                    <hr class="solid"></hr>
                    <div className="vouchers-main-wrap new-res-data-table" style={{ marginTop: '20px' }}>
                        <table className='table table-striped' id="tblOrders">
                            <thead>
                                <tr>

                                    <th>
                                        <div >UserName</div>
                                    </th>
                                    <th>
                                        <div >Email</div>
                                    </th>
                                    <th>
                                        <div>IP</div>
                                    </th>
                                    <th>
                                        <div>Date</div>
                                    </th>
                                    <th>
                                        <div>Mobile Details</div>
                                    </th>
                                    <th>
                                        <div >Source</div>
                                    </th>
                                    <th className="t-balance-w">
                                        <div>Wallet Balance</div>
                                    </th>
                                    <th>
                                        <div>Action</div>
                                    </th>

                                </tr>

                            </thead>

                            {this.renderData(this.state.batchList)}

                        </table>
                    </div>

                </div>
                {this.GenerateValidTimeModalModel()}
            </div>

        );
    }
}

export default GroupVoucherDetails;