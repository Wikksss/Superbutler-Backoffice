import React, { Component } from 'react';
import {Button} from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import * as CommissionService from '../../service/EnterpriseCommission';
import * as EnterpriseService from '../../service/Enterprise';
import * as Utilities from '../../helpers/Utilities';
import Loader from 'react-loader-spinner';
//import Constants from '../../helpers/Constants';
import Config from '../../helpers/Config';
import Labels from '../../containers/language/labels';

class CommisionSetup extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
          show: false,
          modalVisible: false,
          DataFetched: false,
            Enterprise: {},
            IsSave:false,
            FromInvalid: false,
            currencySymbol: Config.Setting.currencySymbol
          
    };

    this.UpdateEnterpriseCommission = this.UpdateEnterpriseCommission.bind(this);
    
      }



// #region api calling

GetEnterpriseDetail = async () => {
   
      this.setState({DataFetched: false});
      let data = await EnterpriseService.Get();
    //  console.log("ikm", data);
      if(data.length !== 0) {

        let SupermealCommision = ((data.CommissionPercentage - data.CommissionHistory.CashbackPortalInternal) * 100).toFixed(2);
        let SupermealAppCommission = ((data.AppCommissionPercentage  - data.CommissionHistory.CashbackPortalExternal) * 100).toFixed(2);

        data.SupermealCommision = SupermealCommision
        data.SupermealAppCommission = SupermealAppCommission;

        this.setState({Enterprise: data,DataFetched: true, currencySymbol: data.RestaurantSettings.CurrencySymbol});
      }
      
     
}


UpdateEnterpriseCommissionApi = async(enterpriseCommission) =>{

        let message = await CommissionService.Update(enterpriseCommission)  
        this.setState({IsSave:false,FromInvalid: false});
        if(message === '1')
                Utilities.notify("Updated successfully.","s");
            else 
                Utilities.notify("Update failed.","e");
      
}

UpdateEnterpriseCommission(event, values){
    if(this.state.IsSave) return;
    this.setState({IsSave:true});
    
    let enterpriseCommission = CommissionService.EnterpriseCommission;
    enterpriseCommission.StandardCharges = values.txtFixedCharges;
    enterpriseCommission.CashBackMinOrder = values.txtCashBackMinOrder;
    enterpriseCommission.CommissionPercentage = values.txtCommissionPercentageInternal;
    enterpriseCommission.StandardChargesExternal = values.txtFixedChargesExternal;
    enterpriseCommission.CashBackMinOrderEnterprise = values.txtCashBackMinOrderEnterpriseApp;
    enterpriseCommission.AppCommissionPercentage = values.txtAppCommissionPercentage;
    enterpriseCommission.CommissionAmountTableBookingSourcePortal = values.txtTableBookingCommissionAmount;
    enterpriseCommission.CommissionAmountTableBookingSourceEnterprise = values.txtTableBookingCommissionAmountApp;
    enterpriseCommission.CommissionHistory.CardFeesPortalInternal = values.txtCardFeesPortalInternal;
    enterpriseCommission.CommissionHistory.CashbackPortalInternal = values.txtCashBackPercentageInternal;
    enterpriseCommission.CommissionHistory.CashbackEnterpriseInternal = values.txtEnterpriseOfferingCashbackInternal;
    enterpriseCommission.CommissionHistory.CardFeesPortalExternal = values.txtCardFeesPortalExternal;
    enterpriseCommission.CommissionHistory.CashbackPortalExternal = values.txtCashbackEnterpriseApp;
    enterpriseCommission.CommissionHistory.CashbackEnterpriseExternal = values.txtEnterpriseOfferingCashbackExternal;
    enterpriseCommission.AgentRestaurant.CommissionPercentage = values.txtAgentCommissionPercentageInternal;
    enterpriseCommission.AgentRestaurant.CommissionAmountTableBookingSourcePortal = values.txtTableBookingAgentCommissionAmount;
    enterpriseCommission.AgentRestaurant.CommissionPercentageSourceEnterprise = values.txtAgentCommissionAppPercentage;
    enterpriseCommission.AgentRestaurant.CommissionAmountTableBookingSourceEnterprise = values.txtTableBookingAgentCommissionAmountApp;


     //updating
     this.UpdateEnterpriseCommissionApi(enterpriseCommission);

}


    
//#endregion

SetSupermealCommissionValue(value,control){

    let enterprise = this.state.Enterprise;
    
    switch(control.toUpperCase()){
      
        case 'EC':
        value = Number(value)/100;
            enterprise.SupermealCommision = ((value - enterprise.CommissionHistory.CashbackPortalInternal) * 100).toFixed(2);
            enterprise.CommissionPercentage = value;
            
            break;
      
        case 'AC':
            // enterprise.SupermealCommision = ((enterprise.CommissionPercentage - value - enterprise.CommissionHistory.CashbackPortalInternal) * 100).toFixed(2);
            enterprise.AgentRestaurant.CommissionPercentage  = value;
            break;
        
        case 'CP':
        value = Number(value)/100;
        enterprise.SupermealCommision = ((enterprise.CommissionPercentage - value) * 100).toFixed(2);
            enterprise.CashBack = (Number(value) +  Number(enterprise.CommissionHistory.CashbackEnterpriseInternal)).toFixed(2);
            enterprise.CommissionHistory.CashbackPortalInternal = value
            break;


        case 'ECE':

            value = Number(value)/100;
            enterprise.SupermealAppCommission = ((value  - enterprise.CommissionHistory.CashbackPortalExternal) * 100).toFixed(2);
            enterprise.AppCommissionPercentage = value;
            break;
      
        case 'ACE':
            // enterprise.SupermealAppCommission = ((enterprise.AppCommissionPercentage - value - enterprise.CommissionHistory.CashbackPortalExternal) * 100).toFixed(2);
            enterprise.AgentRestaurant.CommissionPercentageSourceEnterprise  = value;
            break;
        
        case 'CPE':
        value = Number(value)/100;
            enterprise.SupermealAppCommission = ((enterprise.AppCommissionPercentage - value) * 100).toFixed(2);
            enterprise.CashBackEnterprise = (Number(value) +  Number(enterprise.CommissionHistory.CashbackEnterpriseExternal)).toFixed(2);
            enterprise.CommissionHistory.CashbackPortalExternal = value
            break;
        default:
            break;

    }

    this.setState({Enterprise: enterprise});
}



SetConsumerCashback(value,control){

    let enterprise = this.state.Enterprise;
    value = Number(value)/100;
    
    switch(control.toUpperCase()){
      
    case 'CEI':
    enterprise.CashBack =  (Number(enterprise.CommissionHistory.CashbackPortalInternal) + Number(value)).toFixed(2);
    enterprise.CommissionHistory.CashbackEnterpriseInternal = value
    this.setState({Enterprise: enterprise});
    break;
        
    case 'CEE':
    enterprise.CashBackEnterprise =  (Number(enterprise.CommissionHistory.CashbackPortalExternal) + Number(value)).toFixed(2);
    enterprise.CommissionHistory.CashbackEnterpriseExternal = value
    this.setState({Enterprise: enterprise});
    break;

    default:
            break;
}
}

handleInvalidSubmit = () => {
    this.setState({FromInvalid: true})
}
 
componentDidMount() {
  
    this.GetEnterpriseDetail();
   
   } 


    loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

    render() {

        let enterprise = this.state.Enterprise;

        if(!this.state.DataFetched){

            return this.loading();
        }

        // let FoortalCommisionValue = ((enterprise.CommissionPercentage - enterprise.AgentRestaurant.CommissionPercentage - enterprise.CommissionHistory.CashbackPortalInternal) * 100).toFixed(2);
        // let SupermealAppCommission = ((enterprise.AppCommissionPercentage - enterprise.AgentRestaurant.CommissionPercentageSourceEnterprise - enterprise.CommissionHistory.CashbackEnterpriseExternal) * 100).toFixed(2);


        // alert(enterprise.CardFeesPortalInternal);

        return (
            <div className="card" id="generalSettingsDv">
               <h3 className="card-title card-new-title">{Labels.Commission_Setup}</h3>
                <div className="card-body">
                

                    <AvForm onValidSubmit={this.UpdateEnterpriseCommission}  onInvalidSubmit={this.handleInvalidSubmit}>
                        <div className="row ">
                            <div className="col-md-6 formBorder" style={{borderRight:'0px', display:"none"}}>
                                <h4 className="card-title headingComm">
                                    Core Platform
                            <p className="d-block m-t-10 font-14 font-weight-normal" >This section is to setup commission and cashback for orders which will come through Superbutler website and apps.</p>
                                </h4>
                                <div className="form-body m-b-10">
                                    <div className="row p-t-20">
                                        <div className="col-md-12">
                                            <label className="control-label font-weight-500">Fixed Charges</label>
                                            <div className="input-group m-b-10 form-group">
                                                <div className="input-group-prepend">
                                                    <span style={{borderRight:'none'}} className="input-group-text form-control" id="basic-addon1">{this.state.currencySymbol}</span>
                                                </div>
                                                <AvField  name="txtFixedCharges" type="number" value={enterprise.StandardCharges + ""} className="form-control borderRadiusLeftNone form-control-left borderRightRadius" required 
                                                   validate={{
                                                    required: { value: true, errorMessage: 'This is a required field' },
                                                    pattern: { value: /^[0-9]+(\.[0-9]{1,2})?$/, errorMessage: 'please fill correct value' }
                                                }} />
                                                <div className="help-block with-errors"></div>
                                            </div>

                                        </div>

                                        <div className="col-md-12">
                                            <label className="control-label font-weight-500">Card Fees</label>
                                            <div className="input-group mb-3 form-group">
                                            <AvField errorMessage="This is a required field" required type="tel" name="txtCardFeesPortalInternal" value={(enterprise.CommissionHistory.CardFeesPortalInternal * 100) + ""} className="borderRadiusRightNone form-control form-control-right" id="txtFreeDeliveryWithIn"
                                                validate={{tel: {pattern: '^[0-9]'}}}
                                            />
                                                <div className="input-group-append">
                                                    <span className="input-group-text form-control borderRightRadius">%</span>
                                                </div>
                                                <div className="help-block with-errors"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <label className="control-label font-weight-500">Enterprise Commission</label>
                                            <div className="input-group mb-3 form-group">
                                            <AvField errorMessage="This is a required field" required type="tel" name="txtCommissionPercentageInternal" value={(enterprise.CommissionPercentage * 100) + ""} onChange={(e)=>this.SetSupermealCommissionValue(e.target.value, "EC")} className="borderRadiusRightNone form-control form-control-right" id="txtFreeDeliveryWithIn"
                                                validate={{tel: {pattern: '^[0-9]'}}}
                                            />
                                            <div className="input-group-append">
                                                    <span className="input-group-text form-control borderRightRadius">%</span>
                                                </div>
                                                <div className="help-block with-errors"></div>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <label className="control-label font-weight-500">Superbutler Offering Cashback</label>
                                            <div className="input-group mb-3 form-group">
                                            <AvField errorMessage="This is a required field" required type="tel" name="txtCashBackPercentageInternal" value={(enterprise.CommissionHistory.CashbackPortalInternal * 100) + ""} onChange={(e)=>this.SetSupermealCommissionValue(e.target.value, "CP")} className="borderRadiusRightNone form-control form-control-right" id="txtFreeDeliveryWithIn"
                                                validate={{tel: {pattern: '^[0-9]'}}}
                                            />
                                            <div className="input-group-append">
                                                    <span className="input-group-text form-control borderRightRadius">%</span>
                                                </div>
                                                <div className="help-block with-errors"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">


                                        <div className="col-md-12">
                                            <label className="control-label font-weight-500">Superbutler Commission</label>
                                            <div className="input-group mb-3 form-group">

                                             <AvField errorMessage="This is a required field" name="lblSupermealCommisionValue" value={enterprise.SupermealCommision} type="text" className="form-control borderRadiusLeftNone form-control-left borderRightRadius" readOnly 
                                                     />

                                            <div className="input-group-append">
                                                    <span className="input-group-text form-control borderRightRadius">%</span>
                                                </div>
                                                <div className="help-block with-errors"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12" style={{marginBottom:'15px'}}>
                                            <label className="control-label font-weight-500">Enterprise offering Cashback</label>
                                            <div className="input-group mb-3  form-group">
                                                {/* <input type="tel" className="form-control form-control-right validatedField flexBasisValidation" value={this.state.StandardCharges} required data-error="This field is required" /> */}
                                                <AvField errorMessage="This is a required field" required type="text" name="txtEnterpriseOfferingCashbackInternal" value={(enterprise.CommissionHistory.CashbackEnterpriseInternal * 100) + ""} onChange={(e) => this.SetConsumerCashback(e.target.value, 'CEI')} className="borderRadiusRightNone form-control form-control-right" id="txtFreeDeliveryWithIn"
                                                validate={{tel: {pattern: '^[0-9]'}}}
                                            />
                                                <div className="input-group-append">
                                                    <span className="input-group-text form-control borderRightRadius">%</span>
                                                </div>
                                                <div className="help-block with-errors"></div>
                                            </div>
                                            <div className="form-control-feedback font-12">
                                                <label className="m-r-10">Cashback Min Order</label>
                                                <span className="input-group d-inline-flex free-charges-input">
                                                    <span className="input-group-prepend">
                                                        <span className="input-group-text form-control" id="">{this.state.currencySymbol}</span>
                                                    </span>
                                                    {/* <input type="tel" className="form-control form-control-left validatedField" aria-label="Username" aria-describedby="basic-addon1" required /> */}
                                                    <AvField errorMessage="This is a required field" required type="tel" name="txtCashBackMinOrder" value={(enterprise.CashBackMinOrder) + ""} className="borderRadiusRightNone form-control form-control-left" id="txtFreeDeliveryWithIn"
                                                validate={{tel: {pattern: '^[0-9]'}}}
                                            />
                                                </span>
                                            </div>
                                        </div>
                                        <div className="col-md-12" style={{marginBottom:'15px'}}>
                                            <label className="control-label font-weight-500">Cashback consumer will get</label>
                                            <div className="input-group mb-3  form-group">
                                            <AvField errorMessage="This is a required field" required type="tel" name="lblCashbackConsumer" value={(enterprise.CashBack * 100).toFixed(2) + ""} className="borderRadiusRightNone form-control form-control-right" readOnly id="txtFreeDeliveryWithIn"
                                                validate={{tel: {pattern: '^[0-9]'}}}
                                            />
                                            <div className="input-group-append">
                                                    <span className="input-group-text form-control borderRightRadius">%</span>
                                                </div>
                                                <div className="help-block with-errors"></div>
                                            </div>
                                           
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12" style={{marginBottom:'15px'}}>
                                            <label className="control-label font-weight-500">Restaurant Table booking Commission (per person)</label>
                                            <div className="input-group m-b-10 form-group">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text form-control" id="basic-addon1">{this.state.currencySymbol}</span>
                                                </div>
                                                <AvField errorMessage="This is a required field" name="txtTableBookingCommissionAmount" value={enterprise.CommissionAmountTableBookingSourcePortal + ""} type="tel" className="form-control borderRadiusLeftNone form-control-left borderRightRadius" required 
                                                    validate={{tel: {pattern: '^[0-9]'}}} />
                                                <div className="help-block with-errors"></div>
                                            </div>

                                        </div>
                                        <div className="col-md-12">
                                            <label className="control-label font-weight-500">Agent Table Booking Commission  (per person)</label>
                                            <div className="input-group m-b-10 form-group">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text form-control" id="basic-addon1">{this.state.currencySymbol}</span>
                                                </div>
                                                <AvField errorMessage="This is a required field" name="txtTableBookingAgentCommissionAmount" value={enterprise.AgentRestaurant.CommissionAmountTableBookingSourcePortal + ""} type="tel" className="form-control borderRadiusLeftNone form-control-left borderRightRadius" required 
                                                    validate={{tel: {pattern: '^[0-9]'}}} />
                                                <div className="help-block with-errors"></div>
                                            </div>

                                        </div>

                                        <div className="col-md-12">
                                            <label className="control-label font-weight-500">Agent Commission</label>
                                            <div className="input-group mb-10  form-group">
                                            <div className="input-group-prepend">
                                                    <span className="input-group-text form-control" id="basic-addon1">{this.state.currencySymbol}</span>
                                            </div>
                                            <AvField type="text" name="txtAgentCommissionPercentageInternal" value={(enterprise.AgentRestaurant.CommissionPercentage ) + ""}  onChange={(e)=>this.SetSupermealCommissionValue(e.target.value, "AC")} className="borderRadiusRightNone form-control form-control-left" id="txtFreeDeliveryWithIn"
                                                validate={{
                                                    required: { value: true, errorMessage: 'This is a required field' },
                                                    pattern: { value: /^[0-9]+(\.[0-9]{1,2})?$/, errorMessage: 'please fill correct value' }
                                                }}/>

                                                <div className="help-block with-errors"></div>
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </div>

                            <div className="col-md-12 formBorder marginResp" style={{maxWidth:"400px"}}>
                                <h4 className="card-title headingComm">
                                    {Labels.White_Label_Website}
                            <p className="d-block m-t-10 font-14 font-weight-normal" >This section is to setup commission and cashback for orders which will come from Business White Label website and apps.</p>
                                </h4>
                                <div className="form-body m-b-10">
                                    <div className="row p-t-20">
                                        <div className="col-md-12">
                                            <label className="control-label font-weight-500">{Labels.Fixed_Charges}</label>
                                            <div className="input-group m-b-10 form-group">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text form-control" id="basic-addon1">{this.state.currencySymbol}</span>
                                                </div>
                                                <AvField errorMessage="This is a required field" name="txtFixedChargesExternal" value={enterprise.StandardChargesExternal + ""} type="tel" className="form-control borderRadiusLeftNone form-control-left borderRightRadius" required 
                                                    validate={{tel: {pattern: '^[0-9]'}}} />
                                                <div className="help-block with-errors"></div>
                                            </div>

                                        </div>




                                        <div className="col-md-12">
                                            <label className="control-label font-weight-500">{Labels.Card_Fees}</label>
                                            <div className="input-group mb-3 form-group">
                                            <AvField errorMessage="This is a required field" required type="tel" name="txtCardFeesPortalExternal" value={(enterprise.CommissionHistory.CardFeesPortalExternal * 100) + ""} className="borderRadiusRightNone form-control form-control-right" id="txtFreeDeliveryWithIn"
                                                validate={{tel: {pattern: '^[0-9]'}}}
                                            />
                                            <div className="input-group-append">
                                                    <span className="input-group-text form-control borderRightRadius">%</span>
                                                </div>
                                                <div className="help-block with-errors"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <label className="control-label font-weight-500">{Labels.Business_Commission}</label>
                                            <div className="input-group mb-3 form-group">
                                                <AvField errorMessage="This is a required field" required type="tel" name="txtAppCommissionPercentage" value={(enterprise.AppCommissionPercentage * 100) + ""} onChange={(e)=>this.SetSupermealCommissionValue(e.target.value, "ECE")}  className="borderRadiusRightNone form-control form-control-right" id="txtFreeDeliveryWithIn"
                                                    validate={{tel: {pattern: '^[0-9]'}}}
                                                />
                                                <div className="input-group-append">
                                                    <span className="input-group-text form-control borderRightRadius">%</span>
                                                </div>
                                                <div className="help-block with-errors"></div>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <label className="control-label font-weight-500">{Labels.Superbutler_Offering_Cashback}</label>
                                            <div className="input-group mb-3 form-group">
                                                <AvField errorMessage="This is a required field" required type="tel" name="txtCashbackEnterpriseApp" value={(enterprise.CommissionHistory.CashbackPortalExternal * 100) + ""} onChange={(e)=>this.SetSupermealCommissionValue(e.target.value, "CPE")} className="borderRadiusRightNone form-control form-control-right" id="txtFreeDeliveryWithIn"
                                                    validate={{tel: {pattern: '^[0-9]'}}}
                                                />
                                                <div className="input-group-append">
                                                    <span className="input-group-text form-control borderRightRadius">%</span>
                                                </div>
                                                <div className="help-block with-errors"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <label className="control-label font-weight-500">{Labels.Superbutler_Commission}</label>
                                            <div className="input-group mb-3 form-group">

                                                 <AvField errorMessage="This is a required field" name="lblSupermealAppCommission" value={enterprise.SupermealAppCommission + ""} type="text" className="form-control borderRadiusLeftNone form-control-left borderRightRadius" readOnly 
                                                    />
                                                 {/* <AvField errorMessage="This is a required field" name="lblSupermealCommisionValue" value={enterprise.SupermealCommision} type="text" className="form-control borderRadiusLeftNone form-control-left borderRightRadius" readOnly 
                                                     /> */}

                                               <div className="input-group-append">
                                                    <span className="input-group-text form-control borderRightRadius">%</span>
                                                </div>
                                                <div className="help-block with-errors"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12" style={{marginBottom:'15px'}}>
                                            <label className="control-label font-weight-500">{Labels.Business_Offering_Cashback}</label>
                                            <div className="input-group mb-3  form-group">
                                                <AvField errorMessage="This is a required field" required type="tel" name="txtEnterpriseOfferingCashbackExternal" value={(enterprise.CommissionHistory.CashbackEnterpriseExternal * 100) + ""} onChange={(e) => this.SetConsumerCashback(e.target.value, 'CEE')} className="borderRadiusRightNone form-control form-control-right" id="txtFreeDeliveryWithIn"
                                                    validate={{tel: {pattern: '^[0-9]'}}}
                                                />
                                                <div className="input-group-append">
                                                    <span className="input-group-text form-control borderRightRadius">%</span>
                                                </div>
                                                <div className="help-block with-errors"></div>
                                            </div>
                                            <div className="form-control-feedback font-12">
                                                <span className="m-r-10">{Labels.Cashback_Min_Order}</span>
                                                <span className="input-group d-inline-flex free-charges-input">
                                                    <span className="input-group-prepend">
                                                        <span className="input-group-text form-control" id="">{this.state.currencySymbol}</span>
                                                    </span>
                                                    <AvField errorMessage="This is a required field" name="txtCashBackMinOrderEnterpriseApp" value={enterprise.CashBackMinOrderEnterprise + ""} type="tel" className="form-control borderRadiusLeftNone form-control-left borderRightRadius" required 
                                                    validate={{tel: {pattern: '^[0-9]'}}} />
                                                    </span>
                                            </div>
                                        </div>
                                        <div className="col-md-12" style={{marginBottom:'15px'}}>
                                            <label className="control-label font-weight-500">{Labels.Cashback_Consumer_Will_Get}</label>
                                            <div className="input-group mb-3  form-group">
                                                {/* <input type="tel" className="form-control form-control-right validatedField flexBasisValidation" required data-error="This field is required" /> */}
                                                <AvField errorMessage="This is a required field" name="lblCashbackExternalConsumer" value={(enterprise.CashBackEnterprise * 100).toFixed(2)  + ""} type="tel" className="form-control borderRadiusLeftNone form-control-left borderRightRadius" required readOnly 
                                                    validate={{tel: {pattern: '^[0-9]'}}} />
                                                <div className="input-group-append">
                                                    <span className="input-group-text form-control borderRightRadius">%</span>
                                                </div>
                                                <div className="help-block with-errors"></div>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12" style={{marginBottom:'15px'}}>
                                            <label className="control-label font-weight-500">{Labels.Business_Table_booking_Commission}</label>
                                            <div className="input-group m-b-10 form-group">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text form-control" id="basic-addon1">{this.state.currencySymbol}</span>
                                                </div>
                                                <AvField errorMessage="This is a required field" name="txtTableBookingCommissionAmountApp" value={enterprise.CommissionAmountTableBookingSourceEnterprise  + ""} type="tel" className="form-control borderRadiusLeftNone form-control-left borderRightRadius" required 
                                                validate={{tel: {pattern: '^[0-9]'}}} />
                                                    <div className="help-block with-errors"></div>
                                            </div>


                                        </div>

                                        <div className="col-md-12">
                                            <label className="control-label font-weight-500">{Labels.Agent_Table_Booking_Commission}</label>
                                            <div className="input-group m-b-10 form-group">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text form-control" id="basic-addon1">{this.state.currencySymbol}</span>
                                                </div>
                                                <AvField errorMessage="This is a required field" name="txtTableBookingAgentCommissionAmountApp" value={enterprise.AgentRestaurant.CommissionAmountTableBookingSourceEnterprise  + "" } type="tel" className="form-control borderRadiusLeftNone form-control-left borderRightRadius" required 
                                                    validate={{tel: {pattern: '^[0-9]'}}} />
                                                <div className="help-block with-errors"></div>
                                            </div>

                                        </div>

                                        <div className="col-md-12">
                                            <label className="control-label font-weight-500">{Labels.Agent_Commission}</label>
                                            <div className="input-group mb-10  form-group">
                                            <div className="input-group-prepend">
                                                    <span className="input-group-text form-control" id="basic-addon1">{this.state.currencySymbol}</span>
                                                </div>
                                                <AvField type="text" name="txtAgentCommissionAppPercentage" value={(enterprise.AgentRestaurant.CommissionPercentageSourceEnterprise) + ""} onChange={(e)=>this.SetSupermealCommissionValue(e.target.value, "ACE")} className="borderRadiusRightNone form-control form-control-left" id="txtFreeDeliveryWithIn"
                                                    validate={{
                                                        required: { value: true, errorMessage: 'This is a required field' },
                                                        pattern: { value: /^[0-9]+(\.[0-9]{1,2})?$/, errorMessage: 'please fill correct value' }
                                                    }}/>
                                                <div className="help-block with-errors"></div>
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="bottomBtnsDiv" style={{marginTop:20}}>
                        <Button color="secondary"   style={{ marginRight: 10 }}>{Labels.Cancel}</Button>
                            <Button color="primary" style={{width:'78px'}}>
                            {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                : <span className="comment-text">{Labels.Save}</span>}

                            </Button>
                           
                        </div>
                        {this.state.FromInvalid ? <div className="gnerror error media-imgerror">One or more fields has errors.</div> : ""}
                    </AvForm>
                </div>
            </div>
        );
    }
}

export default CommisionSetup;
