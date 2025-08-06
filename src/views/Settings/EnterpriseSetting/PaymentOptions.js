import React, { Component, Fragment } from 'react';
import { FormGroup, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader, Table, Alert } from 'reactstrap';
import * as EnterpriseSettingService from '../../../service/EnterpriseSetting';
import * as Utilities from '../../../helpers/Utilities';
import Constants from '../../../helpers/Constants';
import { AvForm, AvField, AvInput } from 'availity-reactstrap-validation';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import SweetAlert from 'sweetalert-react';
import 'rc-time-picker/assets/index.css';
import Labels from '../../../containers/language/labels';


class PaymentOptions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            paymentandFacilities: this.props != undefined && this.props.enterpriseInfo != undefined ? this.props.enterpriseInfo : {},
            InfoData: this.props != undefined && this.props.enterpriseInfo != undefined ? JSON.stringify(this.props.enterpriseInfo) : {},
            isSaving: false,
            comfirmationModelType:'',
            confirmationModelText:'',
            showConfirmation: false,
        };
    }
    savePaymentAndFacilities = async () => {
        try{
        const { IsCardAccepted, IsCashAccepted, IsDeliveryOffered, IsTakeawayOffered } = this.state.paymentandFacilities;
        var message = "";
        var paymentAndFacilities = {}
        paymentAndFacilities.EnterpriseId = this.state.paymentandFacilities.EnterpriseId
        paymentAndFacilities.CardOnDelivery = IsCardAccepted
        paymentAndFacilities.CashOnDelivery = IsCashAccepted
        paymentAndFacilities.OfferDelivery = IsDeliveryOffered
        paymentAndFacilities.OfferPickup = IsTakeawayOffered
        let response = await EnterpriseSettingService.StoreFacilities(paymentAndFacilities)
        if (response != undefined && !response.HasError) {
            message = `updated successfully.`
            Utilities.notify(message, 's');
            this.props.GetEnterpriseHealth()
            this.setState({ isSaving: false, showConfirmation: false})
            return
        }
        message = `${response.ErrorCodeCsv}.`
        Utilities.notify(message, 'e');
        this.setState({ isSaving: false, showConfirmation: false, paymentandFacilities: JSON.parse(this.state.InfoData)})
  
      }catch(e){
        this.setState({ isSaving: false, showConfirmation: false, paymentandFacilities: JSON.parse(this.state.InfoData) })
        console.log('Error in saving savePaymentAndFacilities', e)
      }
    }

    enableDisableConfirmation(value, label, type) {
        this.setState({ showConfirmation: true, confirmationModelText: !!value ? `Are you sure you want to enable ${label}?` : `Are you sure you want to disable ${label}?`, comfirmationModelType: type })
    }
    
    GenerateSweetConfirmationWithCancel() {
        return (
            <SweetAlert
                show={this.state.showConfirmation}
                title=""
                text={this.state.confirmationModelText}
                showCancelButton
                onConfirm={() => { this.savePaymentAndFacilities() }}
                confirmButtonText="Yes"
                onCancel={() => {
                    this.onCancel()
                }}
                onEscapeKey={() => this.onCancel()}
            // onOutsideClick={() => this.setState({ showConfirmation: false })}
            />
        )
    }

    onCancel = () =>{
            let type = this.state.comfirmationModelType;
    
            switch (type.toUpperCase()) {
            case 'OD':
                this.state.paymentandFacilities.IsDeliveryOffered = !this.state.paymentandFacilities.IsDeliveryOffered
                this.setState({ showConfirmation: false, paymentandFacilities: this.state.paymentandFacilities });
                break;
            case 'OP':
                this.state.paymentandFacilities.IsTakeawayOffered = !this.state.paymentandFacilities.IsTakeawayOffered
                this.setState({ showConfirmation: false, paymentandFacilities: this.state.paymentandFacilities });
                break;
            case 'CD':
                this.state.paymentandFacilities.IsCardAccepted = !this.state.paymentandFacilities.IsCardAccepted
                this.setState({ showConfirmation: false, paymentandFacilities: this.state.paymentandFacilities });
                break;
            case 'COD':
                this.state.paymentandFacilities.IsCashAccepted = !this.state.paymentandFacilities.IsCashAccepted
                this.setState({ showConfirmation: false, paymentandFacilities: this.state.paymentandFacilities });
                break;
    
            default:
                break;
            }
    }

    render() {
        const enterpriseDataLength = Object.keys(this.state.paymentandFacilities).length > 0
        const { IsCardAccepted, IsCashAccepted, IsDeliveryOffered, IsTakeawayOffered } = this.state.paymentandFacilities;
        return (
            <div className='card-body mx-0'>
                <div class="row">
                    <div  className="m-3 w-100 mb-4 p-4" style={{ boxShadow: "0 0 5px #00000030" }}>
                    
                    <div class="col-md-12 px-0">
                        <div className="d-flex justify-content-between align-items-center" style={{ marginBottom: "18px" }}>
                            <h5>{Labels.Facilities}</h5>
                            {/* <a class="ml-1 text-primary cursor-pointer">edit</a> */}
                        </div>

                        <div className="mb-1" style={{ maxWidth: "800px" }}>
                            <div className="row mb-2 flex-nowrap">
                                <label className="col-lg-3 fw-semibold font-14">Offer Delivery</label>
                                <div className="col-lg-8">
                                    <BootstrapSwitchButton
                                        checked={IsDeliveryOffered}
                                        onChange={(e) => {
                                            this.state.paymentandFacilities.IsDeliveryOffered = e
                                            // this.enableDisableConfirmation(e, 'Offer Delivery', 'OD')
                                            this.savePaymentAndFacilities()
                                            // this.setState({ paymentandFacilities: this.state.paymentandFacilities })
                                        }}
                                        onlabel='Activate'
                                        offlabel='Deactivate'
                                        size="xs"
                                        style="min-xs xs-toggle-btn"
                                        onstyle="primary"
                                    />
                                </div>
                            </div>
                            <div className="row mb-4 flex-nowrap">
                                <label className="col-lg-3 fw-semibold font-14">Offer Pickup</label>
                                <div className="col-lg-8">
                                    <BootstrapSwitchButton
                                        checked={IsTakeawayOffered}
                                        onChange={(e) => {
                                            this.state.paymentandFacilities.IsTakeawayOffered = e
                                            this.savePaymentAndFacilities()
                                            // this.enableDisableConfirmation(e, 'Offer Pickup', "OP")
                                            // this.setState({ paymentandFacilities: this.state.paymentandFacilities })
                                        }}
                                        onlabel='Activate'
                                        offlabel='Deactivate'
                                        size="xs"
                                        style="min-xs xs-toggle-btn"
                                        onstyle="primary"
                                    />
                                </div>
                            </div>

                            <div className="row mb-2 flex-nowrap">
                                <h6 className="col-lg-3 bold font-14">Payment options</h6>
                            </div>
                            {/* <div className="row mb-2 flex-nowrap">
                                <label className="col-lg-3 fw-semibold font-14">Accept Card</label>
                                <div className="col-lg-8">
                                    <BootstrapSwitchButton
                                        checked={IsCardAccepted}
                                        onChange={(e) => {
                                            this.state.paymentandFacilities.IsCardAccepted = e
                                            // this.enableDisableConfirmation(e, 'Card on Delivery', "CD")
                                            this.savePaymentAndFacilities()
                                            // this.setState({ paymentandFacilities: this.state.paymentandFacilities })
                                        }}
                                        onlabel='Activate'
                                        offlabel='Deactivate'
                                        size="xs"
                                        style="min-xs xs-toggle-btn"
                                        onstyle="primary"
                                    />
                                </div>
                            </div> */}
                            <div className="row mb-2 flex-nowrap">
                                <label className="col-lg-3 fw-semibold font-14">Accept Cash</label>
                                <div className="col-lg-8">
                                    <BootstrapSwitchButton
                                        checked={IsCashAccepted}
                                        onChange={(e) => {
                                            this.state.paymentandFacilities.IsCashAccepted = e
                                            // this.enableDisableConfirmation(e, 'Cash on Delivery', "COD")
                                            this.savePaymentAndFacilities()
                                            // this.setState({ paymentandFacilities: this.state.paymentandFacilities })
                                        }}
                                        onlabel='Activate'
                                        offlabel='Deactivate'
                                        size="xs"
                                        style="min-xs xs-toggle-btn"
                                        onstyle="primary"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
                {this.GenerateSweetConfirmationWithCancel()}
            </div>
        );
    }
}

export default PaymentOptions;
