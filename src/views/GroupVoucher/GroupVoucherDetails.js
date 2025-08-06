import React, { Component } from 'react';
import * as Utilities from '../../helpers/Utilities';
import Config from '../../helpers/Config';
import Constants from '../../helpers/Constants';
import * as VoucherBatchService from '../../service/VoucherBatch';
import * as VoucherService from '../../service/voucher';
import * as revertVoucherService from '../../service/voucher';
import Loader from 'react-loader-spinner';
import { AppSwitch } from '@coreui/react';
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';
import ReactExport from "react-export-excel";

import { FormGroup, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { AvForm, AvField, AvInput, AvGroup } from 'availity-reactstrap-validation';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const $ = require("jquery");
const moment = require('moment-timezone');
$.DataTable = require("datatables.net");

class GroupVoucherDetails extends Component {
    constructor(props) {
        super(props);
        if (props.location.pathname == '/Group-voucher/batchDetails') {
            this.state = {
                batchDetails: props.location.state.voucherData,
                batchList: props.location.state.batchDetails,
                voucherValue: props.location.state.batchDetails.length > 0 ? props.location.state.batchDetails[0].VoucherValue : 0,
                deleteAlert: false,
                searchModal: false,
                suspendAlert: false,
                activateAlert: false,
                batchData: {},
                downloadExcel: false,
                dataSet: [],
                pathname: props.location.pathname,
                ShowLoader: false,
                NoResult: false,
                viewQRCodeModal: false,
            }
            this.setExcelSheetDataSet()
        } else {
            this.state = {
                batchDetails: props.location.state.voucherData,
                batchList: props.location.state.details,
                voucherValue: props.location.state.details.length > 0 ? props.location.state.details[0].VoucherValue : 0,
                revertObj: {},
                message: '',
                dataSet: [],
                pathname: props.location.pathname,
                ShowLoader: false,
            }
            this.setExcelSheetDataSet2()
        }
        if (props.history.action == 'POP' && props.location.pathname == '/Group-voucher/batchDetails') {
            this.getVoucherDetails()
        }
        this.searchViewModal = this.searchViewModal.bind(this);
    }

    setExcelSheetDataSet = () => {
        this.state.dataSet = []
        if (this.state.batchDetails.HasUniqueVoucher == false) {
            for (let index = 0; index < this.state.batchList.length; index++) {
                this.state.dataSet.push({
                    name: this.state.batchList[index].Title,
                    voucherValue: Utilities.GetCurrencySymbol() + " " + this.state.batchList[index].VoucherValue,
                    code: this.state.batchList[index].VoucherCode,
                    pin: this.state.batchList[index].PinCode,
                    available: this.state.batchList[index].Quantity - this.state.batchList[index].RedemptionCount,
                    quantity: this.state.batchList[index].Quantity,
                    expiry: this.state.batchList[index].ExpiryDate,

                })

            }
        } else {
            for (let index = 0; index < this.state.batchList.length; index++) {
                this.state.dataSet.push({
                    code: this.state.batchList[index].VoucherCode,
                    pin: this.state.batchList[index].PinCode,
                    username: this.state.batchList[index].UserName,
                    email: this.state.batchList[index].PrimaryEmail,
                    redeenDate: this.state.batchList[index].RedeemDate,
                    ip: this.state.batchList[index].Ip,
                    deviceId: this.state.batchList[index].DeviceId,
                    os: this.state.batchList[index].OperatingSystem,
                    version: this.state.batchList[index].OsVersion,
                    modal: this.state.batchList[index].Model,
                    expiry: this.state.batchList[index].ExpiryDate,
                    revert: this.state.batchList[index].IsReverted == true ? 'Reverted' : ''
                })

            }
        }
    }
    searchViewModal() {
        this.setState({ searchModal: !this.state.searchModal, NoResult: false })
    }


    GetVouchers = async () => {

        // this.setState({ ShowLoader: true });
        // var data = await VoucherService.GetBatches();
        // this.setState({ Vouchers: data, FilterVouchers: data });
        // this.setState({ ShowLoader: false });
        this.bindDataTable();

    }

    SearchVoucherDetailsByUser = async (info) => {
        let response = await VoucherBatchService.GetVoucherDetailByUser(this.state.batchDetails.Id, info)
        this.setState({ IsSave: false })
        if (response != undefined && response.length > 0) {

            var index = Utilities.GetObjectArrId(response[0].VoucherId, this.state.batchList)
            this.goToVoucherDetails(response, this.state.batchList[index])
            this.setState({ searchModal: false })
            return;
        }

        this.setState({ NoResult: true });

    }

    GenerateQRCode = async (token) => {

        this.toggleQRCodeModal();
        let response = await VoucherService.GetQRCode(token)
        this.setState({ QRCode: response });
    }

    getVoucherDetails = async () => {
        let response = await VoucherBatchService.GetBatchDetail(this.state.batchDetails.Id)
        if (response != undefined && response != null) {
            this.setState({
                batchList: response
            })
        }
    }

    AddNewVoucher() {

        this.props.history.push('/Group-voucher/create', { details: this.state.batchDetails })
    }


    loading = () => <div className="allorders-loader">
        <div className="loader-menu-inner">
            <Loader type="Oval" color="#ed0000" height={50} width={50} />
            <div className="loading-label">Loading.....</div>
        </div>
    </div>

    getVoucherDetailsBy = async (data) => {
        let response = await VoucherBatchService.GetVoucherDetailBy(data.Id)
        if (response != undefined) {

            this.goToVoucherDetails(response, data)
        }
    }

    goToVoucherDetails(voucherDetails, data) {

        this.props.history.push('/Group-voucher/voucherDetails', { details: voucherDetails, voucherData: data })
    }

    activateVoucher = async (data) => {
        try {
            this.setState({ ShowLoader: true });
            let response = await VoucherService.ActivateVoucher(data.Id)
            if (response) {
                this.getVoucherDetails()
                Utilities.notify(`'${data.Title}'` + " voucher activated successfully", "s");
                this.setState({
                    activateAlert: false,
                    ShowLoader: false
                })
            } else {
                Utilities.notify("Something went wrong while activating this voucher", "e");
                this.setState({
                    activateAlert: false,
                    ShowLoader: false
                })
            }
        } catch (error) {
            this.setState({ ShowLoader: false });
            console.log('error', error.message)
        }
    }
    suspendVoucher = async (data) => {
        try {
            this.setState({ ShowLoader: true });
            let response = await VoucherService.SuspendVoucher(data.Id)
            if (response) {
                this.getVoucherDetails()
                Utilities.notify(`'${data.Title}'` + " voucher suspended successfully", "s");
                this.setState({
                    suspendAlert: false,
                    ShowLoader: false
                })
            } else {
                Utilities.notify("Something went wrong while suspending this voucher", "e");
                this.setState({
                    ShowLoader: false,
                    suspendAlert: false
                })
            }
        } catch (error) {
            this.setState({ ShowLoader: false });
            console.log('error', error.message)
        }
    }
    deleteVoucher = async (data) => {
        try {
            this.setState({ ShowLoader: true });
            let response = await VoucherService.DeleteVoucher(data.Id)
            if (response) {
                this.getVoucherDetails()
                Utilities.notify(`'${data.Title}'` + " voucher deleted successfully", "s");
                this.setState({
                    deleteAlert: false,
                    ShowLoader: false
                })
            } else {
                Utilities.notify("Something went wrong while deleting this voucher", "e");
                this.setState({
                    deleteAlert: false,
                    ShowLoader: false
                })
            }
        } catch (error) {
            this.setState({ ShowLoader: false });
            console.log('error', error.message)
        }
    }

    suspendAlert() {
        return (
            <SweetAlert
                show={this.state.suspendAlert}
                title="Confirm"
                text={'Are you sure you want to suspend ' + this.state.batchData.Title + '?'}
                onConfirm={() => this.suspendVoucher(this.state.batchData)}
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
                text={'Are you sure you want to activate ' + this.state.batchData.Title + '?'}
                onConfirm={() => this.activateVoucher(this.state.batchData)}
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
                text={'Are you sure you want to delete ' + this.state.batchData.Title + '?'}
                onConfirm={() => this.deleteVoucher(this.state.batchData)}
                confirmButtonText="Yes"
                onEscapeKey={() => this.setState({ deleteAlert: false })}
                showCancelButton
                onCancel={() => {
                    this.setState({ deleteAlert: false });
                }}
            />
        )
    }

    getVoucherType(voucherType){

        var type ='';

        switch(voucherType){
            case 1:
                type= "Promo Voucher - Amount"
                break;
            case 2:
                    type= "Promo Voucher - Percentage";
                    break;
            case 4:
                    type= "Group Voucher";
                    break;        

            case 5:
                    type= "Split Voucher";
                    break;
        }

        return type;
    }


    renderData(voucher) {

        if (this.state.ShowLoader === true) {
            return this.loading()
        }

        return (

            <tbody>
                {voucher.length > 0 ? voucher.map(data =>
                    <>
                        {
                            this.state.batchDetails.HasUniqueVoucher == true ?

                                <tr>

                                    <td data-column="Code">
                                        <div >
                                            {data.VoucherCode}
                                        </div>
                                    </td>
                                    <td data-column="PIN">
                                        <div >
                                            {data.PinCode}
                                        </div>

                                    </td>
                                    <td data-column="QR">
                                        <div onClick={(e) => {
                                            e.stopPropagation()
                                            this.ShowCode(data.CodeMerge)
                                        }} style={{ color: '#00BCD4', fontWeight: 'bold', cursor: 'pointer' }}>
                                            {'QR Code'}
                                        </div>
                                    </td>
                                    <td data-column="Expiry">
                                        <div>

                                            {data.ExpiryDate}
                                        </div>
                                    </td>


                                    <td data-column="User Balance">
                                        <div>
                                            {data.UserWalletBalance > 0 ? Utilities.GetCurrencySymbol() + data.UserWalletBalance : '---'}
                                        </div>
                                    </td>
                                    <td data-column="Mobile Details">
                                        <div >
                                            {data.Model == '' ? '---' : data.OperatingSystem + ' v' + data.OsVersion + ' ' + data.Model}
                                        </div>
                                    </td>
                                    <td data-column="Status">
                                        {
                                            data.UserName != '' ?
                                                <div style={{ fontWeight: 'bold' }}>
                                                    {data.UserName}
                                                </div>
                                                :
                                                <div>
                                                    {'---'}
                                                </div>
                                        }
                                        <div >
                                            {data.PrimaryEmail + ' ' + data.RedeemDate}
                                        </div>
                                    </td>
                                    <td data-column="Revert">
                                        <div >
                                            {
                                                data.IsReverted == true ?
                                                    <label>Reverted</label> : data.RedemptionCount > 0 ?

                                                        <button className='btn btn-primary' style={{ zIndex: 2 }} onClick={(e) => {
                                                            e.stopPropagation()
                                                            this.EditVoucher(data.Id)
                                                        }}>Revert</button>
                                                        : ''
                                            }


                                        </div>

                                    </td>

                                </tr>
                                :
                                <tr>

                                    <td data-column="Name">
                                        <div style={{ color: '#00BCD4', fontWeight: 'bold', cursor: 'pointer' }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                this.getVoucherDetailsBy(data)
                                            }}
                                        >
                                            {data.Title}
                                        </div>
                                    </td>
                                    <td data-column="Type">
                                        <div >
                                            {this.getVoucherType(Number(data.VoucherType))}
                                        </div>

                                    </td>
                                    <td data-column="Value">
                                        <div >
                                            {Utilities.GetCurrencySymbol() + data.VoucherValue}
                                        </div>
                                    </td>
                                    <td data-column="Code">
                                        <div>
                                            {data.VoucherCode}
                                        </div>
                                    </td>


                                    <td data-column="Pin">
                                        <div >
                                            {data.PinCode}
                                        </div>
                                    </td>
                                    <td data-column="QR">
                                        <div onClick={(e) => {
                                            e.stopPropagation()
                                            this.ShowCode(data.CodeMerge)
                                        }} style={{ color: '#00BCD4', fontWeight: 'bold', cursor: 'Pointer' }}>
                                            {'QR Code'}
                                        </div>
                                    </td>
                                    <td data-column="Quantity">

                                        <div >
                                            {data.Quantity}
                                        </div>
                                    </td>
                                    <td data-column="Available">

                                        <div >
                                            {data.Quantity - data.RedemptionCount}
                                        </div>
                                    </td>
                                    <td data-column="Expiry">

                                        <div >
                                            {data.ExpiryDate}
                                        </div>
                                    </td>
                                    <td data-column="T&C">
                                        {
                                            data.VoucherType == 5 ?
                                                <div >
                                                    <p>{'Split Count : ' + data.AllowedOrderCount}</p>
                                                    <p>{'Cashback per order : ' + Utilities.GetCurrencySymbol() + data.ECashSpendLimit}</p>
                                                    <p>{'Min Order : ' + Utilities.GetCurrencySymbol() + data.MinimumOrderAmount}</p>
                                                    <p>{'Day span : ' + data.DaySpan}</p>
                                                </div>
                                                :
                                                <div>
                                                    {'---'}
                                                </div>
                                        }
                                    </td>
                                    <td data-column="Action">
                                        <div className="action-voucher-btn-wrap ">
                                            {
                                                !data.IsDeleted ?
                                                    <>
                                                        {
                                                            !data.IsActive ?
                                                                <span className='m-b-0 statusChangeLink m-r-20' onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    //this.activateVoucher(data)
                                                                    this.setState({
                                                                        batchData: data,
                                                                        activateAlert: true
                                                                    })
                                                                }}><span><i className="fa fa-check" aria-hidden="true" ></i>Activate</span></span>
                                                                :
                                                                <span className='m-b-0 statusChangeLink m-r-20' onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    //this.suspendVoucher(data)
                                                                    this.setState({
                                                                        batchData: data,
                                                                        suspendAlert: true
                                                                    })
                                                                }}><span><i class="fa fa-ban "></i>Suspend</span> </span>
                                                        }
                                                        <span className='m-b-0 statusChangeLink ' onClick={(e) => {
                                                            e.stopPropagation()
                                                            //this.deleteVoucher(data)
                                                            this.setState({
                                                                batchData: data,
                                                                deleteAlert: true
                                                            })
                                                        }}><span><i class="fa fa-trash-o font-18 delete"></i>Delete</span></span>
                                                    </>
                                                    :
                                                    <>
                                                        <p>Deleted</p>
                                                    </>
                                            }
                                        </div>

                                    </td>

                                </tr>
                        }
                    </>
                ) : ""}
            </tbody>

        );

    }


    //Voucher specific details 

    setExcelSheetDataSet2 = () => {
        this.state.dataSet = []
        for (let index = 0; index < this.state.batchList.length; index++) {
            this.state.dataSet.push({
                username: this.state.batchList[index].DisplayName,
                email: this.state.batchList[index].PrimaryEmail,
                redeemDate: this.state.batchList[index].RedeemDate,
                ip: this.state.batchList[index].IP,
                deviceId: this.state.batchList[index].DeviceId != undefined ? this.state.batchList[index].DeviceId : '',
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

        this.GenerateQRCode(token);

    }

    getVoucherDetailsBy2 = async () => {
        let response = await VoucherBatchService.GetVoucherDetailBy(this.state.batchDetails.Id)
        if (response != undefined) {
            this.setState({
                batchList: response
            }, () => {
                this.setExcelSheetDataSet()
            })
        }
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
                "searchPlaceholder": (this.state.pathname == '/Group-voucher/batchDetails' ? "Search by group name" : "Search"),
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
                this.getVoucherDetailsBy2()
            } else {
                Utilities.notify("Something went wrong while reverting this voucher", "e");
            }
        } catch (error) {
            Utilities.notify("Something went wrong while reverting this voucher", "e");
            console.log('error', error.message)
        }
    }

    SearchVoucherDetail = (event, values) => {
        if (this.state.IsSave) return;
        this.setState({ IsSave: true, NoResult: false })

        this.SearchVoucherDetailsByUser(values.txtInfo);

    }

    toggleQRCodeModal = () => {
        this.setState({
            viewQRCodeModal: !this.state.viewQRCodeModal,
        });
    }

    GenerateQRCodeModal() {

        return (
            <Modal size="md" isOpen={this.state.viewQRCodeModal} backdrop={'static'} className={this.props.className}>
                <ModalHeader toggle={() => this.toggleQRCodeModal()} className="view-image-modal-header">
                    QR Code
                </ModalHeader>
                <ModalBody>
                    <div className="view-image-wrap">
                        <img src={this.state.QRCode} />
                    </div>
                </ModalBody>
            </Modal>
        )

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

    renderData2(voucher) {


        // console.log("voucher: ", voucher)

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

                                {data.RedeemDate}
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
                                { this.state.batchDetails.VoucherType > 2 ?
                                    (data.StatusID > 1 ?
                                        <label>Reverted</label> :

                                        <button className='btn btn-primary' style={{ zIndex: 2 }} onClick={(e) => {
                                            e.stopPropagation()
                                            this.onRevertClick(data)

                                        }}>Revert</button>) : ''
                                }

                            </div>

                        </td>

                    </tr>
                ) : ""}
            </tbody>

        );

    }

    render() {
        if (this.state.pathname == '/Group-voucher/batchDetails') {
            return (
                <div className="card group-voucher" id="orderWrapper">
                    <div className={
                            this.state.batchDetails.HasUniqueVoucher == false ? "m-b-20 btn-setting card-new-title" : "m-b-20 card-new-title"} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 className="card-title "><span onClick={() => this.props.history.goBack()} className="back-arrow"><i class="fa fa-chevron-left" aria-hidden="true"></i></span> {this.state.batchDetails.Name}
                                {/* {this.state.batchDetails.Name + ' ' + 'Details'} */}
                            </h3>
                            <div className="card-right-btns">
                                {
                                    this.state.batchDetails.HasUniqueVoucher == false &&
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }} >
                                        <span className="btn btn-primary-plus btn btn-secondary" onClick={(e) => this.AddNewVoucher()}><i className="fa fa-plus" aria-hidden="true"></i> Add new Voucher</span>
                                    </div>
                                }
                                {
                                    this.state.batchDetails.HasUniqueVoucher == false ?
                                        <span>
                                            <ExcelFile filename={this.state.batchDetails.Name} element={<span className="excel-link" ><i className="fa fa-download" aria-hidden="true"></i> Excel sheet</span>}>
                                                <ExcelSheet data={this.state.dataSet} name="Vouchers">
                                                    <ExcelColumn alignment={{ wrapText: true }} label="Name" value="name" />
                                                    <ExcelColumn alignment={{ wrapText: true }} label="Voucher Value" value="voucherValue" />
                                                    <ExcelColumn alignment={{ wrapText: true }} label="Voucher Code" value="code" />
                                                    <ExcelColumn alignment={{ wrapText: true }} label="PIN" value="pin" />
                                                    <ExcelColumn alignment={{ wrapText: true }} label="Available" value="available" />
                                                    <ExcelColumn alignment={{ wrapText: true }} label="Quantity" value="quantity" />
                                                    <ExcelColumn alignment={{ wrapText: true }} label="Expiry Date" value="expiry" />

                                                </ExcelSheet>

                                            </ExcelFile>
                                        </span>
                                        :
                                        <span>
                                            <ExcelFile filename={this.state.batchDetails.Name} element={<span className="excel-link" ><i className="fa fa-download" aria-hidden="true"></i> Excel sheet</span>}>
                                                <ExcelSheet data={this.state.dataSet} name="Vouchers">
                                                    <ExcelColumn label="Voucher Code" value="code" />
                                                    <ExcelColumn label="PIN" value="pin" />
                                                    <ExcelColumn label="UserName" value="username" />
                                                    <ExcelColumn label="Email" value="email" />
                                                    <ExcelColumn label="Redeem Date" value="redeenDate" />
                                                    <ExcelColumn label="IP" value="ip" />
                                                    <ExcelColumn label="Device Id" value="deviceId" />
                                                    <ExcelColumn label="Operating System" value="os" />
                                                    <ExcelColumn label="OS Version" value="version" />
                                                    <ExcelColumn label="Model" value="modal" />
                                                    <ExcelColumn label="Expiry Date" value="expiry" />
                                                    <ExcelColumn label="Revert" value="revert" />

                                                </ExcelSheet>

                                            </ExcelFile>
                                        </span>
                                }
                            </div>
                        </div>
                    <div className="card-body card-body-res">
                        


                        {
                            this.state.batchDetails.HasUniqueVoucher == true &&
                            <div className="v-d-main-wrap">
                                <div className="v-d-wrap">
                                    <span>Voucher Value:</span>
                                    <span>{Utilities.GetCurrencySymbol()}{this.state.voucherValue}</span>
                                </div>
                                <div className="v-d-wrap">
                                    <span>Quantity:</span>
                                    <span>{this.state.batchDetails.Quantity}</span>
                                </div>
                                <div className="v-d-wrap">
                                    <span>Available:</span>
                                    <span>{this.state.batchDetails.AvailableCount}</span>
                                </div>
                                <div className="v-d-wrap">
                                    <span>Expiry Date:</span>
                                    <span>{this.state.batchDetails.ExpiryDate}</span>
                                </div>

                            </div>
                        }

                        <div className="table-main-set-wrap">

                            <div className="vouchers-main-wrap new-res-data-table" style={{ marginTop: '20px' }}>
                                <span className="group-v-search-link" onClick={() => this.searchViewModal({})}>Search by user</span>
                                <table className='table table-striped' id="tblOrders">

                                    <thead>
                                        {
                                            this.state.batchDetails.HasUniqueVoucher == true ?
                                                <>
                                                    <tr>

                                                        <th >Code</th>


                                                        <th >PIN</th>


                                                        <th className="qr-th">QR</th>


                                                        <th>Expiry</th>


                                                        <th>User Balance</th>


                                                        <th >Mobile Details</th>


                                                        <th>Status</th>


                                                        <th>Revert</th>


                                                    </tr>
                                                </> :
                                                <>
                                                    <tr>

                                                        <th >Name</th>


                                                        <th >Type</th>


                                                        <th>Value</th>


                                                        <th>Code</th>


                                                        <th>Pin</th>


                                                        <th className="qr-th">QR</th>


                                                        <th>Quantity</th>


                                                        <th>Available</th>


                                                        <th>Expiry</th>

                                                        <th>{'T&C'}</th>
                                                        <th>Action</th>


                                                    </tr>
                                                </>
                                        }
                                    </thead>

                                    {this.renderData(this.state.batchList)}

                                </table>
                            </div>
                        </div>
                    </div>
                    {this.activateAlert()}
                    {this.suspendAlert()}
                    {this.deleteAlert()}
                    <Modal isOpen={this.state.searchModal} className={this.props.className}>
                        <ModalHeader>Search by email or mobile</ModalHeader>
                        <ModalBody className="padding-0 ">
                            <AvForm onValidSubmit={this.SearchVoucherDetail}>
                                <div className="padding-20 scroll-model-web">
                                    <FormGroup className="modal-form-group set-price-field">

                                        <div className="input-group h-set">

                                            <AvField type="text" className="form-control" name="txtInfo" placeholder="Email or Mobile" />

                                        </div>
                                        <div>{this.state.NoResult ? <div className="error m-t-5">No record found.</div> : ''}</div>
                                    </FormGroup>
                                </div>
                                <FormGroup className="modal-footer" >
                                    <Button color="secondary" onClick={() => this.searchViewModal({})}>Cancel</Button>
                                    <Button color="success">Search</Button>


                                </FormGroup>
                            </AvForm>
                        </ModalBody>
                    </Modal>

                    {this.GenerateQRCodeModal()}

                </div>

            );
        } else {
            return (
                <div className="group-voucher card" id="orderWrapper">
                     <div className="m-b-20" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 className="card-title "><span onClick={() => this.props.history.goBack()} className="back-arrow"><i class="fa fa-chevron-left" aria-hidden="true"></i></span> {this.state.batchDetails.Title}

                                {/* {this.state.batchDetails.Title + ' ' + 'Details'} */}
                            </h3>
                            {/* {
                                this.state.batchDetails.HasUniqueVoucher == false &&
                                <span className="btn btn-primary-plus btn btn-secondary" onClick={(e) => this.AddNewVoucher()}><i className="fa fa-plus" aria-hidden="true"></i>Add new Voucher</span>
                            } */}
                            <span>
                                <div className="card-right-btns">
                                    <ExcelFile filename={this.state.batchDetails.Title} element={<span className="excel-link" ><i className="fa fa-download" aria-hidden="true"></i> Excel sheet</span>}>
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
                                </div>
                            </span>
                        </div>
                    <div className="card-body card-body-res">
                       
                        <div className="v-d-main-wrap">
                            <div className="v-d-wrap">
                                <span>Voucher Value:</span>
                                <span>{Utilities.GetCurrencySymbol()}{this.state.batchDetails.VoucherValue}</span>
                            </div>


                            <div className="v-d-wrap">
                                <span>Quantity:</span>
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

                                {this.renderData2(this.state.batchList)}

                            </table>
                        </div>

                    </div>
                    {this.GenerateValidTimeModalModel()}
                    {this.GenerateQRCodeModal()}



                </div>

            );
        }

    }
}

export default GroupVoucherDetails;