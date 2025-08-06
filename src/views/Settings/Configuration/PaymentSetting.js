import React, { Component, Fragment } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import Avatar from 'react-avatar';
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';
import { Link } from 'react-router-dom'
import { FormGroup, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader, Form, Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import { AvForm, AvField, AvInput } from 'availity-reactstrap-validation';
import * as CampaignService from '../../../service/Campaign';
import * as Utilities from '../../../helpers/Utilities';
import Loader from 'react-loader-spinner';
import Dropdown from 'react-bootstrap/Dropdown';
import ImageUploader from 'react-images-upload';
import { AppSwitch } from '@coreui/react';
import 'rc-color-picker/assets/index.css';
//import ReactDOM from 'react-dom';
import ColorPicker from 'rc-color-picker';
import DatePicker from "react-datepicker";
import Constants from '../../../helpers/Constants';
import "react-datepicker/dist/react-datepicker.css";
import GlobalData from '../../../helpers/GlobalData'
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import * as DefaultTheme from '../../../helpers/DefaultTheme';
import * as EnterpriseSettingService from '../../../service/EnterpriseSetting';
import * as EnterpriseService from '../../../service/EnterpriseService';
import arrayMove from 'array-move';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import Lables from '../../../containers/language/labels';
const $ = require('jquery');

export default class PaymentSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            PaymentGatewayList: {},
            show: false,
            paymentModal: false,
            isSaving: false,
            disabled: true,
            isLoading: false,
            // paymentType:[],
            isPaymentEnabled: false,
            paymentData:[],
            paymentValue:{},
            comfirmationModelType:'',
            confirmationModelText:'',
        }

    }
    componentDidMount() {
        this.getPaymentTypes()
    }
    handleSwitchChange(e) {
        var paymentEnable = [];
        paymentEnable[0] = e
        paymentEnable[1] = this.state.PaymentGatewayList.IsSmsAlertsAccepted
        paymentEnable[2] = this.state.PaymentGatewayList.IsExternalDelivery
        var label =  e == true ? {Label:'enable online payment?'} : {Label:'disable online payment?'}
        this.setState({paymentData: paymentEnable})
        this.enableDisableConfirmation(label, 'Edp')
        // this.setState({
        //     show: !this.state.show,
        //     isPaymentEnabled: e,
        // }, () => {
        //     this.enabledPaymentSetting(paymentEnable)
        // })

    }


    togglePaymentModal() {
        this.setState({
            paymentModal: !this.state.paymentModal,
        })
    }

    getPaymentTypes = async () => {
        try {
            var data = undefined; //await EnterpriseService.Get('1');
            if (data != undefined && data.Message == undefined) {
                this.setState({ PaymentGatewayList: data, isPaymentEnabled: data.IsCardAccepted, show: data.IsCardAccepted, showConfirmation: false })
            }
        } catch (e) {
            console.log('Error in Configuration PaymentSetting getPaymentTypes', e)
        }
    }


    selectPayment(e, v) {
        const { PaymentGatewayList } = this.state;
        if (!!e) {
            var selectPaymentData = []
            PaymentGatewayList.ServiceKeys.forEach(val => {
                if (v.Id != val.ServiceId) return;
                var paymentType = {}
                paymentType.Id = 0
                paymentType.ServiceKeyId = val.Id
                paymentType.EnterpriseId = Utilities.GetEnterpriseIDFromSession()
                paymentType.Value = e
                paymentType.Key = val.Key
                selectPaymentData.push(paymentType)
            });
            var paymentSelected = [...this.state.PaymentGatewayList.EnterpriseServiceValues, ...selectPaymentData]
            this.state.PaymentGatewayList.EnterpriseServiceValues = paymentSelected
            this.setState({ disabled: false })
            this.enableDisableConfirmation(v, 'Ept')
            // this.savePaymentType(paymentSelected, v)
            return;
        }

        this.enableDisableConfirmation(v, 'Dpt')
    }

    selectedValue = (v) => {
        const { PaymentGatewayList } = this.state;
        var foundIndex = PaymentGatewayList.ServiceKeys.findIndex(x => x.ServiceId == v.Id);
        var findValue = PaymentGatewayList.ServiceKeys[foundIndex].Id
        // setTimeout(() => {
            if (PaymentGatewayList.EnterpriseServiceValues.length > 0) {
                var findSelectedValue = PaymentGatewayList.EnterpriseServiceValues.find((val) => {
                   
                    return val.ServiceKeyId == findValue
                });
                return findSelectedValue !== undefined ? true : false
            }
            return false
        // }, 100);

    }

    deleteCustomServices = async () => {
        // const { paymentValue } = this.state;
        // var data = await EnterpriseService.Delete('1', paymentValue.Id);
        // let message = '';
        // if (data != undefined && data.Message == undefined) {
        //     this.getPaymentTypes()
        //     // this.setState({ showConfirmation: false });
        //     message = `${paymentValue.Label} disbaled successfully.`
        //     Utilities.notify(message, 's');
        //     return;
        // }
        // message = `${data.Message}.`
        // Utilities.notify(message, 'e');
        // this.setState({ showConfirmation: false })
    }

    enableDisableConfirmation(v, type) {
        this.setState({ paymentValue: v, comfirmationModelType: type , showConfirmation: true, confirmationModelText: type =='Edp' ? `Are you sure you want to ${v.Label}?` : type == "Ept" ? `Are you sure you want to enable ${v.Label}?` : `Are you sure you want to disable ${v.Label}?` })
    }

    HandleOnConfirmation() {
        let type = this.state.comfirmationModelType;

        switch (type.toUpperCase()) {
        case 'DPT':
            this.deleteCustomServices();
            break;
        case 'EPT':
            this.savePaymentType(this.state.paymentValue)
            break;
        case 'EDP':
            this.enabledPaymentSetting(this.state.paymentData);
            break;

        default:
            break;
        }

    }

    GenerateSweetConfirmationWithCancel() {
        return (
            <SweetAlert
                show={this.state.showConfirmation}
                title=""
                text={this.state.confirmationModelText}
                showCancelButton
                onConfirm={() => { this.HandleOnConfirmation() }}
                confirmButtonText="Yes"
                onCancel={() => {
                    this.setState({ showConfirmation: false });
                }}
                onEscapeKey={() => this.setState({ showConfirmation: false })}
            // onOutsideClick={() => this.setState({ showConfirmation: false })}
            />
        )
    }

    savePaymentType = async (v) => {
        // try {
        //     var data = await EnterpriseService.Put(this.state.PaymentGatewayList);
        //     let message = '';
        //     if (data != undefined && data.Message == undefined) {
        //         this.getPaymentTypes()
        //         message = `${v.Label} updated successfully.`
        //         Utilities.notify(message, 's');
        //         return;
        //     }
        //     message = `${data.Message}.`
        //     Utilities.notify(message, 'e');
        //     this.setState({ showConfirmation: false })
        // } catch (e) {
        //     console.log('Error in Configuration PaymentSetting savePaymentType', e)
        // }
    }

    enabledPaymentSetting = async (isPaymentEnable) => {
        // try{
        //     const url = `UpdateConfigurationSetting/`
        //     var data = await EnterpriseSettingService.Put(isPaymentEnable, url);
        //     let message = '';
        //     if (data != undefined && data.Message == undefined) {
        //         this.setState({  show: !this.state.show, isPaymentEnabled: isPaymentEnable[0], showConfirmation: false})
        //         message = this.state.isPaymentEnabled ? `Payment setting enabled successfully.` : `Payment setting disabled successfully.`
        //         Utilities.notify(message, 's');
        //         return;
        //     }
        //     message = `${data.Message}.`
        //     Utilities.notify(message, 'e');
        //     this.setState({ showConfirmation: false })
        // }catch(e){
        //     console.log('Error in Configuration PaymentSetting enabledPaymentSetting', e)
        // }
    }

    render() {
        return (
            <div>
                {/* <div class="coming-soon-d badge badge-dark p-3 px-5">
                    <span>This feature is coming soon</span>
                    </div> */}
            <div>
            <div id="content-area" className=" p-l-15 p-r-15">
                <div className='d-flex mt-4 ml-1'>
                    <span className='ml-4' style={{ fontSize: 14 }}>{Lables.EnableOnlinePayment}</span>

                    {/* <div className='ml-2'>
                        <BootstrapSwitchButton
                            checked={this.state.isPaymentEnabled}
                            size="lg"
                            style="min-lg lg-toggle-btn"
                            onstyle="primary"

                            onChange={(e) => {
                                this.handleSwitchChange(e)
                            }}
                        />
                        <span className={this.state.isPaymentEnabled ?"ml-2 text-primary":"ml-2"}>{this.state.isPaymentEnabled ?"Enable":"Disable"}</span>
                    </div> */}

                    <div className='status-qc qr-toggle-c ml-4'>
                     <AppSwitch name="ALC" onChange={(e) => this.handleSwitchChange(e)} checked={this.state.isPaymentEnabled} value={this.state.isPaymentEnabled} className={'mr-auto'} variant={'3d'} color={'primary'} label data-on="On" data-off="Off"/>
                    </div>   



                </div>
                {
                    Object.keys(this.state.PaymentGatewayList).length > 0  &&
                    // <div className='d-flex  serv-unavailable badge-dark p-3 px-5'>
                    <div className=''>
                        {/* {"Service not available"} */}
                    </div>
                }
                <div className={this.state.show ? '' : 'overlay-disable-wrap'}>
                    <div className='overlay-disable'></div>
                    <div className="row">
                        <div className="col-md-8 col-sm-12 ">
                            <div className="form-group mb-3">

                                <div style={{ marginTop: 10 }}>
                                        <div >
                                            <div className="form-group mb-3 flex-wrap" style={{
                                                maxWidth: '400px',
                                                paddingLeft: '15px'
                                            }}>
                                                {/* {Object.keys(this.state.PaymentGatewayList).length > 0 && this.state.PaymentGatewayList.ServiceLabels.length > 0 && this.state.PaymentGatewayList.ServiceLabels.map((v, i) => { */}
                                                {Object.keys(this.state.PaymentGatewayList).length > 0 && this.state.PaymentGatewayList.ServiceLabels.map((v, i) => {
                                                    return (
                                                        <div>

                                                            <div className='ml-4 d-flex align-items-center'>
                                                                <label className='ml-1 mt-2' for="active">{v.Label}</label>
                                                                <label className='ml-1 mt-2' for="active">(25%)</label>
                                                                <div className='  ml-auto'>
                                                                    <BootstrapSwitchButton
                                                                        checked={this.selectedValue(v)}
                                                                        size="xs"
                                                                        style="min-xs xs-toggle-btn"
                                                                        onstyle="primary"
                                                                        onChange={(e) => {
                                                                            console.log('e', e)
                                                                            this.selectPayment(e, v)
                                                                        }}
                                                                    />
                                                                </div>
                                                                <a onClick={() => this.togglePaymentModal()} className='ml-3 text-primary cursor-pointer' for="active">view details</a>
                                                            </div>

                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                </div>
                            </div>



                        </div>

                    </div>

                    <div className="col-xs-12 setting-cus-field m-b-20 ml-3">

                        <div className="action-wrapper">
                        </div>
                    </div>
                </div>
                </div>
                </div>
                {this.GenerateSweetConfirmationWithCancel()}
                <Modal isOpen={this.state.paymentModal} toggle={() => this.togglePaymentModal()} className={this.props.className}>
                    <ModalHeader >Payment Details</ModalHeader>
                    <ModalBody></ModalBody>
                </Modal>
            </div >
        )
    }
}