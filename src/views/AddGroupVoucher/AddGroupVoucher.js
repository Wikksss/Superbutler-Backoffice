import React, { Component, Fragment } from 'react';
import { Button, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { AvForm, AvField, AvInput, AvGroup } from 'availity-reactstrap-validation';
import Cropper from 'react-easy-crop';
import Slider from '@material-ui/core/Slider'
import * as CityServ from '../../service/City';
import * as CategoryService from '../../service/Category';
import * as EnterpriseService from '../../service/Enterprise';
// import * as VoucherService from '../../service/voucher';
import * as VoucherService from '../../service/VoucherBatch';
import * as Utilities from '../../helpers/Utilities';
import Constants from '../../helpers/Constants';
import Config from '../../helpers/Config';
import Loader from 'react-loader-spinner'
import Autocomplete from 'react-autocomplete';
import DatePicker from "react-datepicker";
import moment from 'moment';
import 'rc-time-picker/assets/index.css';
import TimePicker from 'rc-time-picker';
import "react-datepicker/dist/react-datepicker.css";
import getCroppedImg from '../../helpers/CropImage'
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';

class AddGroupVoucher extends Component {
    constructor(props) {
        super(props)
        this.state = {
            batchName: '',
            uniqueVoucher: false,
            voucherValue: '',
            quantity: '',
            StartDate: '',
            EndDate: '',
            ValidDate: true,
            ValidVoucherStartDate: true,
            ValidVoucherEndDate: true,
            voucherAlert: false,
            IsEdit: props.location.state.IsEdit,
            Id: 0,
            voucherVolueEmpty: false,
            quantityEmpty: false
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        if (this.state.IsEdit == true) {
            this.state.Id = props.location.state.voucherData.Id
            this.state.batchName = props.location.state.voucherData.Name
            this.state.uniqueVoucher = props.location.state.voucherData.HasUniqueVoucher
            var startDate = props.location.state.voucherData.StartDate.split('/')
            var startDate = startDate[1] + '/' + startDate[0] + '/' + startDate[2]
            this.state.StartDate = new Date(startDate)
            if (props.location.state.voucherData.ExpiryDate != "") {
                var endDate = props.location.state.voucherData.ExpiryDate.split('/')
                var endDate = endDate[1] + '/' + endDate[0] + '/' + endDate[2]
                this.state.EndDate = new Date(endDate)
            }
            this.state.quantity = props.location.state.voucherData.Quantity
            this.state.voucherValue = props.location.state.voucherData.VoucherValue == 0 ? "0" : props.location.state.voucherData.VoucherValue

        }
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    validateVoucherName = async () => {
        try {
            if (this.state.batchName == '') {
                this.setState({
                    voucherAlert: true
                })
                return
            }
            if (this.state.uniqueVoucher == true) {
                if (this.state.voucherValue == '') {
                    this.setState({
                        voucherVolueEmpty: true
                    })
                    return
                }
                if (this.state.quantity == '') {
                    this.setState({
                        quantityEmpty: true
                    })
                    return
                }
                if (this.state.StartDate == '') {
                    this.setState({
                        ValidVoucherStartDate: false
                    })
                    return
                }
                if (this.state.EndDate == '') {
                    this.setState({
                        ValidVoucherEndDate: false
                    })
                    return
                }
                if (this.state.ValidDate == false) {
                    return
                }
            }
            let response = await VoucherService.IsAvailable(0, this.state.batchName)
            if (response) {
                this.createVoucher()
            } else {
                Utilities.notify("Voucher name already exists", "e");
            }
        } catch (error) {
            console.log('error', error.message)
        }
    }
    validateVoucherNameForUpdate = async () => {
        try {
            if (this.state.batchName == '') {
                this.setState({
                    voucherAlert: true
                })
                return
            }
            if (this.state.uniqueVoucher == true) {
                if (this.state.EndDate == '') {
                    this.setState({
                        ValidVoucherEndDate: false
                    })
                    return
                }
            }
            let response = await VoucherService.IsAvailable(this.state.Id, this.state.batchName)
            if (response) {
                this.updateVoucher()
            } else {
                Utilities.notify("Something went wrong while updating the voucher", "e");
            }
        } catch (error) {
            console.log('error', error.message)
        }
    }

    createVoucher = async () => {
        try {
            var voucherBatch = {}
            voucherBatch.Name = this.state.batchName
            // voucherBatch.StartDate =moment(new Date()).format("dd/MM/yyyy HH:mm")
            voucherBatch.StartDate = moment.tz(new Date(), 'YYYY-MM-DD', true, Config.Setting.timeZone).format("DD/MM/yyyy HH:mm");
            if (this.state.uniqueVoucher == true) {
                voucherBatch.VoucherValue = this.state.voucherValue
                voucherBatch.Quantity = this.state.quantity
                voucherBatch.StartDate = moment.tz(this.state.StartDate, 'YYYY-MM-DD', true, Config.Setting.timeZone).format("DD/MM/yyyy HH:mm")
                voucherBatch.ExpiryDate = moment.tz(this.state.EndDate, 'YYYY-MM-DD', true, Config.Setting.timeZone).format("DD/MM/yyyy HH:mm")
            }
            voucherBatch.HasUniqueVoucher = this.state.uniqueVoucher
            let response = await VoucherService.SaveBatch(voucherBatch)
            // console.log(response)
            if (response) {
                Utilities.notify("Successfully created batch voucher " + `'${this.state.batchName}'`, "s");
                this.props.history.goBack()

            } else {
                Utilities.notify("Something went wrong while creating the batch voucher " + `'${this.state.batchName}'`, "e");
            }
        } catch (error) {
            Utilities.notify("Something went wrong while creating the batch voucher " + `'${this.state.batchName}'`, "e");
            console.log('createVoucher, AddGroupVoucher', error.message)
        }
    }
    updateVoucher = async () => {
        try {
            var voucherBatch = {}
            voucherBatch.Name = this.state.batchName
            voucherBatch.Quantity = this.state.quantity
            voucherBatch.Id = this.state.Id
            if (this.state.EndDate != '') {
                voucherBatch.ExpiryDate = moment.tz(this.state.EndDate, 'YYYY-MM-DD', true, Config.Setting.timeZone).format("DD/MM/yyyy HH:mm")
            }
            if (this.state.uniqueVoucher == true) {
                voucherBatch.ExpiryDate = moment.tz(this.state.EndDate, 'YYYY-MM-DD', true, Config.Setting.timeZone).format("DD/MM/yyyy HH:mm")
            }
            let response = await VoucherService.UpdateBatch(voucherBatch)
            // console.log(response)
            if (response) {
                Utilities.notify("Successfully updated batch voucher " + `'${this.state.batchName}'`, "s");
                this.props.history.goBack()

            } else {
                Utilities.notify("Something went wrong while updating the batch voucher " + `'${this.state.batchName}'`, "e");
            }
        } catch (error) {
            Utilities.notify("Something went wrong while updating the batch voucher " + `'${this.state.batchName}'`, "e");
            console.log('createVoucher, AddGroupVoucher', error.message)
        }
    }

    // voucherAlertFun() {
    //     return (
    //         <SweetAlert
    //             show={this.state.voucherAlert}
    //             title="Alert"
    //             text={'Batch name cannot be empty!'}
    //             onConfirm={() => this.setState({ voucherAlert: false })}
    //             confirmButtonText="Okay"
    //             onEscapeKey={() => this.setState({ voucherAlert: false })}
    //         />
    //     )
    // }

    HandleDateChange = (date, isExpiry) => {


        let isDateValid = true;

        if (isExpiry) {

            isDateValid = date > this.state.StartDate
            this.setState({ EndDate: date, ValidDate: isDateValid, ValidVoucherEndDate: true });
        }
        else {

            if (this.state.EndDate !== "") {
                isDateValid = date < this.state.EndDate
            }
            this.setState({ StartDate: date, ValidDate: isDateValid, ValidVoucherStartDate: true });
        }
    };


    render() {
        return (
            <div className="card">
                 <h3 className="card-title card-new-title">Create Voucher Batch</h3>
                <div className="card-body">
                   
                    <div className="row">
                        <div className="col-md-6 ">
                            <div className="form-group mb-3" style={{ marginTop: 30 }}>
                                <AvForm>
                                    <div className="form-body">
                                        <div >
                                            <label id="name" className="control-label">Batch Name</label>
                                            <AvField onChange={(e) => {
                                                if (e.target != undefined && e.target.value != undefined) {
                                                    var value = e.target.value
                                                    this.state.batchName = value
                                                    this.setState({
                                                        voucherAlert: false
                                                    })
                                                }
                                            }} placeholder='Enter batch name' name="txtName" value={this.state.batchName} type="text" className="form-control"

                                            />
                                            {
                                                this.state.voucherAlert == true &&
                                                <label className="error"> Batch name cannot be empty</label>
                                            }

                                        </div>
                                    </div>
                                </AvForm>
                            </div>
                        </div>
                    </div>
                    {
                        this.state.IsEdit != true &&
                        <div className="row">

                            <div className='col-md-6 ' >
                                {/* <label id="name" className="control-label" style={{ marginTop: 20 }}>Generate Unique Voucher</label> */}
                                <div className="checkDiv" >

                                    <input
                                        id="uniqueVoucher"
                                        name="uniqueVoucher"
                                        type="checkbox"
                                        className="form-checkbox"
                                        checked={this.state.uniqueVoucher}
                                        onChange={this.handleInputChange} />
                                    <label id="name" className="settingsLabel" htmlFor="uniqueVoucher">Generate Unique Voucher</label>

                                </div>

                            </div>
                        </div>
                    }
                    {
                        this.state.uniqueVoucher == true &&
                        <div className='row mt-3  '  >
                            <div className="col-md-6 mb-3 ">
                                <div className="form-group " >
                                    <AvForm>
                                        <div className="form-body">
                                            <div >
                                                <label id="name" className="control-label">Voucher Value</label>
                                                <AvField disabled={this.state.IsEdit} onChange={(e) => {
                                                    if (e.target != undefined && e.target.value != undefined) {
                                                        var value = e.target.value
                                                        this.state.voucherValue = value
                                                        this.setState({
                                                            voucherVolueEmpty: false
                                                        })
                                                    }
                                                }} type="number" min='0' placeholder='Enter voucher value' name="txtName" value={this.state.voucherValue} className="form-control"

                                                />
                                                {
                                                    this.state.voucherVolueEmpty == true &&
                                                    <label className="error"> Voucher value cannot be empty</label>
                                                }
                                            </div>
                                        </div>
                                    </AvForm>
                                </div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <div className="form-group" >
                                    <AvForm>
                                        <div className="form-body">
                                            <div >
                                                <label id="name" className="control-label">Quantity</label>
                                                <AvField disabled={this.state.IsEdit} onChange={(e) => {
                                                    if (e.target != undefined && e.target.value != undefined) {
                                                        var value = e.target.value
                                                        this.state.quantity = value
                                                        this.setState({
                                                            quantityEmpty: false
                                                        })
                                                    }
                                                }} type="number" min='0' placeholder='Enter voucher quantity' name="txtName" value={this.state.quantity} className="form-control"
                                                />
                                                {
                                                    this.state.quantityEmpty == true &&
                                                    <label className="error"> Quantity required</label>
                                                }

                                            </div>
                                        </div>
                                    </AvForm>
                                </div>
                            </div>


                            <div className="col-md-6">
                                <label className="control-label font-weight-500">Start Date</label>
                                {/* <div className="input-group mb-3 form-group"> */}

                                <DatePicker
                                    disabled={this.state.IsEdit}
                                    selected={this.state.StartDate}
                                    onChange={(date) => this.HandleDateChange(date, false)}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    timeCaption="time"
                                    dateFormat="dd/MM/yyyy hh:mm aa"
                                    className="form-control"
                                />
                                {/* </div> */}
                                {this.state.ValidVoucherStartDate ? "" : <div class="invalid-feedback" style={{ "display": "block" }}>Please provide voucher's starting date.</div>}
                            </div>

                            <div className="col-md-6">
                                <label className="control-label font-weight-500">Expiry Date</label>

                                <DatePicker
                                    selected={this.state.EndDate}
                                    onChange={(date) => this.HandleDateChange(date, true)}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    timeCaption="time"
                                    dateFormat="dd/MM/yyyy hh:mm aa"
                                    className="form-control"
                                />
                                {this.state.ValidVoucherEndDate ? "" : <div class="invalid-feedback" style={{ "display": "block" }}>Please provide voucher's expiry date.</div>}
                                {this.state.ValidDate ? "" : <div class="invalid-feedback" style={{ "display": "block" }}>Expiry date cannot be less than Start date.</div>}
                            </div>
                        </div>
                    }
                    <div className="col-xs-12 setting-cus-field mt-4">

                        {/* <Button color="secondary" onClick={(e) => this.setState({ step: 0 })}>Cancel</Button> */}
                        {
                            this.state.IsEdit == true ?

                                <Button color="primary" onClick={(e) => this.validateVoucherNameForUpdate()}>Update</Button>
                                :
                                <Button color="primary" onClick={(e) => this.validateVoucherName()}>Create</Button>
                        }

                    </div>

                </div>


                {/* {this.voucherAlertFun()} */}
            </div>
        )
    }
}

export default AddGroupVoucher;
