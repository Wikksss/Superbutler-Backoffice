import React, { Component, Fragment } from 'react';
import { Button, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { AvForm, AvField, AvInput, AvGroup } from 'availity-reactstrap-validation';
import Cropper from 'react-easy-crop';
import Slider from '@material-ui/core/Slider'
import * as CityServ from '../../service/City';
import * as CategoryService from '../../service/Category';
import * as EnterpriseService from '../../service/Enterprise';
import * as createVoucherService from '../../service/voucher';
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

class CreateVoucher extends Component {
    constructor(props) {
        super(props)
        this.state = {
            batchDetails: props.location.state.details,
            batchName: '',
            uniqueVoucher: false,
            voucherTitle: '',
            voucherCode: '',
            pinCode: '',
            voucherValue: '',
            quantity: '',
            StartDate: '',
            EndDate: '',
            ValidDate: true,
            ValidVoucherStartDate: true,
            ValidVoucherEndDate: true,
            voucherAlert: false,
            Id: 0,
            splitVoucher: false,
            voucherType :-1,
            allowedOrder: '',
            EcashSpendLimit: "0",
            daySpan: '',
            minimumOrderAmount: '',
            message: '',
            ValidVoucherType : true,     
            voucherTitleAlert: false,
            voucherCodeAlert: false,
            pinCodeAlert: false,
            voucherValueAlert: false,
            allowedOrderAlert: false,
            daySpanAlert: false,
            minimumOrderAmountAlert: false,
            quantityAlert: false,
            TermAndCondition: '',
            ValidVoucherOrderType: true,
            IsActive: true,
            IsUserRestricted: false,
            AllowMultipleUse: true,
            DeliveryOffered: true,
            TakeawayOffered:true,
            DineOffered: true
        }
        this.handleInputChange = this.handleInputChange.bind(this);

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
            let response = await VoucherService.IsAvailable(0, this.state.batchName)
            if (response) {
                this.createVoucher()
            } else {
                alert('Voucher name already exists')
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
            let response = await VoucherService.IsAvailable(this.state.Id, this.state.batchName)
            if (response) {
                this.updateVoucher()
            } else {
                alert('Voucher name already exists')
            }
        } catch (error) {
            console.log('error', error.message)
        }
    }

    // createVoucher = async () => {
    //     try {
    //         var voucherBatch = {}
    //         voucherBatch.Name = this.state.batchName
    //         // voucherBatch.StartDate =moment(new Date()).format("dd/MM/yyyy HH:mm")
    //         voucherBatch.StartDate = moment.tz(new Date(), 'YYYY-MM-DD', true, Config.Setting.timeZone).format("DD/MM/yyyy HH:mm");
    //         if (this.state.uniqueVoucher == true) {
    //             voucherBatch.VoucherValue = this.state.voucherValue
    //             voucherBatch.Quantity = this.state.quantity
    //             voucherBatch.StartDate = moment.tz(this.state.StartDate, 'YYYY-MM-DD', true, Config.Setting.timeZone).format("DD/MM/yyyy HH:mm")
    //             voucherBatch.ExpiryDate = moment.tz(this.state.EndDate, 'YYYY-MM-DD', true, Config.Setting.timeZone).format("DD/MM/yyyy HH:mm")
    //         }
    //         voucherBatch.HasUniqueVoucher = this.state.uniqueVoucher
    //         let response = await VoucherService.SaveBatch(voucherBatch)
    //         console.log(response)
    //         if (response) {
    //             Utilities.notify("Successfully created batch voucher", "s");
    //             this.props.history.goBack()

    //         } else {
    //             Utilities.notify("Something went wrong while creating the batch voucher", "e");
    //         }
    //     } catch (error) {
    //         Utilities.notify("Something went wrong while creating the batch voucher", "e");
    //         console.log('createVoucher, AddGroupVoucher', error.message)
    //     }
    // }
    // updateVoucher = async () => {
    //     try {
    //         var voucherBatch = {}
    //         voucherBatch.Name = this.state.batchName
    //         voucherBatch.Quantity = this.state.quantity
    //         voucherBatch.Id = this.state.Id
    //         if (this.state.EndDate != '') {
    //             voucherBatch.ExpiryDate = moment.tz(this.state.EndDate, 'YYYY-MM-DD', true, Config.Setting.timeZone).format("DD/MM/yyyy HH:mm")
    //         }
    //         if (this.state.uniqueVoucher == true) {
    //             voucherBatch.ExpiryDate = moment.tz(this.state.EndDate, 'YYYY-MM-DD', true, Config.Setting.timeZone).format("DD/MM/yyyy HH:mm")
    //         }
    //         let response = await VoucherService.UpdateBatch(voucherBatch)
    //         console.log(response)
    //         if (response) {
    //             Utilities.notify("Successfully updated batch voucher", "s");
    //             this.props.history.goBack()

    //         } else {
    //             Utilities.notify("Something went wrong while updating the batch voucher", "e");
    //         }
    //     } catch (error) {
    //         Utilities.notify("Something went wrong while updating the batch voucher", "e");
    //         console.log('createVoucher, AddGroupVoucher', error.message)
    //     }
    // }

    voucherAlertFun() {
        return (
            <SweetAlert
                show={this.state.voucherAlert}
                title="Alert"
                text={this.state.message}
                onConfirm={() => this.setState({ voucherAlert: false })}
                confirmButtonText="Okay"
                onEscapeKey={() => this.setState({ voucherAlert: false })}
            />
        )
    }

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

    changeVoucherType = (value) => {
        
        if(Number(value) === -1){
            this.setState({
                ValidVoucherType: false,
                voucherType: Number(value)
            })
            return;
        }
        

        this.setState({
            voucherType: Number(value),
            ValidVoucherType: true,
            IsActive: true,
            IsUserRestricted: false,
            AllowMultipleUse: true,
            DeliveryOffered: true,
            TakeawayOffered:true,
            DineOffered: true
        })
    }

    createVoucher = async () => {
        try {
            if (this.state.voucherTitle === '') {
                this.setState({
                    voucherTitleAlert: true,
                    message: 'Voucher title cannot be empty'
                })
                return
            }
            if (this.state.voucherCode === '') {
                this.setState({
                    voucherCodeAlert: true,
                    message: 'Voucher Code cannot be empty'
                })
                return
            }
            if (this.state.pinCode === '' && Number(this.state.VoucherType) > 2) {
                this.setState({
                    pinCodeAlert: true,
                    message: 'Pin Code cannot be empty'
                })
                return
            }
            if (this.state.voucherValue === '') {
                this.setState({
                    voucherValueAlert: true,
                    message: 'Voucher value required!'
                })
                return
            }

            if (Number(this.state.VoucherType) === 5) {
                if (this.state.allowedOrder === '') {
                    this.setState({
                        allowedOrderAlert: true,
                        message: 'Allowed Order amount required!'
                    })
                    return
                }
                if (this.state.daySpan === '') {
                    this.setState({
                        daySpanAlert: true,
                        message: 'Day span required!'
                    })
                    return
                }
                if (this.state.minimumOrderAmount === '') {
                    this.setState({
                        minimumOrderAmountAlert: true,
                        message: 'Minimum order amount required!'
                    })
                    return
                }
            }
            if (this.state.quantity === '') {
                this.setState({
                    quantityAlert: true,
                    message: 'Quantity cannot be empty'
                })
                return
            }
            if (this.state.StartDate === '') {
                this.setState({
                    ValidVoucherStartDate: false,
                    // message: 'Starting date required'
                })
                return
            }
            if (this.state.EndDate === '') {
                this.setState({
                    ValidVoucherEndDate: false,
                    // message: 'Expiration date required'
                })
                return
            }
            let newVoucher = {}
            newVoucher.VoucherBatchId = this.state.batchDetails.Id
            newVoucher.Title = this.state.voucherTitle
            newVoucher.VoucherValue = Number(this.state.voucherValue)
            newVoucher.Quantity = Number(this.state.quantity)
            newVoucher.Code = this.state.voucherCode
            newVoucher.PinCode = this.state.pinCode
            newVoucher.StartDate = moment(this.state.StartDate.toString()).format("DD/MM/YYYY HH:mm"); //moment.tz(this.state.StartDate, 'YYYY-MM-DD', true, Config.Setting.timeZone).format("DD/MM/yyyy HH:mm")
            newVoucher.VoucherType = this.state.voucherType
            newVoucher.ExpiryDate =  moment(this.state.EndDate.toString()).format("DD/MM/YYYY HH:mm"); //moment.tz(this.state.EndDate, 'YYYY-MM-DD', true, Config.Setting.timeZone).format("DD/MM/yyyy HH:mm")

            newVoucher.MinimumOrderAmount = Number(this.state.VoucherType) === 4 ? 0 : Number(this.state.minimumOrderAmount)
            newVoucher.IsActive = this.state.IsActive;
            newVoucher.IsUserRestricted = false;
            newVoucher.IsActive = this.state.IsActive;
            newVoucher.AllowMultipleUse = this.state.AllowMultipleUse;
            newVoucher.DineOffered = this.state.DineOffered;
            newVoucher.TakeawayOffered = this.state.TakeawayOffered;
            newVoucher.DeliveryOffered = this.state.DeliveryOffered;
            newVoucher.TermAndCondition = Utilities.SpecialCharacterEncode(this.state.TermAndCondition);

            if (Number(newVoucher.VoucherType) === 5) {
                newVoucher.AllowedOrderCount = Number(this.state.allowedOrder)
                newVoucher.DaySpan = Number(this.state.daySpan)
                newVoucher.ECashSpendLimit = Number(this.state.EcashSpendLimit)   
            }
           


            let response = await createVoucherService.saveGroupVoucher(newVoucher)
            if (!response.HasError) {
                Utilities.notify("Voucher created successfully", "s");
                this.props.history.goBack()
            } else {
                Utilities.notify("Something went wrong while creating voucher", "e");
            }
        } catch (error) {
            Utilities.notify("Something went wrong while creating voucher", "e");
            console.log('error', error.message)
        }
    }

    render() {
        return (
            <div className="card">
                                <h3 className="card-title card-new-title">Create Voucher</h3>
                <div className="card-body">
                

                    <div className="row">
                        <div className="col-md-6 ">
                            <div className="form-group mb-3" style={{ marginTop: 30 }}>
                                <AvForm>
                                    <div className="form-body">
                                        <div >
                                            <label id="name" className="control-label">Voucher Type</label>
                                            {/* <AvField onChange={(e) => {
                                                if (e.target != undefined && e.target.value != undefined) {
                                                    var value = e.target.value
                                                    this.state.batchName = value
                                                }
                                            }} placeholder='Enter batch name' name="txtName" value={this.state.batchName} type="text" className="form-control"
                                                required
                                            /> */}
                                            <select className={this.state.ValidVoucherType ? "order-date-dropdown form-control custom-select" : "is-touched is-pristine av-invalid is-invalid form-control"}   className="order-date-dropdown form-control custom-select" value={this.state.voucherType} style={{ height: '36px' }}
                                                onChange={(e) => this.changeVoucherType(e.target.value)}>
                                                <option value={-1}>Select Voucher Type</option>
                                                <option value={1}>Promo Voucher - Amount</option>
                                                <option value={2}>Promo Voucher - Percentage</option>
                                                <option value={4}>Group Voucher</option>        
                                                <option value={5}>Split Voucher</option>
                                            </select>
                                            {this.state.ValidVoucherType ? "" : <div class="invalid-feedback" style={this.state.isBNumValid ? {"display" : "none"} : {"display" : "block"}}>Please select voucher type</div>}
        
                                        </div>
                                    </div>
                                </AvForm>
                            </div>
                        </div>
                    </div>

                    <div className='row mt-3  '  >
                        <div className="col-md-6 mb-3 ">
                            <div className="form-group " >
                                <AvForm>
                                    <div className="form-body">
                                        <div >
                                            <label id="name" className="control-label">Voucher Title</label>
                                            <AvField onChange={(e) => {
                                                if (e.target != undefined && e.target.value != undefined) {
                                                    var value = e.target.value
                                                    this.state.voucherTitle = value
                                                    this.setState({
                                                        voucherTitleAlert: false
                                                    })
                                                }
                                            }} type="text" placeholder='Enter title' name="txtName" value={this.state.voucherTitle} className="form-control"

                                            />
                                            {
                                                this.state.voucherTitleAlert == true &&
                                                <label className="error"> {this.state.message}</label>
                                            }
                                        </div>
                                    </div>
                                </AvForm>
                            </div>
                        </div>
                        <div className="col-md-6 mb-3 ">
                            <div className="form-group " >
                                <AvForm>
                                    <div className="form-body">
                                        <div >
                                            <label id="name" className="control-label">Voucher Code</label>
                                            <AvField onChange={(e) => {
                                                if (e.target != undefined && e.target.value != undefined) {
                                                    var value = e.target.value
                                                    this.state.voucherCode = value
                                                    this.setState({
                                                        voucherCodeAlert: false
                                                    })
                                                }
                                            }} type="text" placeholder='Enter voucher code' name="txtName" value={this.state.voucherCode} className="form-control"
                                            />
                                            {
                                                this.state.voucherCodeAlert == true &&
                                                <label className="error"> {this.state.message}</label>
                                            }

                                        </div>
                                    </div>
                                </AvForm>
                            </div>
                        </div>
                        { (this.state.voucherType > 2) &&
                        <div className="col-md-6 mb-3 ">
                            <div className="form-group " >
                                <AvForm>
                                    <div className="form-body">
                                        <div >
                                            <label id="name" className="control-label">Pin Code</label>
                                            <AvField onChange={(e) => {
                                                if (e.target != undefined && e.target.value != undefined) {
                                                    var value = e.target.value
                                                    this.state.pinCode = value
                                                    this.setState({
                                                        pinCodeAlert: false
                                                    })
                                                }
                                            }} type="text" placeholder='Enter pin code' name="txtName" value={this.state.pinCode} className="form-control"

                                            />
                                            {
                                                this.state.pinCodeAlert == true &&
                                                <label className="error"> {this.state.message}</label>
                                            }

                                        </div>
                                    </div>
                                </AvForm>
                            </div>
                        </div>
                        }
                        <div className="col-md-6 mb-3 ">
                            <div className="form-group " >
                                <AvForm>
                                    <div className="form-body">
                                        <div >
                                            <label id="name" className="control-label">Voucher Value</label>
                                            <AvField onChange={(e) => {
                                                if (e.target != undefined && e.target.value != undefined) {
                                                    var value = e.target.value
                                                    if (this.state.allowedOrder == '') {
                                                        this.state.voucherValue = value
                                                        this.setState({
                                                            voucherValueAlert: false
                                                        })
                                                    } else {
                                                        this.state.voucherValue = value
                                                        let voucherValue = parseInt(value)
                                                        let allowedOrder = parseInt(this.state.allowedOrder)
                                                        this.state.EcashSpendLimit = voucherValue / allowedOrder
                                                        this.state.EcashSpendLimit = this.state.EcashSpendLimit.toFixed(2)
                                                        // console.log(' this.state.EcashSpendLimit', this.state.EcashSpendLimit)
                                                        this.setState({
                                                            EcashSpendLimit: this.state.EcashSpendLimit,
                                                            voucherValueAlert: false
                                                        })
                                                        this.state.EcashSpendLimit = this.state.voucherValue / this.state.allowedOrder
                                                    }

                                                }
                                            }} type="number" min='0' maxlength="6" placeholder='Enter voucher value' name="txtName" value={this.state.voucherValue} className="form-control"

                                            />
                                            {
                                                this.state.voucherValueAlert == true &&
                                                <label className="error"> {this.state.message}</label>
                                            }

                                        </div>
                                    </div>
                                </AvForm>
                            </div>
                        </div>
                        {
                            this.state.voucherType == 5 &&
                            <>
                                <div className="col-md-6 mb-3 ">
                                    <div className="form-group " >
                                        <AvForm>
                                            <div className="form-body">
                                                <div >
                                                    <label id="name" className="control-label">Allowed Order</label>
                                                    <AvField onChange={(e) => {
                                                        if (e.target != undefined && e.target.value != undefined) {
                                                            var value = e.target.value
                                                            if (this.state.voucherValue == '') {
                                                                this.state.allowedOrder = value
                                                                this.setState({
                                                                    allowedOrderAlert: false
                                                                })
                                                            } else {
                                                                this.state.allowedOrder = value
                                                                let voucherValue = parseInt(this.state.voucherValue)
                                                                let allowedOrder = parseInt(value)
                                                                this.state.EcashSpendLimit = voucherValue / allowedOrder
                                                                this.state.EcashSpendLimit = this.state.EcashSpendLimit.toFixed(2)
                                                                // console.log(' this.state.EcashSpendLimit', this.state.EcashSpendLimit)
                                                                this.setState({
                                                                    EcashSpendLimit: this.state.EcashSpendLimit,
                                                                    allowedOrderAlert: false
                                                                })
                                                            }
                                                            // this.state.allowedOrder = value
                                                        }
                                                    }} type="number" min='0' placeholder='Enter Allowed Order Count' name="txtName" value={this.state.allowedOrder} className="form-control"
                                                    />
                                                    {
                                                        this.state.allowedOrderAlert == true &&
                                                        <label className="error"> {this.state.message}</label>
                                                    }


                                                </div>
                                            </div>
                                        </AvForm>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3 ">
                                    <div className="form-group " >
                                        <AvForm>
                                            <div className="form-body">
                                                <div >
                                                    <label id="name" className="control-label">ECash Spend Limit</label>
                                                    <AvField disabled onChange={(e) => {
                                                        if (e.target != undefined && e.target.value != undefined) {
                                                            var value = e.target.value
                                                            this.state.EcashSpendLimit = value
                                                        }
                                                    }} type="number" name="txtName" value={this.state.EcashSpendLimit} className="form-control"
                                                        required
                                                    />

                                                </div>
                                            </div>
                                        </AvForm>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3 ">
                                    <div className="form-group " >
                                        <AvForm>
                                            <div className="form-body">
                                                <div >
                                                    <label id="name" className="control-label">Day Span</label>
                                                    <AvField onChange={(e) => {
                                                        if (e.target != undefined && e.target.value != undefined) {
                                                            var value = e.target.value
                                                            this.state.daySpan = value
                                                            this.setState({
                                                                daySpanAlert: false
                                                            })
                                                        }
                                                    }} type="number"  min='0' placeholder='Enter Day Span' name="txtName" value={this.state.daySpan} className="form-control"

                                                    />
                                                    {
                                                        this.state.daySpanAlert == true &&
                                                        <label className="error"> {this.state.message}</label>
                                                    }

                                                </div>
                                            </div>
                                        </AvForm>
                                    </div>
                                </div>
                                
                               
                            </>
                        }

                        { (this.state.voucherType === 1 || this.state.voucherType === 2 ||  this.state.voucherType === 5) &&
                                <div className="col-md-6 mb-3 ">
                                    <div className="form-group " >
                                        <AvForm>
                                            <div className="form-body">
                                                <div >
                                                    <label id="name" className="control-label">Minimum Order Amount</label>
                                                    <AvField onChange={(e) => {
                                                        if (e.target != undefined && e.target.value != undefined) {
                                                            var value = e.target.value
                                                            this.state.minimumOrderAmount = value
                                                            this.setState({
                                                                minimumOrderAmountAlert: false
                                                            })
                                                        }
                                                    }} type="number"  min='0' placeholder='Enter Minimum Amount' name="txtName" value={this.state.minimumOrderAmount} className="form-control"

                                                    />
                                                    {
                                                        this.state.minimumOrderAmountAlert == true &&
                                                        <label className="error"> {this.state.message}</label>
                                                    }

                                                </div>
                                            </div>
                                        </AvForm>
                                    </div>
                                </div>
                                }

                        { (this.state.voucherType === 1 || this.state.voucherType === 2 ) &&
                           <> 
                            <div className="col-md-6 mb-3 ">
                                <div className="form-group " >
                                <AvForm>
                                    <div className="form-body">
                                            <div >     
                                            <label className="control-label">Terms and conditions</label>
                                            <div className="input-group m-b-10 form-group">
                                                <AvField type="textarea" name="txtTermAndCondition" rows={2} maxLength={256} cols={50} className="form-control" value={Utilities.SpecialCharacterDecode(this.state.TermAndCondition)} 
                                                validate={{
                                                    required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                                                    }} 
                                                />
                                                <div className="help-block with-errors"></div>
                                            </div>
                                        </div>
                                    </div>
                                </AvForm>
                                </div> 
                            </div> 

                        </>        
                        }

                        <div className="col-md-6 mb-3">
                            <div className="form-group" >
                                <AvForm>
                                    <div className="form-body">
                                        <div >
                                            <label id="name" className="control-label">Quantity</label>
                                            <AvField onChange={(e) => {
                                                if (e.target != undefined && e.target.value != undefined) {
                                                    var value = e.target.value
                                                    this.state.quantity = value
                                                    this.setState({
                                                        quantityAlert: false
                                                    })
                                                }
                                            }} type="number" min='0' placeholder='Enter voucher quantity' name="txtName" value={this.state.quantity} className="form-control"

                                            />
                                            {
                                                this.state.quantityAlert == true &&
                                                <label className="error"> {this.state.message}</label>
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
                        {(this.state.voucherType === 1 || this.state.voucherType === 2 ) &&

                       <div className="time-picker-main-wraper">
                        <AvForm>                            
                            <div>
                            <AvGroup name="chkVoucher" required className="row col-xs-12 setting-cus-field m-t-20 m-b-20">
                                <div className="col-xs-12 col-sm-3 m-b-10 form-group checkSpanDV" >
                                <AvInput type="checkbox" id="isActive" name="isActive" className="form-checkbox" checked={this.state.IsActive} value={this.state.IsActive}/>
                                <Label check htmlFor="isActive">  IsActive </Label>
                                </div>
                                <div className="col-xs-12 col-sm-3 m-b-10 form-group checkSpanDV">
                                    <AvInput type="checkbox" id="isMultiple" name="isMultiple" className="form-checkbox" onChange={(e) => this.setState({AllowMultipleUse:e.target.checked})} checked={this.state.AllowMultipleUse} value={this.state.AllowMultipleUse} />
                                    <Label check htmlFor="isMultiple">  Allow Multiple Use </Label>
                                </div>

                                <div className="col-xs-12 col-sm-3 m-b-10 form-group checkSpanDV" >
                                    <AvInput type="checkbox" id="isRestricted" name="isRestricted" className="form-checkbox" checked={this.state.IsUserRestricted} value={this.state.IsUserRestricted} />
                                    <Label check htmlFor="isRestricted"> Is User Restricted </Label>
                                </div>
                        </AvGroup>
                            </div>                      

                        </AvForm>

                        <h4 className="title-sperator" style={{ "display": "none" }}>Select Voucher Order Type</h4 >
                        <AvForm >                            
                            <div  style={{ "display": "none" }}>
                        <AvGroup name="chkVoucherType" required className="row col-xs-12 setting-cus-field m-t-20 m-b-20" >
                        
                                    <div className="col-xs-12 col-sm-3 m-b-10 form-group checkSpanDV">
                                        <AvInput type="checkbox" id="isDelOffered" name="isDelOffered" className="form-checkbox" checked={this.state.DeliveryOffered} value={this.state.DeliveryOffered} />
                                        <Label check htmlFor="isDelOffered">  Delivery Offered </Label>
                                    </div>
                                    <div className="col-xs-12 col-sm-3 m-b-10 form-group checkSpanDV">
                                        <AvInput type="checkbox" id="isColOffered" name="isColOffered" className="form-checkbox" checked={this.state.TakeawayOffered} value={this.state.TakeawayOffered} />
                                        <Label check htmlFor="isColOffered">  Pick-up Offered </Label>
                                    </div>
                                    <div className="col-xs-12 col-sm-3 m-b-10 form-group checkSpanDV">
                                        <AvInput type="checkbox" id="isDinOffered" name="isDinOffered" className="form-checkbox" checked={this.state.DineOffered} value={this.state.DineOffered} />
                                        <Label check htmlFor="isDinOffered">  Dine-In Offered  </Label>
                                    </div>

                                    {this.state.ValidVoucherOrderType ? "" : <div class="invalid-feedback" style={ {"display" : "block"}}>Please select voucher order type</div>}


                        </AvGroup> 
                         </div>                      

                       </AvForm>      
                        </div> 
  
                         }                           

                    <div className="col-xs-12 setting-cus-field mt-4">

                        {/* <Button color="secondary" onClick={(e) => this.setState({ step: 0 })}>Cancel</Button> */}

                        <Button color="success" onClick={(e) => this.createVoucher()}>Create</Button>


                    </div>

                </div>


                {this.voucherAlertFun()}
            </div>
        )
    }
}

export default CreateVoucher;
