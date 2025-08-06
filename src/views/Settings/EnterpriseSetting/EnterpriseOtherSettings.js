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
import GeneralSettings from '../EnterpriseSetting/GeneralSettings';


class OtherSettings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            otherSettings: this.props != undefined && this.props.enterpriseInfo != undefined ? this.props.enterpriseInfo : {},
            InfoData: this.props != undefined && this.props.enterpriseInfo != undefined ? JSON.stringify(this.props.enterpriseInfo) : {},
            isSaving: false,
            comfirmationModelType: '',
            confirmationModelText: '',
            showConfirmation: false,
            enabledAdditionalCharges: false,
            additionalCharges: { enableAdditionalCharges: false },
            additionalCharges: [],
            UserObject:{}
        };
        if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
            var userObject = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
            this.state.UserObject = userObject;
            // if (userObject.RoleLevel !== Constants.Role.ENTERPRISE_ADMIN_ID) SetMenuStatus(false);
          }
    }

    handleAdditionalChargesState = () => {

        this.setState({ enabledAdditionalCharges: !this.state.enabledAdditionalCharges })

    }

    saveOtherSettings = async () => {
        try {
            const { GuestPrivacy } = this.state.otherSettings;
            var message = "";
            var otherSettings = {}
            otherSettings.EnterpriseId = this.state.otherSettings.EnterpriseId
            otherSettings.GuestPrivacy = GuestPrivacy

            let response = await EnterpriseSettingService.StoreOtherSetting(otherSettings)
            if (response != undefined && !response.HasError) {
                message = `updated successfully.`
                Utilities.notify(message, 's');
                this.props.GetEnterpriseHealth()
                this.state.UserObject.EnterpriseRestaurant.RestaurantSettings.GuestPrivacy = this.state.otherSettings.GuestPrivacy
                localStorage.setItem(Constants.Session.USER_OBJECT, JSON.stringify(this.state.UserObject))
                localStorage.setItem(Constants.Session.PRIVACY_SWITCH, this.state.otherSettings.GuestPrivacy)
                window.location.href = window.location.href
                this.setState({ isSaving: false, showConfirmation: false })
                return
            }
            message = `${response.ErrorCodeCsv}.`
            Utilities.notify(message, 'e');
            this.setState({ isSaving: false, showConfirmation: false, otherSettings: JSON.parse(this.state.InfoData) })

        } catch (e) {
            this.setState({ isSaving: false, showConfirmation: false, otherSettings: JSON.parse(this.state.InfoData) })
            console.log('Error in saving saveOtherSettings', e)
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

    onCancel = () => {
        let type = this.state.comfirmationModelType;

        switch (type.toUpperCase()) {
            case 'OD':
                this.state.paymentandFacilities.IsDeliveryOffered = !this.state.paymentandFacilities.IsDeliveryOffered
                this.setState({ showConfirmation: false, paymentandFacilities: this.state.paymentandFacilities });
                break;

            default:
                break;
        }
    }



    render() {
        const enterpriseDataLength = Object.keys(this.state.otherSettings).length > 0
        const { GuestPrivacy } = this.state.otherSettings;
        return (
            <div className='card-body mx-0 other-setting-p-wrap'>
                <div class="row">
                    <div className="m-3 w-100 mb-4 p-4" style={{ boxShadow: "0 0 5px #00000030" }}>

                        <div class="col-md-12 px-0">
                            <div className="d-flex justify-content-between align-items-center" style={{ marginBottom: "18px" }}>
                                <h5>{Labels.OtherSettings}</h5>
                                {/* <a class="ml-1 text-primary cursor-pointer">edit</a> */}
                            </div>

                            <div id="generalSettingsDv" className="" >
                                <div className='col-md-12 col-xs-12'>
                                {
                                    this.state.UserObject.Enterprise.EnterpriseTypeId == 5 &&
                                    <div className="col-xs-12 col-sm-12 m-b-20 checkDiv justify-content-between">
                                        <label className="fw-semibold font-14">Guest Privacy</label>
                                        <div className="">
                                            <BootstrapSwitchButton
                                                checked={GuestPrivacy}
                                                onChange={(e) => {
                                                    this.state.otherSettings.GuestPrivacy = e

                                                    this.saveOtherSettings()

                                                }}
                                                onlabel='Activate'
                                                offlabel='Deactivate'
                                                size="xs"
                                                style="min-xs xs-toggle-btn"
                                                onstyle="primary"
                                            />
                                        </div>
                                    </div>
                                }
                                </div>
                                <GeneralSettings/>
                            </div>
                        </div>
                    </div>
                </div>
                {this.GenerateSweetConfirmationWithCancel()}
            </div>
        );
    }
}

export default OtherSettings;
