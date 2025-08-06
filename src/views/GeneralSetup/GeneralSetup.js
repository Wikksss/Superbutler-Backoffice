import React, { Component } from 'react';
import { Button, Label } from 'reactstrap';
import { AvForm, AvField ,AvInput,AvGroup } from 'availity-reactstrap-validation';
import {  Link } from 'react-router-dom';
import * as EnterpriseService from '../../service/Enterprise';
import * as EnterpriseUserService from '../../service/EnterpriseUsers';
import * as CountryService from '../../service/Country';
import * as CityService from '../../service/City';
import * as AreaService from '../../service/Area';
import * as Utilities from '../../helpers/Utilities';
import Constants from '../../helpers/Constants';
import Config from '../../helpers/Config';
import Loader from 'react-loader-spinner'
import Autocomplete from 'react-autocomplete';
import GlobalData from '../../helpers/GlobalData'
import Labels from '../../containers/language/labels';
import Messages from '../../containers/language/Messages';
import { checkActiveTab } from '../../containers/DefaultLayout/DefaultLayout';
import { BsAsterisk } from "react-icons/bs";
const passwordTextValidation = (value, ctx) => {

    if (value.toUpperCase() === "PASSWORD") {
      return "Your password can not be 'password'";
    }
    return true;
  }
  
  const phoneNumValidation = (value,ctx) => {

    if (/^[+()\d-]+$/.test(value) || value == "") {
        return true;
    } else {
        return "Invalid input"
    }
  }

class GeneralSetup extends Component {

    loading = () =>   <div className="loader-menu-inner"> 
    <Loader type="Oval" color="#ed0000" height="50" width="50"/>  
    <div className="loading-label">Loading.....</div>
    </div>
  

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      showAlert: false,
      ShowLoader: true,
      ShowError: false,
      UserId: 0,
      loggedInUser : [],
      hdAreaCode : 0,
      PostCode : "",
      validateUserName: true,
      UserFieldFocused: false,
      UserNameText : "",
      Agents: [],
      ResellerUsers: [],
      Enterprise: EnterpriseService.Enterprise.EnterpriseDetail,
      SelectedAgentId: 0,
      SelectedResellerUserId: 0,
      SelectedCountryId: 222,
      selectedCountry: {},
      EnterpriseTypeId: 0,
      SelectedCategoryId: 1,
      CityIdsCsv: "",
      Cities: [],
      countryList: [],
      enterpriseTypeList: [],
      CityCsvArray: [],
      ValidatePageName: true,
      IsCitySelected: true,
      PageName: "",
      toRestaurant: false,
      Areas: [],
      AreaId: 0,
      AreaText: "",
      IsNewEnterprise: false,
      ShowPostcodeLoader: false,
      IsSave:false,
      IsChild: false,
      FilterEnterprises: [],
      Enterprises:[],
      ParentName: '',
      ParentID: 0,
      IsParent: false,
      FromInvalid: false,
      IsDineInOffered: false,
      taxPercentage: 1,
      loggedInUser: {},
      newService: false,
      enterpriseTypeError: false,
      enterpriseTypeErrorMessage: "Please select business type",
      parentEnterprise: {},
      lognEmail:''


    };

    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
        this.state.loggedInUser = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
      }

      if(localStorage.getItem(Constants.Session.ENTERPRISE_TYPE_ID) == 5 && (localStorage.getItem(Constants.Session.ENTERPRISE_ID) == 1 || localStorage.getItem(Constants.Session.ENTERPRISE_ID) == 2))
      {
   
            this.state.newService  = true;
      }

  }
    
// #region api calling


GetEnterprises = async () => {

    this.setState({ShowLoader: true});
    let data = await EnterpriseService.GetActive();

    if(data.length !== 0) {

        var enterprises = data.filter(enterprise => {
            return Number(localStorage.getItem(Constants.Session.ENTERPRISE_ID)) !== enterprise.Id && (enterprise.ParentId === 0)
           })

           // Filter if this enterprise is a parent.
        var filterParent = data.filter(enterprise => {
            return Number(localStorage.getItem(Constants.Session.ENTERPRISE_ID)) === enterprise.ParentId
          })
   
          this.setState({Enterprises: enterprises, IsParent: filterParent.length > 0});

    

        var parentEnterprise = data.filter(enterpise => {
            return enterpise.Id === this.state.Enterprise.ParentId
          })

          if(parentEnterprise.length > 0) {

            this.setState({ParentName: parentEnterprise[0].Name, parentEnterprise: parentEnterprise[0]});

          }

    

    if(localStorage.getItem(Constants.Session.ENTERPRISE_TYPE_ID) == 5 && (localStorage.getItem(Constants.Session.ENTERPRISE_ID) == 1 || localStorage.getItem(Constants.Session.ENTERPRISE_ID) == 2))
    {
      this.state.EnterpriseTypeId = 0;
      this.state.IsChild = true;
      this.state.ParentID = this.props.match.params.id;
      
      var parent = data.find((enterprise) =>  enterprise.Id == this.state.ParentID)

      if(parent != undefined){

        this.state.ParentName = parent.Name;
        this.state.parentEnterprise = parent;
      }

    }



    }

    this.setState({ShowLoader: false});
    

}


GetEnterpriseDetail = async () => {
  
    this.setState({ShowLoader: true});
    if(Number(localStorage.getItem(Constants.Session.ENTERPRISE_ID)) == 1)
    {
       var parentConfig = JSON.parse(localStorage.getItem(Constants.Session.COUNTRY_CONFIGURATION))

    this.setState({Enterprise: EnterpriseService.Enterprise.EnterpriseDetail, IsNewEnterprise: true, SelectedCountryId: Object.keys(parentConfig).length > 0 ? parentConfig.Id : this.state.SelectedCountryId},() => this.getActiveCountries());
    
    } else {

    let data = await EnterpriseService.Get();
    if(data.Id > 0) {
        // console.log("DAtaaa", data)
        this.setState({Enterprise: data, ParentID: data.ParentId, IsChild: data.ParentId !== null && data.ParentId > 0, taxPercentage: data.TaxPercentage,
            SelectedAgentId: data.AgentRestaurant.EnterpriseAgentId,SelectedCategoryId: data.Category, PageName: data.RestaurantPage.PageName, 
            SelectedResellerUserId: data.AgentRestaurant.ResellerUserID == 0 || Utilities.stringIsEmpty(data.AgentRestaurant.ResellerUserID) ? this.state.ResellerUsers.length > 0 ? this.state.ResellerUsers[0].Id : 0 :    data.AgentRestaurant.ResellerUserID,
            // SelectedResellerUserId: data.AgentRestaurant.ResellerUserID,
            SelectedCountryId : data.CountryId, EnterpriseTypeId: data.EnterpriseTypeId},() => this.getActiveCountries());
        
    if(this.state.Enterprises.length > 0){

        var parentEnterprise = this.state.Enterprises.filter(enterpise => {
            return enterpise.Id === data.ParentId
          })

          this.setState({ParentName: parentEnterprise.Name});
    }

    
}

}
this.GetEnterprises();
}
 
getActiveCountries = async () => {
    try {
        let response = await CountryService.getAllCountries()
        if (response.length > 0) {


            var selectedCountry = response.find(c => c.Id == this.state.SelectedCountryId)
            var enterpriseDetail = this.state.Enterprise;

            if(enterpriseDetail.TaxPercentage == 0 || this.state.IsNewEnterprise) this.setState({taxPercentage: selectedCountry?.TaxPercentage})
            // console.log("data", this.state.taxPercentage);
            // console.log("data", this.state.taxPercentage);
            // console.log("dataaa", selectedCountry);
            response.sort(function(a,b){
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

GetEnterpriseTypes = async() => {
    let enterpriseTypes = await EnterpriseService.GetEnterpriseType();
    this.setState({
        enterpriseTypeList: enterpriseTypes != null ? enterpriseTypes : []
    })
}
GetEnterpriseAgents = async () => {
    this.setState({ShowLoader: true});
    let data = await EnterpriseService.GetAgents();
   
    if(data.length !== 0) {
      
      if(this.state.loggedInUser.RoleLevel == Constants.Role.RESELLER_ADMIN_ID || this.state.loggedInUser.RoleLevel == Constants.Role.RESELLER_MODERATOR_ID)
      {
        this.setState({Agents: data, SelectedAgentId: this.state.loggedInUser.Enterprise.Id});
      } else {     
        this.setState({Agents: data, SelectedAgentId: data[0].Id});
      }
    }

    if(Number(localStorage.getItem(Constants.Session.ENTERPRISE_ID)) === 1)
        this.setState({ShowLoader: false});
}
GetEnterpriseReseller = async () => {

    this.setState({ShowLoader: true});
    let enterpriseId = Utilities.GetEnterpriseIDFromSession()
    var data = await EnterpriseUserService.GetAll(enterpriseId);
   
    if(data.length !== 0) {
      this.setState({ResellerUsers: data, SelectedResellerUserId: data[0].Id});
    }
}
  
GetCities = async () => {
    
    var data = await CityService.GetAll();

    if(data.length !== 0){
        data.sort(Utilities.SortByName);
        this.setState({Cities: data});
        
    }
  }

  
  GetAreaByKeyword = async (txtSearch) => {

    this.setState({ShowPostcodeLoader: true})

    var data = await AreaService.GetBy(txtSearch);
    if(data.length > 0) {
        this.setState({Areas:data, AreaText: data[0].Area2, AreaId: data[0].Id});
    } else{
        this.setState({ShowError : true,});
    }
    this.setState({ShowPostcodeLoader: false})

}


UserAlreadyRegistered = async (userName,) => {

    if (userName === ""){
      this.setState({validateUserName:true})
        return true;
    }
    
      let message  = await EnterpriseUserService.IsUserAlreadyRegistered(userName);
     
      if(message === '1') {
         this.setState({validateUserName:true})
        return true;
      }
      this.setState({validateUserName:false})
      return false;
    
      
    }



  PageNameAvailable = async (pageName) => {
    if (pageName === ""){
      this.setState({ValidatePageName:true})
        return true;
    }
      let message  = await EnterpriseService.IsPageNameAvailable(pageName);
      
      if(message === '1') {
         this.setState({ValidatePageName:true});
        return true;
      }
      this.setState({ValidatePageName:false});
      return false;
    }


    SaveEnterpriseApi = async(enterprise,name) =>{
        let enterpriseId = await EnterpriseService.Save(enterprise)
        this.setState({IsSave:false}) 
        if(enterpriseId > 0 ) {
            this.GetEnterpriseDetail();
            localStorage.setItem(Constants.Session.ENTERPRISE_ID, enterpriseId);
            localStorage.setItem(Constants.Session.ENTERPRISE_NAME, name);
             window.location.href = '/enterprise/commission-setup';
            //  if(checkActiveTab){
            //      checkActiveTab('/enterprise/commission-setup', true)
            //  }
            
        }
           else 
           Utilities.notify("Save failed.", "e");
}
    


  UpdateEnterpriseApi = async(enterprise) =>{
  
    let message = await EnterpriseService.Update(enterprise)
      
    this.setState({IsSave:false,FromInvalid: false});
        if(message === '1')
            Utilities.notify("Updated successfully.", "s");
        else 
            Utilities.notify("Update failed.", "e");
}


  SaveEnterprise = (event, values) => {

    if(this.state.IsSave) return;
    this.setState({IsSave:true})

    if(this.state.EnterpriseTypeId == 0 || !this.state.ValidatePageName) {
        this.setState({ enterpriseTypeError: this.state.EnterpriseTypeId == 0, IsSave: false, FromInvalid: true })
        return
    }
    let enterprise = this.state.Enterprise;
    enterprise.EnterpriseId = !this.state.IsNewEnterprise ? Number(localStorage.getItem(Constants.Session.ENTERPRISE_ID)) : 0;
    enterprise.Name = Utilities.SpecialCharacterEncode(values.restName);
    enterprise.RestaurantPage.PageName = Utilities.SpecialCharacterEncode(values.pageName);
    enterprise.OwnerName = Utilities.SpecialCharacterEncode(values.ownerName);
    enterprise.AgentRestaurant.EnterpriseAgentId = this.state.SelectedAgentId;
    enterprise.AgentRestaurant.ResellerUserID = this.state.SelectedResellerUserId;
    enterprise.RestaurantPage.SubdomainName = values.subDomName;
    enterprise.Url = values.url;
    enterprise.LongDescription = values.description;
    enterprise.Email = values.email;
    enterprise.Mobile1 = values.mobOne;
    enterprise.Mobile2 = values.mobTwo;
    enterprise.Landline1 = values.landlineOne;
    enterprise.Landline2 = values.landlineTwo;
    enterprise.Category = this.state.SelectedCategoryId
    enterprise.SmsMaskingName = values.smsMask;
    enterprise.CityIdsCsv = '';//cityIdCsv; //this.state.CityIdsCsv;
    // enterprise.IsOwnRestaurant = false //values.chkIsClaimed;
    enterprise.IsSmsAlertsOffered = values.chkAllowNewOrderSms;
    enterprise.TakeOnlineOrder = values.chkOnlineOrder;
    enterprise.IsOwnRestaurant = values.chkOnlineOrder;
    enterprise.ApplyGST = values.chkApplyGst;
    enterprise.TaxPercentage = Number(this.state.taxPercentage);
    enterprise.RestaurantSettings.AllowActivitySMS = values.chkAllowActivitySms;
    enterprise.RestaurantSettings.IsSupermealProfileAllowed = values.chkSupermealProfile;
    enterprise.RestaurantSettings.IsSponsored = values.chkIsSponsored;
    enterprise.RestaurantSettings.IsDineOffered = this.state.IsDineInOffered;
    enterprise.MetaTitle = values.txtMetaTitle;
    enterprise.MetaDescription = values.metaDesc;
    enterprise.MetaKeywords = values.metaKeyword;
    enterprise.OtherTagCsv = values.otherTag;
    enterprise.ParentID = this.state.ParentID;
    enterprise.CountryId = this.state.SelectedCountryId;
    enterprise.EnterpriseTypeId = this.state.EnterpriseTypeId;



    let user = EnterpriseUserService.UserObject
    let loggedInUser = this.state.loggedInUser
    
    user.EUser.Title = values.ddlTitle;
    user.EUser.FirstName = values.frstName;
    user.EUser.SurName = values.lastName;
    user.EUser.PrimaryEmail = this.state.lognEmail;
    user.EUser.Gender = user.EUser.Title === "Mr" ? "M" : "F";
    user.EUser.CreatedBy =  loggedInUser.Id;
    user.EUser.RoleLevel = user.EUser.EnterpiseUser.RoleID = 4;
    user.Password  = values.passwrd;
    user.ConfirmPassword  = values.cnfrmPswrd;
    user.LoginUserName  = values.loginusrName;

    let EnterpriseWithUser = EnterpriseService.Enterprise;
    EnterpriseWithUser.EnterpriseDetail = enterprise;
    EnterpriseWithUser.EnterpriseUser = user;
    

    if(!this.state.IsNewEnterprise) {

     //updating
    this.UpdateEnterpriseApi(enterprise);
    } else{
    
     //save
    this.SaveEnterpriseApi(EnterpriseWithUser,values.restName);     
     }
    
  } 



  //#endregion

  handleInvalidSubmit = () => {
    this.setState({FromInvalid: true})
}

  GetAreaBy(){

    var value = this.state.AreaText;
    if(value==""){
        return
    }
    
    this.setState({ShowError : false, AreaId: 0});
    value = Utilities.FormatPostCodeUK(value);
    this.GetAreaByKeyword(value);
    
    }
    OnItemSelect(value){

    let enterprises = this.state.FilterEnterprises.filter((enterprise) => {
        return enterprise.Name == value
    });

    this.setState({ParentID : enterprises[0].Id, ParentName :enterprises[0].Name}, () => {
        // console.log("ID: ", this.state.ParentID)
    })
    }

    SearchEnterprise(e,value) {
  
        let searchText = value;
        this.setState({ParentID : 0, ParentName: searchText,FilterEnterprises: []});
        if(value.length < 2) return;
      
        let filteredData = []
        if (searchText.toString().trim() === '') {
          this.setState({FilterBrand: []});
          return;
        }
      
        filteredData = this.state.Enterprises.filter((enterprise) => {
        let arr = searchText.toUpperCase();
        let isExists = false;
      
            if (enterprise.Name.toUpperCase().indexOf(arr) !== -1 && !Utilities.stringIsEmpty(arr) && enterprise.EnterpriseId !== 0  ) {
                  isExists = true   
          }
      
          return isExists
        })
      
        this.setState({ FilterEnterprises: filteredData});
      }


handleIsChildCheck(e){

    this.setState({ParentID : 0, ParentName: "",FilterEnterprises: [], IsChild: e.target.checked});

 }


SetCategory(categoryId){


    this.setState({SelectedCategoryId: categoryId})

}

SetAgent(agentId){

    this.setState({SelectedAgentId: agentId})
}

SetResellerUserId(resellerUserId){

    // console.log("checking", resellerUserId);
    this.setState({SelectedResellerUserId: resellerUserId})
}


SetCountry(countryId){

    var selectedCountry = this.state.countryList.find(c => c.Id == countryId)
    this.setState({SelectedCountryId: countryId, selectedCountry: selectedCountry, taxPercentage: selectedCountry.TaxPercentage})
}

SetEnterpriseType(enterpriseId){

    var IsDineInOffered = (enterpriseId == 10 || enterpriseId == 11 || enterpriseId == 12 || enterpriseId == 13 || enterpriseId == 14 || enterpriseId == 15)
    this.setState({EnterpriseTypeId: enterpriseId, IsDineInOffered: IsDineInOffered, IsChild: enterpriseId == 5 && false, enterpriseTypeError: false})
}

MakePageName(e){
   
    let pageName = e.target.value;
    pageName = pageName.replace(/'/gi, "").replace(/ /gi, "-").replace(/\./g, "").replace(/#/gi,"");
    this.RemoveSpecialChars(e);
    this.setState({PageName: pageName.toLowerCase()});
}


RemoveSpecialChars(e){
    
    Utilities.RemoveSpecialChars(e);
    Utilities.RemoveDefinedSpecialChars(e);
    
}

handleSetGst = (e) => {

    var value = e.target.value;
    this.setState({taxPercentage: value > 0 ? value : this.state.taxPercentage});
}

handlerCheckBox(e,control){

    let value = e.target.value;
    let enterprise = this.state.Enterprise;

    switch(control.toUpperCase()){
  
        // case 'IOR':
        // enterprise.IsOwnRestaurant = value === "false"? true:false;
        // break;

        case 'ISA':
        enterprise.IsSmsAlertsOffered = value === "false"? true:false;
        break;

        case 'TO':
        enterprise.TakeOnlineOrder = value === "false"? true:false;
        enterprise.IsOwnRestaurant = enterprise.TakeOnlineOrder;
        break;

        case 'AG':
        enterprise.ApplyGST = value === "false"? true:false;
        break;

        case 'AS':
        enterprise.RestaurantSettings.AllowActivitySMS = value === "false"? true:false;
        break;

        case 'ISP':
        enterprise.RestaurantSettings.IsSupermealProfileAllowed = value === "false"? true:false;
        break;

        case 'IS':
        enterprise.RestaurantSettings.IsSponsored = value === "false"? true:false;
        break;

        case 'SM':
        enterprise.RestaurantSettings.ShowMessageOfOtherCharges = value === "false"? true:false;
        break;

        default:
            break;
        
    }

        this.setState({Enterprise: enterprise});

}


handlerCitiesCheckBox(e)
{
    let cityArray = this.state.CityCsvArray;

    if(e.target.value === 'true')
    {
        var index = cityArray.indexOf(Number(e.target.id))
        if (index !== -1) {
            cityArray.splice(index, 1);
            
  }     
    } else {
        cityArray.push(Number(e.target.id));
    }


    this.setState({CityCsvArray: cityArray});

}

GetCityIdCsv(){

    let cityArray = this.state.CityCsvArray;
    var Csv = "";
    
    for(var i = 0; i < cityArray.length; i++){
        
        Csv += cityArray[i] + Config.Setting.csvSeperator;
  }

  Csv = Utilities.FormatCsv(Csv, Config.Setting.csvSeperator);
  return Csv;
 }


  RenderCity(city)
{
    
    let enterprise = this.state.Enterprise;
    
    return (
        <div className="col-xs-12 col-sm-3 m-b-10 form-group checkSpanDV">
                                    <AvInput  type="checkbox" name={city.Name} id={city.Id} value={Utilities.isExistInCsv(city.Id, enterprise.CityIdsCsv+Config.Setting.csvSeperator, Config.Setting.csvSeperator)} onClick={(event)=>this.handlerCitiesCheckBox(event)} className="form-checkbox" />
                                    <Label check for={city.Id}> {city.Name}</Label>
                             </div>
   )
} 
 
LoadCities(cities){
    
    var htmlCity = [];

    if(cities.length === 0) {
        return;
    }

  for (var i=0; i < cities.length; i++){

    htmlCity.push(this.RenderCity(cities[i],));
}

  return(

    <div className=" formPadding row col-xs-12 setting-cus-field m-t-20 m-b-20">
    {htmlCity.map((cityHtml) => cityHtml)}
    </div>
   )
   
  }

  RenderAgentDropDown(agent)
    {
        if(agent.Id === this.state.SelectedAgentId) {

           return <option key={agent.Id} value={agent.Id} selected>{agent.Name}</option>
        }
        return (
            <option key={agent.Id} value={agent.Id}>{agent.Name}</option>
       )
     }

     RenderCountryDropDown(country)
     {
         if(country.Id === this.state.SelectedCountryId) {
 
            return <option key={country.Id} value={country.Id} selected>{Utilities.SpecialCharacterDecode(country.Name)}</option>
         }
         return (
             <option key={country.Id} value={country.Id}>{Utilities.SpecialCharacterDecode(country.Name)}</option>
        )
      }

      RenderEnterpriseTypeDropDown(enterpriseType)
      {
          if(enterpriseType.ID === this.state.EnterpriseTypeId) {
             return <option key={enterpriseType.ID} value={enterpriseType.ID} >{enterpriseType.Name}</option>
          }
          return (
              <option key={enterpriseType.ID} value={enterpriseType.ID}>{enterpriseType.Name}</option>
         )
       }
    
    LoadAgentsDropDown(agents){
        
        var htmlAgents = [];
       
        if(agents === null || agents.length <1)
        {
            return;
        }
    
    
      for (var i=0; i < agents.length; i++){
       
        htmlAgents.push(this.RenderAgentDropDown(agents[i]));
        
      
        }
    
      return(

        <div className="input-group mb-3 form-group">
            <select disabled={this.state.loggedInUser.RoleLevel == Constants.Role.RESELLER_ADMIN_ID || this.state.loggedInUser.RoleLevel == Constants.Role.RESELLER_MODERATOR_ID} className="form-control" onChange={(e) => this.SetAgent(Number(e.target.value))} >{htmlAgents.map((agentHtml) => agentHtml)}</select>
        </div>
       )
       
      }

      LoadCountryDropDown(){
        
        var htmlCountry = [];
        var countryList = this.state.countryList;
        if (countryList === null || countryList.length < 1) {
          return;
        }

        for (var i = 0; i < countryList.length; i++) {
          htmlCountry.push(this.RenderCountryDropDown(countryList[i]));
        }

        return (
          <div className="input-group mb-3 form-group">
            {/* <select className="form-control" onChange={(e) => this.handlerOnChangeTown(e.target.value)}>{htmlAgents.map((agentHtml) => agentHtml)}</select> */}
            <select
              className="form-control"
              onChange={(e) => this.SetCountry(Number(e.target.value))}
              value={Object.keys(this.state.parentEnterprise).length > 0 && this.state.newService ? this.state.parentEnterprise.CountryId : this.state.SelectedCountryId}
            >
              {htmlCountry.map((countryHtml) => countryHtml)}
            </select>
          </div>
        );
       
      }
      LoadEnterpriseTypeDropDown(){
        
        var htmlEnterpriseType = [];
        var enterpriseTypeList = this.state.enterpriseTypeList;
        if (enterpriseTypeList === null || enterpriseTypeList.length < 1) {
          return;
        }

        for (var i = 0; i < enterpriseTypeList.length; i++) {
            
          
            if ((!this.state.newService && this.state.Enterprise.ParentId == 0 && (enterpriseTypeList[i].ID == 5 || enterpriseTypeList[i].ID == 6)) || ((this.state.Enterprise.ParentId > 0 || this.state.newService) && enterpriseTypeList[i].ID != 5 && enterpriseTypeList[i].ID != 6))  {
                
                htmlEnterpriseType.push(this.RenderEnterpriseTypeDropDown(enterpriseTypeList[i]));
            }
            

        }

        return (
          <div className="input-group mb-3 form-group flex-column">
             <select disabled = {this.state.Enterprise.Id > 0}
              className="form-control w-100 mb-2"
              onChange={(e) => this.SetEnterpriseType(Number(e.target.value))}
              value={this.state.EnterpriseTypeId }
            >
              <option value={'0'}>Select Type</option>
              {htmlEnterpriseType.map((Html) => Html)}
            </select>
            {
                this.state.enterpriseTypeError &&
                <span className='text-danger'>{this.state.enterpriseTypeErrorMessage}</span>
            }
          </div>
        );
       
      }
  
  componentDidMount() {
    
    // this.GetCities();
    this.GetEnterpriseAgents();
    this.GetEnterpriseReseller();
    this.GetEnterpriseDetail();
    // this.getActiveCountries();
    setTimeout(() => {
        this.GetEnterpriseTypes();
      }, 150);
}

   componentWillUnmount() {
    //  localStorage.setItem(Constants.Session.ENTERPRISE_ID, this.state.loggedInUser.Enterprise.Id);
    //  localStorage.setItem(Constants.Session.ENTERPRISE_NAME, this.state.loggedInUser.Enterprise.Name);
  }

render() {

    
        let enterprise = this.state.Enterprise;
        
        if(this.state.ShowLoader ){

            return this.loading();
        }

        var invalidPageNameClass = this.state.ValidatePageName ? "form-control" : "form-control is-touched is-pristine av-invalid is-invalid form-control";
        var dvValidation = this.state.ValidatePageName ? <div></div> : <div className="invalid-feedback" style={{ display: 'block' }}>This PageName already taken.</div>
        // var loginField =  <AvField ref="txtlogin"  name="loginusrName" onBlur={(e) => this.UserAlreadyRegistered(e.target.value)}  type="text" className={invalidUserNameClass} validate={{ required: { value: this.props.isRequired, errorMessage: 'This is a required field' },}}/>
        var dvCityValidation = this.state.IsCitySelected ? <div></div> : <div className="invalid-feedback" style={{ display: 'block' }}>Please select city.</div>
        var pageNameField = <AvField  name="pageName" value={this.state.PageName}  onKeyUp={(e) => this.MakePageName(e)} onBlur={(e) => this.PageNameAvailable(e.target.value)}  type="text" className={invalidPageNameClass} 
        validate={{ required: { value: this.props.isRequired, errorMessage: 'This is a required field' },}}
        />
        return (
            <div className="card">
               <h3 className="card-title card-new-title">{Labels.General_Setup} {Utilities.SpecialCharacterDecode(enterprise.Name)}</h3>
                <div className="card-body">

                    <AvForm  onValidSubmit={this.SaveEnterprise} onInvalidSubmit={this.handleInvalidSubmit} id="generalSetupForm" > 
                    <h4 className="title-sperator font-weight-600">{Labels.Business_Information}</h4>
                        <div className="form-body m-b-10 formPadding">
                            <div className="row p-t-20 m-b-20">
                                <div className="col-md-6">
                                    <label className="color-7 font-weight-normal">{Labels.Business_Name} <BsAsterisk className='st-show'></BsAsterisk></label>
                                    <div className="input-group m-b-10 form-group">
                                    <AvField errorMessage="This is a required field" name="restName" onBlur={(e) => this.PageNameAvailable(this.state.PageName)}  value={Utilities.SpecialCharacterDecode(enterprise.Name)} onKeyUp={Utilities.RemoveSpecialChars} onChange={(e) => this.MakePageName(e)} type="text" className="form-control" required />
                                    <div className="help-block with-errors"></div>
                                    </div>

                                </div>
                                <div className="col-md-6">
                                    <label className="color-7 font-weight-normal">{Labels.Owner_Name}</label>
                                    <div className="input-group m-b-10 form-group">
                                    <AvField  name="ownerName" value={Utilities.SpecialCharacterDecode(enterprise.OwnerName)} type="text" className="form-control" />
                                        <div className="help-block with-errors"></div>
                                    </div>
                                </div>
                            {/* </div> */}
                            {/* <div className="row m-b-20"> */}
                                {
                                    this.state.IsParent && this.state.loggedInUser.RoleLevel != Constants.Role.ENTERPRISE_ADMIN_ID  &&  this.state.loggedInUser.RoleLevel != Constants.Role.ENTERPRISE_MANAGER_ID &&  this.state.loggedInUser.RoleLevel != Constants.Role.STAFF_ID &&      
                                    <div className="col-md-6">
                                        <label className="color-7 font-weight-normal">{Labels.Reseller}</label>
                                    
                                    { this.state.Agents.length > 0 &&  this.LoadAgentsDropDown(this.state.Agents)}
                                    
                                    </div>
                                }

                            { (this.state.loggedInUser.RoleLevel == 3  || this.state.loggedInUser.RoleLevel == 16) ? 
                                
                                <div className="col-md-6">
                                    <label className="color-7 font-weight-normal">{Labels.Key_Account}</label>
                                   
                                   { this.state.ResellerUsers.length > 0 &&  
                                   <select className="form-control" onChange={(e) => this.SetResellerUserId(Number(e.target.value))} >
                                    
                                    {this.state.ResellerUsers.map((user) => {
                                        // console.log("this.state.SelectedResellerUserId", this.state.SelectedResellerUserId)
                                        // console.log("SelectedResellerUserId", user.Id == this.state.SelectedResellerUserId)
                                        return <option key={user.Id} value={user.Id} selected={user.Id == this.state.SelectedResellerUserId}>{`${!Utilities.stringIsEmpty(user.DisplayName) ? user.DisplayName : `${user.FirstName} ${user.SurName}`  } (${Utilities.GetRoleName(user.RoleLevel)})`}</option>
                                    }
                                    
                                    )}
                                    
                                    </select>
                                   
                                   }
                                   
                                </div>
                                :
                                <div className="col-md-6">
                                 <label className="color-7 font-weight-normal">{Labels.Page_Name} <BsAsterisk className='st-show'></BsAsterisk></label>
                                 <div className="input-group mb-3 form-group">
                                 {pageNameField}
                                 {dvValidation}
                                 {/* <div className="help-block with-errors"></div> */}
                                 </div>
                               </div>
                        }
                               
                            {/* </div> */}
                           { (this.state.loggedInUser.RoleLevel == 3 || this.state.loggedInUser.RoleLevel == 16) && 
                            <div className="row m-b-20">
                               
                                <div className="col-md-6">
                                    <label className="color-7 font-weight-normal">{Labels.Page_Name}</label>
                                    <div className="input-group mb-3 form-group">
                                    {pageNameField}
                                    {dvValidation}
                                    {/* <div className="help-block with-errors"></div> */}
                                    </div>
                                </div>
                            </div> }
                            {/* <div className="row m-b-20"> */}
                                <div className="col-md-6">
                                    <label className="color-7 font-weight-normal">{Labels.Sub_Domain}</label>
                                    <div className="input-group mb-3  form-group">
                                    <AvField errorMessage="This is a required field" name="subDomName" value={Utilities.SpecialCharacterDecode(enterprise.RestaurantPage.SubdomainName)} type="text" className="form-control"/>
                                    <div className="help-block with-errors"></div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="color-7 font-weight-normal">{Labels.Country}</label>
                                   
                                   { this.state.countryList.length > 0 &&  this.LoadCountryDropDown()}
                                   
                                </div>

                            {/* </div> */}
                            {/* <div className="row m-b-20"> */}
                                <div className="col-md-6">
                                    <label className="color-7 font-weight-normal">{Labels.Business_Type}</label>
                                   
                                   { this.state.enterpriseTypeList.length > 0 &&  this.LoadEnterpriseTypeDropDown()}
                                   
                                </div>
                                {this.state.EnterpriseTypeId != 5 && 
                                this.state.EnterpriseTypeId != 6 && this.state.newService &&
                                !this.state.IsParent
                                //localStorage.getItem(Constants.Session.ENTERPRISE_TYPE_ID) != 5 && 
                                //&& (localStorage.getItem(Constants.Session.ENTERPRISE_ID) != 1 || localStorage.getItem(Constants.Session.ENTERPRISE_ID) != 2) 
                                
                                ? <div className="col-md-6">
                                    
                                    {/* { this.state.newService ?
                                        <div className="child-th-wrap">
                                        <label className="color-7 font-weight-normal ">{Messages.Is_service_Hotel}</label>
                                        <div>
                                            <input type="checkbox" id="yes" className="form-checkbox" checked={this.state.IsChild} onChange={(e) => this.handleIsChildCheck(e)} />
                                            <Label htmlFor="yes">{Labels.Yes}</Label>
                                        </div>
                                    </div> 
                                    : 
                                    <label className="color-7 font-weight-normal ">{Messages.Hotel_Name}</label>
                                    
                                }  */}
                                    <label className="color-7 font-weight-normal ">{Messages.Hotel_Name}</label>
                                    <AvField disabled name="parentName" value={Utilities.SpecialCharacterDecode(this.state.ParentName)} type="text" className="form-control"/>                                    
                                    {/* {this.state.IsChild && this.state.newService ?
                                       
                                       <div className="input-group h-set-new">
                                            <Autocomplete
                                                className="form-control"
                                                getItemValue={(item) => item.Name}
                                                items={this.state.FilterEnterprises}
                                                renderItem={(item, isHighlighted) =>
                                                    <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                                                        {item.Name}
                                                    </div>
                                                }
                                                value={this.state.ParentName}
                                                onChange={(event, value) => this.SearchEnterprise(event, value)}
                                                onSelect={(value) => this.OnItemSelect(value)}
                                                selectOnBlur={true}
                                            />
                                        </div>

                                        : 
                                        <AvField disabled name="parentName" value={Utilities.SpecialCharacterDecode(this.state.ParentName)} type="text" className="form-control"/>
                                        } */}
                                </div> : ""}
                            </div>

                            <div className="row m-b-20">
                                <div className=" col-sx-12 col-sm-12">
                                    <div className="form-group m-b-0 form-group">
                                        <label className="color-7 font-weight-normal">{Labels.Long_Description} </label>
                                        <AvField type="textarea" name="description" rows="4" maxLength="1000" cols="50" value={Utilities.SpecialCharacterDecode(enterprise.LongDescription)}  className="form-control">
                                        </AvField>
                                    </div>
                                </div>
                            </div>

                            <div className="row m-b-20">
                                <div className="col-md-6">
                                    <label className="color-7 font-weight-normal ">{Labels.Email} <BsAsterisk className='st-show'></BsAsterisk></label>
                                    <div className="input-group mb-3  form-group">
                                    <AvField name="email" value={enterprise.Email} type="email" className="form-control"  onChange={(e)=> this.setState({lognEmail: e.target.value})}
                                    validate={{email: true , required: { value: this.props.isRequired, errorMessage: 'This is a required field' }}}
                                     />
                                    <div className="help-block with-errors"></div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label className="color-7 font-weight-normal ">{Labels.Primary_Mobile} <BsAsterisk className='st-show'></BsAsterisk></label>
                                    <div className="input-group mb-3 form-group">
                                    <AvField name="mobOne" value={enterprise.Mobile1} type="text" className="form-control" 
                                    validate={{
                                        required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                                        myValidation: phoneNumValidation,
                                        }} 
                                    // validate={{tel: {pattern: '^[0-9]',errorMessage: 'Invalid input'},required: { value: this.props.isRequired, errorMessage: 'This is a required field' }}}  
                                    />
                                    <div className="help-block with-errors"></div>
                                    </div>
                                </div>

                            </div>

                            <div className="row m-b-20">
                                <div className="col-md-6">
                                    <label className="color-7 font-weight-normal ">{Labels.Secondary_Mobile}</label>
                                    <div className="input-group mb-3  form-group">
                                    <AvField name="mobTwo" value={enterprise.Mobile2} type="text" className="form-control" 
                                     validate={{ myValidation: phoneNumValidation,}} 
                                    />
                                    <div className="help-block with-errors"></div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label className="color-7 font-weight-normal ">{Labels.Primary_Landline}</label>
                                    <div className="input-group mb-3 form-group">
                                    <AvField  name="landlineOne" value={enterprise.Landline1} type="text" className="form-control" 
                                    validate={{ myValidation: phoneNumValidation,}} 
                                    />
                                    <div className="help-block with-errors"></div>
                                    </div>
                                </div>

                            </div>

                            <div className="row m-b-20">
                                <div className="col-md-6">
                                    <label className="color-7 font-weight-normal ">{Labels.Secondary_Landline}</label>
                                    <div className="input-group mb-3  form-group">
                                    <AvField  name="landlineTwo" value={enterprise.Landline2} type="text" className="form-control" 
                                    validate={{ myValidation: phoneNumValidation,}} 
                                    />
                                    <div className="help-block with-errors"></div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label className="color-7 font-weight-normal ">{Labels.National_Tax_Number}</label>
                                    <div className="input-group mb-3 form-group">
                                    <AvField errorMessage="This is a required field" name="ntn" value="" type="tel" className="form-control" validate={{tel: {pattern: '^[0-9]'}}}  />
                                    <div className="help-block with-errors"></div>
                                    </div>
                                </div>

                            </div>

                            <div className="row m-b-20">
                                <div className="col-md-6">
                                    <label className="color-7 font-weight-normal ">{Labels.Sales_Tax_Number}</label>
                                    <div className="input-group mb-3  form-group">
                                    <AvField errorMessage="This is a required field" name="stn" value="" type="tel" className="form-control" validate={{tel: {pattern: '^[0-9]'}}}  />
                                    <div className="help-block with-errors"></div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label className="color-7 font-weight-normal ">{Utilities.GetResourceValue(GlobalData.restaurants_data.Supermeal_dev.Platform, 'Category', 'Catalogue')}</label>
                                    <div className="input-group mb-3 form-group">
                                        <select className="form-control" onChange={(e) => this.SetCategory(Number(e.target.value))}>
                                        {enterprise.Category === 0 ? <option value="0" selected>A</option> : <option value="0">A</option>}
                                        {enterprise.Category === 1 ? <option value="0" selected>B</option> : <option value="1">B</option>}
                                        {enterprise.Category === 2 ? <option value="0" selected>C</option> : <option value="2">C</option>}
                                        {enterprise.Category === 3 ? <option value="0" selected>D</option> : <option value="3">D</option>}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="row m-b-20">
                                {/* <div className="col-md-6">
                                    <label className="color-7 font-weight-normal ">SMS Mask</label>
                                    <div className="input-group mb-3  form-group">
                                    <AvField name="smsMask" value={enterprise.SmsMaskingName} type="text" className="form-control"/><div className="help-block with-errors"></div>
                                    </div>
                                    <div>
                                        <ul>
                                            <li>Maximum 11 characters using alphabets and numbers only.</li>
                                            <li>No spaces or special characters allowed.</li>
                                        </ul>
                                    </div>
                                </div> */}

                                <div className="col-md-6">
                                    <label className="color-7 font-weight-normal">{Labels.URL}</label>
                                    <div className="input-group mb-3 form-group">
                                    <AvField  name="url" value={enterprise.Url} type="text" className="form-control" />
                                    <div className="help-block with-errors"></div>
                                    </div>
                                </div>
                              {/* {!this.state.IsParent ?  <div className="col-md-6">
                                  <div className="child-th-wrap">
                                        <label className="color-7 font-weight-normal ">Is this a child business?</label>
                                    <div>
                                    <input type="checkbox" id="yes" className="form-checkbox" checked={this.state.IsChild} onChange={(e) => this.handleIsChildCheck(e)} />
                                    <Label htmlFor="yes">Yes</Label>
                                    </div>
                                    </div>
                                    {this.state.IsChild ?
                                        
                                        
                                        <div className="input-group h-set-new">
                                    <Autocomplete 
                                     className="form-control"
                                     getItemValue={(item) => item.Name}
                                    items={this.state.FilterEnterprises}
                                    renderItem={(item, isHighlighted) =>
                                    <div style={{ background: isHighlighted ? 'lightgray' : 'white'}}>
                                    {item.Name}
                                        </div>
                                    }
                                value={this.state.ParentName}
                                onChange={(event, value) => this.SearchEnterprise(event,value)}
                                onSelect={(value) => this.OnItemSelect(value)}
                                selectOnBlur={true}
                                />
                                    </div> 
                               : ""}
                            </div> : ""} */}
                            </div>

                        <div className="">
                
                    { this.state.IsNewEnterprise && <div>

                      <div style={{display:"none"}}>
                      <h4 className="title-sperator">{Labels.Address}</h4>

                       <div className="card-body address-modal " style={{padding:0}}>
                       
                       <div className="form-body m-b-10">
                           <div className="row p-t-20 m-b-20">
                               <div className="col-md-6">
                                   <label className="color-7 font-weight-normal">{Labels.Tag_This_Address}</label>                            
                                   <div className="input-group m-b-10 form-group">                          
                                   <AvField errorMessage="This is a required field" name="txtTagAddrs" type="text" className="form-control" value=""  />
                                   <div className="help-block with-errors"></div>
                                   </div>                      
                               </div>
                               <div className="col-md-6">
                                   <label className="color-7 font-weight-normal">{Labels.Post_Code}</label>                            
                                   <div className={this.state.ShowError ?"input-group form-group  error-shwow-msg":"input-group  form-group "}>
                                        <AvField name="txtPostCode" type="text" className= "form-control" value={this.state.AreaText} onChange={(e) => this.setState({AreaText: e.target.value })} errorMessage="This is a required field" />
                                        <div className="find-btn" onClick={(e) => this.GetAreaBy()}>
                                        {this.state.ShowPostcodeLoader ?
                                       <span className="loader-find-btn">
                                       <Loader type="Oval" color="#fff" height={20} width={20}/>  
                                       </span>
                                        :<span>Find</span>
                                        } 
                                            
                                            </div>
                                                                  
                               
                                        {this.state.ShowError ? <div className="no-display error-code">{Labels.Invalid_Post_Code}</div> : ''}                         
                                        </div>
                               </div>
                           </div>
                           
                           <div className="row m-b-20">
                             
                               <div className="col-md-6">
                                   <span className="color-7 font-weight-normal">{Labels.Building_Number}</span>                            
                                   <div className="input-group mb-3 form-group">
                                   <AvField errorMessage="This is a required field" name="txtAddress" type="text" className="form-control" value=""   />
                                   <div className="help-block with-errors"></div>
                                   </div>
                               </div>
                               <div className="col-md-6">
                                   <span className="color-7 font-weight-normal" for="Latitude">{Labels.Latitude}</span>                            
                                   <div className="input-group mb-3  form-group">
                                   <AvField errorMessage="This is a required field" name="txtLat" type="number" className="form-control"  value="" />
                                   <div className="help-block with-errors"></div>
                                   </div>
                               </div>
                           </div>
                           <div className="row m-b-20">
                          
                               <div className="col-md-6">
                                   <span className="color-7 font-weight-normal" for="Longitude">{Labels.Longitude}</span>
                                   <div className="input-group mb-3 form-group">
                                   <AvField errorMessage="This is a required field" name="txtLong" type="number" className="form-control"  value={this.state.Longitude}  />
                                   <div className="help-block with-errors"></div>
                                   </div>
                               </div> 
                           </div>
                       </div>                 
                   
                       </div>
                       </div>


            
{/* login info*/}

 <h4 className="title-sperator">{Labels.Admin_User_Business}</h4>


<div className="formPadding" >

<div className="row p-t-20 ">
                  <div className="col-md-6">
                  
                      <label id="firstName" className="color-7 font-weight-normal">{Labels.First_Name} <BsAsterisk className='st-show'></BsAsterisk>
                      </label>
                      <div className="input-group mb-3 form-group">
                      <AvField errorMessage="This is a required field" name="frstName" type="text" className="form-control"
                      validate={{
                        required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                        }}
                      
                      />
                 </div>
                  </div>
                  <div className="col-md-6">
                    
                      <label id="lastName" className="color-7 font-weight-normal">{Labels.Last_Name} <BsAsterisk className='st-show'></BsAsterisk>
                      </label>
                      <div className="input-group mb-3 form-group">
                      <AvField errorMessage="This is a required field" name="lastName" type="text" className="form-control"
                      
                      validate={{
                        required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                        }}
                      
                      />
               </div>
                  </div>
</div>


           
<div className="row">
<div className="col-md-6">
  
    <label id="loginEmail" className="color-7 font-weight-normal">{Labels.Email} <BsAsterisk className='st-show'></BsAsterisk></label>
    <div className="input-group mb-3 form-group">
   <AvField  name="lognEmail" value={this.state.lognEmail} errorMessage='please provide valid email' type="email" className="form-control"
    validate={{
      required: { value: this.props.isRequired, errorMessage: 'This is a required field' }
      
      }}
    
    />
  </div>
</div>
<div className="col-md-6">
 
    <label id="loginUserName" className="color-7 font-weight-normal">{Labels.Username} <BsAsterisk className='st-show'></BsAsterisk></label>
    <div className="input-group mb-3 form-group">
  <AvField ref="txtlogin"  name="loginusrName" onBlur={(e) => this.UserAlreadyRegistered(e.target.value)}  type="text" className={this.state.validateUserName ? "form-control" : "form-control is-touched is-pristine av-invalid is-invalid form-control"} validate={{ required: { value: this.props.isRequired, errorMessage: 'This is a required field' },}}/>
  {this.state.validateUserName ? <div></div> : <div className="invalid-feedback" style={{ display: 'block' }}>This Username already taken.</div>}
   
  </div>
</div>
</div>

<div className="row">

<div className="col-md-6">

<label id="loginPassword" className="color-7 font-weight-normal">{Labels.Password} <BsAsterisk className='st-show'></BsAsterisk></label>
<div className="input-group mb-3 form-group">
<AvField  name="passwrd" type="password" className="form-control"
 validate={{
  required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
  myValidation: passwordTextValidation,
  minLength: {value: 6, errorMessage: 'Your password must be more than 6 characters'},
  }} 

/>
</div>
</div>
<div className="col-md-6">

<label id="loginPassword" className="color-7 font-weight-normal">{Labels.Confirm_Password} <BsAsterisk className='st-show'></BsAsterisk></label>
<div className="input-group mb-3 form-group">
<AvField errorMessage="This is a required field" name="cnfrmPswrd" type="password" 
validate={{
  required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
  myValidation: passwordTextValidation,
  match:{value:'passwrd',errorMessage: 'Confirm Password does not match'},
  minLength: {value: 6, errorMessage: 'Your password must be more than 6 characters'},
  }} 
className="form-control" required  />
</div>
</div>
</div>

   



</div>



{/* end login info */}




                    </div>
                    }  
                            {/* <h4 className="title-sperator">Cities</h4>
                            <AvGroup name="chkCities" required>
                            {this.LoadCities(this.state.Cities)}
                            {dvCityValidation}
                            </AvGroup> */}
                            {
                                this.state.EnterpriseTypeId != 5 &&
                                <div>
                                        <h4 className="title-sperator">{Labels.Other_Settings}</h4>
                                        <div className="formPadding row col-xs-12 setting-cus-field m-t-20 m-b-20 flex-column flex-md-row">
                                            {/* <div className="col-xs-12 col-sm-3 m-b-10 form-group checkSpanDV">

                                                <AvInput type="checkbox" name="chkIsClaimed" value={enterprise.IsOwnRestaurant} onClick={(event)=>this.handlerCheckBox(event,'IOR')} className="form-checkbox" />
                                                <Label check for="chkIsClaimed">Is {Utilities.GetResourceValue(GlobalData.restaurants_data.Supermeal_dev.Platform, 'Restaurant', 'Shop')} Claimed</Label>

                                            </div> */}
                                            <div className="col-xs-12 col-sm-3 m-b-10 form-group checkSpanDV "style={{display:"none"}}>

                                                <AvInput type="checkbox" name="chkAllowNewOrderSms" value={enterprise.IsSmsAlertsOffered} onClick={(event)=>this.handlerCheckBox(event,'ISA')} className="form-checkbox" />
                                                <Label check for="chkAllowNewOrderSms">Allow new order sms</Label>

                                            </div>
                                            <div className="mr-3 m-b-10 form-group checkSpanDV px-3">

                                                <AvInput type="checkbox" name="chkOnlineOrder" value={enterprise.TakeOnlineOrder} onClick={(event)=>this.handlerCheckBox(event,'TO')} className="form-checkbox" />
                                                <Label check for="chkOnlineOrder">{Labels.Take_Online_Order}</Label>

                                            </div>
                                            <div className="mr-3 m-b-10 form-group checkSpanDV px-3" style={{height:50}}>  

                                                <AvInput type="checkbox" name="chkApplyGst" value={enterprise.ApplyGST} onClick={(event)=>this.handlerCheckBox(event,'AG')} className="form-checkbox" />
                                                <Label check for="chkApplyGst">Apply {this.state.selectedCountry.TaxLabel}</Label>

                                            </div>
                                            {enterprise.ApplyGST && 

                                                <div className="mr-3 m-b-10 form-group checkSpanDV px-3">
                                                <AvField name="taxPercentage" value={this.state.taxPercentage} onChange={(e) => this.handleSetGst(e)}  type="phonenumber" className="form-control"
                                                                                validate={{
                                                                                    required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                                                                                    myValidation: phoneNumValidation,
                                                                                    }} 
                                                />
                                                <div className="help-block with-errors"></div>
                                                </div>
                                            }
                                                <div className="mr-3 px-3 m-b-10 form-group checkSpanDV">

                                                    <AvInput type="checkbox" name="chkAllowActivitySms" value={enterprise.RestaurantSettings.ShowMessageOfOtherCharges} onClick={(event)=>this.handlerCheckBox(event,'SM')} className="form-checkbox flex-shrink-0" />
                                                    <Label check for="chkAllowActivitySms">{Messages.Display_Message_Checkout}</Label>

                                                </div>

                                            <div className="col-xs-12 col-sm-3 m-b-10 form-group checkSpanDV" style={{display:"none"}}>

                                                <AvInput type="checkbox" name="chkAllowActivitySms" value={enterprise.RestaurantSettings.AllowActivitySMS} onClick={(event)=>this.handlerCheckBox(event,'AS')} className="form-checkbox" />
                                                <Label check for="chkAllowActivitySms">{Labels.Allow_Activity_Sms}</Label>

                                            </div>

                                            <div className="col-xs-12 col-sm-3 m-b-10 form-group checkSpanDV" style={{display:"none"}}>
                                            
                                                <AvInput type="checkbox" name="chkSupermealProfile" value={enterprise.RestaurantSettings.IsSupermealProfileAllowed} onClick={(event)=>this.handlerCheckBox(event,'ISP')} className="form-checkbox" />
                                                <Label check for="chkSupermealProfile">{Labels.Allow_Superbutler_Profile}</Label>

                                            </div>
                                            <div className="col-xs-12 col-sm-3 m-b-10 form-group checkSpanDV" style={{display:"none"}}>

                                                <AvInput type="checkbox" name="chkIsSponsored" value={enterprise.RestaurantSettings.IsSponsored} onClick={(event)=>this.handlerCheckBox(event,'IS')} className="form-checkbox" />
                                                <Label check for="chkIsSponsored">{Labels.Is_Sponsored}</Label>

                                            </div>
                                        </div>
                                </div>
                            }

                            <h4 style={{display:"none"}} className="title-sperator">{Labels.Meta_Information}</h4>
                            <div className="row m-t-20 formPadding" style={{display:"none"}}>
                                <div className=" col-sx-12 col-sm-12">
                                    <div className="form-group m-b-0">
                                        <label className="color-7 font-weight-normal ">{Labels.Meta_Title}</label>
                                        {/* <input type="text" className="form-control form-control-right flexBasisValidation borderRightRadius" required data-error="This field is required" /> */}
                                        <AvField errorMessage="This is a required field" name="txtMetaTitle" value={enterprise.MetaTitle} type="text" className="form-control form-control-right flexBasisValidation borderRightRadius" /><div className="help-block with-errors"></div>
                                        </div>
                                        <div className="help-block with-errors"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="row m-t-20 formPadding" style={{display:"none"}}>
                                <div className=" col-sx-12 col-sm-12">
                                    <div className="form-group m-b-0">
                                        <label className="color-7 font-weight-normal ">{Labels.Meta_Description}</label>
                                        {/* <textarea name="metaDesc" rows="3" id="metaDesc" className="form-control">
                                        </textarea> */}

                                         <AvField type="textarea" name="metaDesc" rows="3" value={enterprise.MetaDescription}  className="form-control">
                                        </AvField>
                                    </div>
                                </div>
                            </div>
                            <div className="row m-t-20 formPadding" style={{display:"none"}}>
                                <div className=" col-sx-12 col-sm-12">
                                    <div className="form-group m-b-0">
                                        <label className="color-7 font-weight-normal ">{Labels.Meta_Keywords}</label>
                                        {/* <textarea name="metaDesc" rows="3" id="metaKey" className="form-control">
                                        </textarea> */}

                                         <AvField type="textarea" name="metaKeyword" rows="3" value={enterprise.MetaKeywords}  className="form-control">
                                        </AvField>
                                    </div>
                                </div>
                            </div>
                            <div className="row m-t-20 formPadding" style={{display:"none"}}>
                                <div className=" col-sx-12 col-sm-12">
                                    <div className="form-group m-b-0">
                                        <label className="color-7 font-weight-normal ">{Labels.Other_Tags_CSV}</label>
                                        {/* <textarea name="metaDesc" rows="3" id="csv" className="form-control">
                                        </textarea> */}

                                         <AvField type="textarea" name="otherTag" rows="3" value={enterprise.OtherTagCsv}  className="form-control">
                                        </AvField>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bottomBtnsDiv" style={{ marginTop: 20, display:'flex', justifyContent:'flex-start', marginLeft:'20px' }}>

                             <Link style={{outline:"none"}} to="/businesses"> <Button type="button" color="secondary" style={{ marginRight: 10 }}>{Labels.Cancel}</Button> </Link>

                            <Button color="primary" style={{width:'76px'}} >
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

export default GeneralSetup;
