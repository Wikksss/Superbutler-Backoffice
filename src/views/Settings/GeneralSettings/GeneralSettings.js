import React, { Component } from 'react';
import { FormGroup, Label, Button } from 'reactstrap';
import { AvForm, AvField, AvInput } from 'availity-reactstrap-validation';
import * as EnterpriseSettingService from '../../../service/EnterpriseSetting';
import * as TagService from '../../../service/Tag';
import * as Utilities from '../../../helpers/Utilities';
import Constants from '../../../helpers/Constants';
import Config from '../../../helpers/Config';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import Loader from 'react-loader-spinner';
import Labels from '../../../containers/language/labels';
// import { Link } from 'react-router-dom';

const NumberValidation = (value, ctx) => {

    if (!Utilities.IsNumber(value) && Number(value) !== -1) {
      return "please fill correct value";
    }
    return true;
  }


const SortableItem = sortableElement(({ value }) => <li className="sortableHelpernew">{value}</li>);

const SortableContainer = sortableContainer(({ items }) => {

    if (items === undefined) { return; }

    return (
        <ul className="sortableHelpernew-wrap">
            {items.map((value, index) => (
                <SortableItem key={`item-${index}`} style={{ zIndex: 100000 }} index={index} value={value.name} />
            ))}
        </ul>
    );
});
class GeneralSettings extends Component {
    onSortEnd = ({ oldIndex, newIndex }) => {
        this.setState(({ foodTypeArray }) => ({
            foodTypeArray: arrayMove(foodTypeArray, oldIndex, newIndex),
        }));

        this.GetUpdatedFoodTypeSort(this.state.foodTypeArray);

    };
    constructor(props) {
        super(props);
        this.state = {
            EnterpriseSetting: {},
            FoodTypes: {},
            FoodTypeCsv: "",
            foodTypeArray: [],
            cuisineArray: [],
            dietaryArray: [],
            FoodTypeCsvArray: [],
            AllowEdit: false,
            IsSave:false,
            FromInvalid: false,
            IsSupermealDelivery:false,
            DeliveryPartnerSettings:{},
            DeliveryPartners : [],
            SelectedDeliveryPartnerId:0,
            itemonItemDetail:false,
            currencySymbol: Config.Setting.currencySymbol
        }
        this.UpdateEnterpriseSetting = this.UpdateEnterpriseSetting.bind(this);
        this.GetUpdatedFoodTypeSort = this.GetUpdatedFoodTypeSort.bind(this);
        this.LoadEnterpriseSetting = this.LoadEnterpriseSetting.bind(this);

    }


    handleInvalidSubmit = () => {
        this.setState({FromInvalid: true})
    }
    handleIsDeliveryCheck(e){

        let enterpriseSetting = this.state.EnterpriseSetting;
        enterpriseSetting.RestaurantSettings.IsSupermealDelivery = e.target.checked
        this.setState({EnterpriseSetting: enterpriseSetting});
    
     }
     itemDetailCheck(e){

        // let enterpriseSetting = this.state.itemonItemDetail;
        // enterpriseSetting.RestaurantSettings.IsSupermealDelivery = e.target.checked
        this.setState({itemonItemDetail:  e.target.checked});
    
     }
    // #region api calling

    UpdateEnterpriseSettingApi = async (enterpriseSetting) => {
        let message = await EnterpriseSettingService.Update(enterpriseSetting)
        this.setState({IsSave:false,FromInvalid: false});
        if (message === '1'){
        this.GetEnterpriseSetting();
        Utilities.notify("Updated successfully.","s");
        }
        else
        Utilities.notify(`${message}`,"e");

    }

    UpdateEnterpriseSetting(event, values) {
       
       let enterpriseSetting = this.state.EnterpriseSetting;
       let deliveryPartnerSettings = enterpriseSetting.RestaurantSettings.DeliveryPartnerSettings !== undefined && enterpriseSetting.RestaurantSettings.DeliveryPartnerSettings !== "{}" && enterpriseSetting.RestaurantSettings.DeliveryPartnerSettings !== '' ? JSON.parse(enterpriseSetting.RestaurantSettings.DeliveryPartnerSettings) : {};
        if(this.state.IsSave) return;
        this.setState({IsSave:true})
        let setting = EnterpriseSettingService.EnterpriseSettings;
        
        if(enterpriseSetting.RestaurantSettings.IsSupermealDelivery){
            deliveryPartnerSettings = {};
            deliveryPartnerSettings.PickupName = Utilities.SpecialCharacterEncode(values.txtPickupName);
            deliveryPartnerSettings.PickupNo = Utilities.SpecialCharacterEncode(values.txtPickupNo);
            deliveryPartnerSettings.DeliveryFee = values.txtDeliveryFee;
            deliveryPartnerSettings.DeliveryTime = 0; //values.txtDeliveryTime;
            deliveryPartnerSettings.DeliveryPartnerId = this.state.SelectedDeliveryPartnerId;
            deliveryPartnerSettings.CommissionPercentageOverrideSourcePortal = values.txtCommissionPercentageOverrideSourcePortal
            deliveryPartnerSettings.CommissionPercentageOverrideSourceEnterprise = values.txtCommissionPercentageOverrideSourceEnterprise
        }


        //let loggedInUser = this.state.loggedInUser;
        setting.MinimumDeliveryOrder = values.minOrder;
        setting.DeliveryCharges = values.DelChrgs;
        setting.FreeDeliveryDistance = values.freeDel;
        setting.MaximumDeliveryDistance = values.delRadius;
        setting.OrderDeliveryTime = values.delTime == undefined ? '0' : values.delTime;
        setting.OrderCollectionTime =values.collTime == undefined ? '0' : values.collTime;
        setting.PromotionMessage = values.promoMsg == undefined ? '' : values.promoMsg;
        setting.IsCashAccepted = values.Acceptcash;
        setting.IsCODAccepted = values.AcceptCOD;
        setting.IsCardAccepted = values.Acceptcreditcard;
        setting.IsPostToRoomAccepted = values.IsPostToRoomAccepted;
        setting.IsBankTransferAccepted = values.IsBankTransferAccepted;
        setting.IsCryptoAccepted = values.Acceptcrypto
        setting.IsECashAccepted = values.AcceptECash;
        setting.IsCardOnDeliveryAccepted = values.IsCardOnDeliveryAccepted;
        setting.IsDeliveryOffered = values.Deloffer == undefined ? this.state.EnterpriseSetting.IsDeliveryOffered : values.Deloffer;
        setting.IsTakeawayOffered = values.Takeawayoffer == undefined ? this.state.EnterpriseSetting.IsTakeawayOffered : values.Takeawayoffer;
        setting.IsDineInOffered = values.dineInOffer == undefined ? this.state.EnterpriseSetting.IsDineInOffered : values.dineInOffer;
        setting.IsBuffetOffered = values.BuffOffer == undefined ? this.state.EnterpriseSetting.IsBuffetOffered : values.BuffOffer;
        setting.IsExecutiveDineInOffered = values.ExDineoffer == undefined ? this.state.EnterpriseSetting.RestaurantSettings.IsExecutiveDineInOffered : values.ExDineoffer;
        setting.IsPinVerificationRequired = values.PINVerification;
        setting.IsDeliveryChargesByAmount = Number(values.DelByAmount) > 0;
        setting.DeliveryChargesByAmount = values.freeif ? values.DelByAmount : "0";
        setting.OtherTagCsv = values.otherTag == undefined ? this.state.EnterpriseSetting.OtherTagCsv : values.otherTag;
        setting.FoodTypeCsv = this.state.FoodTypeCsv;
        setting.IsSupermealDelivery = enterpriseSetting.RestaurantSettings.IsSupermealDelivery;
        setting.DeliveryPartnerSettings = JSON.stringify(deliveryPartnerSettings);
        setting.ItemOnItemDetail = this.state.itemonItemDetail
        //updating
        this.UpdateEnterpriseSettingApi(setting);

    }

    GetEnterpriseSetting = async () => {
        this.setState({ShowLoader: true});
        var data = await EnterpriseSettingService.Get();
        if (data.length !== 0) {
            let deliveryPartnerSettings = !Utilities.stringIsEmpty(data.RestaurantSettings.DeliveryPartnerSettings)?  JSON.parse(data.RestaurantSettings.DeliveryPartnerSettings) : {} ;
            deliveryPartnerSettings.CommissionPercentageOverrideSourcePortal =  !Utilities.stringIsEmpty(deliveryPartnerSettings.CommissionPercentageOverrideSourcePortal) ? deliveryPartnerSettings.CommissionPercentageOverrideSourcePortal : '-1'
            deliveryPartnerSettings.CommissionPercentageOverrideSourceEnterprise =  !Utilities.stringIsEmpty(deliveryPartnerSettings.CommissionPercentageOverrideSourceEnterprise) ? deliveryPartnerSettings.CommissionPercentageOverrideSourceEnterprise : '-1'
            data.RestaurantSettings.DeliveryPartnerSettings = JSON.stringify(deliveryPartnerSettings)
            
            this.setState({
                itemonItemDetail: data.RestaurantSettings.ItemOnItemDetail,
                currencySymbol : data.RestaurantSettings.CurrencySymbol,
                EnterpriseSetting: data, SelectedDeliveryPartnerId: !Utilities.stringIsEmpty(deliveryPartnerSettings.DeliveryPartnerId) && deliveryPartnerSettings.DeliveryPartnerId > 0 ? deliveryPartnerSettings.DeliveryPartnerId : this.state.SelectedDeliveryPartnerId},() => {
                    this.GetDeliveryPartners();
                });
            this.GetFoodTypes();
        }

    }

    GetDeliveryPartners = async () => {
        
        let data = await EnterpriseSettingService.GetDeliveryPartners();
       
        if(data.length !== 0) {
          this.setState({DeliveryPartners: data, SelectedDeliveryPartnerId: this.state.SelectedDeliveryPartnerId == 0 ? data[0].Id : this.state.SelectedDeliveryPartnerId});
        }
    
        this.setState({ShowLoader: false});
           
    }

    GetFoodTypes = async () => {

        var data = await TagService.Get();

        if (data.length !== 0) {
            this.setState({ FoodTypes: data });
            this.GetSortedFoodTypes(data);
        }

    }


    //#endregion


    GetSortedFoodTypes(foodTypes) {

        let setting = this.state.EnterpriseSetting;

        if (setting.FoodTypeCsv === undefined) {
            return <div></div>
        }


        var FoodTypeDictionaries = [];
        var FoodTypeDietary = [];
        // var sortCSV ="";
        var foodTypeRow = 0;
        var dietaryRow = 0;
        for (var p = 0; p < foodTypes.length; p++) {
            if (foodTypes[p].Type === "Cuisine") {
                FoodTypeDictionaries[foodTypeRow++] = foodTypes[p];
            }
            else if (foodTypes[p].Type === "Dietary") {
                FoodTypeDietary[dietaryRow++] = foodTypes[p];
            }
        }



        let FoodTypeCsvArray = [];
        FoodTypeDictionaries.sort(Utilities.SortByName);

        var foodTypeCsv = setting.FoodTypeCsv + Config.Setting.csvSeperator;
        var arrfoodType = setting.FoodTypeCsv.toUpperCase().split(Config.Setting.csvSeperator)
        var foodTypeArray = [];
        var cuisineArray = [];
        var dietaryArray = [];


        // Getting FoodTypes
        for (var k = 0; k < arrfoodType.length; k++) {

            var index = Utilities.GetObjectArrId(arrfoodType[k], FoodTypeDictionaries);
            if (index !== "-1") {
                var foodTypeDetail = FoodTypeDictionaries[index];
                foodTypeArray.push({ "id": foodTypeDetail.Id, "name": foodTypeDetail.Name, "SortOrder": (k + 1) });

            }

        }

        this.setState({ foodTypeArray: foodTypeArray });

        //Getting Cuisine
        for (var i = 0, j = FoodTypeDictionaries.length; i < j; i++) {
            var checked = false;

            if (Utilities.isExistInCsv(FoodTypeDictionaries[i].Id, foodTypeCsv, Config.Setting.csvSeperator)) {
                checked = true;
                FoodTypeCsvArray.push(FoodTypeDictionaries[i].Id);
            }
            cuisineArray.push(this.RenderCuisines(FoodTypeDictionaries[i], checked));
        }
        this.setState({ cuisineArray: cuisineArray });


        //Getting Dietary

        for (var m = 0, n = FoodTypeDietary.length; m < n; m++) {
            var isChecked = false;

            if (Utilities.isExistInCsv(FoodTypeDietary[m].Id, foodTypeCsv, Config.Setting.csvSeperator)) {
                isChecked = true;
                FoodTypeCsvArray.push(FoodTypeDietary[m].Id);
            }
            dietaryArray.push(this.RenderDietary(FoodTypeDietary[m], isChecked));
        }
        this.setState({ dietaryArray: dietaryArray });
        // console.log("dietaryArray", dietaryArray);

        this.setState({ FoodTypeCsvArray: FoodTypeCsvArray });


        this.GetSortedFoodTypeCSV(FoodTypeCsvArray);

    }


    GetSortedFoodTypeCSV(foodType) {

        var sortCSV = "";

        for (var i = 0; i < foodType.length; i++) {

            sortCSV += foodType[i] + Config.Setting.csvSeperator;
        }

        sortCSV = Utilities.FormatCsv(sortCSV, Config.Setting.csvSeperator);

        this.setState({ FoodTypeCsv: sortCSV })

    }

    handlerCheckBox(e) {
        let foodTypeCsvArray = this.state.FoodTypeCsvArray;

        if (e.target.value === 'true') {
            var index = foodTypeCsvArray.indexOf(Number(e.target.id))
            if (index !== -1) {
                foodTypeCsvArray.splice(index, 1);

            }
        } else {
            foodTypeCsvArray.push(Number(e.target.id));

        }

        this.setState({ FoodTypeCsvArray: foodTypeCsvArray });

        this.GetSortedFoodTypeCSV(foodTypeCsvArray)

    }


    RenderDietary(dietary, checked) {

        return (

            <div className="col-xs-12 col-sm-3 m-b-10 checkDiv" key={'dietary-' + dietary.Id}>
                <AvInput disabled = {!this.state.AllowEdit} type="checkbox" name={`${dietary.Id}`} id={dietary.Id} value={checked} onClick={(event) => this.handlerCheckBox(event)} className="form-checkbox" />
                <Label check for={`${dietary.Id}`}> {dietary.Name}</Label>
            </div>
        )
    }

    RenderCuisines(cuisine, checked) {

        return (
            <div className="col-xs-12 col-sm-3 m-b-10 checkDiv" key={'cuisine-' + cuisine.Id}>

                <AvInput disabled = {!this.state.AllowEdit} type="checkbox" name={cuisine.Name} value={checked} id={cuisine.Id} onClick={(event) => this.handlerCheckBox(event)} className="form-checkbox" />
                <Label check for={`${cuisine.Id}`}> {cuisine.Name}</Label>

            </div>
        )
    }

    SetDeliveryPartner(partnerId){

        this.setState({SelectedDeliveryPartnerId: partnerId})
    }

    RenderDeliveryPartnerDropDown(deliveryPartner)
    {
        return ( <option key={deliveryPartner.Id} value={deliveryPartner.Id}>{deliveryPartner.Name}</option> )
     }
    
    LoadDeliveryPartnerDropDown(deliveryPartners){
        
        var htmlDeliveryPartner = [];
       
        if(deliveryPartners === null || deliveryPartners.length < 1)
        {
            return;
        }
    
      for (var i=0; i < deliveryPartners.length; i++){
        htmlDeliveryPartner.push(this.RenderDeliveryPartnerDropDown(deliveryPartners[i]));
      }
    
      return(
      
            htmlDeliveryPartner.map((partnerHtml) => partnerHtml)
       
       )
       
      }


    GetUpdatedFoodTypeSort(foodTypes) {

        let foodTypeCsvArray = this.state.FoodTypeCsvArray;

        this.setState({ foodTypeArray: foodTypes });
        let sortCSV = '';



        for (var u = 0; u < foodTypes.length; u++) {
            sortCSV += foodTypes[u].id + Config.Setting.csvSeperator;
        }

        // sortCSV = Utilities.FormatCsv(sortCSV, Config.Setting.csvSeperator);

        for (var i = 0; i < foodTypeCsvArray.length; i++) {

            if (!Utilities.isExistInCsv(foodTypeCsvArray[i], sortCSV, Config.Setting.csvSeperator)) {

                sortCSV += foodTypeCsvArray[i] + Config.Setting.csvSeperator;
            }

        }
        sortCSV = Utilities.FormatCsv(sortCSV, Config.Setting.csvSeperator);

        this.setState({ FoodTypeCsv: sortCSV })

    }

    LoadEnterpriseSetting(setting) {

        // const renderItem = ({ item }) => {
        //     return item.name;
        //  };

        if (setting.EnterpriseId === undefined) {
            return <div></div>
        }

        let deliveryPartnerSettings = !Utilities.stringIsEmpty(setting.RestaurantSettings.DeliveryPartnerSettings)?  JSON.parse(setting.RestaurantSettings.DeliveryPartnerSettings) : {} ;
        


        return (

            <div>
                <AvForm onValidSubmit={this.UpdateEnterpriseSetting} onInvalidSubmit={this.handleInvalidSubmit}>
                    <div id="generalSettingsForm">
                        <div className="form-body m-b-10">
                            {
                                setting.EnterpriseTypeId == 6  &&
                                <div className="row p-t-20 m-b-20">
                                    <div className="col-md-6 form-group">
                                        <label className="control-label font-weight-500">Minimum order amount for delivery</label>
                                        <div className="input-group m-b-10 form-group" style={{ width: "100%" }}>
                                            <div className="input-group-prepend">
                                                <span className="input-group-text form-control" style={{ borderRight: 'none' }} id="basic-addon1">{this.state.currencySymbol}</span>
                                            </div>
                                            <AvField disabled={!this.state.AllowEdit} name="minOrder" value={setting.MinimumDeliveryOrder !== undefined && setting.MinimumDeliveryOrder > 0 ? setting.MinimumDeliveryOrder : "0"} type="number" className="form-control borderRadiusLeftNone form-control-left borderRightRadius"
                                                validate={{
                                                    required: { value: true, errorMessage: 'This is a required field' },
                                                    pattern: { value: /^[0-9]+(\.[0-9]{1,2})?$/, errorMessage: 'please fill correct value' }
                                                }}
                                            />
                                        </div>
                                        <div className="form-control-feedback font-12 field-gen-wrp">
                                            {/* <input type="checkbox" checked={this.state.IsDeliveryChargesByAmount} className="check m-r-10" id="freeif" /> */}
                                            <div className="field-gen-inner-wrp">
                                                <AvField disabled={!this.state.AllowEdit} name="freeif" value={setting.DeliveryChargesByAmount > 0} type="checkbox" className="check form-checkbox m-r-10" />
                                                <Label check for="freeif" className="settingsLabel">Free Delivery if the Order is above</Label>
                                            </div>
                                            <span className="input-group d-inline-flex free-charges-input form-group">
                                                <span className="input-group-prepend">
                                                    <span className="input-group-text form-control" style={{ borderRight: 'none' }} id="">{this.state.currencySymbol}</span>
                                                </span>
                                                {/* <AvField name="DelByAmount" value={setting.DeliveryChargesByAmount}  type="tel" className="form-control borderRadiusLeftNone form-control-left borderRightRadius"/> */}
                                                <AvField disabled={!this.state.AllowEdit} name="DelByAmount" value={setting.DeliveryChargesByAmount > 0 ? setting.DeliveryChargesByAmount : "0"} type="number" className="form-control borderRadiusLeftNone form-control-left borderRightRadius"
                                                    validate={{
                                                        required: { value: true, errorMessage: 'This is a required field' },
                                                        pattern: { value: /^[0-9]+(\.[0-9]{1,2})?$/, errorMessage: 'please fill correct value' }
                                                    }}
                                                />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="control-label">{Labels.Delivery_Charges}</label>
                                        <div className="input-group m-b-10 form-group">
                                            <div className="input-group-prepend">
                                                <span style={{ borderRight: 'none' }} className="input-group-text form-control">{this.state.currencySymbol}</span>
                                            </div>
                                            <AvField disabled={!this.state.AllowEdit} name="DelChrgs" value={setting.DeliveryCharges > 0 ? setting.DeliveryCharges : "0"} type="number" className="form-control borderRadiusLeftNone form-control-left borderRightRadius"
                                                validate={{
                                                    required: { value: true, errorMessage: 'This is a required field' },
                                                    pattern: { value: /^[0-9]+(\.[0-9]{1,2})?$/, errorMessage: 'please fill correct value' }
                                                }}
                                            />
                                            <div className="help-block with-errors"></div>
                                        </div>
                                    </div>
                                </div>
                            }
                            {
                                setting.EnterpriseTypeId == 6  &&
                                <div className="row m-b-20" >
                                    <div className="col-md-6 form-group">
                                        <label className="control-label">{Labels.Free_Delivery_Within}</label>
                                        <div className="input-group mb-3 form-group">
                                            <AvField disabled={!this.state.AllowEdit} value={setting.FreeDeliveryDistance > 0 ? setting.FreeDeliveryDistance : "0"} type="number" name="freeDel" className="borderRadiusRightNone form-control form-control-right" id="txtFreeDeliveryWithIn"
                                                validate={{
                                                    required: { value: true, errorMessage: 'This is a required field' },
                                                    pattern: { value: /^[0-9]+(\.[0-9]{1,2})?$/, errorMessage: 'please fill correct value' }
                                                }}
                                            />
                                            <div className="input-group-append">
                                                <span className="input-group-text form-control borderRightRadius">{Config.Setting.distanceUnit}</span>
                                            </div>
                                            <div className="help-block with-errors"></div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="control-label">{Labels.Delivery_Radius}</label>
                                        <div className="input-group mb-3 form-group">
                                            <AvField disabled={!this.state.AllowEdit} value={setting.MaximumDeliveryDistance > 0 ? setting.MaximumDeliveryDistance : "0"} type="number" name="delRadius" className="borderRadiusRightNone form-control form-control-right" id="txtDeliveryRadius"
                                                validate={{
                                                    required: { value: true, errorMessage: 'This is a required field' },
                                                    pattern: { value: /^[0-9]+(\.[0-9]{1,2})?$/, errorMessage: 'please fill correct value' }
                                                }}
                                            />
                                            <div className="input-group-append">
                                                <span className="input-group-text form-control borderRightRadius">{Config.Setting.distanceUnit}</span>
                                            </div>
                                            <div className="help-block with-errors"></div>
                                        </div>
                                    </div>
                                </div>
                            }
                            {
                                (setting.EnterpriseTypeId == 10 ||  setting.EnterpriseTypeId == 6 )&&
                                <div className="row m-b-20" >
                                    <div className="col-md-6">
                                        <label className="control-label">{Labels.Minimum_Time_For_Delivery}</label>
                                        <div className="input-group mb-3 form-group">
                                            <AvField disabled={!this.state.AllowEdit} value={setting.OrderDeliveryTime > 0 ? setting.OrderDeliveryTime : "0"} type="number" name="delTime" className="borderRadiusRightNone form-control form-control-right" id="txtDeliveryTime"
                                                validate={{
                                                    required: { value: true, errorMessage: 'This is a required field' },
                                                    pattern: { value: /^[0-9]+(\.[0-9]{1,2})?$/, errorMessage: 'please fill correct value' }
                                                }}
                                            />
                                            <div className="input-group-append">
                                                <span className="input-group-text form-control borderRightRadius">hour(s)</span>
                                            </div>
                                            <div className="help-block with-errors"></div>
                                        </div>
                                    </div>
                                    {
                                        setting.EnterpriseTypeId == 6 &&
                                        <div className="col-md-6">
                                            <label className="control-label">{Labels.Takeaway_Time}</label>
                                            <div className="input-group mb-3 form-group">
                                                <AvField disabled={!this.state.AllowEdit} value={setting.OrderCollectionTime > 0 ? setting.OrderCollectionTime : "0"} type="number" name="collTime" className="borderRadiusRightNone form-control form-control-right" id="txtCollectionTime"
                                                    validate={{
                                                        required: { value: true, errorMessage: 'This is a required field' },
                                                        pattern: { value: /^[0-9]+(\.[0-9]{1,2})?$/, errorMessage: 'please fill correct value' }
                                                    }}
                                                />
                                                <div className="input-group-append">
                                                    <span className="input-group-text form-control borderRightRadius">mins</span>
                                                </div>
                                                <div className="help-block with-errors"></div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            }
                            {
                                setting.EnterpriseTypeId == 6 &&
                                <div className="row m-b-20">
                                    <div className=" col-sx-12 col-sm-12">
                                        <div className="form-group m-b-0 form-group">
                                            <label><span className="control-label">{Labels.Promotion_Message} </span></label>
                                            <AvField disabled={!this.state.AllowEdit} type="textarea" name="promoMsg" rows="4" maxLength="256" cols="50" value={setting.PromotionMessage} className="form-control">

                                            </AvField>
                                            Limit : <span className="remaining"></span>/256
                </div>
                                    </div>
                                </div>
                            }
                        </div>
                        {
                        setting.EnterpriseTypeId == 6 &&
                        <div className="row m-b-10">
                            <div className=" col-sx-12 col-sm-12">
                                <label className="control-label">{Labels.Items_Settings}</label>
                            </div>
                            <div className=" col-sx-12 col-sm-12">
                                <div className="form-group checkSpanDV">

                                    <AvInput disabled={!this.state.AllowEdit} type="checkbox" name="chkIsClaimed" checked={this.state.itemonItemDetail} value={this.state.itemonItemDetail} onClick={(e) => this.itemDetailCheck(e)} className="form-checkbox" />
                                    <Label check for="chkIsClaimed">{Labels.Items_On_Item_Detail} </Label>

                                </div>
                            </div>
                        </div>
                        }

                        {
                            setting.EnterpriseTypeId == 6 &&
                            <>
                            <div className="row m-b-10">
                                <div className=" col-sx-12 col-sm-12">
                                    <label className="control-label">{Labels.Delivery_Settings}</label>
                                </div>
                                <div className=" col-sx-12 col-sm-12">
                                    <div className="form-group checkSpanDV">

                                        <AvInput disabled={!this.state.AllowEdit} type="checkbox" name="chkIsSupermealDelivery" checked={setting.RestaurantSettings.IsSupermealDelivery} value={setting.RestaurantSettings.IsSupermealDelivery} onClick={(e) => this.handleIsDeliveryCheck(e)} className="form-checkbox" />
                                        <Label check for="chkIsSupermealDelivery">Superbutler Delivery </Label>

                                    </div>
                                </div>
                            </div>
                            <div className="form-body  formPadding">

                                {setting.RestaurantSettings.IsSupermealDelivery || Object.keys(deliveryPartnerSettings).length > 0 ? <div>

                                    <div className="row " >

                                        <div className="col-md-4 col-xs-12">
                                            <label className="control-label">{Labels.Delivery_Partner}</label>
                                            <div className="input-group m-b-10 form-group">

                                                <div className="input-group mb-3 form-group">
                                                    <select disabled={!this.state.AllowEdit}  className="form-control" name="ddlDeliveryPartner" value={this.state.SelectedDeliveryPartnerId} onChange={(e) => this.SetDeliveryPartner(Number(e.target.value))} >
                                                        {this.LoadDeliveryPartnerDropDown(this.state.DeliveryPartners)}
                                                    </select>
                                                </div>


                                                <div className="help-block with-errors"></div>
                                            </div>
                                        </div>

                                        <div className="col-md-4 col-xs-12">
                                        <label className="control-label">Delivery Time</label>
                                        <div className="input-group m-b-10 form-group">
                                                    <AvField disabled={!setting.RestaurantSettings.IsSupermealDelivery} value={Object.keys(deliveryPartnerSettings).length > 0 ? deliveryPartnerSettings.DeliveryTime : 0} name="txtDeliveryTime" type="text"  className="form-control"  
                                                    validate={{
                                                        required: { value: setting.RestaurantSettings.IsSupermealDelivery ? true : false, errorMessage: 'This is a required field' },
                                                        pattern: { value: /^[\d]*$/, errorMessage: 'please fill correct value' }
                                                        
                                                    }} />
                                                    <div className="help-block with-errors"></div>
                                                </div>
                                    </div>


                                    </div>


                                    <div className="row ">

                                        <div className="col-md-4 col-xs-12">
                                            <label className="control-label">{Labels.Pickup_Name}</label>
                                            <div className="input-group m-b-10 form-group">
                                                <AvField disabled={!this.state.AllowEdit} value={Object.keys(deliveryPartnerSettings).length > 0 ? Utilities.SpecialCharacterDecode(deliveryPartnerSettings.PickupName) : ''} name="txtPickupName" type="text" className="form-control"
                                                    validate={{
                                                        required: { value: setting.RestaurantSettings.IsSupermealDelivery ? true : false, errorMessage: 'This is a required field' },
                                                    }}
                                                />
                                                <div className="help-block with-errors"></div>
                                            </div>
                                        </div>


                                        <div className="col-md-4 col-xs-12">
                                            <label className="control-label">{Labels.Pickup_Number}</label>
                                            <div className="input-group m-b-10 form-group">
                                                <AvField disabled={!this.state.AllowEdit} value={Object.keys(deliveryPartnerSettings).length > 0 ? Utilities.SpecialCharacterDecode(deliveryPartnerSettings.PickupNo) : ''} name="txtPickupNo" type="text" className="form-control"
                                                    validate={{
                                                        required: { value: setting.RestaurantSettings.IsSupermealDelivery ? true : false, errorMessage: 'This is a required field' },
                                                    }}
                                                />
                                                <div className="help-block with-errors"></div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 col-xs-12">
                                            <label className="control-label">{Labels.Delivery_Fee}</label>
                                            <div className="input-group m-b-10 form-group">
                                                <div className="input-group-prepend">
                                                    <span style={{ borderRight:'none'}} className="input-group-text form-control" >{this.state.currencySymbol}</span>
                                                </div>
                                                <AvField disabled={!this.state.AllowEdit} value={Object.keys(deliveryPartnerSettings).length > 0 ? deliveryPartnerSettings.DeliveryFee : 0} name="txtDeliveryFee" type="text" className="form-control borderRadiusLeftNone form-control-left borderRightRadius"
                                                    validate={{
                                                        required: { value: setting.RestaurantSettings.IsSupermealDelivery ? true : false, errorMessage: 'This is a required field' },
                                                        pattern: { value: /^[0-9]+(\.[0-9]{1,2})?$/, errorMessage: 'please fill correct value' }
                                                    }} />
                                                <div className="help-block with-errors"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row ">
                                        <div className="col-md-4 col-xs-12">
                                            <label className="control-label">{Labels.Commission_Percentage_Platform}</label>
                                            <div className="input-group m-b-10 form-group">
                                                <AvField
                                                    onKeyUp={Utilities.ValidateDecimalInteger}
                                                    disabled={!this.state.AllowEdit} value={Object.keys(deliveryPartnerSettings).length > 0 ? deliveryPartnerSettings.CommissionPercentageOverrideSourcePortal : ''} name="txtCommissionPercentageOverrideSourcePortal" type="text" className="form-control"
                                                    maxLength="6"
                                                    validate={{
                                                        required: { value: setting.RestaurantSettings.IsSupermealDelivery ? true : false, errorMessage: 'This is a required field' },
                                                    }}
                                                />
                                                <div className="help-block with-errors"></div>
                                            </div>
                                        </div>


                                        <div className="col-md-4 col-xs-12">
                                            <label className="control-label">{Labels.Commission_Percentage_WhiteLabel}</label>
                                            <div className="input-group m-b-10 form-group">
                                                <AvField
                                                    onKeyUp={Utilities.ValidateDecimalInteger}
                                                    disabled={!this.state.AllowEdit} value={Object.keys(deliveryPartnerSettings).length > 0 ? deliveryPartnerSettings.CommissionPercentageOverrideSourceEnterprise : ''} name="txtCommissionPercentageOverrideSourceEnterprise" type="text" className="form-control"
                                                    maxLength="6"
                                                    validate={{
                                                        required: { value: setting.RestaurantSettings.IsSupermealDelivery ? true : false, errorMessage: 'This is a required field' },
                                                    }}
                                                />
                                                <div className="help-block with-errors"></div>
                                            </div>
                                        </div>
                                    </div>

                                </div> : ""}
                            </div>
                            </>
                        }


                        <div className="card-body">
                            {/* <div className="row ">
                                <div className=" p-b-0">
                                    <div className="control-label m-b-0">{Labels.Payment_Types}</div>
                                </div>
                            </div>

                            <div className="row col-md-12 col-xs-12 setting-cus-field m-t-10 m-b-20">
                                
                            <div className="col-xs-12 col-sm-3 m-b-10 checkDiv">

								<AvInput disabled={!this.state.AllowEdit} type="checkbox" name="AcceptCOD" value={setting.RestaurantSettings.IsCODAccepted} className="form-checkbox" />
								<Label check for="AcceptCOD" className="settingsLabel">{Labels.Cash_On_Delivery}</Label>
								</div>
                                
                                <div className="col-xs-12 col-sm-3 m-b-10 checkDiv">

                                    <AvInput disabled={!this.state.AllowEdit} type="checkbox" name="Acceptcash" value={setting.IsCashAccepted} className="form-checkbox" />
                                    <Label check for="Acceptcash" className="settingsLabel">{Labels.Pay_By_Cash}</Label>

                                </div>

                                <div className="col-xs-12 col-sm-3 m-b-10 checkDiv">

                                    <AvInput disabled={!this.state.AllowEdit} type="checkbox" name="Acceptcreditcard" value={setting.IsCardAccepted} className="form-checkbox" />
                                    <Label check for="Acceptcreditcard" className="settingsLabel">{Labels.Online_Payment}</Label>

                                </div>


                                <div className="col-xs-12 col-sm-3 m-b-10 checkDiv" style={{display:"none"}}>

                                    <AvInput disabled={!this.state.AllowEdit} type="checkbox" name="Acceptcrypto" value={setting.RestaurantSettings.IsCryptoAccepted} className="form-checkbox" />
                                    <Label check for="Acceptcrypto" className="settingsLabel">{Labels.Accept_Crypto_Payment}</Label>

                                </div>


                                <div className="col-xs-12 col-sm-3 m-b-10 checkDiv" style={{display:"none"}}>

                                    <AvInput disabled={!this.state.AllowEdit} type="checkbox" name="AcceptECash" value={setting.RestaurantSettings.IsECashAccepted} className="form-checkbox" />
                                    <Label check for="AcceptECash" className="settingsLabel">{Labels.Accept_ECash}</Label>

                                </div>



                                <div className="col-xs-12 col-sm-3 m-b-10 checkDiv">

                                    <AvInput disabled={!this.state.AllowEdit} type="checkbox" name="IsCardOnDeliveryAccepted" value={setting.RestaurantSettings.IsCardOnDeliveryAccepted} className="form-checkbox" />
                                    <Label check for="IsCardOnDeliveryAccepted" className="settingsLabel">{Labels.Card_On_Delivery} (Terminal)</Label>

                                </div>


                                <div className="col-xs-12 col-sm-3 m-b-10 checkDiv">

                                    <AvInput disabled={!this.state.AllowEdit} type="checkbox" name="IsPostToRoomAccepted" value={setting.RestaurantSettings.IsPostToRoomAccepted} className="form-checkbox" />
                                    <Label check for="IsPostToRoomAccepted" className="settingsLabel">{Labels.Post_to_Room}</Label>

                                </div>


                                <div className="col-xs-12 col-sm-3 m-b-10 checkDiv">

                                    <AvInput disabled={!this.state.AllowEdit} type="checkbox" name="IsBankTransferAccepted" value={setting.RestaurantSettings.IsBankTransferAccepted} className="form-checkbox" />
                                    <Label check for="IsBankTransferAccepted" className="settingsLabel">{Labels.Bank_Transfer}</Label>

                                </div>


                            </div> */}
                            {
                               (setting.EnterpriseTypeId == 6 || setting.EnterpriseTypeId == 3 || setting.EnterpriseTypeId == 20) && this.state.dietaryArray.length > 0 &&
                               <> 
                                <div className="row">
                                    <div className=" p-b-0">
                                        <div className="control-label  m-b-0">{Labels.Dietary_Types}</div>
                                    </div>
                                </div>
                                <div className="row col-md-12  col-xs-12 setting-cus-field m-t-10" id="dvDietryTypes">

                                    {this.state.dietaryArray.map((dietaryHtml) => dietaryHtml)}

                                </div>
                               </>
                            }
                            {/* {
                                (setting.EnterpriseTypeId != 7 && setting.EnterpriseTypeId != 10 && setting.EnterpriseTypeId != 11 && setting.EnterpriseTypeId != 12 && setting.EnterpriseTypeId != 13 && setting.EnterpriseTypeId != 14 && setting.EnterpriseTypeId != 15) &&
                                <div>
                                    <div className="row m-t-30" >
                                        <div className=" p-b-0">
                                            <div className="control-label  m-b-0">{Labels.Facilities}</div>
                                        </div>
                                    </div>
                                    <div className="row  col-md-12 col-xs-12 setting-cus-field m-t-10 m-b-20">
                                    {
                                        setting.EnterpriseTypeId == 6 &&
                                        <div className="col-xs-12 col-sm-3 m-b-10 checkDiv" style={{  }}>

                                            <AvInput disabled={!this.state.AllowEdit} type="checkbox" name="Deloffer" value={setting.IsDeliveryOffered} className="form-checkbox" />
                                            <Label check for="Deloffer" className="settingsLabel">{Labels.Delivery_Offered}</Label>


                                        </div>
                                    }
                                        {
                                            setting.EnterpriseTypeId == 6 ?
                                            <>
                                            <div className="col-xs-12 col-sm-3 m-b-10 checkDiv" style={{}}>

                                                <AvInput disabled={!this.state.AllowEdit} type="checkbox" name="Takeawayoffer" value={setting.IsTakeawayOffered} className="form-checkbox" />
                                                <Label check for="Takeawayoffer" className="settingsLabel">{Labels.Takeaway_Offered}</Label>

                                            </div>
                                        
                                            <div className="col-xs-12 col-sm-3 m-b-10 checkDiv">

                                                <AvInput disabled={!this.state.AllowEdit} type="checkbox" name="dineInOffer" value={setting.IsDineInOffered} className="form-checkbox" />
                                                <Label check for="dineInOffer" className="settingsLabel">{Labels.Dine_Offered}</Label>

                                            </div>
                                            </>
                                            :

                                            <div className="col-xs-12 col-sm-3 m-b-10 checkDiv">

                                            <AvInput disabled={!this.state.AllowEdit} type="checkbox" name="dineInOffer" value={setting.IsDineInOffered} className="form-checkbox" />
                                            <Label check for="dineInOffer" className="settingsLabel">{Labels.Eat_In_Room}</Label>

                                        </div>
                                        }
                                        {
                                            setting.EnterpriseTypeId == 6 &&
                                            
                                            <div className="col-xs-12 col-sm-3 m-b-10 checkDiv" style={{ }}>

                                                <AvInput disabled={!this.state.AllowEdit} type="checkbox" name="BuffOffer" value={setting.IsBuffetOffered} className="form-checkbox" />
                                                <Label check for="BuffOffer" className="settingsLabel">{Labels.Buffet_Offered}</Label>

                                            </div>
                                        }

                                        {
                                            setting.EnterpriseTypeId != 6 &&

                                        <div className="col-xs-12 col-sm-3 m-b-10 checkDiv" style={{}}>
                                            <AvInput disabled={!this.state.AllowEdit} type="checkbox" name="ExDineoffer" value={setting.RestaurantSettings.IsExecutiveDineInOffered} className="form-checkbox" />
                                            <Label check for="ExDineoffer" className="settingsLabel">{Labels.Eat_At_Restaurant}</Label>
                                        </div>
                                        }

                                         {
                                            setting.EnterpriseTypeId == 6 &&

                                        <div className="col-xs-12 col-sm-3 m-b-10 checkDiv" style={{}}>
                                            <AvInput disabled={!this.state.AllowEdit} type="checkbox" name="ExDineoffer" value={setting.RestaurantSettings.IsExecutiveDineInOffered} className="form-checkbox" />
                                            <Label check for="ExDineoffer" className="settingsLabel">{Labels.Executive_Dine_Offered}</Label>
                                        </div>
                                        }

                                    </div>
                                </div>
                            } */}
                            {
                               setting.EnterpriseTypeId == Constants.ENTERPRISE_TYPE_IDS.RESTAURANT && 
                               <>
                                <div className=" p-b-10">
                                    <div className="control-label m-b-10">{Labels.Food_Types}</div>

                                    <div className=" counter-reset sortable-item sortable-new-wrap" style={!this.state.AllowEdit ? {position:'relative'} : {}}>
                                    {!this.state.AllowEdit ? <div className="disable-sort"></div> : ''}
                                        <SortableContainer
                                            items={this.state.foodTypeArray}
                                            onSortEnd={this.onSortEnd}
                                        >

                                        </SortableContainer>
                                    </div>

                                </div>

                                <div className="row  col-md-12 col-xs-12 setting-cus-field m-t-10" id="dvFoodItems">
                                {this.state.cuisineArray.map((cuisineHtml) => cuisineHtml)}
                                </div>
                                </>

                            }
                        
                            {/* <div className="row m-t-20">
                                <div className=" col-sx-12 col-sm-12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                    <div className="form-group m-b-0">
                                        <label><span className="control-label">Other Tags CSV</span></label>
                                        <AvField disabled={!this.state.AllowEdit} type="textarea" name="otherTag" rows="4" cols="50" value={setting.OtherTagCsv} className="form-control">

                                        </AvField>
                                    </div>
                                </div>
                            </div> */}
                        </div>

                        <div className="bottomBtnsDiv" style={{ paddingRight: '20px' }}>

                            <FormGroup>

                                {!this.state.AllowEdit ? '':
                                <Button color="primary" style={{width:'61px'}} className="btn waves-effect waves-light btn-primary pull-right m-l-10">
                                 {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                                : <span className="comment-text">{Labels.Save}</span>}

                                </Button>

                                }

                              
                            </FormGroup>
                           
                           
                        </div>
                        {this.state.FromInvalid ? <FormGroup>

                        <div className="gnerror error media-imgerror">One or more fields has errors.</div>

                        </FormGroup>
                        : ""}
                    </div>
                </AvForm>
            </div>
        )
    }

    componentDidMount() {

        
        this.GetEnterpriseSetting();
        if(!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))){
            var userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
            var HasPermission = Utilities.HasPermission(userObj.RoleLevel, Constants.Permission.ENTERPRISE_SETTING_UPDATE);
            this.setState({AllowEdit : HasPermission});
        }

    }

    render() {

        /*const renderItem = ({ item }) => {
            return item.text;
        };*/

        
        return (
            <div className="card" id="generalSettingsDv">
       <div className="back-page-link-wrap m-b-15 card-new-title" style={{display:'flex'}}>
                        <h3 className="card-title" style={{cursor:'pointer'}}  onClick={(e) => this.props.history.goBack()}>
                        {!this.state.AllowEdit ? 
<i className="fa fa-arrow-left"  style={{marginRight:'10px'}}> </i>
 :
""
}
{Labels.General_Settings}
                            </h3>
                        <FormGroup>


</FormGroup>
                </div>
                <div className="card-body">
            
                { this.state.AllowEdit ? '' :
                <div className="alert alert-warning ">
                In order to make changes to this section, please contact Superbutler Support on <strong>{Config.Setting.SupportEmail}</strong>.
                </div>
                }
                    {this.LoadEnterpriseSetting(this.state.EnterpriseSetting)}

                </div>
            </div>
        );
    }
}

export default GeneralSettings;
