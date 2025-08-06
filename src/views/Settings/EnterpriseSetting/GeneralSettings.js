import React, { Component } from 'react';
import { FormGroup, Label, Button } from 'reactstrap';
import { AvForm, AvField, AvInput } from 'availity-reactstrap-validation';
import * as EnterpriseSettingService from '../../../service/EnterpriseSetting';
import * as EnterpriseService from '../../../service/Enterprise';
import * as TagService from '../../../service/Tag';
import * as Utilities from '../../../helpers/Utilities';
import Constants from '../../../helpers/Constants';
import Config from '../../../helpers/Config';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import Loader from 'react-loader-spinner';
import Labels from '../../../containers/language/labels';
// import { Link } from 'react-router-dom';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import Messages from '../../../containers/language/Messages';
import * as CountryService from '../../../service/Country';
import { reloadSupportChatButton } from '../../../containers/DefaultLayout/DefaultHeader';
import { reloadDefaultLayout } from '../../../containers/DefaultLayout/DefaultLayout';
const NumberValidation = (value, ctx) => {

    if (!Utilities.IsNumber(value) && Number(value) !== -1) {
        return "please fill correct value";
    }
    return true;
}
const phoneNumValidation = (value, ctx) => {

    if (/^[+()\d-]+$/.test(value) || value == "") {
        return true;
    } else {
        return "Invalid input"
    }
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
            IsSave: false,
            FromInvalid: false,
            IsSupermealDelivery: false,
            DeliveryPartnerSettings: {},
            DeliveryPartners: [],
            SelectedDeliveryPartnerId: 0,
            itemonItemDetail: false,
            currencySymbol: Config.Setting.currencySymbol,
            enableAdditionalCharges: false,
            additionalCharges: [],
            taxPercentage: 1,
            countryList: [],
            SelectedCountryId: 222,
            selectedCountry: {},
            UserObject: {},
            printerJson: [],
            allowAutoPrint: false,
            printers: [],
            enableOrderCommission: false,
            orderCommission: [],
        }
        // this.UpdateEnterpriseSetting = this.UpdateEnterpriseSetting.bind(this);
        this.GetUpdatedFoodTypeSort = this.GetUpdatedFoodTypeSort.bind(this);
        this.LoadEnterpriseSetting = this.LoadEnterpriseSetting.bind(this);
        if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
            var userObject = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
            this.state.UserObject = userObject;
            // if (userObject.RoleLevel !== Constants.Role.ENTERPRISE_ADMIN_ID) SetMenuStatus(false);
          }
    }


    handleInvalidSubmit = () => {
        this.setState({ FromInvalid: true })
    }
    handleIsDeliveryCheck(e) {

        let enterpriseSetting = this.state.EnterpriseSetting;
        enterpriseSetting.RestaurantSettings.IsSupermealDelivery = e.target.checked
        this.setState({ EnterpriseSetting: enterpriseSetting });

    }
    itemDetailCheck(e) {

        // let enterpriseSetting = this.state.itemonItemDetail;
        // enterpriseSetting.RestaurantSettings.IsSupermealDelivery = e.target.checked
        this.setState({ itemonItemDetail: e.target.checked });

    }
    // #region api calling

    UpdateEnterpriseSettingApi = async (enterpriseSetting) => {
        let message = await EnterpriseSettingService.UpdateV2(enterpriseSetting)
        this.setState({ IsSave: false, FromInvalid: false });
        if (message === '1') {
            this.GetEnterpriseSetting();
            localStorage.setItem(Constants.Session.USER_OBJECT, JSON.stringify(this.state.UserObject))
            reloadSupportChatButton()
            reloadDefaultLayout()
            Utilities.notify("Updated successfully.", "s");
        }
        else
            Utilities.notify(`${message}`, "e");

    }

    // UpdateEnterpriseSetting(event, values) {

    //     let enterpriseSetting = this.state.EnterpriseSetting;
    //     let deliveryPartnerSettings = enterpriseSetting.RestaurantSettings.DeliveryPartnerSettings !== undefined && enterpriseSetting.RestaurantSettings.DeliveryPartnerSettings !== "{}" && enterpriseSetting.RestaurantSettings.DeliveryPartnerSettings !== '' ? JSON.parse(enterpriseSetting.RestaurantSettings.DeliveryPartnerSettings) : {};
    //     if (this.state.IsSave) return;
    //     this.setState({ IsSave: true })
    //     let setting = EnterpriseSettingService.EnterpriseSettings;

    //     if (enterpriseSetting.RestaurantSettings.IsSupermealDelivery) {
    //         deliveryPartnerSettings = {};
    //         deliveryPartnerSettings.PickupName = Utilities.SpecialCharacterEncode(values.txtPickupName);
    //         deliveryPartnerSettings.PickupNo = Utilities.SpecialCharacterEncode(values.txtPickupNo);
    //         deliveryPartnerSettings.DeliveryFee = values.txtDeliveryFee;
    //         deliveryPartnerSettings.DeliveryTime = 0; //values.txtDeliveryTime;
    //         deliveryPartnerSettings.DeliveryPartnerId = this.state.SelectedDeliveryPartnerId;
    //         deliveryPartnerSettings.CommissionPercentageOverrideSourcePortal = values.txtCommissionPercentageOverrideSourcePortal
    //         deliveryPartnerSettings.CommissionPercentageOverrideSourceEnterprise = values.txtCommissionPercentageOverrideSourceEnterprise
    //     }


    //     //let loggedInUser = this.state.loggedInUser;
    //     setting.MinimumDeliveryOrder = values.minOrder;
    //     setting.DeliveryCharges = values.DelChrgs;
    //     setting.FreeDeliveryDistance = values.freeDel;
    //     setting.MaximumDeliveryDistance = values.delRadius;
    //     setting.OrderDeliveryTime = values.delTime == undefined ? '0' : values.delTime;
    //     setting.OrderCollectionTime = values.collTime == undefined ? '0' : values.collTime;
    //     setting.PromotionMessage = values.promoMsg == undefined ? '' : values.promoMsg;
    //     setting.IsCashAccepted = values.Acceptcash;
    //     setting.IsCODAccepted = this.state.EnterpriseSetting.RestaurantSettings.IsCODAccepted;
    //     setting.IsCardAccepted = values.Acceptcreditcard;
    //     setting.IsPostToRoomAccepted = values.IsPostToRoomAccepted;
    //     setting.IsBankTransferAccepted = values.IsBankTransferAccepted;
    //     setting.IsCryptoAccepted = values.Acceptcrypto
    //     setting.IsECashAccepted = values.AcceptECash;
    //     setting.IsCardOnDeliveryAccepted = values.IsCardOnDeliveryAccepted;
    //     setting.IsDeliveryOffered = values.Deloffer == undefined ? this.state.EnterpriseSetting.IsDeliveryOffered : values.Deloffer;
    //     setting.IsTakeawayOffered = values.Takeawayoffer == undefined ? this.state.EnterpriseSetting.IsTakeawayOffered : values.Takeawayoffer;
    //     setting.IsDineInOffered = values.dineInOffer == undefined ? this.state.EnterpriseSetting.IsDineInOffered : values.dineInOffer;
    //     setting.IsBuffetOffered = values.BuffOffer == undefined ? this.state.EnterpriseSetting.IsBuffetOffered : values.BuffOffer;
    //     setting.IsExecutiveDineInOffered = values.ExDineoffer == undefined ? this.state.EnterpriseSetting.RestaurantSettings.IsExecutiveDineInOffered : values.ExDineoffer;
    //     setting.IsPinVerificationRequired = values.PINVerification;
    //     setting.IsDeliveryChargesByAmount = Number(values.DelByAmount) > 0;
    //     setting.DeliveryChargesByAmount = values.freeif ? values.DelByAmount : "0";
    //     setting.OtherTagCsv = values.otherTag == undefined ? this.state.EnterpriseSetting.OtherTagCsv : values.otherTag;
    //     setting.FoodTypeCsv = this.state.FoodTypeCsv;
    //     setting.IsSupermealDelivery = enterpriseSetting.RestaurantSettings.IsSupermealDelivery;
    //     setting.DeliveryPartnerSettings = JSON.stringify(deliveryPartnerSettings);
    //     setting.ItemOnItemDetail = this.state.itemonItemDetail
    //     //updating
    //     this.UpdateEnterpriseSettingApi(setting);
    // }

    UpdateV2EnterpriseSetting = () => {
        this.state.EnterpriseSetting.RestaurantSettings.AdditionalChargesJson = JSON.stringify(this.state.additionalCharges);
        this.state.EnterpriseSetting.RestaurantSettings.OrderCommissionJson = JSON.stringify(this.state.orderCommission);

        //Remove duplicate records
        this.state.printerJson = this.state.printerJson.filter((obj, index, self) =>
            index === self.findIndex((o) => o.Name === obj.Name) && obj.Name != "");

        this.state.EnterpriseSetting.RestaurantSettings.PrinterJson = JSON.stringify(this.state.printerJson);
        //this.state.EnterpriseSetting.IsCashAccepted = this.state.EnterpriseSetting.RestaurantSettings.IsCashAccepted;
        let enterpriseSetting = this.state.EnterpriseSetting;

        this.UpdateEnterpriseSettingApi(enterpriseSetting);

    }

    GetEnterpriseSetting = async () => {
        this.setState({ ShowLoader: true });
        var data = await EnterpriseSettingService.Get();
        if (data.length !== 0) {
            let deliveryPartnerSettings = !Utilities.stringIsEmpty(data.RestaurantSettings.DeliveryPartnerSettings) ? JSON.parse(data.RestaurantSettings.DeliveryPartnerSettings) : {};
            deliveryPartnerSettings.CommissionPercentageOverrideSourcePortal = !Utilities.stringIsEmpty(deliveryPartnerSettings.CommissionPercentageOverrideSourcePortal) ? deliveryPartnerSettings.CommissionPercentageOverrideSourcePortal : '-1'
            deliveryPartnerSettings.CommissionPercentageOverrideSourceEnterprise = !Utilities.stringIsEmpty(deliveryPartnerSettings.CommissionPercentageOverrideSourceEnterprise) ? deliveryPartnerSettings.CommissionPercentageOverrideSourceEnterprise : '-1'
            data.RestaurantSettings.DeliveryPartnerSettings = JSON.stringify(deliveryPartnerSettings)
            var additionalChargesToggle = (data.RestaurantSettings.AdditionalChargesJson != null && data.RestaurantSettings.AdditionalChargesJson != "" && JSON.parse(data.RestaurantSettings.AdditionalChargesJson).length > 0 ? true : false)
            var orderCommissionToggle = (data.RestaurantSettings.OrderCommissionJson != null && data.RestaurantSettings.OrderCommissionJson != "" && JSON.parse(data.RestaurantSettings.OrderCommissionJson).length > 0 ? JSON.parse(data.RestaurantSettings.OrderCommissionJson) : [])
            var additionalCharges = (data.RestaurantSettings.AdditionalChargesJson != null && data.RestaurantSettings.AdditionalChargesJson != "" && JSON.parse(data.RestaurantSettings.AdditionalChargesJson).length > 0 ? JSON.parse(data.RestaurantSettings.AdditionalChargesJson) : [])
            var orderCommission = (data.RestaurantSettings.OrderCommissionJson != null && data.RestaurantSettings.OrderCommissionJson != "" && JSON.parse(data.RestaurantSettings.OrderCommissionJson).length > 0 ? JSON.parse(data.RestaurantSettings.OrderCommissionJson) : [])
            
            this.setState({
                itemonItemDetail: data.RestaurantSettings.ItemOnItemDetail,
                currencySymbol: data.RestaurantSettings.CurrencySymbol,
                enableAdditionalCharges: additionalChargesToggle,
                enableOrderCommission: orderCommissionToggle,
                additionalCharges: additionalCharges,
                orderCommission: orderCommission,
                allowAutoPrint: data.RestaurantSettings.AllowAutoPrint,
                printerJson: this.state.printerJson.length > 0 ? this.state.printerJson :  Utilities.stringIsEmpty(data.RestaurantSettings.PrinterJson) ? [] : JSON.parse(data.RestaurantSettings.PrinterJson),
                EnterpriseSetting: data, SelectedDeliveryPartnerId: !Utilities.stringIsEmpty(deliveryPartnerSettings.DeliveryPartnerId) && deliveryPartnerSettings.DeliveryPartnerId > 0 ? deliveryPartnerSettings.DeliveryPartnerId : this.state.SelectedDeliveryPartnerId
            }, () => {
                this.GetDeliveryPartners();
            });
            this.GetFoodTypes();
        }

    }


    GetAllPrinters = async () => {
        this.setState({ ShowLoader: true });
        var data = await EnterpriseService.GetAllPrinters();
        if (data.length !== 0) {
            console.log("Printers: ", data)
            this.setState({printers: data});
        }

    }


    handleChange = (index, e, name) => {
        const { value } = e.target;
        const updatedItems = [...this.state.additionalCharges];
        updatedItems[index][name] = value;

        // Update the state with the modified array
        this.setState({ additionalCharges: updatedItems });
    };
    
    handleChangeOrderCommission = (index, e, name) => {
        const { value } = e.target;
        const updatedItems = [...this.state.orderCommission];
        updatedItems[index][name] = value;

        // Update the state with the modified array
        this.setState({ orderCommission: updatedItems });
    };

    handleChangePrinter = (index, e) => {
        const { value } = e.target;
        const updatedItems = [...this.state.printerJson];
        updatedItems[index]["Name"] = value;

        // Update the state with the modified array
        this.setState({ printerJson: updatedItems });
    };



    GetDeliveryPartners = async () => {

        let data = await EnterpriseSettingService.GetDeliveryPartners();

        if (data.length !== 0) {
            this.setState({ DeliveryPartners: data, SelectedDeliveryPartnerId: this.state.SelectedDeliveryPartnerId == 0 ? data[0].Id : this.state.SelectedDeliveryPartnerId });
        }

        this.setState({ ShowLoader: false });

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

    generalSetupHandlerCheckBox(e, control) {

        // let value = e.target.value;
        // let enterprise = this.state.Enterprise;

        switch (control.toUpperCase()) {

            // case 'IOR':
            // enterprise.IsOwnRestaurant = value === "false"? true:false;
            // break;

            // case 'ISA':
            //     this.state.EnterpriseSetting.IsSmsAlertsOffered = value === "false"? true:false;
            // break;

            case 'TO':
                this.state.EnterpriseSetting.RestaurantSettings.TakeOnlineOrder = e;
                this.UpdateV2EnterpriseSetting()
                // this.state.EnterpriseSetting.IsOwnRestaurant = enterprise.TakeOnlineOrder;
                break;

            case 'AG':
                this.state.EnterpriseSetting.RestaurantSettings.ApplyGST = e;
                this.UpdateV2EnterpriseSetting()
                break;

            case 'AI':
                this.state.EnterpriseSetting.RestaurantSettings.AIModeOnly = e;
                this.UpdateV2EnterpriseSetting()
                break;

            case 'SC':
                this.state.EnterpriseSetting.RestaurantSettings.HasSupportChat = e;
                this.state.UserObject.EnterpriseRestaurant.RestaurantSettings.HasSupportChat = e
                this.UpdateV2EnterpriseSetting()
                break;

            case 'SM':
                this.state.EnterpriseSetting.RestaurantSettings.ShowMessageOfOtherCharges = e
                this.setState({ additionalCharges: !e ? [] : this.state.additionalCharges})
                this.UpdateV2EnterpriseSetting()
                break;

            case 'SR':
                    this.state.EnterpriseSetting.RestaurantSettings.ShowReviews = e
                    this.UpdateV2EnterpriseSetting()
                    break;

             case 'OC':
                    this.state.EnterpriseSetting.RestaurantSettings.EnableOrderCommission = e
                    this.setState({ orderCommission: !e ? [] : this.state.orderCommission})
                    this.UpdateV2EnterpriseSetting()
                    break;


            default:
                break;

        }

        this.setState({ EnterpriseSetting: this.state.EnterpriseSetting });

    }

    RenderDietary(dietary, checked) {

        return (

            <div className="col-xs-12 col-sm-3 m-b-10 checkDiv" key={'dietary-' + dietary.Id}>
                <AvInput disabled={!this.state.AllowEdit} type="checkbox" name={`${dietary.Id}`} id={dietary.Id} value={checked} onClick={(event) => this.handlerCheckBox(event)} className="form-checkbox" />
                <Label check for={`${dietary.Id}`}> {dietary.Name}</Label>
            </div>
        )
    }

    RenderCuisines(cuisine, checked) {

        return (
            <div className="col-xs-12 col-sm-3 m-b-10 checkDiv" key={'cuisine-' + cuisine.Id}>

                <AvInput disabled={!this.state.AllowEdit} type="checkbox" name={cuisine.Name} value={checked} id={cuisine.Id} onClick={(event) => this.handlerCheckBox(event)} className="form-checkbox" />
                <Label check for={`${cuisine.Id}`}> {cuisine.Name}</Label>

            </div>
        )
    }

    SetDeliveryPartner(partnerId) {

        this.setState({ SelectedDeliveryPartnerId: partnerId })
    }

    RenderDeliveryPartnerDropDown(deliveryPartner) {
        return (<option key={deliveryPartner.Id} value={deliveryPartner.Id}>{deliveryPartner.Name}</option>)
    }

    LoadDeliveryPartnerDropDown(deliveryPartners) {

        var htmlDeliveryPartner = [];

        if (deliveryPartners === null || deliveryPartners.length < 1) {
            return;
        }

        for (var i = 0; i < deliveryPartners.length; i++) {
            htmlDeliveryPartner.push(this.RenderDeliveryPartnerDropDown(deliveryPartners[i]));
        }

        return (

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

    getActiveCountries = async () => {
        try {
            let response = await CountryService.getAllCountries()
            if (response.length > 0) {


                var selectedCountry = response.find(c => c.Id == this.state.SelectedCountryId)
                var enterpriseDetail = this.state.EnterpriseSetting;

                if (enterpriseDetail.TaxPercentage == 0) this.setState({ taxPercentage: selectedCountry?.TaxPercentage })
                // console.log("data", this.state.taxPercentage);
                // console.log("data", this.state.taxPercentage);
                // console.log("dataaa", selectedCountry);
                response.sort(function (a, b) {
                    return a.Name.localeCompare(b.Name);
                })
                this.setState({
                    countryList: response,
                    selectedCountry: selectedCountry
                })
            } else {
                console.log('something went wrong')
            }
        } catch (error) {
            console.log('something went wrong', error.message)
        }
    }

    LoadEnterpriseSetting(setting) {
        // console.log('EnterpriseSetting', this.state.EnterpriseSetting)

        // const renderItem = ({ item }) => {
        //     return item.name;
        //  };

        if (setting.EnterpriseId === undefined) {
            return <div></div>
        }

        let deliveryPartnerSettings = !Utilities.stringIsEmpty(setting.RestaurantSettings.DeliveryPartnerSettings) ? JSON.parse(setting.RestaurantSettings.DeliveryPartnerSettings) : {};

        return (

            <div>
                <AvForm >
                    <div id="generalSettingsForm">
                {
                  this.state.EnterpriseSetting.EnterpriseTypeId != 5 &&
                  <div className='printer-setting-wrap'>
                    <div className="row m-t-30 ">
                      <div className=" p-b-0 business-rep-pad-remove" style={{ paddingLeft: "20px" }}>
                        <div className="bold">Printer Setting</div>
                      </div>
                    </div>
                    <div className="row col-md-12 col-xs-12 setting-cus-field mt-2 flex-column">
                      <div className="col-xs-12 col-sm-3 m-b-10 checkDiv px-1">
                        <Label check for="AcceptCOD" className="settingsLabel">Auto Print</Label>
                        <BootstrapSwitchButton
                          checked={setting.RestaurantSettings.AllowAutoPrint}
                          onChange={(e) => {
                              this.state.EnterpriseSetting.RestaurantSettings.AllowAutoPrint = e
                              this.UpdateV2EnterpriseSetting()

                          }}
                          onlabel='Activate'
                          offlabel='Deactivate'
                          size="xs"
                          style="min-xs xs-toggle-btn"
                          onstyle="primary"
                        />
                      </div>
                      <AvForm>
                        <div className="flex-wrap mt-3 d-flex">
                          {this.state.printerJson.map((v, i) => {

                              if(this.state.printers.some(printer => printer.includes(v.Name))){

                            return (

                                <div className='row mb-3 flex-column'>

                              <div className='business-rep-pad-remove px-1'>
                                <div className='d-flex align-items-center'>
                                <select className="select2 form-control custom-select flex-1" onChange={(e) => this.handleChangePrinter(i, e)} value={v.Name} style={{ width: '100%', height: '36px' }}>
                                <option className='pr-2' value="0">Select Printer</option>
                                {this.state.printers.map((printerName) => {
                                    return(
                                            <option value={printerName}>{printerName}</option>
                                    )

                                })

                                }
                               </select>
                              <span className='text-danger font-14 cursor-pointer flex-1 d-flex align-items-center' onClick={() => this.removePrinter(i)}><i class="fa fa-trash mx-2"></i> remove</span>
                              </div>
                              </div>

                            </div>
                          )
                        }
                        }
                          )

                          }

                        </div>
                          <div className='mb-3 px-1 d-flex align-items-center'>
                                <div className=''>
                                  <span className='text-primary font-14 cursor-pointer' onClick={() => this.AddPrinter()}>+ {this.state.printerJson.length > 0 ? "Add another" : "Add Printer"}</span> </div>
                          </div>
                        <FormGroup className='d-flex mb-5'>
                            <Button onClick={() => this.UpdateV2EnterpriseSetting()} color="primary" style={{ width: '61px' }} className="btn waves-effect waves-light btn-primary pull-right">
                              {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                                : <span className="comment-text">{Labels.Save}</span>}

                            </Button>
                        </FormGroup>
                      </AvForm>
                      </div>

                  </div>
                }
                        <div>
                            <div className="row m-t-40 m-b-10">
                                <div className=" p-b-0 business-rep-pad-remove" style={{paddingLeft:"30px"}}>
                                    <div className="bold">{Labels.Payment_Types}</div>
                                </div>
                            </div>

                            <div className="col-md-12 col-xs-12 setting-cus-field mt-2">

                                {/* <div className="col-xs-12 col-sm-12 m-b-20 checkDiv">
                                    <Label check for="AcceptCOD" className="settingsLabel">{Labels.Cash_On_Delivery}</Label>
                                    <BootstrapSwitchButton
                                        checked={setting.RestaurantSettings.IsCODAccepted}
                                        onChange={(e) => {
                                            this.state.EnterpriseSetting.RestaurantSettings.IsCODAccepted = e
                                            this.UpdateV2EnterpriseSetting()

                                        }}
                                        onlabel='Activate'
                                        offlabel='Deactivate'
                                        size="xs"
                                        style="min-xs xs-toggle-btn"
                                        onstyle="primary"
                                    />
                                </div> */}

                                <div className="col-xs-12 col-sm-12 m-b-20 checkDiv">

                                    {/* <AvInput disabled={!this.state.AllowEdit} type="checkbox" name="Acceptcash" value={setting.IsCashAccepted} className="form-checkbox" /> */}
                                    <Label check for="Acceptcash" className="settingsLabel">{Labels.Pay_By_Cash}</Label>
                                    <BootstrapSwitchButton
                                        checked={setting.IsCashAccepted}
                                        onChange={(e) => {
                                            this.state.EnterpriseSetting.IsCashAccepted = e
                                            this.UpdateV2EnterpriseSetting()

                                        }}
                                        onlabel='Activate'
                                        offlabel='Deactivate'
                                        size="xs"
                                        style="min-xs xs-toggle-btn"
                                        onstyle="primary"
                                    />

                                </div>

                                <div className="col-xs-12 col-sm-12 m-b-20 checkDiv">

                                    {/* <AvInput disabled={!this.state.AllowEdit} type="checkbox" name="Acceptcreditcard" value={setting.IsCardAccepted} className="form-checkbox" /> */}
                                    <Label check for="Acceptcreditcard" className="settingsLabel">{Labels.Online_Payment}</Label>
                                    <BootstrapSwitchButton
                                        checked={setting.IsCardAccepted}
                                        onChange={(e) => {
                                            this.state.EnterpriseSetting.IsCardAccepted = e
                                            this.UpdateV2EnterpriseSetting()

                                        }}
                                        onlabel='Activate'
                                        offlabel='Deactivate'
                                        size="xs"
                                        style="min-xs xs-toggle-btn"
                                        onstyle="primary"
                                    />
                                </div>


                                <div className="col-xs-12 col-sm-12 m-b-20 checkDiv" style={{ display: "none" }}>

                                    {/* <AvInput disabled={!this.state.AllowEdit} type="checkbox" name="Acceptcrypto" value={setting.RestaurantSettings.IsCryptoAccepted} className="form-checkbox" /> */}
                                    <Label check for="Acceptcrypto" className="settingsLabel">{Labels.Accept_Crypto_Payment}</Label>
                                    <BootstrapSwitchButton
                                        checked={setting.RestaurantSettings.IsCryptoAccepted}
                                        onChange={(e) => {
                                            this.state.EnterpriseSetting.RestaurantSettings.IsCryptoAccepted = e
                                            this.UpdateV2EnterpriseSetting()
                                        }}
                                        onlabel='Activate'
                                        offlabel='Deactivate'
                                        size="xs"
                                        style="min-xs xs-toggle-btn"
                                        onstyle="primary"
                                    />
                                </div>


                                <div className="col-xs-12 col-sm-12 m-b-20 checkDiv" style={{ display: "none" }}>

                                    {/* <AvInput disabled={!this.state.AllowEdit} type="checkbox" name="AcceptECash" value={setting.RestaurantSettings.IsECashAccepted} className="form-checkbox" /> */}
                                    <Label check for="AcceptECash" className="settingsLabel">{Labels.Accept_ECash}</Label>
                                    <BootstrapSwitchButton
                                        checked={setting.RestaurantSettings.IsECashAccepted}
                                        onChange={(e) => {
                                            this.state.EnterpriseSetting.RestaurantSettings.IsECashAccepted = e
                                            this.UpdateV2EnterpriseSetting()
                                        }}
                                        onlabel='Activate'
                                        offlabel='Deactivate'
                                        size="xs"
                                        style="min-xs xs-toggle-btn"
                                        onstyle="primary"
                                    />
                                </div>



                                <div className="col-xs-12 col-sm-12 m-b-20 checkDiv">

                                    {/* <AvInput disabled={!this.state.AllowEdit} type="checkbox" name="IsCardOnDeliveryAccepted" value={setting.RestaurantSettings.IsCardOnDeliveryAccepted} className="form-checkbox" /> */}
                                    <Label check for="IsCardOnDeliveryAccepted" className="settingsLabel">{Labels.Card_On_Delivery}</Label>
                                    <BootstrapSwitchButton
                                        checked={setting.RestaurantSettings.IsCardOnDeliveryAccepted}
                                        onChange={(e) => {
                                            this.state.EnterpriseSetting.RestaurantSettings.IsCardOnDeliveryAccepted = e
                                            this.UpdateV2EnterpriseSetting()
                                        }}
                                        onlabel='Activate'
                                        offlabel='Deactivate'
                                        size="xs"
                                        style="min-xs xs-toggle-btn"
                                        onstyle="primary"
                                    />
                                </div>

                            {setting.EnterpriseTypeId != 6 &&
                                <div className="col-xs-12 col-sm-12 m-b-20 checkDiv">

                                    <Label check for="IsPostToRoomAccepted" className="settingsLabel">{Labels.Post_to_Room}</Label>
                                    <BootstrapSwitchButton
                                        checked={setting.RestaurantSettings.IsPostToRoomAccepted}
                                        onChange={(e) => {
                                            this.state.EnterpriseSetting.RestaurantSettings.IsPostToRoomAccepted = e
                                            this.UpdateV2EnterpriseSetting()
                                        }}
                                        onlabel='Activate'
                                        offlabel='Deactivate'
                                        size="xs"
                                        style="min-xs xs-toggle-btn"
                                        onstyle="primary"
                                    />
                                </div>
                            }


                                <div className="col-xs-12 col-sm-12 m-b-20 checkDiv">

                                    {/* <AvInput disabled={!this.state.AllowEdit} type="checkbox" name="IsBankTransferAccepted" value={setting.RestaurantSettings.IsBankTransferAccepted} className="form-checkbox" /> */}
                                    <Label check for="IsBankTransferAccepted" className="settingsLabel">{Labels.Bank_Transfer}</Label>
                                    <BootstrapSwitchButton
                                        checked={setting.RestaurantSettings.IsBankTransferAccepted}
                                        onChange={(e) => {
                                            this.state.EnterpriseSetting.RestaurantSettings.IsBankTransferAccepted = e
                                            this.UpdateV2EnterpriseSetting()
                                        }}
                                        onlabel='Activate'
                                        offlabel='Deactivate'
                                        size="xs"
                                        style="min-xs xs-toggle-btn"
                                        onstyle="primary"
                                    />
                                </div>


                            </div>
                            {/* {
                                (setting.EnterpriseTypeId == 6 || setting.EnterpriseTypeId == 3) && this.state.dietaryArray.length > 0 &&
                                <>
                                    <div className="row m-t-30">
                                        <div className=" p-b-0">
                                            <div className="control-label  m-b-0">{Labels.Dietary_Types}</div>
                                        </div>
                                    </div>
                                    <div className="row col-md-12  col-xs-12 setting-cus-field m-t-10" id="dvDietryTypes">

                                        {this.state.dietaryArray.map((dietaryHtml) => dietaryHtml)}

                                    </div>
                                </>
                            } */}
                            {
                                (setting.EnterpriseTypeId != 7 && setting.EnterpriseTypeId != 10 && setting.EnterpriseTypeId != 11 && setting.EnterpriseTypeId != 12 && setting.EnterpriseTypeId != 13 && setting.EnterpriseTypeId != 14 && setting.EnterpriseTypeId != 15) &&
                                <div>
                                    <div className="row m-t-30 m-b-10 business-rep-pad-remove" style={{paddingLeft:"30px"}}>
                                        <div className=" p-b-0">
                                            <div className="bold">{Labels.Facilities}</div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-xs-12 setting-cus-field mt-2">
                                        {
                                            setting.EnterpriseTypeId == 6 &&
                                            <div className="col-xs-12 col-sm-12 m-b-20 checkDiv" style={{}}>

                                                {/* <AvInput disabled={!this.state.AllowEdit} type="checkbox" name="Deloffer" value={setting.IsDeliveryOffered} className="form-checkbox" /> */}
                                                <Label check for="Deloffer" className="settingsLabel">{Labels.Delivery_Offered}</Label>
                                                <BootstrapSwitchButton
                                                    checked={setting.IsDeliveryOffered}
                                                    onChange={(e) => {
                                                        this.state.EnterpriseSetting.IsDeliveryOffered = e
                                                        this.UpdateV2EnterpriseSetting()

                                                    }}
                                                    onlabel='Activate'
                                                    offlabel='Deactivate'
                                                    size="xs"
                                                    style="min-xs xs-toggle-btn"
                                                    onstyle="primary"
                                                />

                                            </div>
                                        }

                                    {
                                            setting.EnterpriseTypeId != 5 &&
                                         <div className="col-xs-12 col-sm-12 m-b-20 checkDiv" style={{}}>

                                                        {/* <AvInput disabled={!this.state.AllowEdit} type="checkbox" name="Takeawayoffer" value={setting.IsTakeawayOffered} className="form-checkbox" /> */}
                                                        <Label check for="Takeawayoffer" className="settingsLabel">{Labels.Collection_Offered}</Label>
                                                        <BootstrapSwitchButton
                                                            checked={setting.IsTakeawayOffered}
                                                            onChange={(e) => {
                                                                this.state.EnterpriseSetting.IsTakeawayOffered = e
                                                                this.UpdateV2EnterpriseSetting()

                                                            }}
                                                            onlabel='Activate'
                                                            offlabel='Deactivate'
                                                            size="xs"
                                                            style="min-xs xs-toggle-btn"
                                                            onstyle="primary"
                                                        />

                                                    </div>
                                            }


                                        {
                                            setting.EnterpriseTypeId == 6 || setting.EnterpriseTypeId == 20 ?

                                                    <div className="col-xs-12 col-sm-12 m-b-20 checkDiv">

                                                        {/* <AvInput disabled={!this.state.AllowEdit} type="checkbox" name="dineInOffer" value={setting.IsDineInOffered} className="form-checkbox" /> */}
                                                        <Label check for="dineInOffer" className="settingsLabel">{Labels.Dine_Offered}</Label>
                                                        <BootstrapSwitchButton
                                                            checked={setting.IsDineInOffered}
                                                            onChange={(e) => {
                                                                this.state.EnterpriseSetting.IsDineInOffered = e
                                                                this.UpdateV2EnterpriseSetting()

                                                            }}
                                                            onlabel='Activate'
                                                            offlabel='Deactivate'
                                                            size="xs"
                                                            style="min-xs xs-toggle-btn"
                                                            onstyle="primary"
                                                        />

                                                    </div>

                                                :

                                                <div className="col-xs-12 col-sm-12 m-b-20 checkDiv">

                                                    {/* <AvInput disabled={!this.state.AllowEdit} type="checkbox" name="dineInOffer" value={setting.IsDineInOffered} className="form-checkbox" /> */}
                                                    <Label check for="dineInOffer" className="settingsLabel">{Labels.Eat_In_Room}</Label>
                                                    <BootstrapSwitchButton
                                                        checked={setting.IsDineInOffered}
                                                        onChange={(e) => {
                                                            this.state.EnterpriseSetting.IsDineInOffered = e
                                                            this.UpdateV2EnterpriseSetting()
                                                        }}
                                                        onlabel='Activate'
                                                        offlabel='Deactivate'
                                                        size="xs"
                                                        style="min-xs xs-toggle-btn"
                                                        onstyle="primary"
                                                    />
                                                </div>
                                        }
                                        {/* {
                                            setting.EnterpriseTypeId == 6 &&

                                            <div className="col-xs-12 col-sm-3 m-b-10 checkDiv" style={{}}>

                                                <Label check for="BuffOffer" className="settingsLabel">{Labels.Buffet_Offered}</Label>
                                                <BootstrapSwitchButton
                                                    checked={setting.IsBuffetOffered}
                                                    onChange={(e) => {
                                                        this.state.EnterpriseSetting.IsBuffetOffered = e
                                                        this.UpdateV2EnterpriseSetting()

                                                    }}
                                                    onlabel='Activate'
                                                    offlabel='Deactivate'
                                                    size="xs"
                                                    style="min-xs xs-toggle-btn"
                                                    onstyle="primary"
                                                />
                                            </div>
                                        } */}

                                        {/* {
                                            setting.EnterpriseTypeId != 6 &&

                                            <div className="col-xs-12 col-sm-3 m-b-10 checkDiv" style={{}}>
                                                <Label check for="ExDineoffer" className="settingsLabel">{Labels.Eat_At_Restaurant}</Label>
                                                <BootstrapSwitchButton
                                                    checked={setting.RestaurantSettings.IsExecutiveDineInOffered}
                                                    onChange={(e) => {
                                                        this.state.EnterpriseSetting.RestaurantSettings.IsExecutiveDineInOffered = e
                                                        this.UpdateV2EnterpriseSetting()
                                                    }}
                                                    onlabel='Activate'
                                                    offlabel='Deactivate'
                                                    size="xs"
                                                    style="min-xs xs-toggle-btn"
                                                    onstyle="primary"
                                                />
                                            </div>
                                        } */}

                                        {
                                            setting.EnterpriseTypeId == 6 &&

                                            <div className="col-xs-12 col-sm-3 m-b-10 checkDiv" style={{}}>
                                                <Label check for="ExDineoffer" className="settingsLabel">{Labels.Executive_Dine_Offered}</Label>
                                                <BootstrapSwitchButton
                                                    checked={setting.RestaurantSettings.IsExecutiveDineInOffered}
                                                    onChange={(e) => {
                                                        this.state.EnterpriseSetting.RestaurantSettings.IsExecutiveDineInOffered = e
                                                        this.UpdateV2EnterpriseSetting()

                                                    }}
                                                    onlabel='Activate'
                                                    offlabel='Deactivate'
                                                    size="xs"
                                                    style="min-xs xs-toggle-btn"
                                                    onstyle="primary"
                                                />
                                            </div>
                                        }

                                    </div>
                                </div>
                            }
                            {/* {
                                setting.EnterpriseTypeId == 6 &&
                                <>
                                    <div className=" p-b-10">
                                        <div className="control-label m-b-10">{Labels.Food_Types}</div>

                                        <div className=" counter-reset sortable-item sortable-new-wrap" style={!this.state.AllowEdit ? { position: 'relative' } : {}}>
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

                            } */}

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

                                {/* {!this.state.AllowEdit ? '' :
                                    <Button color="primary" style={{ width: '61px' }} className="btn waves-effect waves-light btn-primary pull-right m-l-10">
                                        {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                                            : <span className="comment-text">{Labels.Save}</span>}

                                    </Button>

                                } */}


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

        this.GetAllPrinters();
        this.GetEnterpriseSetting();
        this.getActiveCountries()
        if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
            var userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
            var HasPermission = Utilities.HasPermission(userObj.RoleLevel, Constants.Permission.ENTERPRISE_SETTING_UPDATE);
            this.setState({ AllowEdit: HasPermission });
        }

    }


    addCharges = () => {
        const newCharges = {
            //   Id: this.state.additionalCharges.length + 1, // Generate a unique id
            Label: '',
            Amount: 0,
            Threshould: 0,
            Type: "Fixed"
        };

        // Update the state with the new array
        this.setState((prevState) => ({
            additionalCharges: [...prevState.additionalCharges, newCharges],
        }));
    };

    addOrderCommission = () => {
        const newCharges = {
            //   Id: this.state.orderCommission.length + 1, // Generate a unique id
            Amount: 0,
            Threshould: 0,
            Type: "Fixed"
        };

        // Update the state with the new array
        this.setState((prevState) => ({
            orderCommission: [...prevState.orderCommission, newCharges],
        }));
    };

    AddPrinter = () => {
        const newCharges = {
            Name: '',
        };

        // Update the state with the new array
        this.setState((prevState) => ({
            printerJson: [...prevState.printerJson, newCharges],
        }), () => { console.log("this.state.printerJson:", this.state.printerJson)});
    };

    removeCharges = (index) => {
        const updatedItems = this.state.additionalCharges.filter((v, i) => i !== index);

        // Update the state with the filtered array
        this.setState({ additionalCharges: updatedItems },()=>{
            this.UpdateV2EnterpriseSetting()
        });
    };

        removeOrderCommission = (index) => {
        const updatedItems = this.state.orderCommission.filter((v, i) => i !== index);

        // Update the state with the filtered array
        this.setState({ orderCommission: updatedItems },()=>{
            this.UpdateV2EnterpriseSetting()
        });
    };


    removePrinter = (index) => {
        const updatedItems = this.state.printerJson.filter((v, i) => i !== index);

        // Update the state with the filtered array
        this.setState({ printerJson: updatedItems },()=>{
            this.UpdateV2EnterpriseSetting()
        });
    };


    handleSetGst = (e, controls) => {

        var value = e.target.value;
        //if(value == "") return;
        switch (controls.toUpperCase()) {
            case "TP":
                this.state.EnterpriseSetting.RestaurantSettings.TaxPercentage = value
                this.UpdateV2EnterpriseSetting()
                break;
            case "CA":
                this.state.EnterpriseSetting.RestaurantSettings.ChatAIAssistantId = value
                this.UpdateV2EnterpriseSetting()
                break;
            case "VA":
                this.state.EnterpriseSetting.RestaurantSettings.VoiceAIAssistantId = value
                this.UpdateV2EnterpriseSetting()
                break;

            default:
                break;
        }

        // this.setState({taxPercentage: value > 0 ? value : this.state.taxPercentage});
    }

    render() {

        /*const renderItem = ({ item }) => {
            return item.text;
        };*/


        return (
            <div className="card general-settings-b-wrap" id="generalSettingsDv">

                <div className="">

                    {/* {this.state.AllowEdit ? '' :
                        <div className="alert alert-warning ">
                            In order to make changes to this section, please contact Superbutler Support on <strong>{Config.Setting.SupportEmail}</strong>.
                        </div>
                    } */}

                    {/* {
                        this.state.EnterpriseSetting.EnterpriseTypeId != 5 && */}
                        <AvForm>
                            <div>

                                <div className="col-md-12 col-xs-12 setting-cus-field ">
                                    {/* <div className="col-xs-12 col-sm-3 m-b-10 form-group checkSpanDV">

                                                <AvInput type="checkbox" name="chkIsClaimed" value={enterprise.IsOwnRestaurant} onClick={(event)=>this.handlerCheckBox(event,'IOR')} className="form-checkbox" />
                                                <Label check for="chkIsClaimed">Is {Utilities.GetResourceValue(GlobalData.restaurants_data.Supermeal_dev.Platform, 'Restaurant', 'Shop')} Claimed</Label>

                                            </div> */}
                                        {
                                            this.state.EnterpriseSetting.EnterpriseTypeId != 5 &&
                                            <div className="col-xs-12 col-sm-12 m-b-20 checkDiv">
                                                <Label check for="chkOnlineOrder">{Labels.Take_Online_Order}</Label>
                                                <BootstrapSwitchButton
                                                    checked={this.state.EnterpriseSetting.RestaurantSettings?.TakeOnlineOrder}
                                                    onChange={(event) => this.generalSetupHandlerCheckBox(event, 'TO')}
                                                    onlabel='Activate'
                                                    offlabel='Deactivate'
                                                    size="xs"
                                                    style="min-xs xs-toggle-btn"
                                                    onstyle="primary"
                                                />
                                                {/* <AvInput type="checkbox" name="chkOnlineOrder" checked={this.state.EnterpriseSetting.RestaurantSettings?.TakeOnlineOrder} value={this.state.EnterpriseSetting.RestaurantSettings?.TakeOnlineOrder} onClick={(event)=>this.generalSetupHandlerCheckBox(event,'TO')} className="form-checkbox" /> */}


                                            </div>
                                        }
                                        {
                                            this.state.EnterpriseSetting.EnterpriseTypeId != 5 &&
                                            <div className="col-xs-12 col-sm-12 m-b-20 checkDiv">
                                                <Label check for="chkApplyGst">Apply {this.state.EnterpriseSetting.RestaurantSettings?.TaxLabel}</Label>
                                                <BootstrapSwitchButton
                                                    checked={this.state.EnterpriseSetting.RestaurantSettings?.ApplyGST}
                                                    onChange={(event) => this.generalSetupHandlerCheckBox(event, 'AG')}
                                                    onlabel='Activate'
                                                    offlabel='Deactivate'
                                                    size="xs"
                                                    style="min-xs xs-toggle-btn"
                                                    onstyle="primary"
                                                />



                                            </div>
                                        }
                                    {this.state.EnterpriseSetting.EnterpriseTypeId != 5 && this.state.EnterpriseSetting.RestaurantSettings?.ApplyGST &&

                                        <div className="checkDiv col-sm-12 col-xs-12 justify-content-start m-b-20">
                                            <AvField name="taxPercentage" value={this.state.EnterpriseSetting.RestaurantSettings?.TaxPercentage} onBlur={(e) => this.handleSetGst(e, "TP")} type="phonenumber" className="form-control"
                                                validate={{
                                                    required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                                                    myValidation: phoneNumValidation,
                                                }}
                                            />
                                            <Label className='ml-2'>value in %</Label>
                                            <div className="help-block with-errors"></div>
                                        </div>
                                    }

                                    {
                                        this.state.EnterpriseSetting.EnterpriseTypeId == 5 &&
                                            <div className="col-xs-12 col-sm-12 m-b-20 checkDiv">
                                            <Label check for="chkAllowActivitySms">{Labels.Allow_OrderSupport}</Label>

                                                <BootstrapSwitchButton
                                                    checked={this.state.EnterpriseSetting.RestaurantSettings?.HasSupportChat}
                                                    onChange={(event) => this.generalSetupHandlerCheckBox(event, 'SC')}
                                                    onlabel='Activate'
                                                    offlabel='Deactivate'
                                                    size="xs"
                                                    style="min-xs xs-toggle-btn"
                                                    onstyle="primary"
                                                />


                                            </div>
                                    }

                                  {
                                        this.state.EnterpriseSetting.EnterpriseTypeId == 5 &&
                                        <div className="col-xs-12 col-sm-12 m-b-20 checkDiv">
                                        <Label check for="chkAllowActivitySms">{Labels.Allow_AIMode}</Label>
                                            <BootstrapSwitchButton
                                                checked={this.state.EnterpriseSetting.RestaurantSettings?.AIModeOnly}
                                                onChange={(event) => this.generalSetupHandlerCheckBox(event, 'AI')}
                                                onlabel='Activate'
                                                offlabel='Deactivate'
                                                size="xs"
                                                style="min-xs xs-toggle-btn"
                                                onstyle="primary"
                                            />


                                        </div>
                                  }


                                </div>
                                {
                                    this.state.EnterpriseSetting.EnterpriseTypeId == 5 &&
                                    <div className='mb-3 px-3 business-rep-pad-remove'>
                                    <div className="col-md-12 business-rep-pad-remove m-b-20" style={{maxWidth:400}}>
                                            <Label className='mb-1' check for="chkAllowActivitySms">{Labels.ChatAIAssistantId}</Label>
                                            <AvField name="taxPercentage" value={this.state.EnterpriseSetting.RestaurantSettings?.ChatAIAssistantId} onBlur={(e) => this.handleSetGst(e, "CA")} type="phonenumber" className="form-control"/>
                                            <div className="help-block with-errors"></div>
                                        </div>
                                        <div className="col-md-12 business-rep-pad-remove m-b-20" style={{maxWidth:400}}>
                                            <Label  className='mb-1' check for="chkAllowActivitySms">{Labels.VoiceAIAssistantId}</Label>
                                            <AvField name="taxPercentage" value={this.state.EnterpriseSetting.RestaurantSettings?.VoiceAIAssistantId} onBlur={(e) => this.handleSetGst(e, "VA")} type="phonenumber" className="form-control"/>
                                            <div className="help-block with-errors"></div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </AvForm>
                    {/* } */}
                    <div class="row col-md-12 col-xs-12 setting-cus-field flex-column">
                        <div className='d-flex align-items-start flex-column'>

                        {
                                this.state.EnterpriseSetting.EnterpriseTypeId != 5 &&
                                <div className="col-xs-12 col-sm-12 checkDiv pr-3 m-b-20">
                                    <Label>{Labels.Show_Reviews}</Label>
                                    <div className="">
                                        <BootstrapSwitchButton
                                            checked={this.state.EnterpriseSetting.RestaurantSettings?.ShowReviews}
                                            onChange={(event) => {
                                                this.generalSetupHandlerCheckBox(event, 'SR')
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


                            {/* {
                                this.state.EnterpriseSetting.EnterpriseTypeId != 5 &&
                                <div className="col-xs-12 col-sm-12 checkDiv pr-3 m-b-20">
                                    <Label>{Labels.AdditionalCharges}</Label>
                                    <div className="">
                                        <BootstrapSwitchButton
                                            checked={this.state.EnterpriseSetting.RestaurantSettings?.ShowMessageOfOtherCharges}
                                            onChange={(event) => {
                                                this.generalSetupHandlerCheckBox(event, 'SM')

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

                            {
                                this.state.EnterpriseSetting.EnterpriseTypeId != 5 && this.state.EnterpriseSetting.RestaurantSettings?.ShowMessageOfOtherCharges && this.state.additionalCharges.length == 0 &&
                                <div className=''>
                                    <span className='text-primary font-14 cursor-pointer' onClick={() => this.addCharges()}>+ Add Charges</span>
                                </div>
                            } */}
                        </div>

                        {
                         
                        <div className="mb-1" style={{ maxWidth: "800px" }}>
                            <AvForm onValidSubmit={this.UpdateV2EnterpriseSetting}>
                                
                             {
                                this.state.EnterpriseSetting.EnterpriseTypeId != 5 &&
                                <div className="col-xs-12 col-sm-12 checkDiv pr-3 m-b-20">
                                    <Label>{Labels.AdditionalCharges}</Label>
                                    <div className="">
                                        <BootstrapSwitchButton
                                            checked={this.state.EnterpriseSetting.RestaurantSettings?.ShowMessageOfOtherCharges}
                                            onChange={(event) => {
                                                this.generalSetupHandlerCheckBox(event, 'SM')

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

                            {
                                this.state.EnterpriseSetting.EnterpriseTypeId != 5 && this.state.EnterpriseSetting.RestaurantSettings?.ShowMessageOfOtherCharges && this.state.additionalCharges.length == 0 &&
                                <div className='mb-5'>
                                    <span className='text-primary font-14 cursor-pointer' onClick={() => this.addCharges()}>+ Add Charges</span>
                                </div>
                            }
                                
                             {this.state.EnterpriseSetting.EnterpriseTypeId != 5 && this.state.EnterpriseSetting.RestaurantSettings?.ShowMessageOfOtherCharges &&  this.state.additionalCharges.length > 0 &&    
                                <div className=" mb-4 flex-nowrap mt-3">
                                    {this.state.additionalCharges.map((v, i) => (
                                            <div className='row mb-3'>
                                                <div className='col-md-3 business-rep-pad-remove'>
                                                    <label className="fw-semibold font-14">Label</label>
                                                    <AvField className="form-control" name={"Label" + i} type="text" value={Utilities.SpecialCharacterDecode(v.Label)}
                                                          validate={{
                                                            required: { value: this.props.isRequired, errorMessage: 'This is a required field' }
                                                        }} onChange={(e) => this.handleChange(i, e, "Label")}
                                                    />
                                                </div>
                                                <div className='col-md-2 business-rep-pad-remove'>
                                                    <label className="fw-semibold font-14">Amount</label>
                                                    <AvField className="form-control" name={"Amount" + i} type="text" value={v.Amount}
                                                         validate={{
                                                            required: { value: this.props.isRequired, errorMessage: 'This is a required field' }
                                                        }} onChange={(e) => this.handleChange(i, e, "Amount")}
                                                    />
                                                </div>
                                                <div className='col-md-2 business-rep-pad-remove'>
                                                    <div className='d-flex align-items-end'>
                                                        <div className='d-flex flex-1 flex-column'>
                                                            <label className="fw-semibold font-14">Threshold</label>
                                                            <AvField className="form-control" name={"Threshold" + i} type="text" value={v.Threshould}
                                                                 validate={{
                                                                    required: { value: this.props.isRequired, errorMessage: 'This is a required field' }
                                                                }} onChange={(e) => this.handleChange(i, e, "Threshould")}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>


                                                <div className='col-md-4 business-rep-pad-remove'>
                                                    <div className='d-flex align-items-end'>
                                                        <div className='d-flex flex-1 flex-column'>
                                                            <label className="fw-semibold font-14">Type</label>
                                                            <select className="form-control custom-select " name="ddlType" id="ddlType" onChange={(e) => this.handleChange(i, e, "Type")} value={v.Type}>
                                                                <option value={"Fixed"}>Fixed</option>
                                                                <option value={"Percentage"}>Percentage</option>
                                                            </select>
                                                        </div>
                                                        <span className='text-danger font-14 cursor-pointer mb-2' onClick={() => this.removeCharges(i)}><i class="fa fa-trash ml-2"></i> remove</span>
                                                    </div>
                                                </div>



                                                <div className='mt-3 px-3 d-flex align-items-center'>

                                                    {
                                                        this.state.additionalCharges.length - 1 == i ?
                                                            <div className=''>
                                                                <span className='text-primary font-14 cursor-pointer' onClick={() => this.addCharges()}>+ Add another</span>   </div> : ""

                                                    }

                                                </div>
                                            </div>
                                        ))

                                    }
                                </div>
                            }

                            {
                                this.state.EnterpriseSetting.EnterpriseTypeId != 5 &&
                                <div className="col-xs-12 col-sm-12 checkDiv pr-3 m-b-20">
                                    <Label>{Labels.OrderCommision}</Label>
                                    <div className="">
                                        <BootstrapSwitchButton
                                            checked={this.state.EnterpriseSetting.RestaurantSettings?.EnableOrderCommission}
                                            onChange={(event) => {
                                                this.generalSetupHandlerCheckBox(event, 'OC')

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


                            {
                                this.state.EnterpriseSetting.EnterpriseTypeId != 5 && this.state.EnterpriseSetting.RestaurantSettings?.EnableOrderCommission && this.state.orderCommission.length == 0 &&
                                <div className='mb-3'>
                                    <span className='text-primary font-14 cursor-pointer' onClick={() => this.addOrderCommission()}>+ Add Order Commission</span>
                                </div>
                            }

                           { this.state.EnterpriseSetting.EnterpriseTypeId != 5 && this.state.EnterpriseSetting.RestaurantSettings?.EnableOrderCommission &&  this.state.orderCommission.length > 0 &&
                            <div className=" mb-4 flex-nowrap mt-3">
                                    {this.state.orderCommission.map((v, i) => (
                                            <div className='row mb-3'>
     
                                                <div className='col-md-2 business-rep-pad-remove'>
                                                    <label className="fw-semibold font-14">Amount</label>
                                                    <AvField className="form-control" name={"CommissionAmount" + i} type="text" value={v.Amount}
                                                         validate={{
                                                            required: { value: this.props.isRequired, errorMessage: 'This is a required field' }
                                                        }} onChange={(e) => this.handleChangeOrderCommission(i, e, "Amount")}
                                                    />
                                                </div>
                                                <div className='col-md-2 business-rep-pad-remove'>
                                                    <div className='d-flex align-items-end'>
                                                        <div className='d-flex flex-1 flex-column'>
                                                            <label className="fw-semibold font-14">Threshold</label>
                                                            <AvField className="form-control" name={"CommissionThreshold" + i} type="text" value={v.Threshould}
                                                                 validate={{
                                                                    required: { value: this.props.isRequired, errorMessage: 'This is a required field' }
                                                                }} onChange={(e) => this.handleChangeOrderCommission(i, e, "Threshould")}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>


                                                <div className='col-md-4 business-rep-pad-remove'>
                                                    <div className='d-flex align-items-end'>
                                                        <div className='d-flex flex-1 flex-column'>
                                                            <label className="fw-semibold font-14">Type</label>
                                                            <select className="form-control custom-select " name="ddlCommissionType" id="ddlCommissionType" onChange={(e) => this.handleChangeOrderCommission(i, e, "Type")} value={v.Type}>
                                                                <option value={"Fixed"}>Fixed</option>
                                                                <option value={"Percentage"}>Percentage</option>
                                                            </select>
                                                        </div>
                                                        <span className='text-danger font-14 cursor-pointer mb-2' onClick={() => this.removeOrderCommission(i)}><i class="fa fa-trash ml-2"></i> remove</span>
                                                    </div>
                                                </div>



                                                <div className='mt-3 px-3 d-flex align-items-center'>

                                                    {
                                                        this.state.orderCommission.length - 1 == i ?
                                                            <div className=''>
                                                                <span className='text-primary font-14 cursor-pointer' onClick={() => this.addOrderCommission()}>+ Add another</span>   </div> : ""

                                                    }

                                                </div>
                                            </div>
                                        ))

                                    }
                            </div>
                            }

                                <FormGroup className='d-flex mb-5'>
                                    {
                                    ((this.state.EnterpriseSetting.RestaurantSettings?.ShowMessageOfOtherCharges && this.state.additionalCharges.length > 0) || (this.state.EnterpriseSetting.RestaurantSettings?.EnableOrderCommission && this.state.orderCommission.length > 0)) &&
                                        <Button color="primary" style={{ width: '61px' }} className="btn waves-effect waves-light btn-primary pull-right m-l-10">
                                            {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                                                : <span className="comment-text">{Labels.Save}</span>}

                                        </Button>

                                    } 
                                </FormGroup>
                            </AvForm>
                        </div>

                        }
                    </div>

                    {this.state.EnterpriseSetting.EnterpriseTypeId != 5 && this.LoadEnterpriseSetting(this.state.EnterpriseSetting)}
                </div>
            </div>
        );
    }
}

export default GeneralSettings;
