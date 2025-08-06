import React, { Component, Fragment } from 'react';
import { FormGroup, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader, Table, Alert } from 'reactstrap';
import * as EnterpriseSettingService from '../../../service/EnterpriseSetting';
import * as Utilities from '../../../helpers/Utilities';
import Constants from '../../../helpers/Constants';
import { AvForm, AvField, AvInput } from 'availity-reactstrap-validation';
import Loader from 'react-loader-spinner';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import 'rc-time-picker/assets/index.css';
import Labels from '../../../containers/language/labels';


class SEO extends Component {
  constructor(props) {
    super(props);

    this.state = {
        paymentandFacilities: this.props != undefined && this.props.enterpriseInfo != undefined ? this.props.enterpriseInfo : {},
        InfoData: this.props != undefined && this.props.enterpriseInfo != undefined ? JSON.stringify(this.props.enterpriseInfo) : {},
        isSaving: false,
        googleAnalytic: ``
    };
  }


  saveSEOPaymentAndFacilities = async () => {
    try{
    this.setState({ isSaving: true})
    const { IsCardAccepted, IsCashAccepted, IsDeliveryOffered, IsTakeawayOffered } = this.state.paymentandFacilities;
    var message = "";
    var paymentAndFacilities = {}
    var GoogleAnalytic = this.state.paymentandFacilities.GoogleAnalyticScript.replaceAll(`"`, "^^^")
    paymentAndFacilities.EnterpriseId = this.state.paymentandFacilities.EnterpriseId
    paymentAndFacilities.CardOnDelivery = IsCardAccepted
    paymentAndFacilities.CashOnDelivery = IsCashAccepted
    paymentAndFacilities.OfferDelivery = IsDeliveryOffered
    paymentAndFacilities.OfferPickup = IsTakeawayOffered
    paymentAndFacilities.GoogleAnalyticScript = this.removeSpecialCharacters(GoogleAnalytic)
    paymentAndFacilities.AnalyticsPropertyId = this.state.paymentandFacilities.AnalyticsPropertyId
    
    let response = await EnterpriseSettingService.StoreFacilities(paymentAndFacilities)
    if (response != undefined && !response.HasError) {
        message = `updated successfully.`
        Utilities.notify(message, 's');
        this.UpdateUserObject();
        this.props.GetEnterpriseHealth()
        this.setState({ isSaving: false, showConfirmation: false})
        return
    }
    message = `${response.ErrorCodeCsv}.`
    Utilities.notify(message, 'e');
    this.setState({ isSaving: false, showConfirmation: false, paymentandFacilities: JSON.parse(this.state.InfoData)})

  }catch(e){
    this.setState({ isSaving: false, showConfirmation: false, paymentandFacilities: JSON.parse(this.state.InfoData) })
    console.log('Error in saving SEO', e)
  }
}

UpdateUserObject = () => {

var pId = this.state.paymentandFacilities.AnalyticsPropertyId
 if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
        var userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
        userObj.EnterpriseRestaurant.RestaurantSettings.AnalyticsPropertyId = pId
        localStorage.setItem(Constants.Session.USER_OBJECT, JSON.stringify(userObj))
    }
}



removeSpecialCharacters = (inputString) => {
  let outputString = inputString.replace(/<br>/gi, "").replace(/\n/g, "");
  outputString = outputString.replace(/'/g, "^^^").replace(/"/g, "^^^");

  return outputString;
}


  render() {
    const enterpriseDataLength = Object.keys(this.state.paymentandFacilities).length > 0
    return (
      <div className='card-body mx-0'>
        <div class="row">
          <div className="m-3 mb-4 p-4 w-100" style={{ boxShadow: "0 0 5px #00000030" }}>
            <div className=''>
              <div class="d-flex align-items-center justify-content-between mb-4" >
                <h5>Google Analytics</h5>
                {/* <Button onClick={()=>this.saveSEOPaymentAndFacilities()} color="primary" >
                    {
                        this.state.isSaving ?
                        <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                        :
                        <span className="comment-text">{Labels.Save}</span>
                    }
                </Button> */}
                {/* <a onClick={() => this.OwnerInfoModal()} class="ml-5 cursor-pointer text-primary"><i class="fa fa-edit mr-1"></i>Edit</a> */}
              </div>
              <AvForm>
                <div className=''>


                   <div className="form-group mb-3 col-md-3 px-0">
                   <label id="analyticsPropertyId" className="control-label">Property Id</label>
                     <AvField name="analyticsPropertyId" onChange={(e) => {this.state.paymentandFacilities.AnalyticsPropertyId = e.target.value}} value={this.state.paymentandFacilities.AnalyticsPropertyId} onBlur={(e) => this.saveSEOPaymentAndFacilities()} type="text" className="form-control"
                     />
                     <div className="help-block with-errors"></div>
                 </div>

                    <div className="form-group mb-3 col-md-6 px-0">
                    <label id="firstName" className="control-label">Tracking Script</label>
                    <AvField
                      tag="textarea"
                      className="form-control seo-txt-area"
                      name="googleAnalytics"
                      onBlur={(e) =>
                        this.saveSEOPaymentAndFacilities()
                      }
                      value={this.state.paymentandFacilities.GoogleAnalyticScript}
                      onChange={(e) => {
                        if (e.target !== undefined && e.target.value !== undefined) {
                          const updatedPaymentAndFacilities = {
                            ...this.state.paymentandFacilities,
                            GoogleAnalyticScript: e.target.value,
                          };
                          this.setState({ paymentandFacilities: updatedPaymentAndFacilities });
                        }
                      }}
                    />
                    </div>
                </div>
              </AvForm>

            </div>

          </div>

        </div>

      </div>
    );
  }
}

export default SEO;
