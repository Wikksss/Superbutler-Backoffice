import React, { Component, Fragment } from 'react';
import * as Utilities from '../../../helpers/Utilities';
import Config from '../../../helpers/Config';
import Constants from '../../../helpers/Constants';
import * as EnterpriseOrderService from '../../../service/Orders';
import * as UserService from '../../../service/User';
import Loader from 'react-loader-spinner';
import sound from '../../../assets/sound/sound_clip.mp3'
import { Button, Badge, Modal, ModalBody, ModalFooter, ModalHeader, } from 'reactstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import Iframe from 'react-iframe'
import ProgressBar from 'react-bootstrap/ProgressBar'
import { orderSupportBubbleNotification, PlayOrStop } from '../../../containers/DefaultLayout/DefaultLayout';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getMessaging, onMessage, isSupported } from "firebase/messaging";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Autocomplete from 'react-autocomplete';
import MUIDataTable from "mui-datatables";
import { nodeName } from 'jquery';
const $ = require("jquery");
const moment = require('moment-timezone');

var audio = new Audio(sound)
var interval;

$.DataTable = require("datatables.net");
class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userObj: [],
      EnterpriseOrders: [],
      FilterOrders: [],
      ShowLoader: false,
      openIframeModal: false,
      openRiderModal: false,
      moveToStatus: false,
      cancelOrder: false,
      addExtraTime: false,
      iframeUrl: '',
      SelectedStatus: -1,
      SelectedDuration: 30,
      ChkNew: true,
      ChkInKitchen: true,
      ChkReady: true,
      ChkCancelled: false,
      ChkDelivered: false,
      ChkBooking: false,
      ChkPreOrder: false,
      ChkAll: false,
      TotalOrders: 0,
      CancelledCount: 0,
      TotalCardsAmount: 0.00,
      TotalCashAmount: 0.00,
      TotalAmount: 0.00,
      TotalCancelledAmount: 0.00,
      IsSave: false,
      TimeError: false,
      TimeErrorText: 'Please select time',
      ReasonError: false,
      ReasonErrorText: 'Please choose reason',
      OtherReasonError: false,
      OtherReasonErrorText: 'Please provide a reason',
      AcceptErrorText: '',
      AcceptError: false,
      OrderDuration: "0",
      SelectedOrderEnterpriseId: 0,
      SelectedOrderId: 0,
      MoveToStatus: "0",
      StatusText: "",
      MoveToStatusText: "",
      MoveToCancelText: "",
      AddExtraTimeText: "",
      CancelReason: "",
      MoveToCancel: false,
      dropdownOpen: false,
      IsPlaying: false,
      IsStopped: false,
      ProgressWidth: 30,
      EnterpriseTypeId: 0,
      IsParent: false,
      IsSupermealDelivery: false,
      SelectedOrderType: 1,
      RiderInfo: {},
      PickupTime: '',
      EstDeliveryTime: '',
      StartDate: '',
      EndDate: '',
      DeliveryOrderCount: 0,
      CollectionOrderCount: 0,
      EatInOrderCount: 0,
      BookingOrderCount: 0,
      AppsOrderCount: 0,
      WebOrderCount: 0,
      WhiteLableOrderCount: 0,
      HighValueOrderAmount: 0,
      LowValueOrderAmount: 0,
      CancelledOrderCount: 0,
      CashbackEarned: 0,
      TotalVouchersRedeem: 0,
      OrdersPerDay: 0,
      CardOrderCount: 0,
      CODOrderCount: 0,
      CustomersCount: 0,
      RestaurantsCount: 0,
      NewCustomers: 0,
      AppVersion: '',
      TotalDevices: 0,
      RecomendationSource: '',
      TotalReferral: 0,
      AppOpenDate: '',
      ShowButtonLoader: false,
      UserInfo: {},
      UserList: [],
      SearchText: '',
      FilterUsers: [],
      SelectedUserId: 0,
      UserName: "",
      countryConfigObj: {},
    }
    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.COUNTRY_CONFIGURATION))) {
      this.state.countryConfigObj = JSON.parse(localStorage.getItem(Constants.Session.COUNTRY_CONFIGURATION))
    }


    this.state.StartDate =new Date(moment.tz(Config.Setting.timeZone).subtract(7, 'days').calendar());
    this.state.EndDate =  new Date(moment.tz(Config.Setting.timeZone).format("YYYY-MM-DD"));

    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
      let userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
      this.state.EnterpriseTypeId = userObj.Enterprise.EnterpriseTypeId;
      localStorage.setItem(Constants.Session.ENTERPRISE_ID, userObj.Enterprise);
      localStorage.setItem(Constants.Session.ENTERPRISE_NAME, userObj.Enterprise.Name);
      localStorage.setItem(Constants.Session.ENTERPRISE_TYPE_ID, userObj.Enterprise.EnterpriseTypeId);
    }
    if(!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.SELECTED_REPORT_ORDER_STATUS))) {
        this.GetSelectedStatus();
    }

    this.GetOrdersByStatus = this.GetOrdersByStatus.bind(this);
    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
      this.state.userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
    }
    else {
      this.props.history.push('/login')
    }
  }


  SetSelectedStatus(){

    let selectedStatus = "";
    selectedStatus += (this.state.ChkAll? 1 : 0) + Config.Setting.csvSeperator;
    selectedStatus += (this.state.ChkNew? 1 : 0) + Config.Setting.csvSeperator;
    selectedStatus += (this.state.ChkInKitchen? 1 : 0) + Config.Setting.csvSeperator;
    selectedStatus += (this.state.ChkReady? 1 : 0) + Config.Setting.csvSeperator;
    selectedStatus += (this.state.ChkDelivered? 1 : 0) + Config.Setting.csvSeperator;
    selectedStatus += (this.state.ChkCancelled? 1 : 0) + Config.Setting.csvSeperator;
    selectedStatus += (this.state.ChkBooking? 1 : 0) + Config.Setting.csvSeperator;
    selectedStatus += (this.state.ChkPreOrder? 1 : 0) + Config.Setting.csvSeperator;
    selectedStatus = Utilities.FormatCsv(selectedStatus, Config.Setting.csvSeperator)
    selectedStatus += '|' +  moment(this.state.StartDate).format("YYYY-MM-DD") + '^' + moment(this.state.EndDate).format("YYYY-MM-DD");
    
    localStorage.setItem(Constants.Session.SELECTED_REPORT_ORDER_STATUS,selectedStatus);
  }

  GetSelectedStatus(){

    if(!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.SELECTED_REPORT_ORDER_STATUS))){

    let states = String(localStorage.getItem(Constants.Session.SELECTED_REPORT_ORDER_STATUS)).split('|');
    let dateRange = states[1].split('^');
    let selectedStatus = states[0].split(Config.Setting.csvSeperator);
  
    this.state.ChkAll = selectedStatus[0] == "1";
    this.state.ChkNew = selectedStatus[1] == "1";
    this.state.ChkInKitchen = selectedStatus[2] == "1";
    this.state.ChkReady = selectedStatus[3] == "1";
    this.state.ChkDelivered = selectedStatus[4] == "1";
    this.state.ChkCancelled = selectedStatus[5] == "1";
    this.state.ChkBooking = selectedStatus[6] == "1";
    this.state.ChkPreOrder  = selectedStatus[7] == "1";
    this.state.StartDate = new Date(dateRange[0]);
    this.state.EndDate =  new Date(dateRange[1]);
    }

  }


 ResetStatisticsValues = () => {
  
  this.setState({

  DeliveryOrderCount: 0,
  CollectionOrderCount: 0,
  DeliveryOrderCount : 0,
  CollectionOrderCount : 0,
  EatInOrderCount: 0,
  BookingOrderCount: 0,
  AppsOrderCount: 0,
  WebOrderCount: 0,
  WhiteLableOrderCount: 0,
  HighValueOrderAmount: 0,
  LowValueOrderAmount: 0,
  CancelledOrderCount: 0,
  CardOrderCount: 0,
  CODOrderCount: 0,
  CustomersCount: 0,
  RestaurantsCount: 0,
  NewCustomers: 0,
  CashbackEarned: 0,
  TotalVouchersRedeem: 0,
  AppVersion: '',
  AppOpenDate: '',
  TotalDevices: 0,
  OrdersPerDay: 0,
   })
 }



SetStatisticsValues = (orders, userInfo) => {

  var customerIdCSV = "";
  var restaurantCSV = "";
  this.ResetStatisticsValues();
  this.state.CashbackEarned = userInfo.CashbackEarned;
  this.state.TotalVouchersRedeem = userInfo.TotalVouchersRedeem;
 
  
  if(orders[0].Id > 0) {


  orders.forEach((order) => {

    // Setting Order type states
    if(order.OrderType == 1) this.state.DeliveryOrderCount += 1;
    else if(order.OrderType == 2) this.state.CollectionOrderCount += 1;
    else if(order.OrderType == 3) this.state.EatInOrderCount += 1;
    else if(order.OrderType == 4) this.state.BookingOrderCount += 1;
    
    
    
    // Setting Order source states
    if(order.Source.indexOf("App") != -1) this.state.AppsOrderCount += 1;
    else if(order.Source.indexOf("White Label") != -1) this.state.WhiteLableOrderCount += 1;
    else  this.state.WebOrderCount += 1;
    
    // Setting Order Amount States
    var totalAmount = Number(Utilities.FormatCurrency(Number(order.TotalAmount) + Number(order.DiscountedAmount), this.state.countryConfigObj?.DecimalPlaces));
    if(totalAmount > Number(this.state.HighValueOrderAmount)) this.state.HighValueOrderAmount = Utilities.FormatCurrency(totalAmount, this.state.countryConfigObj?.DecimalPlaces);
    if(totalAmount < Number(this.state.LowValueOrderAmount) || this.state.LowValueOrderAmount == 0) this.state.LowValueOrderAmount = Utilities.FormatCurrency(totalAmount, this.state.countryConfigObj?.DecimalPlaces);


    // Setting Restaurant Count
     if(!Utilities.isExistInCsv(order.EnterpriseId,restaurantCSV,Config.Setting.csvSeperator)){
      this.state.RestaurantsCount += 1;
      restaurantCSV += order.EnterpriseId + Config.Setting.csvSeperator;
     }

     // Setting Customer Count
     if(!Utilities.isExistInCsv(order.UserId,customerIdCSV,Config.Setting.csvSeperator)){
      this.state.CustomersCount += 1;

      var startDate =  moment(this.state.StartDate).format('YYYY-MM-DD');
    var endDate =  moment(this.state.EndDate).format('YYYY-MM-DD');
    var userCreatedOn =  moment(order.UserCreatedOn).format('YYYY-MM-DD');

    if(moment(userCreatedOn).isSameOrAfter(startDate,'d') && moment(userCreatedOn).isSameOrBefore(endDate,'d')){
      this.state.NewCustomers += 1;
    }

      customerIdCSV += order.UserId + Config.Setting.csvSeperator;
    }

    // Setting Cancellation states

    if(order.OrderStatus == 3){

      this.state.CancelledOrderCount += 1;

    }


    // Setting Payment By States
    var isCardOrder = true;
    order.PaymentModes.forEach(mode => {
      
      if (Number(mode.PaymentMode) === 1 && Number(order.TotalAmount > 0)) {
        isCardOrder = false
      } else {
        isCardOrder = true;
      }
    });

    isCardOrder ? this.state.CardOrderCount += 1 : this.state.CODOrderCount += 1;
    
  });

  var firstOrder = moment(moment(userInfo.FirstOrderDate).format("YYYY-MM-DD"));
  var lastOrder =  moment(moment(userInfo.LastOrderDate).format("YYYY-MM-DD"));
  var totalDays = lastOrder.diff(firstOrder, 'days');   
  this.state.OrdersPerDay = totalDays > 0 ? (Number(orders.length)/Number(totalDays+1)).toFixed(2) : (orders.length).toFixed(2);
  }

}


  HandleCheckAll(e) {

    var isChecked = e.target.checked;
    this.setState({ ChkNew: isChecked, ChkInKitchen: isChecked, ChkReady: isChecked, ChkCancelled: isChecked, ChkDelivered: isChecked, ChkBooking: isChecked, ChkPreOrder: isChecked,  ChkAll: isChecked }, () => {
      this.setState({ ShowLoader: true });
      this.GetOrdersByStatus();
      this.SetSelectedStatus();
    })


  }

  HandleOrderStatusCheck(e, status) {

    let isChecked = e.target.checked

    switch (Number(status)) {
      case 0:
        this.state.ChkNew = isChecked
        break;
      case 1:
        this.state.ChkInKitchen = isChecked
        break;
      case 2:
        this.state.ChkReady = isChecked
        break;
      case 3:
        this.state.ChkCancelled = isChecked
        break;
      case 4:
        this.state.ChkDelivered = isChecked
        break;
      case 6:
        this.state.ChkBooking = isChecked
        break;
      case 7:
        this.state.ChkPreOrder = isChecked
        break;
     
        default:
        break;
    }
    this.setState({ ShowLoader: true });
    this.GetOrdersByStatus();
    // this.SetSelectedStatus();

  }

  HandleDateChange = (date,isEndDate) => {
        
    let isDateValid = true;

    if(isEndDate) {
        
        isDateValid = date > this.state.StartDate
        this.setState({ EndDate: date, ValidDate: isDateValid },() => {
        });
    }
    else {

        if(this.state.EndDate !== ""){
        isDateValid = date < this.state.EndDate
        }
        this.setState({ StartDate: date, ValidDate: isDateValid },() => {
        });
    }

   
};

  OrderSorting(orders) {

    let sortedOrders = [];
    let sortedFilterOrders = [];

    var order = orders.filter(order => {
      if (Number(order.OrderStatus) == 0) {
        sortedFilterOrders.push(order);
      }
    });

    sortedFilterOrders.sort((a, b) => a.Id - b.Id);
    sortedOrders.push.apply(sortedOrders, sortedFilterOrders);
    sortedFilterOrders = [];

    order = orders.filter(order => {
      if (Number(order.OrderStatus) == 1) {
        sortedFilterOrders.push(order);
      }
    })

    sortedFilterOrders.sort((a, b) => a.Id - b.Id);
    sortedOrders.push.apply(sortedOrders, sortedFilterOrders);
    sortedFilterOrders = [];

    order = orders.filter(order => {
      if (Number(order.OrderStatus) == 2) {
        sortedFilterOrders.push(order);
      }
    })

    sortedFilterOrders.sort((a, b) => a.Id - b.Id);
    sortedOrders.push.apply(sortedOrders, sortedFilterOrders);
    sortedFilterOrders = [];

    order = orders.filter(order => {
      if (Number(order.OrderStatus) == 4) {
        sortedFilterOrders.push(order);
      }
    })


    sortedFilterOrders.sort((a, b) => b.Id - a.Id);
    sortedOrders.push.apply(sortedOrders, sortedFilterOrders);
    sortedFilterOrders = [];

    order = orders.filter(order => {
      if (Number(order.OrderStatus) == 6) {
        sortedFilterOrders.push(order);
      }
    })



    order = orders.filter(order => {
      if (Number(order.OrderStatus) == 3) {
        sortedFilterOrders.push(order);
      }
    })

    sortedFilterOrders.sort((a, b) => b.Id - a.Id);
    sortedOrders.push.apply(sortedOrders, sortedFilterOrders);
    sortedFilterOrders = [];

    order = orders.filter(order => {
      if (Number(order.OrderStatus) == 5) {
        sortedFilterOrders.push(order);
      }
    })

    sortedFilterOrders.sort((a, b) => b.Id - a.Id);
    sortedOrders.push.apply(sortedOrders, sortedFilterOrders);

    this.setState({ FilterOrders: sortedOrders }, ()=> {
      this.MergeColumnsForSearch(this.state.FilterOrders);
    });

  }



  GetOrdersByStatus() {

    let orders = this.state.EnterpriseOrders;

    let accptedOrders = orders.filter(order => {
      return (Number(order.OrderStatus) !== 3)
    })

    let selected = true

    let order = orders.filter(order => {

      switch (Number(order.OrderStatus)) {

        case 0:
          if (!Utilities.stringIsEmpty(order.PreOrderTime)) {
            var date = moment(order.PreOrderTime).format('YYYY-MM-DD HH:mm:ss');
            var today = new Date(moment.tz(Config.Setting.timeZone).format("YYYY-MM-DDTHH:mm:ss"));
            var diff = moment.duration(moment(date).diff(moment(today)));
            var hours = parseInt(diff.asHours());
            var min = parseInt(diff.asMinutes());
            selected = min < Config.Setting.preOrderAcceptDuration && this.state.ChkNew  || (min >= Config.Setting.preOrderAcceptDuration && this.state.ChkPreOrder && Number(order.OrderType) !== 4) ;
            } else { selected = this.state.ChkNew || this.state.ChkPreOrder && Number(order.OrderType) !== 4 && (!Utilities.stringIsEmpty(order.PreOrderTime)) };

          break;
        case 1:
          selected = this.state.ChkInKitchen
          break;
        case 2:
          selected = this.state.ChkReady
          break;
        case 3:
          selected = this.state.ChkCancelled
          break;
        case 4:
          selected = this.state.ChkDelivered
          break;
        case 6:
          selected = this.state.ChkBooking
          break;


        default:
          break;
      }

      return selected;
    });

    let totalCardsAmount = 0, totalCashAmount = 0, totalAmount = 0, totalCancelledAmount = 0, totalDiscountedAmount = 0;

    orders.forEach(orderSummary => {


      orderSummary.PaymentModes.forEach(mode => {

        if (Number(orderSummary.OrderStatus) !== 3) {
          Number(mode.PaymentMode) === 1 ? totalCashAmount += Number(mode.Amount) : totalCardsAmount += Number(mode.Amount)
          totalAmount += Number(mode.Amount);
        } else {
          totalCancelledAmount += Number(mode.Amount)
        }

      });

    });

    setTimeout(
      function () {
        this.OrderSorting(order);
        this.setState({ShowButtonLoader: false,
          ShowLoader: false, TotalOrders: orders[0].Id > 0 ? orders.length : 0, TotalCardsAmount: totalCardsAmount, TotalCashAmount: totalCashAmount, TotalAmount: totalAmount + totalCancelledAmount, TotalCancelledAmount: totalCancelledAmount,
          ChkAll: this.state.ChkNew && this.state.ChkInKitchen && this.state.ChkReady && this.state.ChkDelivered && this.state.ChkCancelled && this.state.ChkBooking && this.state.ChkPreOrder

        });

        this.bindDataTable();
      }
        .bind(this),
      100
    );

  }

  GetOrdersCount(orders, status, isPreOrder) {


    if (orders === null || orders[0].Id == 0) {
      return;
    }

    let filterOrder = orders.filter(order => {
      return (Number(order.OrderStatus) === status)
    });


    if (Number(status) === 0 && filterOrder.length === 0) {
      PlayOrStop(false);
    }

    if (Number(status) === 0 && filterOrder.length > 0 && !isPreOrder) {

      filterOrder = filterOrder.filter(order => {

        if (!Utilities.stringIsEmpty(order.PreOrderTime)) {

          var date = moment(order.PreOrderTime).format('YYYY-MM-DD HH:mm:ss');
          var today = new Date(moment.tz(Config.Setting.timeZone).format("YYYY-MM-DDTHH:mm:ss"));
          var diff = moment.duration(moment(date).diff(moment(today)));
          var hours = parseInt(diff.asHours());
          var min = parseInt(diff.asMinutes());
          return min < Config.Setting.preOrderAcceptDuration ;
        } 

        else { return true };

      });

      if (!this.state.IsStopped && filterOrder.length > 0) {
       
      } else {
        PlayOrStop(false);
      }
    } 

    if (Number(status) === 0 && filterOrder.length > 0 && isPreOrder) {

      filterOrder = filterOrder.filter(order => {

        if (!Utilities.stringIsEmpty(order.PreOrderTime)) {

          var date = moment(order.PreOrderTime).format('YYYY-MM-DD HH:mm:ss');
          var today = new Date(moment.tz(Config.Setting.timeZone).format("YYYY-MM-DDTHH:mm:ss"));
          var diff = moment.duration(moment(date).diff(moment(today)));
          var hours = parseInt(diff.asHours());
          var min = parseInt(diff.asMinutes());
          return min >= Config.Setting.preOrderAcceptDuration && Number(order.OrderType) !== 4;
        } 
        
        else { return false };

      });

    }

    return filterOrder.length > 0 ?  filterOrder.length : "";
  }


  GetBookingOrdersCount(orders) {

    if (orders === null) {
      return;
    }

    let filterOrder = orders.filter(order => {
      return (Number(order.OrderType) === 4 || Number(order.OrderStatus) == 6)
    });


    return filterOrder.length > 0 ?  filterOrder.length : "";
  }

  GetEnterpriseOrders = async (userId) => {

    this.setState({ ShowLoader: true, ShowReportLoader: true });
    this.ResetStatisticsValues();

    var data = await EnterpriseOrderService.GetBy(moment().format("YYYY-MM-DD"), moment().format("YYYY-MM-DD"), userId);
    var orders = data;
    var userInfo = {};
    
    if(orders[0] !== undefined) {

          userInfo = {Name: orders[0].ConsumerName, 
          DisplayName: orders[0].ConsumerName, 
          Mobile: orders[0].MobileNo, 
          Email: orders[0].ConsumerEmail, 
          RegistrationAt: orders[0].UserCreatedOn, 
          FirstOrderDate: orders[0].FirstOrderDate, 
          LastOrderDate: orders[0].LastOrderDate,
          CashbackEarned: orders[0].CashbackEarned,
          TotalVouchersRedeem: orders[0].TotalVouchersRedeem,
          SearchText: orders[0].ConsumerName,
          AppOpenDate: orders[0].AppOpenDate ,
          AppVersion: orders[0].AppVersion ,
          Source: orders[0].Source ,
          TotalReferral: orders[0].TotalReferral,
          TotalDevices: orders[0].TotalDevices,
          
        }

    }
    // console.log("Orders:", orders);

    this.SetStatisticsValues(orders,userInfo);
    if (orders.length > 0) {
      this.setState({ IsParent: data[0].IsParent === '1', UserInfo: userInfo, SearchText: orders[0].ConsumerName });
    } else {
      
    }

    this.setState({ EnterpriseOrders: Utilities.stringIsEmpty(data) ? [] : data,
       FilterOrders: Utilities.stringIsEmpty(data) ? [] : data, 
       ShowButtonLoader: false,  
       SelectedUserId: userId, 
       ShowReportLoader: false
    }, ()=> {
      this.MergeColumnsForSearch(this.state.FilterOrders);
    });
    this.GetOrdersByStatus();
    this.SetSelectedStatus();

  }

  GetAllUsers = async (searchText) => {
    
    var data = await UserService.GetAll(searchText);
    // console.log(data);
    var users = [];
    data.forEach( user => {
      users.push({Id: user.Id, 
        DisplayName: !Utilities.stringIsEmpty(user.DisplayName) ? user.DisplayName :  `${user.FirstName} ${user.SurName}`,
        FullName: !Utilities.stringIsEmpty(user.DisplayName) && !Utilities.stringIsEmpty(user.FirstName) && !Utilities.stringIsEmpty(user.SurName) ? ` (${user.FirstName} ${user.SurName})` : '',
        LastOrderDate: moment(user.LastOrderDate).format("DD MMM YYYY"),
        FirstOrderDate: moment(user.FirstOrderDate).format("DD MMM YYYY"),
        Mobile: user.Mobile1, 
        Email: user.PrimaryEmail, 
        RegistrationAt: moment(user.CreatedOn).format("DD MMM YYYY"), 
      });
    })

    if(data.length > 0) {
    this.setState({ UserList: users, FilterUsers: users});
    }
  }


  componentDidMount() {


    // window.addEventListener('popstate', function(event) {
    //   window.history.pushState(null, '', document.URL);
    //   event.stopImmediatePropagation();
      
    // }, false);


    window.addEventListener('popstate', function(event) {
     
      var id = document.URL.split('/')[document.URL.split('/').length - 1];
        window.location.href = '/reports/user-orders/' + id;
    }, false);
    
    var id = this.props.match.params.id;
    if(id !== undefined){
      this.GetEnterpriseOrders(id);
    } else {
      this.setState({ ShowLoader: false });
    }

  }

  componentWillUnmount() {
   

    var id = this.props.match.params.id;
    if(id !== undefined){
      this.GetEnterpriseOrders(id);
    } else {
      this.setState({ ShowLoader: false });
    }
      // super.componentWillUnmount();
      // // Unbind listener
      // this.backListener();

       PlayOrStop(false);
  }



  bindDataTable() {
    $("#tblOrders").DataTable().destroy();
    $('#tblOrders').DataTable({
      "paging": true,
      "ordering": false,
      "info": false,
      "pageLength": 50,
      "lengthChange": false,
      "search": {
        "smart": false
      },
      "language": {
        "searchPlaceholder": "Search",
        "search": ""
      }

    });
  }

  setOrderTypeIcon = (orderType) => {
    if (orderType === 1) {
      return (
        <span className="info-detail-icon deliver-bg">
          <i className="fa fa-motorcycle"></i>
        </span>
      )
    } else if (orderType === 2) {
      return (
        <span className="info-detail-icon collection-bg">
          <i className="fa fa-shopping-bag" aria-hidden="true"></i>
        </span>
      )
    } else if (orderType === 3) {
      return (
        <span className="info-detail-icon eatin-bg">
          <i className="fa fa fa-cutlery" aria-hidden="true"></i>
        </span>
      )
    }
    else if (orderType === 4) {
      return (
        <span className="info-detail-icon tableBooking-bg">
          <i className="fa fa fa-cutlery" aria-hidden="true"></i>
        </span>
      )
    }
  }

  MergeColumnsForSearch = (filterOrders) => {

    filterOrders.forEach((order)=> {

      var allColumns = Object.keys(order).map(function(key) {
       
        if(key == 'OrderType'){
          let paymentMode = "BY CARD";
          order.PaymentModes.forEach(mode => {
         if (Number(mode.PaymentMode) === 1 && Number(order.TotalAmount > 0)) {
          paymentMode = "BY CASH";
          if (Number(order.OrderStatus) === 4) {
            paymentMode = "PAID CASH";
          }
      }
    });
    return paymentMode;

      }
        
        
        return key == "Token" || key == "EnterpriseId" || key == "OrderStatus" || key == "UserId" || key == "RiderInfo" || key == "PaymentModes" ? "" : order[key];

    });

    var mergedColumns = ""

    allColumns.forEach((orderValues)=> {
    
      mergedColumns += orderValues + "^^^";

    })

    order.AllColumns = Utilities.SpecialCharacterDecode(mergedColumns);
    this.setState({FilterOrders: filterOrders});
   
  });
}


  setOrderStatus = (orderStatus, type, preOrderTime) => {

    let statusText = Number(orderStatus) === 0 ? "New" : Number(orderStatus) === 1 ? "In-Kitchen" : "Ready";
    
    if (orderStatus < 3) {

    if (!Utilities.stringIsEmpty(preOrderTime)) {
      var date = moment(preOrderTime).format('YYYY-MM-DD HH:mm:ss');
      var today = new Date(moment.tz(Config.Setting.timeZone).format("YYYY-MM-DDTHH:mm:ss"));
      var diff = moment.duration(moment(date).diff(moment(today)));
      var min = parseInt(diff.asMinutes());
      if(min >= Config.Setting.preOrderAcceptDuration) {
        
        if(type !== 4) {
          statusText = "Pre-Order";
        } else {
          statusText = "Booking";
        }
        }

      }
    }

     else if (orderStatus === 3) {
        statusText = "Cancelled";
        
    } else if (orderStatus === 4) {
      statusText = "Delivered";
     
    } else if (orderStatus === 6) {
      statusText = "Booked";
    }

    return (
      // <Dropdown className="padding-dropdown hide-arrow-status">
       
      //   <Dropdown.Toggle variant="secondary" >
      //     <span>{statusText}</span>
      //   </Dropdown.Toggle>
      // </Dropdown>
      <span className={`o-status-badge ${this.orderStatusColor(orderStatus)}`}>{statusText}</span>
    )


  }

  setPreOrderTime = (preOrderTime, orderType, status, completionTime) => {

    var ServingTime = !Utilities.stringIsEmpty(preOrderTime) && (Number(status) === 0 || Number(status) === 6)? moment(preOrderTime).format("DD MMM YYYY hh:mm") : Number(status) > 0 && Number(status) != 3 ? moment(completionTime).format("DD MMM YYYY hh:mm") : "-";

    return (<div ><div><span className="Common-label-all-order">{this.GetOrderType(Number(orderType))} Time</span></div><span className="common-o-label">{ServingTime}</span></div>)
  }

  GetOrderType(type) {

    var OrderType = "Delivery";

    if (type === 2)
      OrderType = "Pick-up";

    if (type === 3)
      OrderType = "Room Service";


    if (type === 4)
      OrderType = "Booking";

    if (type === 12)
      OrderType = "Shop";

    return OrderType;

  }

  GetPercentage(value, total) {

    var percentage = Number(total) > 0 ?  parseFloat((Number(value) / Number(total)) * 100).toFixed(1) :  0;
    return percentage > 0 ? (Number(total) > 0 ? <span style={{"fontSize": "12px", "fontWeight": "100"}}>{` ${percentage}%`}</span>  : "") : '';

  }

  SetPaidClass(paymentModes, status, payableAmount) {

    let className = "value-paid";
    paymentModes.forEach(mode => {
      if ((Number(mode.PaymentMode) === 1 || Number(mode.PaymentMode) === 6 || Number(mode.PaymentMode) === 7) && Number(status) !== 4 && Number(payableAmount > 0)) {
        className = "value-paid not-paid";
      }
    });
    return className;

  }

  SetPaymentMode = (paymentModes, status, payableAmount) => {

    let paymentMode = "BY CARD";
    paymentModes.forEach(mode => {
      if (Number(mode.PaymentMode) === 1 && Number(payableAmount > 0)) {
        paymentMode = "BY CASH";
        if (Number(status) === 4) {
          paymentMode = "PAID CASH";
        }
      }  else if(Number(mode.PaymentMode) === 5 && Number(payableAmount > 0)){
        paymentMode = "Pay by Card (Terminal)";
      } else if(Number(mode.PaymentMode) === 2){
        paymentMode = "Online Payment";
      } else if (Number(mode.PaymentMode) === 6 && Number(payableAmount > 0)) {
        paymentMode = "Post to Room";
      } else if (Number(mode.PaymentMode) === 7 && Number(payableAmount > 0)) {
        paymentMode = "Bank Transfer";
      }
    });
    return paymentMode;
  }

  ShowPaymentMode(paymentModes,status,payableAmount){
    
    let show = true;
    paymentModes.forEach(mode => {
      if ((Number(mode.PaymentMode) === 1 || Number(mode.PaymentMode) === 5 || Number(mode.PaymentMode) === 6 || Number(mode.PaymentMode) === 7) && Number(status) === 4) {
        show = false;
      }
    });
    return show;
  }

  SetDateFormat(orderDate, status) {

    //var date = orderDate

    if (Number(status) == 0 || Number(status) == 1 || Number(status) == 2) {

      var date = moment(orderDate).format('YYYY-MM-DD');
      // var today = moment(new Date()).format('YYYY-MM-DD');
      var today = new Date(moment.tz(Config.Setting.timeZone).format("YYYY-MM-DD"));

      if (moment(date).isSame(today, 'day')) {
        return moment(orderDate).format('h:mm a')
      }
    }

    return moment(orderDate).format('DD MMM YYYY  h:mm a')

  }


  setWaitingSince = (orderDate) => {


    orderDate = new Date(orderDate);
    var date2 = new Date(moment.tz(Config.Setting.timeZone).format("YYYY-MM-DDTHH:mm:ss"));

    var sec = date2.getTime() - orderDate.getTime();
    if (isNaN(sec)) {
      //alert("Input data is incorrect!");
      return '';
    }

    if (sec < 0) {
      //alert("The second date ocurred earlier than the first one!");
      return '0  sec ago';
    }

    var second = 1000, minute = 60 * second, hour = 60 * minute, day = 24 * hour;
    var days = 0, hours = 0, minutes = 0, seconds = 0;
    // days = Math.floor(sec / day);
    // sec -= days * day;
    hours = Math.floor(sec / hour);
    sec -= hours * hour;
    minutes = Math.floor(sec / minute);
    sec -= minutes * minute;
    seconds = Math.floor(sec / second);

    return hours + "h " + minutes + "m";
  }

  viewOrderDetail(token, id) {
      this.setState({
      openIframeModal: true,
      iframeUrl: Config.Setting.baseUrl + '/m/' + token,
      SelectedOrderId: id,

    })
  }


  OnItemSelect(value){

    this.state.UserName = "";
    let user = this.state.UserList.filter((user) => {
        return user.Id == value
    });

    if(user[0].Id == this.state.SelectedUserId){
      this.setState({ ShowButtonLoader: false, ShowReportLoader: false, SearchText: user[0].DisplayName});
      return;
    }

    this.setState({UserInfo: user[0], UserName: user[0].DisplayName , SearchText: user[0].DisplayName, EnterpriseOrders: [], ShowButtonLoader: false,  SelectedUserId: user[0].Id, ShowReportLoader: false}, () =>{
      
      // this.setState({ ShowButtonLoader: false, ShowReportLoader: false,
      // this.props.history.push(`/reports/user-orders/${user[0].Id}`);
      window.history.pushState('report', 'user-report', `/reports/user-orders/${user[0].Id}`);

      this.GetEnterpriseOrders(user[0].Id);
    });
    
     
    
    }

    SearchUsers(e,value) {
  
        let searchText = value;
     
        this.setState({SearchText: searchText,FilterUsers: []});
        this.state.FilterUsers = [];
        // return;
        if(value.length < 3) return;
      
        let filteredData = []
        if (searchText.toString().trim() === '') {
          return;
        }
        // console.log("User:", this.state.FilterUsers);
         
        this.GetAllUsers(searchText);

      
        // filteredData = this.state.UserList.find((user) => {
          
        //   return user.Name.toUpperCase().includes(searchText.toUpperCase());
        // })


        // filteredData = this.state.UserList.filter((user) => {
        // let arr = searchText.toUpperCase();
        // let isExists = false;
      
        //     if (user.Name.toUpperCase().indexOf(arr) !== -1) {
        //           isExists = true   
        //   }
      
        //   return isExists
        // })
      
        // this.setState({ FilterUsers: filteredData});
      }



  loading = () => <div className="allorders-loader">
    <div className="loader-menu-inner">
      <Loader type="Oval" color="#ed0000" height={50} width={50} />
      <div className="loading-label">Loading.....</div>
    </div>
  </div>




  toggleModal = () => {
    this.setState({
      openIframeModal: !this.state.openIframeModal
    })
  }
  toggleRiderModal = () => {
    this.setState({
      openRiderModal: !this.state.openRiderModal
    })
  }

  orderStatusColor =(status, type)=>{
    var orderStatusColor = ""
    if(status==0){
     orderStatusColor = "o-new-bg";
    }
    else if(status==1){
        orderStatusColor = "o-kitchen-bg";
      }
    
    else if(status==2){
      orderStatusColor = "o-ready-bg";
    }
    else if(status==3){
      orderStatusColor = "o-canceled-bg";
    }
    else if(status==4){
      orderStatusColor = "o-delivered-bg";
    }
   return orderStatusColor;
  }



  render() {

    var orders =  this.state.FilterOrders
    const columns = [
      {
        name: "AllColumns",
        label: "Order Row",
        options: {
          sort: false,
          filter: true,
          customBodyRender: (value, tableMeta, updateValue) => (
            <>
              <div className="c-order-row c-order-row-resp">

                <div className="col-c-warp  w-auto flex-1">
                <div style={{cursor: 'pointer'}} onClick={() => this.props.history.push(`/order-detail/${orders[tableMeta.rowIndex].EnterpriseId}/${orders[tableMeta.rowIndex].OrderToken}/${orders[tableMeta.rowIndex].Id}`)}>

                  <div className="order-id-type-wrap">

                    <div className='d-flex flex-row align-items-start'>
                      <div className="order-id">{this.setOrderTypeIcon(Number(orders[tableMeta.rowIndex].OrderType))} <span>#{orders[tableMeta.rowIndex].Id}</span></div>
                      {
                    this.setOrderStatus(Number(orders[tableMeta.rowIndex].OrderStatus), Number(orders[tableMeta.rowIndex].OrderType), orders[tableMeta.rowIndex].PreOrderTime)
                  }

                    </div>
                  </div>
                  </div>

                </div>
                <div className="col-c-warp  w-auto flex-1">
                {this.state.EnterpriseTypeId == 5 || this.state.IsParent ?
                           <div style={{marginTop:"10px", fontWeight:"600", fontSize:"13px", display:"flex", alignItems:"center"}}>
                           <span><img src={Utilities.generatePhotoLargeURL(`${orders[tableMeta.rowIndex].EnterpriseLogo}`)}  
                           style={{ width:"33px", border:"1px solid #d2d2d2", borderRadius:"50%", marginRight:"10px", fontWeight:"bold"}}/></span>
                           <span>{Utilities.SpecialCharacterDecode(orders[tableMeta.rowIndex].RestaurantName)}</span></div>
                         : ""
                        }
                </div>
                <div className="col-c-warp  w-auto flex-1">
                    {/* <div className="Common-label-all-order">Order Placed at</div> */}
                    <div className="time-placed-wrapper"><span className="time-label-format">{moment(orders[tableMeta.rowIndex].OrderDate).format("DD MMM YYYY hh:mm a")}</span></div>
                  </div>
                <div className="col-c-warp  w-auto flex-1">
                  <div className="order-total-r-wrap">
                    {/* <div className="t-label"> ORDER TOTAL</div> */}
                    <div className="t-price">{Utilities.SpecialCharacterDecode(orders[tableMeta.rowIndex].Currency)}{Utilities.FormatCurrency(Number(orders[tableMeta.rowIndex].TotalAmount) + Number(orders[tableMeta.rowIndex].DiscountedAmount), this.state.countryConfigObj?.DecimalPlaces)}</div>
                    {this.ShowPaymentMode(orders[tableMeta.rowIndex].PaymentModes, orders[tableMeta.rowIndex].OrderStatus, orders[tableMeta.rowIndex].TotalAmount) ? <div className={this.SetPaidClass(orders[tableMeta.rowIndex].PaymentModes, orders[tableMeta.rowIndex].OrderStatus, orders[tableMeta.rowIndex].TotalAmount)}>{this.SetPaymentMode(orders[tableMeta.rowIndex].PaymentModes, orders[tableMeta.rowIndex].OrderStatus, orders[tableMeta.rowIndex].TotalAmount)}</div> : ""}
                  </div>
                </div>
                {/* <div className="col-c-warp  w-auto flex-1">
                  {
                    this.setOrderStatus(Number(orders[tableMeta.rowIndex].OrderStatus), Number(orders[tableMeta.rowIndex].OrderType), orders[tableMeta.rowIndex].PreOrderTime)
                  }
                </div> */}
                {/* <div className="col-c-warp  w-auto flex-1 ">
                  {this.state.EnterpriseTypeId == 5 || this.state.IsParent ?

                    <div className="restaurant-name-wrapper align-items-center d-flex"><span className="commmon-label  m-b-5">{Utilities.SpecialCharacterDecode(orders[tableMeta.rowIndex].RestaurantName)}</span><span>
                     
                    </span>
                    </div> : ""
                  }
                </div> */}
              </div>

              <div className="all-order-row d-none">
                <div className="all-order-inner-row">
                  <div className="left-order-row" >
                    <div onClick={() => this.props.history.push(`/order-detail/${orders[tableMeta.rowIndex].EnterpriseId}/${orders[tableMeta.rowIndex].OrderToken}/${orders[tableMeta.rowIndex].Id}`)}>

                      <div className="order-id-type-wrap">

                        <div>
                          <div className="order-id">{this.setOrderTypeIcon(Number(orders[tableMeta.rowIndex].OrderType))} <span>#{orders[tableMeta.rowIndex].Id}</span></div>
                          <div className="Common-label-all-order"> {orders[tableMeta.rowIndex].Source} </div>

                        </div>
                      </div>
                    </div>

                  </div>
                  <div className="right-order-row">
                    <div>
                      <div className="order-total-r-wrap">
                        <div className="t-label"> ORDER TOTAL</div>
                        <div className="t-price">{Utilities.GetCurrencySymbol()}{Utilities.FormatCurrency(Number(orders[tableMeta.rowIndex].TotalAmount) + Number(orders[tableMeta.rowIndex].DiscountedAmount), this.state.countryConfigObj?.DecimalPlaces)}</div>
                        {this.ShowPaymentMode(orders[tableMeta.rowIndex].PaymentModes, orders[tableMeta.rowIndex].OrderStatus, orders[tableMeta.rowIndex].TotalAmount) ? <div className={this.SetPaidClass(orders[tableMeta.rowIndex].PaymentModes, orders[tableMeta.rowIndex].OrderStatus, orders[tableMeta.rowIndex].TotalAmount)}>{this.SetPaymentMode(orders[tableMeta.rowIndex].PaymentModes, orders[tableMeta.rowIndex].OrderStatus, orders[tableMeta.rowIndex].TotalAmount)}</div> : ""}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="order-row-flex-none">
                  <div className="dropdown-print-wrap">
                    {
                      this.setOrderStatus(Number(orders[tableMeta.rowIndex].OrderStatus), Number(orders[tableMeta.rowIndex].OrderType), orders[tableMeta.rowIndex].PreOrderTime)
                    }
                  </div>
                </div>
                <div >

                  {this.state.EnterpriseTypeId == 5 || this.state.IsParent ?

                    <div className="restaurant-name-wrapper res-name-new-wrp">
                      <span className="commmon-label  m-b-5">{Utilities.SpecialCharacterDecode(orders[tableMeta.rowIndex].RestaurantName)}</span>
                      <span>
                      <p className="commmon-label common-label-color m-b-10">{orders[tableMeta.rowIndex].Landline1}</p>
                      <p className="commmon-label common-label-color m-b-10">{orders[tableMeta.rowIndex].Landline2}</p>
                    </span>
                    </div> : ""
                  }
                </div>


              </div>
              </>
          )
        }
      },
    ];

    const options = {
      filterType: '',
      searchOpen: false,
      selectableRowsHideCheckboxes:false,
      selectableRowsOnClick:false,
      sort:false,
      sortFilterList:false,
      print:false,
      download:false,
      filter:false,
      viewColumns:false,
      searchPlaceholder:'Search',
      selectableRows:'none',
      selectableRowsHeader:false,
      responsive:'standard',
      rowsPerPage: 100,
      textLabels: {
          body: {
            noMatch: this.state.loader ? <div><Loader /></div> : "Sorry, no matching records found",
            toolTip: "Sort",
            columnHeaderTooltip: column => `Sort for ${column.label}`
          }
      },
      onTableChange: this.saveSettings
  };

    return (
      <Fragment>
        <div className="card" id="orderWrapper">

        

        <div className="all-order-drop-down  card-new-title p-l-r-0">
              <h3 className="order-drop-dwon-set d-flex w-100 align-items-center flex-wrap align-items-md-center">
              <span className="mr-4 mb-res-3">Customer Report</span>
              <div className="all-order-drop-down  card-new-title p-l-r-0 mb-0">
            <div className="input-group h-set-new dataTables_filter order-inner-m mb-0 orders-auto-set">
                                    <Autocomplete 
                                   
                                     className="form-control"
                                     style={{paddingLeft:'35px'}}
                                    getItemValue={(item) => String(item.Id)}
                                    items={this.state.FilterUsers}
                                    renderItem={(item, isHighlighted) =>
                                    <div style={{ background: isHighlighted ? 'lightgray' : 'white'}}>
                                    <p style={{color: '#333'}}>{item.DisplayName} <span className="t-label">{item.FullName}</span> </p>
                                    <p className="t-label">{item.Mobile}  </p>
                                    <p className="t-label">{item.Email}</p>
                                        </div>
                                    }
                                    placeholder="Search User"
                                value={this.state.SearchText}
                                onChange={(event, value) => this.SearchUsers(event,value)}
                                onSelect={(value) => this.OnItemSelect(value)}
                                selectOnBlur={true}
                                />
                                    </div> 

                             </div> 
              </h3>
             
            </div>

        
          
          
          
          <div className="card-body" >
          { this.state.ShowReportLoader ?  <div style={{minHeight: 600}} className="d-flex w-100 align-items-center justify-content-center"> 
            <div className="loader-menu-inner">
      <Loader type="Oval" color="#ed0000" height={50} width={50} />
      <div className="loading-label">Loading.....</div>
    </div>
     </div> : 
                 this.state.EnterpriseOrders.length == 0 ? 
                 <div  className="d-flex w-100 align-items-center justify-content-center"> 
                     <p>{Utilities.stringIsEmpty(this.state.UserName) ? "Please search user" : ''}</p>
                   </div>
              
         : 

           <div>

          <div className="order-r order-report-user-info" style={{background: 'none !important'}}>
                <div className="total-r-label ">
                  <span className="t-label">Name</span>
                  <span>{this.state.UserInfo.DisplayName}</span>
                 
                </div>
                <div className="total-r-label ">
                  <span className="t-label">Mobile</span>
                  <span>{this.state.UserInfo.Mobile}</span>
                  <span>{this.state.UserInfo.Email}</span>
                </div>
                <div className="total-r-label r ">
                  <span className="t-label">Registration Date</span>
                 {Object.keys(this.state.UserInfo).length > 0 && <span>{this.state.UserInfo.RegistrationAt}</span>}
                </div>
                <div className="total-r-label ">
                  <span className="t-label">First Order Date</span>
                  {Object.keys(this.state.UserInfo).length > 0 &&  <span>{this.state.UserInfo.FirstOrderDate}</span>}
                </div>
                <div className="total-r-label r">
                  <span className="t-label">Last Order Date </span>
                  {Object.keys(this.state.UserInfo).length > 0 && <span>{this.state.UserInfo.LastOrderDate}</span>}
                </div>
              </div>


              <div className="order-r order-report-user-info" style={{background: 'none !important'}}>
                <div className="total-r-label ">
                  <span className="t-label">Cashback Earned To Date</span>
                  <span>{Utilities.GetCurrencySymbol()}{Number(this.state.CashbackEarned) > 0 ? Utilities.FormatCurrency(this.state.CashbackEarned,2)  : "0"}</span>
                 
                </div>
                <div className="total-r-label ">
                  <span className="t-label">Vouchers Redeemed</span>
                  <span>{Number(this.state.TotalVouchersRedeem) > 0 ? this.state.TotalVouchersRedeem : "0"}</span>
                </div>
                <div className="total-r-label r ">
                  <span className="t-label">App Version</span>
                 {Object.keys(this.state.UserInfo).length > 0 && <span>{this.state.UserInfo.AppVersion}{(this.state.UserInfo.TotalDevices) > 0 ? `(${this.state.UserInfo.TotalDevices} ${Number(this.state.UserInfo.TotalDevices) > 1 ? "devices" : "device"}` : ''}</span>}
                </div>
                <div className="total-r-label ">
                  <span className="t-label">App Open Date</span>
                  {Object.keys(this.state.UserInfo).length > 0 &&  <span>{this.state.UserInfo.AppOpenDate}</span>}
                </div>
                <div className="total-r-label r">
                  <span className="t-label">Reg. Source</span>
                  {Object.keys(this.state.UserInfo).length > 0 && <span>{this.state.UserInfo.Source}</span>}
                </div>
              </div>

              <div className="order-r order-report-user-info" style={{background: 'none !important'}}>
                <div className="total-r-label ">
                  <span className="t-label">Total Referrals</span>
                  <span>{this.state.UserInfo.TotalReferral > 0 ? this.state.UserInfo.TotalReferral : "0"}</span>
                </div>
              </div>

          {this.state.ShowButtonLoader &&   <p className="info-msg-on-label font-12 " role="alert">Working on your request, please wait.</p>}

          <div className="order-r">
                <div className="total-r-label ">
                  <span className="t-label">Total Orders</span>
                  <span>{Utilities.FormatCurrency(this.state.TotalOrders,0)}</span>
                </div>
                <div className="total-r-label r ">
                  <span className="t-label">Total Amount</span>
                  <span>{Utilities.GetCurrencySymbol()}{Utilities.FormatCurrency(this.state.TotalAmount, this.state.countryConfigObj?.DecimalPlaces)}</span>
                </div>
                <div className="total-r-label ">
                  <span className="t-label">Cash Total</span>
                  <span>{Utilities.GetCurrencySymbol()}{Utilities.FormatCurrency(this.state.TotalCashAmount, this.state.countryConfigObj?.DecimalPlaces)}</span>
                </div>
                <div className="total-r-label r">
                  <span className="t-label">Online Payments </span>
                  <span>{Utilities.GetCurrencySymbol()}{Utilities.FormatCurrency(this.state.TotalCardsAmount, this.state.countryConfigObj?.DecimalPlaces)}</span>
                </div>
                <div className="total-r-label r">
                  <span className="t-label">Cancelled ({this.GetOrdersCount(this.state.EnterpriseOrders, 3)}) </span>
                  <span style={{ color: "#ed0000" }}>{Utilities.GetCurrencySymbol()}{Utilities.FormatCurrency(this.state.TotalCancelledAmount, this.state.countryConfigObj?.DecimalPlaces)}</span>
                </div>
              </div>
          
          <div className="order-status-main-wrap mt-4 mb-4">
            <div className="order-list-col-1">
                <ul>
                  <li>
                    <i className="fa fa-motorcycle"></i>
                    <span className="list-n-label">
                      Delivery
                    </span>
                    <span className="bold">{this.state.DeliveryOrderCount}{this.GetPercentage(this.state.DeliveryOrderCount,this.state.TotalOrders)}</span>
                  </li>
                  <li>
                    <i className="fa fa-shopping-bag"></i>
                    <span className="list-n-label">
                      Pick-up
                    </span>
                    <span className="bold">{this.state.CollectionOrderCount}{this.GetPercentage(this.state.CollectionOrderCount,this.state.TotalOrders)}</span>
                  </li>
                  <li>
                    <i className="fa fa fa-cutlery"></i>
                    <span className="list-n-label">
                      Room Service
                    </span>
                    <span className="bold">{this.state.EatInOrderCount}{this.GetPercentage(this.state.EatInOrderCount,this.state.TotalOrders)}</span>
                  </li>
                  <li>
                    <i className="fa fa-table"></i>
                    <span className="list-n-label">
                      Booking
                    </span>
                    <span className="bold">{this.state.BookingOrderCount}{this.GetPercentage(this.state.BookingOrderCount,this.state.TotalOrders)}</span>
                  </li>
                </ul>
            </div>
            <div className="order-list-col-1">
                <ul>
                  <li>
                    <i className="fa fa-mobile" style={{fontSize:22}}></i>
                    <span className="list-n-label">
                      App Orders
                    </span>
                    <span className="bold">{this.state.AppsOrderCount}{this.GetPercentage(this.state.AppsOrderCount,this.state.TotalOrders)}</span>
                  </li>
                  <li>
                    <i className="fa fa-globe" style={{fontSize:18}}></i>
                    <span className="list-n-label">
                      Web Orders
                    </span>
                    <span className="bold">{this.state.WebOrderCount}{this.GetPercentage(this.state.WebOrderCount,this.state.TotalOrders)}</span>
                  </li>
                  <li>
                    <i className="fa fa-television"></i>
                    <span className="list-n-label">
                      White Label
                    </span>
                    <span className="bold">{this.state.WhiteLableOrderCount}{this.GetPercentage(this.state.WhiteLableOrderCount,this.state.TotalOrders)}</span>
                  </li>
                </ul>
            </div>
            <div className="order-list-col-1">
                <ul>
                  <li>
                    <i className="fa fa-arrow-up"></i>
                    <span className="list-n-label">
                      High Value
                    </span>
                    <span className="bold">{Utilities.GetCurrencySymbol()}{this.state.HighValueOrderAmount}</span>
                  </li>
                  <li>
                    <i className="fa fa-arrow-down"></i>
                    <span className="list-n-label">
                      Low Value
                    </span>
                    <span className="bold">{Utilities.GetCurrencySymbol()}{this.state.LowValueOrderAmount}</span>
                  </li>
                  <li>
                    <i className="fa fa-arrows-h" style={{fontSize:20}}></i>
                    <span className="list-n-label">
                      Avg.value
                    </span>
                    <span className="bold">{Utilities.GetCurrencySymbol()}{this.state.TotalAmount > 0 ? Utilities.FormatCurrency(Number(this.state.TotalAmount) / Number(this.state.TotalOrders), this.state.countryConfigObj?.DecimalPlaces) : "0"}</span>
                  </li>
                </ul>
            </div>
          </div>

          <div className="order-status-main-wrap mt-4 mb-5">
            <div className="order-list-col-1">
                <ul>
                  <li>
                    <i className="fa fa-ban text-danger"></i>
                    <span className="list-n-label">
                      Cancelled
                    </span>
                    <span className="bold text-danger">{this.state.CancelledOrderCount}</span>
                  </li>
                  <li>
                    <i className="fa fa-percent text-danger"></i>
                    <span className="list-n-label">
                    Cancellation Rate
                    </span>
                    <span className="bold text-danger">{Number(this.state.CancelledOrderCount) > 0 ? Utilities.FormatCurrency(((Number(this.state.CancelledOrderCount) / Number(this.state.TotalOrders)) * 100),2) : "0"}%</span>
                  </li>
                </ul>
            </div>
            <div className="order-list-col-1">
                <ul>
                  <li>
                    <i className="fa fa-credit-card"></i>
                    <span className="list-n-label">
                      Card Orders
                    </span>
                    <span className="bold">{this.state.CardOrderCount}{this.GetPercentage(this.state.CardOrderCount,this.state.TotalOrders)}</span>
                  </li>
                  <li>
                    <i className="fa fa-money"></i>
                    <span className="list-n-label">
                      Cash Orders
                    </span>
                    <span className="bold">{this.state.CODOrderCount}{this.GetPercentage(this.state.CODOrderCount,this.state.TotalOrders)}</span>
                  </li>
                  
                </ul>
            </div>
           
            <div className="order-list-col-1">
                <ul>
                <li>
                    <i className="fa fa-building"></i>
                    <span className="list-n-label">
                    Businesses
                    </span>
                    <span className="bold">{this.state.RestaurantsCount}</span>
                  </li>
                  <li>
                    <i className="fa fa-building"></i>
                    <span className="list-n-label">
                      Orders per Rest.
                    </span>
                    <span className="bold mr-1">{Number(this.state.TotalOrders) > 0 ? parseFloat(Number(this.state.TotalOrders)/Number(this.state.RestaurantsCount)).toFixed(1) : "0"}</span>
                  </li>

                    <li>
                    <i className="fa fa-building"></i>
                    <span className="list-n-label">
                     Orders per Day
                    </span>
                    <span className="bold mr-1">{this.state.OrdersPerDay}</span>
                  </li>
                  
                </ul>
            </div>

            
          </div>

          <div className="order-status-main-wrap mt-4 mb-5">
          <div className="order-list-col-1">
                <ul>
                 
                  
                </ul>
            </div>

          </div>

              <div className="orderlink-wraper">

              <ul>
                <li>
                  <label htmlFor="chkAll">
                    <input type="checkbox" onChange={(e) => this.HandleCheckAll(e)} checked={this.state.ChkAll} value={this.state.ChkAll} className="form-checkbox" name="chkAll" id="chkAll" /> <span className="button-link" > All <span className="badge badge-info">{!Utilities.stringIsEmpty(this.state.EnterpriseOrders) ? (this.state.EnterpriseOrders.length > 0 && this.state.EnterpriseOrders[0].Id > 0 ? this.state.EnterpriseOrders.length : '') : ""}</span></span>
                  </label>
                </li>
                <li>
                  <label htmlFor="chkPreOrder">
                    <input type="checkbox" onChange={(e) => this.HandleOrderStatusCheck(e, 7)} checked={this.state.ChkPreOrder} value={this.state.ChkPreOrder} className="form-checkbox" name="chkBooking" id="chkPreOrder" /> <span className="button-link " > Pre-Order(s) <span className="badge badge-info">{this.GetOrdersCount(this.state.EnterpriseOrders, 0,true)}</span></span>
                  </label>
                </li>
                <li>
                  <label htmlFor="chkNew">
                    <input type="checkbox" onChange={(e) => this.HandleOrderStatusCheck(e, 0)} checked={this.state.ChkNew} value={this.state.ChkNew} className="form-checkbox" name="chkNew" id="chkNew" /> <span className="button-link " > New <span className="badge badge-info">{this.GetOrdersCount(this.state.EnterpriseOrders, 0)}</span></span>
                  </label>
                </li>
                <li>
                  <label htmlFor="chkInKitchen">
                    <input type="checkbox" onChange={(e) => this.HandleOrderStatusCheck(e, 1)} checked={this.state.ChkInKitchen} value={this.state.ChkInKitchen} className="form-checkbox" name="chkInKitchen" id="chkInKitchen" /> <span className="button-link " > In-Kitchen <span className="badge badge-info">{this.GetOrdersCount(this.state.EnterpriseOrders, 1)}</span></span>
                  </label>
                </li>
                <li>
                  <label htmlFor="chkReady">
                    <input type="checkbox" onChange={(e) => this.HandleOrderStatusCheck(e, 2)} checked={this.state.ChkReady} value={this.state.ChkReady} className="form-checkbox" name="chkReady" id="chkReady" /> <span className="button-link " > Ready <span className="badge badge-info">{this.GetOrdersCount(this.state.EnterpriseOrders, 2)}</span></span>
                  </label>
                </li>
                <li>
                  <label htmlFor="chkDelivered">
                    <input type="checkbox" onChange={(e) => this.HandleOrderStatusCheck(e, 4)} checked={this.state.ChkDelivered} value={this.state.ChkDelivered} className="form-checkbox" name="chkDelivered" id="chkDelivered" /> <span className="button-link " > Delivered <span className="badge badge-info">{this.GetOrdersCount(this.state.EnterpriseOrders, 4)}</span></span>
                  </label>
                </li>
                <li>
                  <label htmlFor="chkCancelled">
                    <input type="checkbox" onChange={(e) => this.HandleOrderStatusCheck(e, 3)} checked={this.state.ChkCancelled} value={this.state.ChkCancelled} className="form-checkbox" name="chkCancelled" id="chkCancelled" /> <span className="button-link " > Cancelled <span className="badge badge-info">{this.GetOrdersCount(this.state.EnterpriseOrders, 3)}</span></span>
                  </label>
                </li>
                <li>
                  <label htmlFor="chkBooking">
                    <input type="checkbox" onChange={(e) => this.HandleOrderStatusCheck(e, 6)} checked={this.state.ChkBooking} value={this.state.ChkBooking} className="form-checkbox" name="chkBooking" id="chkBooking" /> <span className="button-link " > Booking <span className="badge badge-info">{this.GetBookingOrdersCount(this.state.EnterpriseOrders,)}</span></span>
                  </label>
                </li>
      
              </ul>

            </div>
            <div className="all-order-res-scroll new-table-set customer-table">
              {/* <table className='table table-striped' id="tblOrders">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}></th>
                  </tr>
                </thead>



              </table> */}
              {this.state.ShowLoader ? this.loading() : 
              <MUIDataTable
                title={""}
                data={this.state.FilterOrders}
                columns={columns}
                options={options}
              />}
            </div>
</div>  }
          
                                
          
          </div> 
      
    
          
          <Modal isOpen={this.state.openIframeModal} toggle={() => this.toggleModal()}>
            <ModalHeader toggle={() => this.toggleModal()} className="order-copy"><span>Order details #{this.state.SelectedOrderId}</span>     <span>{this.state.iframeUrl}</span></ModalHeader>
            <ModalBody className="order-d-res-wrap">
              <Iframe url={this.state.iframeUrl}
                width="100%"
                height='450px'
                frameBorder='0'
              />
            </ModalBody>
            <ModalFooter>
              <div>  <Button color="secondary" onClick={() => {
                this.toggleModal()
              }}>Close</Button></div>
            </ModalFooter>
          </Modal>
        </div>
      </Fragment>

    );
  }
}

export default Orders; 
