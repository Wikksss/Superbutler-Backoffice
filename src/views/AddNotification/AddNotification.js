import React, { Component, Fragment } from 'react';
//import Avatar from 'react-avatar';
//import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';
import { Link } from 'react-router-dom'
import { FormGroup, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader,Table } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import * as Utilities from '../../helpers/Utilities';
import Loader from 'react-loader-spinner';
import Dropdown from 'react-bootstrap/Dropdown';
import * as NotificationService from '../../service/Notification';
import * as DeviceService from '../../service/Device';
import * as AreaService from '../../service/Area';
import * as EnterpriseService from '../../service/Enterprise';
import * as CuisinesService from '../../service/Cuisines';
import * as CategoryService from '../../service/Category';
import * as ProductService from '../../service/Product';
import * as VoucherService from '../../service/voucher';
import 'rc-color-picker/assets/index.css';
//import ColorPicker from 'rc-color-picker';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
//import GlobalData from '../../helpers/GlobalData';
import 'react-dropzone-uploader/dist/styles.css'
//import Dropzone from 'react-dropzone-uploader'
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import { ReactMultiEmail, isEmail } from 'react-multi-email';
import 'react-multi-email/style.css';
import Config from '../../helpers/Config';
import Autocomplete from 'react-autocomplete';
import { isEmptyObject } from 'jquery';
const moment = require('moment-timezone');
const $ = require('jquery');

class AddNotification extends Component {

  //#region Constructor
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      CampaignList: [],
      ShowLoader: true,
      CampaignTheme: [],
      CampaignContentJson: [],
      WebContent: {},
      AppContent: {},
      CampaignId: 0,
      startDate: new Date(),
      endDate: new Date(),
      pictures: [],
      showModal: false,
      groupName: "",
      oldPhotoName: "",
      modalHeader: "",
      PhotoName: null,
      SelectedTeaser: 0,
      OldLogoPhotoName: "",
      OldBackgroundPhotoName: "",
      OldAppBackgroundPhotoName: "",
      OldFoodPhotoName: "",
      OldMainBannerPhotoName: "",
      OldSubBannerPhotoName: "",
      OldAppSubBannerPhotoName: "",
      ImageExtension: '.png',
      TempImg: "",
      image: null,
      FileTypeErrorMessage: "",
      background: '#fff',
      emojiPickerState: false,
      emojiPickerTrayState:false,
      emojiPickerTitleState:false,
      emojiPickerMessageState:false,
      message: '',
      messageTray: '',
      messageTitle: '',
      messagePicker: '',
      selectedNotificationType:"1",
      ByLocation: false,
      ByEmail:false,
      EmailsCsv : "0",
      Platform:"",
      AreaIdCsv: "0",
      TotalDevices: 0,
      DeviceCountAndroid:0,
      DeviceCountIOS: 0,
      Emails: [],
      OldEmailCsv: "0",
      AllDevices: "",
      IsIOSChecked: true,
      IsAndroidChecked: true,
      ScheduleDate: '',
      selecteddeliverydate: "0",
      CheckAllCities: false,
      AllCities: [],
      SelectedConsumerArea: [],
      AreaModal: false,
      IsSearchingItem: false,
      SelectedCity: [],
      SelectedCityName: "",
      SelectedCityId: -1,
      filterSelectedCity: [],
      AreaSelectionError: false,
      FilteredCuisines : [],
      Cuisines: [],
      CuisinesName: "",
      FilterEnterprises: [],
      AllEnterprises: [],
      SelectedEnterpriseId: "",
      SelectedEnterprisePage: "",
      SelectedVoucherId: "",
      SelectedCategoryId: "",
      SelectedItemId: "",
      SelectedEnterpriseName: "",
      SelectedEnterprisePhotoName: "",
      Categories: [],
      Products : [],
      Vouchers: [],
      IsEmptyRestaurant: false,
      FromInvalid: false,
      NotificationDetail: {},
      IsEdit: false,
      NotificationId: 0,
      PageTitle: 'New Notification',
      HasDateTimeError: false,
      SearchVoucher: '',
      FilterVouchers: [],
      SelectedVoucher: {}
      
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.SearchAreas = this.SearchAreas.bind(this);
    this.HandelAreaCheckbox = this.HandelAreaCheckbox.bind(this);
    this.SendNotification = this.SendNotification.bind(this);
    this.GetCuisines = this.GetCuisines.bind(this);
  
  }

   //#region  api calling
   
   GetEnterprises = async () => {

    let data = await EnterpriseService.GetAllOnline();
    this.setState({AllEnterprises: data});

    if(Number(this.state.SelectedEnterpriseId) > 0 && !Utilities.stringIsEmpty(this.state.SelectedEnterpriseId) && this.state.selectedNotificationType === 5){
    
      var notificationDetail = this.state.NotificationDetail;
      var notificationJson = JSON.parse(notificationDetail.NotificationJson);

      let filterdata = data.filter((enterprise) => {
      return enterprise.Id === this.state.SelectedEnterpriseId
    });

    this.setState({
      SelectedEnterpriseName: filterdata.length > 0 ?  filterdata[0].Name : '',
      SelectedEnterprisePage: filterdata.length > 0 ?  filterdata[0].LogoName : '',
      SelectedEnterprisePhotoName: filterdata.length > 0 ?  filterdata[0].PhotoName : '',
    });
      this.GetCategories(this.state.SelectedEnterpriseId);
      this.GetProducts(notificationJson.CategoryId);
      this.GetVouchers(notificationJson.RestaurantId)
    }

  }
   
   GetNotificationDevices = async (areaCsv,emails) => {
    if((emails != "0" && emails.length > 0) || (areaCsv != "0" && areaCsv !="")){
      let emailCsv = this.CreateEmailCsv(emails);
      let data = await DeviceService.GetTotalDevicesCount(areaCsv, emailCsv);
      this.setState({AllDevices: data, EmailsCsv:emailCsv, AreaIdCsv: Utilities.stringIsEmpty(areaCsv) ? "0" : areaCsv});
      this.SetDeviceCount(data);
    } else{
      this.setState({DeviceCountIOS: 0, DeviceCountAndroid: 0, TotalDevices: 0, Platform: "", AllDevices : "", EmailsCsv:""});
    }
    

  }
  
  GetNotificationDetail = async (id) => {

    let data = await NotificationService.GetDetailBy(id);

    if(Object.keys(data).length > 0 ) {
      var notificationType = this.GetNotificationTypeId(data.ActivityType);
      var notificationJson = JSON.parse(data.NotificationJson);

      let isIOSChecked = true;
      let isAndroidChecked = true;

      if(!Utilities.stringIsEmpty(data.Platform)){
        isIOSChecked = data.Platform.toLowerCase() === "ios";
        isAndroidChecked = data.Platform.toLowerCase() === "android";
      }

      var pathName = this.props.location.pathname.toLowerCase();
    
    this.setState({NotificationDetail: data,
      PageTitle: pathName.indexOf("edit-notification") !== -1 ? `Edit '${notificationJson.Title}'` : 'New Notification',
      // ScheduleDate: deliveryDate,
      // selecteddeliverydate: Utilities.stringIsEmpty(deliveryDate) ? "0" : "1",
      IsIOSChecked:isIOSChecked,
      IsAndroidChecked: isAndroidChecked,
      selectedNotificationType : notificationType,
      message: notificationJson.Title,
      messageTray: notificationJson.Message,
      messageTitle: notificationJson.PopUpTitle,
      messagePicker: notificationJson.PopUpMessage,
      SelectedEnterpriseId: notificationJson.RestaurantId,
      SelectedCategoryId: notificationJson.CategoryId, 
      SelectedItemId: notificationJson.ItemMetaId,
      SelectedVoucherId: notificationJson.VoucherCode,
      CuisinesName: notificationJson.Filters,
      Platform: data.Platform,
      AreaIdCsv: data.AreaIdCsv,
      EmailsCsv: data.EmailsCsv,
      ByEmail: !Utilities.stringIsEmpty(data.EmailsCsv),
      ByLocation: Utilities.stringIsEmpty(data.EmailsCsv),
      Emails: !Utilities.stringIsEmpty(data.EmailsCsv) ? data.EmailsCsv.split(',') :'',
    }, () => {

        this.GetEnterprises();
        this.GetConsmerArea();
        this.GetCuisines();        
        if(!Utilities.stringIsEmpty(data.EmailsCsv)){
          this.GetNotificationDevices("0",this.state.Emails)
        }
        this.setState({ ShowLoader: false });

    });
  }
}

  GetConsmerArea = async () => {

    let cities = []
		let data = await AreaService.GetConsumerArea();
    let cityCsv= '';
    
    let selectedCitiesCSV = '';
    let selectedAreaCSV = '';
    let selectedAreas = this.state.AreaIdCsv

    if(!Utilities.stringIsEmpty(selectedAreas) && selectedAreas !== "0") {
    let selectedCitiesObj = selectedAreas.split(Config.Setting.csvSeperator)
      selectedCitiesObj.forEach((city) => {
      selectedCitiesCSV += city.split('|')[0] + ',';
      selectedAreaCSV += city.split('|')[1] + ',';
    });
  }
    for (var i=0; i < data.length; i++) {

      var cityNameWithoutSpaces =  data[i].City.replace(/ /g,'-');
      if (!Utilities.isExistInCsv(cityNameWithoutSpaces, cityCsv, Config.Setting.csvSeperator)) // Adds city html only once
      {
        var areas = [];
        var city = {};
        city.Id = i;
        city.IsChecked = Utilities.isExistInCsv(data[i].City, selectedCitiesCSV, ',');
        city.Name= data[i].City;
        city.SelectedAreaCsv="";
        var index = 0;

        data.forEach((city) => {
          
          if(city.City == data[i].City) {
            var isChecked = false; 

            if(Utilities.isExistInCsv(city.Area,selectedAreaCSV, ',')){
              isChecked = true;
            }

            let area = {}
            area.Id = index;
            area.Name = city.Area;
            area.IsChecked= isChecked ;//Utilities.isExistInCsv(city.Area,selectedAreaCSV, ',') ? true : false;
            areas.push(area);
            index++;
          }
      });
      city.Areas = areas;
      cities.push(city);
      cityCsv += cityNameWithoutSpaces + Config.Setting.csvSeperator;
    
    }

     
  }
  this.setState({ConsumerAreas: data, AllCities: cities}, () => {
    
    if(!Utilities.stringIsEmpty(selectedAreas) && selectedAreas !== "0") {
    this.CreateAreaIdCSV();
    }
  });

  
	}

  SetDeviceCount(devices) {
    let androidDevices = 0
    let iosDevices = 0

    if (devices !== '') {
      
      let arry = devices.split(',');
     
      for (var i = 0; i < arry.length; i++) {

          if (arry[i].split('~')[0] === 'ANDROID') {
            androidDevices = arry[i].split('~')[1];
          }
          else if (arry[i].split('~')[0] === 'IOS') {
            iosDevices = arry[i].split('~')[1];
          }
      }
        
  }
  
  let platform = this.state.IsIOSChecked && this.state.IsAndroidChecked ? ""  : (this.state.IsIOSChecked ? "IOS" : (this.state.IsAndroidChecked ? "ANDROID" : ""))
  let totalDevices = (this.state.IsIOSChecked ? Number(iosDevices) : 0) + (this.state.IsAndroidChecked ? Number(androidDevices) : 0);
  this.setState({DeviceCountIOS: iosDevices, DeviceCountAndroid: androidDevices, TotalDevices: totalDevices, Platform: platform});

  if(this.state.DeviceError && totalDevices > 0) {
    this.setState({DeviceError: false, FromInvalid : false})
  }

  }

  SendNotificationApi = async (notification) => {
		
		let result = await NotificationService.SaveNotification(notification);
    this.setState({IsSave:false,FromInvalid: false});
		if (result) {
     
      this.props.history.push("/app-notification");
		}
    else if(result == '0') {
			Utilities.notify("Save failed.", "e");
		} else {
      Utilities.notify(`Save failed, ${result}`, "e");
  }
}
  
  UpdateNotificationApi = async (notification) => {
		
		let result = await NotificationService.UpdateNotification(notification);
    this.setState({IsSave:false,FromInvalid: false});
		if (result == '1') {
     
      this.props.history.push("/app-notification");
		}
		else if(result == '0') {
			Utilities.notify("Update failed.", "e");
		} else {
      Utilities.notify(`Update failed, ${result}`, "e");

    }
		
  }
  
  GetCuisines = async () => {
    var response = await CuisinesService.getAll()
    let cuisines = []
    if(response.length > 0) {
    
    for (let index = 0; index < response.length; index++) {
      
            if (response[index].Type == 'Cuisine') {
                cuisines.push(response[index])
            }
          }
        }

      if(this.state.CuisinesName) {

        let cuisine = cuisines.filter((cuisine) => {
          return cuisine.Name == this.state.CuisinesName
      });
  
      this.setState({SelectedCuisine: cuisine[0], CuisinesName :cuisine[0].Name, SearchCuisineText: cuisine[0].Name})  
    }

    this.setState({Cuisines: cuisines });

}

GetVouchers = async (enterpriseId) => {

  var response = await VoucherService.GetAllEnterpriseOffers(enterpriseId)
  this.setState({Vouchers: response });
}



GetCategories = async (enterpriseId) => {

  var data = await CategoryService.GetAllBy(enterpriseId);

  data.sort((x, y) => ((x.SortOrder === y.SortOrder) ? 0 : ((x.SortOrder > y.SortOrder) ? 1 : -1)))

  var categoryList = data;

  let cate = []

  for (var i = 0; i < categoryList.length; i++) {

    if (categoryList[i].IsPublished) {
      cate.push({ "id": categoryList[i].Id, "name": categoryList[i].Name, "SortOrder": categoryList[i].SortOrder });
    }
  }

  cate.sort((x, y) => ((x.SortOrder === y.SortOrder) ? 0 : ((x.SortOrder > y.SortOrder) ? 1 : -1)))
  this.setState({ Categories: cate});

}


GetProducts = async (categoryId) => {

  var data = await ProductService.GetWithDetailsBy(this.state.SelectedEnterpriseId,categoryId);
  data.sort((x, y) => ((x.IsPublished  === y.IsPublished) ? y.SortOrder - x.SortOrder : (!y.IsPublished ? 1 : -1)))
  data.reverse();
  var productList = data;
  
  
  let prod = [];
  let productArr = [];

    for (var i = 0; i < productList.length; i++) {

      if (productList[i].IsPublished && Utilities.GetObjectArrId(productList[i].MenuItemMetaId,productArr) === "-1") {
        prod.push({ "id": productList[i].MenuItemMetaId, "name": productList[i].MenuMetaName , "SortOrder": productList[i].SortOrder,  });
        productArr.push({ "Id": productList[i].MenuItemMetaId});
      }
    }

    prod.sort((x, y) => ((x.SortOrder === y.SortOrder) ? 0 : ((x.SortOrder > y.SortOrder) ? 1 : -1)))

    this.setState({ Products: prod});

}

  //#endregion

 CreateEmailCsv(emailArry) {
  let emailCsv = ''
  if(emailArry !== undefined) {

    for (var i = 0; i < emailArry.length; i++) {
      emailCsv += emailArry[i] + ',';
    }
  }

  return Utilities.FormatCsv(emailCsv, ',');
 
 }

  SendNotification = (event, values) => {
  
    var isValid = true;
    if(this.state.IsSave) return;
    this.setState({IsSave:true,DeviceError: false, IsEmptyRestaurant: false, FromInvalid: false});
    
      if(this.state.TotalDevices === 0) {
        this.setState({IsSave:false,DeviceError: true,FromInvalid: true});
        isValid = false;
      }

      if(this.state.HasDateTimeError){
        this.setState({IsSave:false,FromInvalid: true});
        isValid = false;
      }

      if(Number(this.state.selectedNotificationType) === 5 && (this.state.SelectedEnterpriseId === 0 || Utilities.stringIsEmpty(this.state.SelectedEnterpriseId))){
        this.setState({IsSave:false,IsEmptyRestaurant: true, FromInvalid: true});
        isValid = false; 
      }


      if((Number(this.state.selectedNotificationType) === 3 || Number(this.state.selectedNotificationType) === 4)  && (isEmptyObject(this.state.SelectedVoucher) || this.state.SearchVoucher === '' || Utilities.stringIsEmpty(this.state.SearchVoucher))){
        this.setState({IsSave:false, FromInvalid: true});
        isValid = false; 
      }


      if(!isValid){
        return;        
      }


          let androidNotification = {};
          let appNotification = {};
          appNotification.Title = values.txtTrayTitle;
          appNotification.Message = values.txtTrayMessage;
          appNotification.SoundCaf = 'sound.caf';
          appNotification.Activity = this.GetNotificationType(this.state.selectedNotificationType);
          appNotification.NotificationActivityMessageTypes = "Notification";
          appNotification.PopUpMessage = values.txtPopupMsg;
          appNotification.PopUpTitle = values.txtPopupTitle;
          appNotification.ContentUrl = '';
          appNotification.RestaurantId = Number(this.state.selectedNotificationType) === 5 ? this.state.SelectedEnterpriseId : '';
          appNotification.PageName =  Number(this.state.selectedNotificationType) === 5 ? this.state.SelectedEnterprisePage : '';
          appNotification.CategoryId =  Number(this.state.selectedNotificationType) === 5 ? this.state.SelectedCategoryId : '';
          appNotification.ItemMetaId =  Number(this.state.selectedNotificationType) === 5 ? this.state.SelectedItemId : '';
          appNotification.VoucherCode =  Number(this.state.selectedNotificationType) === 5 ? this.state.SelectedVoucherId : '';
          appNotification.RestaurantPhotoName =  Number(this.state.selectedNotificationType) === 5 ? this.state.SelectedEnterprisePhotoName : '';
          appNotification.EnterpriseArea = '';
          appNotification.Filters = Number(this.state.selectedNotificationType) === 2 ? this.state.CuisinesName : '';
          appNotification.Tags = '';
         
          if(Number(this.state.selectedNotificationType) >=3 && Number(this.state.selectedNotificationType) <= 4) {
            
            let voucher = this.state.SelectedVoucher;

            appNotification.VoucherCode = voucher.Code;
            appNotification.VoucherId = voucher.Id
            appNotification.VoucherPin = voucher.PinCode
            appNotification.Expiry = moment(voucher.ExpiryDate,Config.Setting.dateFormat).format('Do MMM YYYY')

         }

          var notificationJson = JSON.stringify(appNotification);
          
          androidNotification.Id = this.state.NotificationId;
          androidNotification.AreaIdCsv = this.state.ByLocation ?  this.state.AreaIdCsv : "";
          androidNotification.ActivityType = this.GetNotificationType(this.state.selectedNotificationType);
          androidNotification.DateToDeliver = this.state.ScheduleDate === "" ?  "" :   moment(this.state.ScheduleDate,"DD/MM/YYYY HH:mm").format("DD/MM/YYYY HH:mm");
          androidNotification.NotificationJson = notificationJson;
          androidNotification.EmailsCsv = this.state.ByEmail ?  this.state.EmailsCsv : "";
          androidNotification.Platform = this.state.Platform;
          androidNotification.TotalDevices = this.state.TotalDevices;
          

          if(this.state.IsEdit){
            this.UpdateNotificationApi(androidNotification);
          }
          
          this.SendNotificationApi(androidNotification);
  
  }

  SetTowns(e){

    let towns = this.state.ConsumerAreas;
    let townCsv = '';
    let cityName = e.target.value;

    var townAreas = towns.filter(town => {

      var TownNameWithoutSpaces =  town.Area.replace(/ /g,'-');
      if (Utilities.isExistInCsv(TownNameWithoutSpaces, townCsv, Config.Setting.csvSeperator)) // Adds city html only once
      {
        return false;
        
      } 
      townCsv += TownNameWithoutSpaces + Config.Setting.csvSeperator;
      return cityName === town.City;
    });

    this.setState({Towns: townAreas});

  }

SearchAreas(e){
  
  let searchText = e.target.value;
  let filteredData = []
  var city = JSON.parse(JSON.stringify(this.state.SelectedCity));
  var filtercity = JSON.parse(JSON.stringify(this.state.filterSelectedCity)); //this.state.;
  this.setState({SearchAreaText : searchText});
   if(searchText.toString().trim() === ''){
    this.setState({filterSelectedCity: city, IsSearchingItem: false});
    return;
   }
  
   filteredData = city.Areas.filter((g) => {
    
    let arr = searchText.toUpperCase().trim();
    let isExists = false;
    
      if (g.Name.toUpperCase().indexOf(arr) !== -1) {
        isExists = true;
    }
    
    return isExists
  })

  filtercity.Areas = filteredData;

  this.setState({ filterSelectedCity: filtercity, IsSearchingItem: true});
}

HandelAllAreaCheckbox(checked){

  var city = this.state.SelectedCity

  if(checked){
    city.Areas.forEach(area => {
        area.IsChecked = true
    });
    city.IsAllChecked = checked;
  }

  let allCitites = this.state.AllCities;
  let index = Utilities.GetObjectArrId(city.Id, allCitites)
  allCitites[index] = city;
  this.setState({AllCities : allCitites});
  
this.CreateAreaIdCSV();
}

HandelAreaCheckbox(e,areaId){

  this.setState({AreaSelectionError: false});
let selectedCity = this.state.SelectedCity; //JSON.parse(JSON.stringify(this.state.SelectedCity));// 
let index = Utilities.GetObjectArrId(areaId, selectedCity.Areas)
let isChecked = e.target.checked;
let areas = selectedCity.Areas.filter((area) => {

  return area.IsChecked

})



selectedCity.Areas[index].IsChecked = isChecked;

if(areas.length < 2 && !isChecked) {
  selectedCity.Areas[index].IsChecked = !isChecked;
  this.setState({AreaSelectionError: true})
}

let allCitites = this.state.AllCities;
index = Utilities.GetObjectArrId(selectedCity.Id, allCitites)

allCitites[index] = selectedCity;

this.setState({AllCities : allCitites});
this.setState({filterSelectedCity : selectedCity});

this.CreateAreaIdCSV();
}

ClearSearchText (){

  let city = this.state.SelectedCity

this.setState({  
  IsSearchingItem: false,
  SelectedItems: [],
  filterSelectedCity : city,
})


}

handleSelectVoucherOptions(e){
  let value = e.target.value;
  this.setState({SelectedVoucherId: value});
}

handleSelectProductOptions(e) {
    
  
  let value = e.target.value;
  this.setState({SelectedItemId: value});
}


handleSelectCategoryOptions(e) {
    
  let value = e.target.value;
  this.setState({SelectedCategoryId: value});
  this.GetProducts(value);

}

RenderVoucher(voucher){
  return <option  key={voucher.Id} value={voucher.Id}>{voucher.Title}</option>
  }

LoadVoucher(){

  var voucher = this.state.Vouchers
  var htmlVoucher = [];
  for (var i=0; i < voucher.length; i++) {
 
    htmlVoucher.push(this.RenderVoucher(voucher[i]));
 
 }
 
 return(
               
   <select className="form-control custom-select " name="ddlVoucher" id="ddlVoucher" onChange={(e) => this.handleSelectVoucherOptions(e)} value={this.state.SelectedVoucherId}>
     <option value={0}>Select Voucher</option>
     {htmlVoucher.map((item) => item)}
     </select>
  )
 
 }


RenderProducts(product){
  return <option key={product.id} value={product.id}>{product.name}</option>
  }

LoadProducts(){

 var product = this.state.Products
 var htmlProduct = [];
 for (var i=0; i < product.length; i++) {

  htmlProduct.push(this.RenderProducts(product[i]));

}

return(
              
  <select className="form-control custom-select " name="ddlProduct" id="ddlProduct" onChange={(e) => this.handleSelectProductOptions(e)} value={this.state.SelectedItemId}>
    <option value={0}>Select Item</option>
    {htmlProduct.map((item) => item)}
    </select>
 )

}


RenderCategories(category){
  return <option key={category.id} value={category.id}>{category.name}</option>
  }

LoadCategories(){

 var categories = this.state.Categories
 var htmlCategory = [];
 for (var i=0; i < categories.length; i++) {

  htmlCategory.push(this.RenderCategories(categories[i]));

}

return(
              
  <select className="form-control custom-select " name="ddlCategory" id="ddlCategory" onChange={(e) => this.handleSelectCategoryOptions(e)} value={this.state.SelectedCategoryId} >
    <option value={0}>Select Category</option>
    {htmlCategory.map((item) => item)}
    </select>

 )

}

AreaList() {
  this.setState({
    showAreaModal: !this.state.showAreaModal,
    SearchAreaText: "",
    IsSearchingItem: false,
    SelectedItems: [],
    AreaSelectionError: false,
  })
}
AreaListHide() {
  this.setState({
    showAreaModal: !this.state.showAreaModal,

  })
}

RenderAreaList(area){

  return(
    <tr key={area.Name}>
                
                  <td> 
                      <div className="row-a">
                        {/* <AvField type="checkbox" className="form-checkbox" name={area.Name} value={area.IsChecked} checked={area.IsChecked} onClick={(e) => this.HandelAreaCheckbox(e,area.Id)}/> {Utilities.SpecialCharacterDecode(area.Name)} */}
                     
                       <div className=" checkDiv">
                     <input type="checkbox" className="form-checkbox" id={area.Name} name={area.Name} value={area.IsChecked} checked={area.IsChecked} onClick={(e) => this.HandelAreaCheckbox(e,area.Id)}/>
                     <label className="settingsLabel" htmlFor={area.Name} >{Utilities.SpecialCharacterDecode(area.Name)}</label>
                </div>
                      </div>
                  </td>
                </tr>
  )
  
  }

LoadAreaList(){

  var htmlAreas = [];
 var cities = this.state.AllCities;
 let index = Utilities.GetObjectArrId(this.state.SelectedCityId,cities)
 if(index == "-1"){
   return <div>No result matched</div>;
 }

 let areas = this.state.filterSelectedCity.Areas
 if(Object.keys(this.state.filterSelectedCity).length === 0){
  return <div>No result matched</div>;
}

areas = JSON.parse(JSON.stringify(this.state.filterSelectedCity.Areas))

 for (var i=0; i < areas.length; i++) {

  htmlAreas.push(this.RenderAreaList(areas[i]));

}

return(

  <tbody>
     <tr key={'All'}>
                
                <td> 
                    <div className="row-a">
                      {/* <AvField type="checkbox" className="form-checkbox" name={area.Name} value={area.IsChecked} checked={area.IsChecked} onClick={(e) => this.HandelAreaCheckbox(e,area.Id)}/> {Utilities.SpecialCharacterDecode(area.Name)} */}
                   
                     <div className=" checkDiv">
                   <input type="checkbox" className="form-checkbox" id={"All"} name={"All"} value={this.state.SelectedCity.IsAllChecked} checked={this.state.SelectedCity.IsAllChecked} onClick={(e) => this.HandelAllAreaCheckbox(e.target.checked)}/>
                   <label className="settingsLabel" htmlFor={"All"} >{"Select All"}</label>
              </div>
                    </div>
                </td>
              </tr>
              <tr key={'1'}>
                <td> 
                    <div className="row-a">
                     <div className=" checkDiv">
              </div>
                    </div>
                </td>
              </tr>
    {htmlAreas.map((item) => item)}
    
    </tbody>

 )

}

CancelItemSearch(){
    
  this.setState({ 
  
    filterSelectedCity: this.state.SelectedCity, 
    SearchAreaText: "",
    IsSearchingItem: false
  });

  }

GenerateAreaModel(){
  
  var city = this.state.filterSelectedCity;
  if(city === undefined){
    return <div></div>
  }

	return(
			<Modal isOpen={this.state.showAreaModal} toggle={() => this.AreaList()} className="modal-md">
			<ModalHeader>{this.state.SelectedCityName} areas</ModalHeader>
      <AvForm>
			<ModalBody>
			
					<div className={this.state.ModalMessageClass}>{this.state.ModalMessageText}</div>
					<div className=" m-t-10 m-b-10" style={{ position: 'relative', float: 'left', width: '100%' }}>
						<input type="text" className="form-control common-serch-field" placeholder="Search List" style={{ paddingleft: '30px' }} value={this.state.SearchAreaText} onChange={this.SearchAreas}/>
							<i className="fa fa-search" aria-hidden="true" style={{ position: 'absolute', top: '11px', left: '12px', color: '#777' }}></i>
						{this.state.IsSearchingItem ? <span onClick={() => this.CancelItemSearch()}><i className="fa fa-times" style={{ position: 'absolute', top: '11px', color: '#777', right: '15px' }}></i></span> : ""}
						
						</div>
						<div className="inner-table-scroll">
              <Table className="areas-table">
                <thead>
                  <tr>
                    
                    <th>Name</th>
                  </tr>
                </thead>
                  {this.LoadAreaList()}
              </Table>
						</div>
					

			
			</ModalBody>
      <div className="modal-footer">
        {/* <Button color="secondary" onClick={() => this.AreaListHide()}>Cancel</Button> */}
        {this.state.AreaSelectionError ? <span className="gnerror error" style={{width:'auto', margin:'0px 0px 0px 15px'}}>Select atleast one area.</span>: ""}
        <Button color="primary" onClick={() => this.AreaList()}>Done</Button>

     </div>
      </AvForm>
		</Modal>
	 )
 }


ChangeAreaSelection(e,city, name){

this.setState({showAreaModal : true, SelectedCityName : city.Name, SelectedCityId: city.Id, SelectedCity:JSON.parse(JSON.stringify(city)), filterSelectedCity: city})

}


SetSelectedAreaCSVByCity(cityName,id,allCitites){

  let index = Utilities.GetObjectArrId(id,allCitites)
  let areaCsv = '';
  let isAllChecked = true;

  this.state.ConsumerAreas.forEach(town => {
    if (town.City == cityName) // Adds city html only once
    {
    if(town.IsChecked){  
      areaCsv += town.Area + ',';
    } else {
      isAllChecked = false;
      allCitites.IsAllChecked = isAllChecked
    }
    
    }  
  });

  allCitites[index].SelectedAreaCsv = Utilities.FormatCsv(areaCsv,',');
  this.setState({AllCities: allCitites});

}

LoadSelectedCitiesAndArea(city){
  return (
    <div className="col-md-12 p-l-20 m-t-10">
      <div className="by-location-inner-title">
        {city.Name}
        <span onClick={() => this.HandleCityCheck(false,city.Name,city.Id)}>Remove</span>
        </div> 
      <div className="areas-wrap">
        <p>{city.SelectedAreaCsv}</p> 
        <a onClick={(e) => this.ChangeAreaSelection(e,city,city.Name)}>Change</a>
       </div>
      </div>
  )
}

RenderSelectedCitiesAndArea() {

  let htmlCity = [];
  let allCitites = this.state.AllCities; 
  var city = {}
  for (var i=0; i < allCitites.length; i++) {
    if(allCitites[i].IsChecked) {
       city = allCitites[i];
      htmlCity.push(this.LoadSelectedCitiesAndArea(city));
    }
}

  return (

    <div>
    {htmlCity.map((cityHtml) => cityHtml)}
    </div>

  )



}


HandleCheckAll(isAllChecked) {

  var cities = this.state.AllCities;
  // let isAllChecked = e.target.checked;
  this.setState({CheckAllCities: isAllChecked});
  if(isAllChecked) {
  
    cities.forEach(city => {
    if(!city.IsChecked) {
      this.HandleCheck(true,city.Name,city.Id); 
    }
  });

  } else {
  
      cities.forEach(city => {
          this.HandleCheck(false,city.Name,city.Id); 
      });

  }
  if(isAllChecked){
    this.CreateAreaIdCSV();
  }else{
    this.setState({DeviceCountIOS: 0, DeviceCountAndroid: 0, TotalDevices: 0, Platform: "", AllDevices : ""});
  }
  

}

HandleCheck(isChecked,cityName,id){
  let selectedArea = '';
  let allCitites = this.state.AllCities;
  let index = Utilities.GetObjectArrId(id,allCitites)
  allCitites[index].IsChecked =  isChecked;
  let selectedCity = allCitites[index];

   if(isChecked) {
    selectedCity.Areas.forEach(area => {
      area.IsChecked = true;
  });
} else {

  selectedCity.Areas.forEach(area => {
    area.IsChecked = false;
});
}

this.setState({AllCities: allCitites });

}


HandleCityCheck(isChecked,cityName,id) {

 this.HandleCheck(isChecked,cityName,id)
this.CreateAreaIdCSV();

}

CreateAreaIdCSV() {

  let areaIdCsv = ''
  let areaCsv = ''
  let cities = this.state.AllCities;
  let isCheckAll = true;
  let isAllCitiesChecked = true;
  for (var i=0; i < cities.length; i++) {
    areaCsv = '';
    isCheckAll = true;
    let CsvLabel = '' 
    if(!cities[i].IsChecked){
      isAllCitiesChecked = false;
    }
    else{
    areaCsv += cities[i].Name + '|'; 
    cities[i].Areas.forEach(area => {
    if(area.IsChecked) {
      areaCsv += area.Name + ','
      CsvLabel += area.Name + ', '
    } else {
      isCheckAll = false
    }
   });

   areaCsv = Utilities.FormatCsv(areaCsv,',');
   CsvLabel = Utilities.FormatCsv(CsvLabel,',');

   areaCsv +='|0' + Config.Setting.csvSeperator
  }
     
   //areaIdCsv += Utilities.stringIsEmpty(areaCsv.split('|')[1])? '' : areaCsv;
   areaIdCsv += areaCsv;
   cities[i].SelectedAreaCsv = isCheckAll ? "All" :  Utilities.FormatCsv(CsvLabel,',');
   cities[i].IsAllChecked = isCheckAll;
}

  areaIdCsv = Utilities.FormatCsv(areaIdCsv,Config.Setting.csvSeperator);
  this.setState({AllCities : cities, CheckAllCities : isAllCitiesChecked, AreaIdCsv: areaIdCsv, FromInvalid : false}, () => {
  this.GetNotificationDevices(areaIdCsv,'0');
  });

}


SetSelectedAreas() {

  let areaCsv = ''
  let cities = this.state.AllCities;
  let isCheckAll = true;
  let isAllCitiesChecked = true;
  for (var i=0; i < cities.length; i++) {
    areaCsv = '';
    if(cities[i].Name){
      isAllCitiesChecked = false;
    }
    isCheckAll = true;
    let CsvLabel = ''   
    areaCsv += cities[i].Name + '|'; 
    cities[i].Areas.forEach(area => {
    if(!area.IsChecked) {
      isCheckAll = false
    } 

   });
   
}

}

RenderCity(city){

    return (
        <label htmlFor={city.Id}>
          <input type="checkbox" onChange={(e) => this.HandleCityCheck(e.target.checked,city.Name,city.Id)} className="form-checkbox" name={city.Name} id={city.Id} checked={city.IsChecked} value={city.IsChecked} /> <span className="settingsLabel" >{city.Name}</span>
        </label>
    )
  }


  LoadCities(cities){

    var htmlCity = [];
    var cityCsv = '';

    for (var i=0; i < cities.length; i++) {

        htmlCity.push(this.RenderCity(cities[i]));
    }
    return(
  
      <Dropdown className="area-drop-down"> 
      <Dropdown.Toggle variant="secondary" id="dropdown-basic">

<span>
  All cities
</span>
</Dropdown.Toggle>
      
<Dropdown.Menu> <div className="area-dropdown-list">

        <label htmlFor="1">
          <input type="checkbox" className="form-checkbox" name="chkAll1" id="1" checked={this.state.CheckAllCities} value={this.state.CheckAllCities} onChange={(e) => this.HandleCheckAll(e.target.checked)} /> <span className="settingsLabel" >All cities</span>
        </label>
    {htmlCity.map((cityHtml) => cityHtml)}

  </div></Dropdown.Menu>      
</Dropdown>
  
 )

  }

  triggerPicker(event) {
    // event.preventDefault();
    this.setState({
      emojiPickerState: !this.state.emojiPickerState

    })
  }
  triggerPickerTray(event) {
    // event.preventDefault();
    this.setState({
      emojiPickerTrayState: !this.state.emojiPickerTrayState

    })
  }
  triggerPickerTitle(event) {
    // event.preventDefault();
    this.setState({
      emojiPickerTitleState: !this.state.emojiPickerTitleState

    })
  }
  triggerPickerMessage(event) {
    // event.preventDefault();
    this.setState({
      emojiPickerMessageState: !this.state.emojiPickerMessageState

    })
  }
  
 
  handleChildClick(e) {
    e.stopPropagation();
  }
  closedtriggerPicker(event) {
    // event.preventDefault();
    if (this.state.emojiPickerState || this.state.emojiPickerTrayState || this.state.emojiPickerTitleState || this.state.emojiPickerMessageState  ) {
      this.setState({
        emojiPickerState: false,
        emojiPickerTrayState: false,
        emojiPickerTitleState:false,
        emojiPickerMessageState:false

      })
    }
  }
  handleChangeComplete = (color) => {
    this.setState({ background: color.hex });
  };
  StartDateChange = date => {
    this.setState({ startDate: date });
  };
  
  ScheduleDateChange = date => {

    this.setState({ ScheduleDate: date, hasDateTimeError: false });
    var today = new Date(moment.tz(Config.Setting.timeZone).format("YYYY-MM-DDTHH:mm:ss"));
    var hasDateTimeError = false;
    if(date < today) {
      hasDateTimeError = true;
    }

    this.setState({ ScheduleDate: date, HasDateTimeError: hasDateTimeError });
  };


  handleSubmit(e) {
    e.preventDefault();
    let main = this.state.startDate
  }
  //#endregion

  loading = () => <div className="page-laoder-users">
    <div className="loader-menu-inner">
      <Loader type="Oval" color="#ed0000" height={50} width={50} />
      <div className="loading-label">Loading.....</div>
    </div>
  </div>

  //#region api calling

  //#endregion

  hadleTeaserChange(e) {

    let value = e.target.value;
    this.setState({ SelectedTeaser: value })

  }

  componentDidMount() {

      
      var id = this.props.match.params.id;
      if(id !== undefined){
        var pathName = this.props.location.pathname.toLowerCase();
        if(pathName.indexOf("edit-notification") !== -1){

          this.setState({ IsEdit: true, NotificationId: id, });
        } 
       
        this.GetNotificationDetail(id);
      } else {
        this.GetEnterprises();
        this.GetConsmerArea();
        this.GetCuisines();
        this.setState({ ShowLoader: false });
      }
      
  }

  shouldComponentUpdate() {
    return true;
  }

  ByLocation =(e) =>{
    this.setState({
      ByLocation: e.target.checked,
      ByEmail: !e.target.checked,
      EmailsCsv: "",
      Emails:[]
    });
    this.HandleCheckAll(true)
    //this.CreateAreaIdCSV();

    
  }

  ByEmail =(e) =>{
    this.setState({
      ByEmail: e.target.checked,
      ByLocation: !e.target.checked,
      DeviceCountIOS: 0, 
      DeviceCountAndroid: 0, 
      TotalDevices: 0, 
      Platform: "", 
      AllDevices : ""
    });
     //this.GetNotificationDevices("0",this.state.Emails)

  }

  handleEmailCsvChange = (e)=> {
    this.setState({
      EmailsCsv: e.target.value
    });
  }


  notificationType = (e)=> {
    
    this.setState({
      selectedNotificationType: e.target.value, SearchVoucher:'', SelectedVoucher:{}, FilterVouchers:[]
    })
  }

  ShowVoucherDetail = () =>{


    if(isEmptyObject(this.state.SelectedVoucher)){
      return ('');
    }

    let voucher = this.state.SelectedVoucher;

    return (
      <div className="order-r">
      <div className="total-r-label w-100">
        <span className="t-label">Voucher Name</span>
        <span>{voucher.Title} </span>
      </div>

        <div className="total-r-label r w-100">
          <span className="t-label">Batch Name</span>
          <span>{voucher.VoucherBatchName}</span>
        </div>

        <div className="total-r-label" ><span className="t-label">Voucher  Pin</span><span>{voucher.PinCode==='' ? '-' : voucher.PinCode}</span></div>
        <div className="total-r-label "><span className="t-label">Voucher Code</span><span>{voucher.Code}</span></div>
        <div className="total-r-label r"><span className="t-label">Total Quantity</span><span>{voucher.Quantity}</span></div>

        <div className="total-r-label r"><span className="t-label">Start Date</span><span >{moment(voucher.StartDate,Config.Setting.dateFormat).format('Do MMM YYYY')}</span></div>
        <div className="total-r-label r"><span className="t-label">Expiry Date</span><span >{moment(voucher.ExpiryDate,Config.Setting.dateFormat).format('Do MMM YYYY')}</span></div>
        <div className="total-r-label r"><span className="t-label">Redeemed Quantity</span><span>{voucher.RedemptionCount}</span></div>
        <div className="total-r-label r"><span className="t-label">Multiple Use</span><span >{voucher.AllowMultipleUse ? `Yes`: `No` }</span></div>
    </div>
    )

  }



  addNotificationFields = () => {
    if (Number(this.state.selectedNotificationType) == 1) {
      return null
    }
    else if (Number(this.state.selectedNotificationType) == 2) {
      return (
        <div className="row">
        <div className="col-md-8">
                                          <div className="child-th-wrap">
                                               
                                          <label className="control-label">Cuisine / Tags</label>
                                            
                                            </div>
                                                <div className="input-group h-set-new">
                                                 <Autocomplete 
                                             className="form-control"
                                             getItemValue={(item) => item.Name}
                                            items={this.state.FilteredCuisines}
                                            renderItem={(item, isHighlighted) =>
                                            <div style={{ background: isHighlighted ? 'lightgray' : 'white'}}>
                                            {item.Name}
                                                </div>
                                            }
                                        value={this.state.SearchCuisineText}
                                        onChange={(event, value) => this.SearchCuisine(event,value)}
                                        onSelect={(value) => this.OnItemSelect(value)}
                                        selectOnBlur={true}
                                        /> 
                                            </div> 
                               
                                    </div> 
                                    </div> 
      )
    }
    else if (this.state.selectedNotificationType == 5) {
      return (
<div className="">


 <div className="row">


<div className="col-md-12">
  <div className="form-group mb-3 flex-type-wrap">
    <label className="control-label">Restaurant</label>
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
                                value={this.state.SelectedEnterpriseName}
                                onChange={(event, value) => this.SearchEnterprise(event,value)}
                                onSelect={(value) => this.OnRestaurantSelect(value)}
                                selectOnBlur={true}
                                />
                                {this.state.IsEmptyRestaurant ? <span className="gnerror error" style={{marginTop:'10px', display:'flex'}}>Please select a restaurant.</span> : "" }
                                </div>
  </div>
</div>

</div>

  <div className="row">


<div className="col-md-8">
  <div className="form-group mb-3 flex-type-wrap">
    <label className="control-label">Voucher</label>
    {this.LoadVoucher()}
  </div>
</div>

</div>


<div className="row">


<div className="col-md-8">
  <div className="form-group mb-3 flex-type-wrap">
    <label className="control-label">Category</label>
    {this.LoadCategories()}
  </div>
</div>

</div>
<div className="row"><div className="col-md-8">
  <div className="form-group mb-3 flex-type-wrap">
    <label className="control-label">Item</label>
    {this.LoadProducts()}
  </div>
</div></div>


</div>

      )
    }


    else if (this.state.selectedNotificationType == 3) {
      return (
        <div className="row">


        <div className="col-md-12">
          <div className="form-group mb-3 flex-type-wrap">
            <label className="control-label">Choose Voucher</label>
            <div className="input-group h-set-new">
            <Autocomplete 
                                             className="form-control"
                                             getItemValue={(item) => String(item.Id)}
                                            items={this.state.FilterVouchers}
                                            renderItem={(item, isHighlighted) =>
                                            <div style={{ background: isHighlighted ? 'lightgray' : 'white'}}>
                                            {item.Title}
                                                </div>
                                            }
                                        value={this.state.SearchVoucher}
                                        onChange={(event, value) => this.SearchVoucher(event,value)}
                                        onSelect={(value) => this.OnVoucherSelect(value)}
                                        selectOnBlur={true}
                                        />
                                         {((Number(this.state.selectedNotificationType)=== 3)  && (isEmptyObject(this.state.SelectedVoucher) || this.state.SearchVoucher === '')) ? <span className="gnerror error" style={{marginTop:'10px', display:'flex'}}>Please select a voucher.</span> : "" }
                                        </div>
          </div>


        {this.ShowVoucherDetail()}

        </div>
        
        </div>
      )}
      else if (this.state.selectedNotificationType == 4) {
        return (
          <div className="row">
  
  
          <div className="col-md-12">
            <div className="form-group mb-3 flex-type-wrap">
              <label className="control-label">Choose Promo Code</label>
              <div className="input-group h-set-new">
              <Autocomplete 
                                               className="form-control"
                                               getItemValue={(item) => String(item.Id)}
                                              items={this.state.FilterVouchers}
                                              renderItem={(item, isHighlighted) =>
                                              <div style={{ background: isHighlighted ? 'lightgray' : 'white'}}>
                                              {item.Title}
                                                  </div>
                                              }
                                          value={this.state.SearchVoucher}
                                          onChange={(event, value) => this.SearchVoucher(event,value)}
                                          onSelect={(value) => this.OnVoucherSelect(value)}
                                          selectOnBlur={true}
                                          />
                                         
                                          {((Number(this.state.selectedNotificationType)=== 4)  && (isEmptyObject(this.state.SelectedVoucher)  || this.state.SearchVoucher === '')) ? <span className="gnerror error" style={{marginTop:'10px', display:'flex'}}>Please select a voucher.</span> : "" }
                                          </div>
            </div>
  
  
            {this.ShowVoucherDetail()}
  
  
          </div>
          
          </div>
        )}
  }


  handleIOSCheck =(e) => {
    this.setState({IsIOSChecked : e.target.checked}, () => {
      this.SetDeviceCount(this.state.AllDevices);

    });
  }

  handleAndroidCheck =(e) => {
    this.setState({IsAndroidChecked : e.target.checked}, () => {
      this.SetDeviceCount(this.state.AllDevices);
    });
  }

  deliverydatetext = (value)=> {
    this.setState({
      selecteddeliverydate: value
    })

    if (Number(value) == 1) {
      this.setState({ScheduleDate: new Date()});
    } else {

      this.setState({ScheduleDate:'', HasDateTimeError: false, FromInvalid: false}); 
    }
    

  }
  handleInvalidSubmit = () => {
    this.setState({FromInvalid: true})
}
  eselecteddate = () => {
    if (this.state.selecteddeliverydate == 0) {
      return null
    }
    else if (this.state.selecteddeliverydate == 1) {
      return (
        <div className="row">
        <div className="col-md-5 ">
                  <div className="form-group mb-3 flex-type-wrap">
                    <label id="name" className="control-label" style={{width:'130px'}}>Delivery Date

                              </label>
                <DatePicker
                selected={this.state.ScheduleDate}
                onChange={this.ScheduleDateChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="time"
                dateFormat="dd/MM/yyyy HH:mm"
                className="form-control"
                
              />
                  </div>
                  {this.state.HasDateTimeError ? <div className="error m-t-5">Please select valid Date/Time.</div> : ''}
                </div>
        </div>

      )
    }
  }

  RenderTowns(){

    return (
      
        <label htmlFor="1">
          <input type="checkbox" className="form-checkbox" name="chkAll1" id="1" /> <span className="settingsLabel" > Select all</span>
        </label>
    )

  }


  LoadTowns(areas){

    var htmlTown = [];

    for (var i=0; i < areas.length; i++){
      
      htmlTown.push(this.RenderTowns(areas[i]));
    }
  
    return(
  
      <Dropdown className="area-drop-down"> 
       <Dropdown.Toggle variant="secondary" id="dropdown-basic">

<span>
  Select your town
</span>
</Dropdown.Toggle>
      
<Dropdown.Menu> <div className="area-dropdown-list">{htmlTown.map((townHtml) => townHtml)}</div></Dropdown.Menu>      
</Dropdown>
  
     )

  }



  LoadNotificationHtml() {

    let emojiPicker;
    if (this.state.emojiPickerState) {
      emojiPicker = (
        <Picker
          title="Pick your emoji…"
          emoji="point_up"
          onSelect={emoji =>
            this.setState({
              message: this.state.message + emoji.native
            })
          }
        />
      );
    }
    let emojiPickerTray;
     if(this.state.emojiPickerTrayState){
      emojiPickerTray = (
        <Picker
          title="Pick your emoji…"
          emoji="point_up"
          onSelect={emoji =>
            this.setState({
              messageTray: this.state.messageTray + emoji.native
            })
          }
        />
      );
    }
    let emojiPickerTitle;
    if(this.state.emojiPickerTitleState){
      emojiPickerTitle = (
       <Picker
         title="Pick your emoji…"
         emoji="point_up"
         onSelect={emoji =>
           this.setState({
             messageTitle: this.state.messageTitle + emoji.native
           })
         }
       />
     );
   }
   let emojiPickerMessage;
   if(this.state.emojiPickerMessageState){
    emojiPickerMessage = (
      <Picker
        title="Pick your emoji…"
        emoji="point_up"
        onSelect={emoji =>
          this.setState({
            messagePicker: this.state.messagePicker + emoji.native
          })
        }
      />
    );
  }

    return (
      <AvForm onValidSubmit={this.SendNotification} onInvalidSubmit={this.handleInvalidSubmit}>
        <div className="form-body">
          <h4 className="title-sperator m-t-20 m-b-20">Choose Audience</h4>
          <div className="formPadding">
            <div className="">
       <div className="chose-aud-wrap">
              <div className=" checkDiv" >
                <input type="radio" className="option-input radio form-radiobox" name="rdobyLocation" id="chkAll" value={this.state.ByLocation} checked={this.state.ByLocation} onChange={(e) => this.ByLocation(e)}/> 
                <label htmlFor="chkAll" className="settingsLabel" >By Location</label>
              </div> 
              { this.state.ByLocation ? <div className="location-field-wrap">
                <div className="col-md-12 ">
                  <div className="form-group">
                  {this.LoadCities(this.state.AllCities)}
                  </div>
                </div>
                <div className="col-md-4">
                </div>
    
              </div> :""}
            </div>
            { this.state.ByLocation ?
            <div className="row location-field-wrap">
                <div className="col-md-12 ">
                  <div className="form-group">
                  {this.RenderSelectedCitiesAndArea(this.state.AllCities)}
                  </div>
                </div>
               
              </div> 
:""}
              <div className="m-t-20">
                <div className=" checkDiv m-b-10">
                     <input type="radio" name="rdoByEmail" className="option-input radio form-radiobox" id="rdoByEmail" value={this.state.ByEmail} checked={this.state.ByEmail}  onChange={(e) => this.ByEmail(e)}/>
                     <label className="settingsLabel" htmlFor="rdoByEmail">By Email address</label>
                </div>
                

              { this.state.ByEmail ?    <div className="col-md-6 p-l-20 ">
                  <div className="form-group ">

        <ReactMultiEmail
          placeholder="Email Address"
          emails={this.state.Emails}
          onChange={(_emails) => {
            this.setState({ Emails: _emails },() => {
            this.GetNotificationDevices('0',_emails);
            });
            
          }}
        
          getLabel={(
            email,index,
            removeEmail = (index) 
           ) => {
            
            return (
              <div data-tag key={index}>
                {email}
                <span data-tag-handle onClick={() => removeEmail(index)}>
                  ×
                </span>

              </div>
            );
          }}
        />
                  </div>
                </div>: ""}
              </div> 


              <div >
  
                  <div>
                                  <div className="total-device-wrap" id="dvDevicesCount">
                                    <div>   <span>Total Devices:</span>
                                      <span id="spTotalDevices" style={{ fontWeight: "bold"}}>{this.state.TotalDevices}</span>
                                      </div> 
                                      <div className="mobile-total-main-wrap"> 
                                        <span className="mobile-wrap">
                                           
                                            <span>
                                            <input id="rdoIos" className="form-checkbox" name="notificationPlatform" type="checkbox" onChange={(e) => this.handleIOSCheck(e)} value="IOS" checked={this.state.IsIOSChecked}/>
                                              {/* <label htmlFor="rdoIos" className="settingsLabel" >By Location</label> */}
                                            </span> 
                                            <span><i className="fa fa-apple" aria-hidden="true"></i>: </span>
                                            <span id="spDeviceCountIOS" style={{ fontWeight: "bold"}} >{this.state.DeviceCountIOS}</span>
                                        </span>
                                        <span className="mobile-wrap">
                                            <span>
                                                <input id="rdoAndroid" className="form-checkbox" name="notificationPlatform" type="checkbox" value="ANDROID" onChange={(e) => this.handleAndroidCheck(e)} checked={this.state.IsAndroidChecked}/></span>
                                            
                                            <span>
                                              <i className="fa fa-android" aria-hidden="true"></i>: </span>
                                            <span id="spDeviceCountAndroid" style={{ fontWeight: "bold"}}>{this.state.DeviceCountAndroid}</span>
                                        </span>
                                        </div>
                                    </div>
                                    {this.state.DeviceError ?  <span className="gnerror error" style={{marginTop:'10px', display:'flex'}}>Required</span> : ''}
                                    <div style={{margin: "0 0 0 16px", float: "left", display: "none"}} id="dvCountLoader">please wait</div>
                                </div>
                
              </div>
            </div>
          </div>
          
          <h4 className="title-sperator m-t-20 m-b-20">Compose Notification</h4>
          <div className="row flex-column">
            <div className="col-md-6 input-emoji">
              <div className="form-group mb-3">
                <label id="lblTrayTitle" className="control-label">Tray Title
                      </label>
                <AvField name="txtTrayTitle"  value={this.state.message} id="txtTrayTitle"  onChange={event =>  this.setState({ message: event.target.value, FromInvalid : false })} type="text" className="input-reset form-control ba b--black-20 pa2 mb2 db w-100"
                      validate={{
                        required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                        }}
                      
                      />
                {/* <input
                  id="name"
                  class="input-reset form-control ba b--black-20 pa2 mb2 db w-100"
                  type="text"
                  aria-describedby="name-desc"
                  value={this.state.message}
                  // onChange={event =>
                  //   this.setState({ message: event.target.value })
                  // }
                />  */}
                <div style={{ zIndex: 99 }} onClick={this.handleChildClick} >
                  {emojiPicker}
                </div>
                <div className="emojibtn">
                  <span
                    class="ma4 b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                    onClick={() => this.triggerPicker()}
                  >
                    <span role="img" aria-label="">
                      😁
            </span>
                  </span>
                </div> 
              </div>
            </div>
            <div className="col-md-6 ">
              <div className="form-group mb-3">
                <label id="lblTrayMessage" className="control-label">Tray Message

                      </label>
                <AvField name="txtTrayMessage" value={this.state.messageTray}   onChange={event =>  this.setState({ messageTray: event.target.value, FromInvalid : false })}  id="txtTrayMessage" type="text" className="form-control"
                  validate={{
                    required: { value: this.props.isRequired, errorMessage: 'This is a required field'},
                  }}

                />
                  <div style={{ zIndex: 99 }} onClick={this.handleChildClick} >
                  {emojiPickerTray}
                </div>
                <div className="emojibtn">
                  <span
                    class="ma4 b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                    onClick={() => this.triggerPickerTray()}
                  >
                    <span role="img" aria-label="">
                      😁
            </span>
                  </span>
                </div> 
              </div>
            </div>
          </div>
          <div className="row flex-column">
            <div className="col-md-6 ">
              <div className="form-group mb-3">
                <label id="lblPopupTitle" className="control-label">In-app Popup Title (Optional)

                      </label>
                <AvField name="txtPopupTitle" id="txtPopupTitle" value={this.state.messageTitle}   onChange={event =>  this.setState({ messageTitle: event.target.value })} type="text" className="form-control"
                />
                  <div style={{ zIndex: 99 }} onClick={this.handleChildClick} >
                  {emojiPickerTitle}
                </div>
                <div className="emojibtn">
                  <span
                    class="ma4 b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                    onClick={() => this.triggerPickerTitle()}
                  >
                    <span role="img" aria-label="">
                      😁
            </span>
                  </span>
                </div> 
              </div>
            </div>
            <div className="col-md-6 ">
              <div className="form-group mb-3">
                <label id="lblPopupMsg" className="control-label">In-app Popup Message (Optional)
                      </label>
                <AvField name="txtPopupMsg" id="txtPopupMsg"  value={this.state.messagePicker}   onChange={event =>  this.setState({ messagePicker: event.target.value })}type="textarea" className="form-control"
                />
                  <div style={{ zIndex: 99 }} onClick={this.handleChildClick} >
                  {emojiPickerMessage}
                </div>
                <div className="emojibtn">
                  <span
                    class="ma4 b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                    onClick={() => this.triggerPickerMessage()}
                  >
                    <span role="img" aria-label="">
                      😁
            </span>
                  </span>
                </div> 
              </div>
            </div>
          </div>
        </div>
        <div className="form-body">
          <h4 className="title-sperator font-weight-600  m-b-20">Choose Activity</h4>
          <div className="formPadding media-wraper form-set-new-notification">

            <div className="row">


              <div className="col-md-8">
                <div className="form-group mb-3 flex-type-wrap">
                  <label className="control-label">Type</label>

                  <AvField name="ddlType" type="select" value={this.state.selectedNotificationType} className="form-control custom-select " onChange={(e) => this.notificationType(e)}
                  >
                    <option value="1">Default</option>
                    <option value="2">Search</option>
                    <option value="3">Cashback Voucher</option>
                    <option value="4">Promo Code</option>
                    <option value="5">Restaurant</option>

                  </AvField >
                </div>
              </div>

              </div>

              {this.addNotificationFields()}








              {/* {Number(this.state.selectedNotificationType) === 2 ? 
  <div className="row">
<div className="col-md-6">
                                  <div className="child-th-wrap">
                                       
                                  <label className="control-label">Cuisine / Tags</label>
                                    
                                    </div>
                                        <div className="input-group h-set-new">
                                        <Autocomplete 
                                     className="form-control"
                                     getItemValue={(item) => item.Name}
                                    items={this.state.FilteredCuisines}
                                    renderItem={(item, isHighlighted) =>
                                    <div style={{ background: isHighlighted ? 'lightgray' : 'white'}}>
                                    {item.Name}
                                        </div>
                                    }
                                value={this.state.SearchCuisineText}
                                onChange={(event, value) => this.SearchCuisine(event,value)}
                                onSelect={(value) => this.OnItemSelect(value)}
                                selectOnBlur={true}
                                />
                                    </div> 
                       
                            </div> 
                            </div> 
                                
:""} */}






          
          </div>
        </div>


        <div className="form-body">
          <h4 className="title-sperator font-weight-600 m-t-30 m-b-20">Set Delivery Date
</h4>
          <div className="formPadding media-wraper form-set-new-notification-col-2"  style={{marginBottom:20}}>
<div className="set-date-wrap">
            <div className=" checkDiv" >
              <input type="radio" className="form-checkbox" name="cuisine" name="Location"  id="now" checked={this.state.selecteddeliverydate === "0"} value={"0"}  onClick={(e) => this.deliverydatetext("0")}/> 
              <label className="settingsLabel"  htmlFor="now">Now</label> 
            </div>

            <div  className="checkDiv" style={{marginLeft:20}}>
              <input type="radio" className="form-checkbox" name="cuisine" id="later" name="Location" value={"1"} onClick={(e) => this.deliverydatetext("1")}/>
               <label className="settingsLabel"  htmlFor="later">Schedule for later</label>
            </div>
            </div>
            {this.eselecteddate()}


          </div>
        </div>



        <div className="col-xs-12 setting-cus-field m-b-20">

          <FormGroup>
            <Link to="/app-notification"><Button color="secondary" className="btn waves-effect waves-light btn-secondary pull-left" style={{ marginRight: 10 }}>Cancel</Button></Link>
            {/* <Button color="success" className="btn waves-effect waves-light btn-success pull-left">
              {Utilities.stringIsEmpty(this.state.ScheduleDate) ? "Send Message" : "Schedule Notification"}
              
            </Button> */}




            <Button color="primary" className="btn waves-effect waves-light btn-success pull-left" >
                            {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                            : <span className="comment-text">{ this.state.IsEdit ? "Update" :
                                Utilities.stringIsEmpty(this.state.ScheduleDate) ? "Send Message" : "Schedule Notification"}</span>
                            
                            }
            </Button>



          </FormGroup>

          <div className="action-wrapper">
          </div>
        </div>
        {this.state.FromInvalid ? <div className="gnerror error media-imgerror">One or more fields has errors.</div> : ""}
      </AvForm>
    )

  }

GetNotificationType(type){

  var notificationType = "Default"
  if(Number(type) === 2) {
    notificationType = "Search"
  }else if(Number(type) === 3) {
    notificationType = "CashbackVoucher"
  }else if(Number(type) === 4) {
    notificationType = "PromoVoucher"
  } 
  else if(Number(type) === 5) {
    notificationType = "Restaurant"
  }

  return notificationType;
}


GetNotificationTypeId(type){

  var notificationTypeId = 1
  if(type === "Search") {
    notificationTypeId = 2
  } else if(type === "CashbackVoucher") {
    notificationTypeId = 3
  }else if(type === "PromoVoucher") {
    notificationTypeId = 4
  }else if(type === "Restaurant") {
    notificationTypeId = 5
  }
  return notificationTypeId;
}



  OnItemSelect(value){

    let cuisines = this.state.FilteredCuisines.filter((cuisine) => {
        return cuisine.Name == value
    });

    this.setState({SelectedCuisine: cuisines[0], CuisinesName :cuisines[0].Name, SearchCuisineText: cuisines[0].Name})
    }

    SearchCuisine(e,value) {
  
        let searchText = value;
        this.setState({SelectedCuisine : {}, CuisinesName: "", SearchCuisineText: searchText  ,FilteredCuisines: []});
        // if(value.length < 2) return;
        let filteredData = []
        if (searchText.toString().trim() === '') {
          this.setState({FilteredCuisines: [], IsSearchingItem: false});
          return;
        }
      
        filteredData = this.state.Cuisines.filter((cuisine) => {
        let arr = searchText.toUpperCase();
        let isExists = false;
      
            if (cuisine.Name.toUpperCase().indexOf(arr) !== -1 && !Utilities.stringIsEmpty(arr)) {
                  isExists = true   
          }
      
          return isExists
        })
      
        this.setState({ FilteredCuisines: filteredData});
      }

    OnRestaurantSelect(value){

        let enterprises = this.state.FilterEnterprises.filter((enterprise) => {
            return enterprise.Name == value
        });
    
        // if(Number(this.state.SelectedEnterpriseId) !== Number(enterprises[0].Id)) {
        //   this.setState({SelectedVoucher: "", SelectedCategoryId: "", SelectedItemId: ""});
        // }

        this.GetCategories(enterprises[0].Id);
        this.GetVouchers(enterprises[0].Id);
        this.setState({
          IsEmptyRestaurant: false,
          SelectedEnterpriseId : enterprises[0].Id,
          SelectedEnterpriseName :enterprises[0].Name,
          SelectedEnterprisePage: enterprises[0].LogoName,
          SelectedEnterprisePhotoName: enterprises[0].PhotoName})
    }
    
    OnVoucherSelect (value){

        let Voucher = this.state.FilterVouchers.filter((voucher) => {
          return voucher.Id == Number(value)
      });
      

      if(Voucher.length > 0){
        this.setState({SelectedVoucher:Voucher[0], SearchVoucher: Voucher[0].Title});
      }
    }

    GetVouchersBy = async (searchText) =>{

      var data = await VoucherService.SearchVoucher(this.state.selectedNotificationType, searchText);


      if(data.length === 0){
        this.setState({SelectedVoucher: {}});
      }

      this.setState({FilterVouchers: data});

    }

    SearchVoucher(e,value){
      let searchText = value;
      
      if(value === ''){
        this.setState({SelectedVoucher: {},SearchVoucher: value});
        return;
      }

      this.setState({SearchVoucher: value});

      if(value.length < 3) return;
      
      this.GetVouchersBy(searchText);

    }


    SearchEnterprise(e,value) {
      
            let searchText = value;
            this.setState({SelectedEnterprisePage: "",
            SelectedEnterprisePhotoName : "", 
            SelectedCategoryId : "",
            SelectedEnterpriseId: "",
            SelectedItemId: "", 
            SelectedVoucherId: "",
            Categories: [], 
            Products: [],
            Vouchers: [],
            SelectedEnterpriseName: searchText});
            let filteredData = []
            filteredData = this.state.AllEnterprises.filter((enterprise) => {
            let arr = searchText.toUpperCase();
            let isExists = false;
          
                if (enterprise.Name.toUpperCase().indexOf(arr) !== -1 && !Utilities.stringIsEmpty(arr) && enterprise.EnterpriseId !== 0 ) {
                      isExists = true   
              }
          
              return isExists
            })
           
          this.setState({ FilterEnterprises: filteredData,SelectedEnterpriseName: searchText});
          }


  render() {

    if (this.state.ShowLoader === true) {
      return this.loading()
    }

    return (
      <div className="card" id="CampaignDataWraper" onClick={() => this.closedtriggerPicker()}>
                  <h3 className="card-title card-new-title">{this.state.PageTitle}</h3>
        <div className="card-body" >
         

          {this.LoadNotificationHtml()}
         {this.GenerateAreaModel()}

          <img src={this.state.image} name="tempImg" id="tempImg" style={{ display: "none" }} />
        </div>
      </div>

    );
  }

}

export default AddNotification;