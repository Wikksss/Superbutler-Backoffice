import React, { Fragment } from 'react';
import { Tooltip, FormGroup, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader, Table, Alert } from 'reactstrap';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Avatar from 'react-avatar';
import Loader from 'react-loader-spinner';
import Dropdown from 'react-bootstrap/Dropdown';
import "react-tabs/style/react-tabs.css";
import * as OrderService from '../../service/Orders';
import * as OrderDetailService from '../../service/OrderDetail';
import * as Utilities from '../../helpers/Utilities';
import Config from '../../helpers/Config';
import { MdArrowBack, MdDragIndicator, MdDragHandle } from "react-icons/md";
import 'react-pro-sidebar/dist/css/styles.css';
import StarRatings from "../../../node_modules/react-star-ratings";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import * as EnterpriseOrderService from '../../service/Orders';
import 'react-lazy-load-image-component/src/effects/blur.css';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import *as svgIcon from '../../containers/svgIcon';
import { Carousel } from 'react-responsive-carousel';
import Constants from '../../helpers/Constants';
import { AiOutlineShoppingCart } from "react-icons/ai";
import Labels from '../../containers/language/labels';
const moment = require('moment-timezone');
const format = "DD MMM YYYY hh:mm a";
var timeZone = '';
var currency = '';
var taxLabel = "VAT";
var taxPercentage = "0";
class OrderDetail extends React.Component {

  //#region Constructor

  constructor(props) {
    super(props);
    this.state = {
      scrolled: false,
      ReviewCarouselModal: false,
      cancelOrder: false,
      moveToStatus: false,
      MoveToStatusText: "",
      MoveToStatus: "0",
      OrderDuration: new Date(),
      IsSave: false,
      orderDetail: {},
      orderReview: {},
      ShowLoader: true,
      OrderStatusHistory: [],
      EnterpriseActivity: [],
      selectedItemImages: [],
      selectedItemOptions: [],
      selectedItem: {},
      //
      MoveToStatus: "0",
      ReasonError: false,
      ReasonErrorText: 'Please choose reason',
      OtherReasonError: false,
      OtherReasonErrorText: 'Please provide a reason',
      AcceptErrorText: '',
      AcceptError: false,
      OrderDuration: new Date(),
      SelectedOrderEnterpriseId: 0,
      SelectedOrderId: 0,
      SelectedOrderType: 1,
      MoveToStatus: "0",
      StatusText: "",
      MoveToStatusText: "",
      MoveToCancelText: "",
      AddExtraTimeText: "",
      CancelReason: "",
      MoveToCancel: false,
      dropdownOpen: false,
      // token: this.props.match.params.token,
      orderToken: '',
      orderId: 0,
      enterpriseId: 1,
      PrintPage:false,
      token: "",
      extraFieldJson : "",
      countryConfigObj: {},
      enterpriseDetail: {},
    }


    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.COUNTRY_CONFIGURATION))) {
      this.state.countryConfigObj = JSON.parse(localStorage.getItem(Constants.Session.COUNTRY_CONFIGURATION))
    }
    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
      var userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))

      timeZone = Config.Setting.timeZone;
      currency = Config.Setting.currencySymbol;

      if(userObj.EnterpriseRestaurant.Country != null) {
        timeZone = userObj.EnterpriseRestaurant.Country.TimeZone;
        currency = userObj.EnterpriseRestaurant.Country.CurrencySymbol;
        taxLabel = userObj.EnterpriseRestaurant.Country.TaxLabel;
        taxPercentage = userObj.EnterpriseRestaurant.Country.TaxPercentage;
        }

    }

  }


  //#region api calling

  getOrderDetail = async (enterpriseId, token, orderId) => {
    try {
      let response = await OrderService.GetByToken(enterpriseId, token, orderId)
      this.getItemDetail(orderId, enterpriseId)
      if (response.Message == undefined) {
        // console.log("response: new ", response)
        var ExtraFieldJson = ""
        if(response.ExtraFieldJson != undefined && response.ExtraFieldJson != ""){
          for (var i = 0; i < response.ExtraFieldJson.length; i++) {
            ExtraFieldJson = response.ExtraFieldJson.replace(new RegExp("\\" + "^", "gi"), '"');
          }
        }
        this.setState({
          enterpriseDetail: response.RestaurantDetailCsv !="" ? JSON.parse(response.RestaurantDetailCsv) : {},
          orderDetail: response,
          extraFieldJson : ExtraFieldJson !="" ? JSON.parse(ExtraFieldJson) : ExtraFieldJson,
          OrderStatusHistory: [],
          EnterpriseActivity: !Utilities.stringIsEmpty(response.RestaurantActivityJson) ? JSON.parse(response.RestaurantActivityJson) : [],
        })
    } else{

    console.log("error: ", response.Message)
    }


  } catch (error) {
      console.log('something went wrong'.error.message)
  }

  }


  getItemDetail = async (orderId, enterpriseId) => {

    try {
      let response = await OrderDetailService.Get(orderId, enterpriseId)

      if (response.Message == undefined) {
        // console.log("response: new ", response)
        this.setState({items: response})
        }
    else{ console.log("error: ", response.Message) }


  } catch (error) {
      console.log('something went wrong'.error.message)
  }

  this.setState({ ShowLoader: false })
  }


  //#endregion api calling

  hasPaind = (paymentModes, status, payableAmount) => {

    let paid = true;
    paymentModes.forEach(mode => {
      if (Number(mode.PaymentMode) == 1 && Number(payableAmount > 0)) {
        paid = false;
      }
    });
    return paid;
  }

  hasPaid = (paymentModes, status, payableAmount) => {

    let paid = true;
    paymentModes.forEach(mode => {
      if ((Number(mode.PaymentMode) === 1 || Number(mode.PaymentMode) === 5 || Number(mode.PaymentMode) === 6 || Number(mode.PaymentMode) === 7) && Number(status) !== 4 && Number(payableAmount > 0)) {
        paid = false;
      }
    });
    return paid;
  }

  isCardOrder = (paymentModes, payableAmount) => {

    let paid = true;
    paymentModes.forEach(mode => {
      if ((Number(mode.PaymentMode) === 1 || Number(mode.PaymentMode) === 5 || Number(mode.PaymentMode) === 6 || Number(mode.PaymentMode) === 7) && Number(payableAmount > 0)) {
        paid = false;
      }
    });
    return paid;
  }

  DiscountTypeLabel = (type) => {

    var typeLabel = ""

    if(type == 1) typeLabel = "Voucher";

    else if(type == 2) typeLabel = "Cashback"

    return typeLabel;

  }

  SetPaymentMode = (paymentModes, status, payableAmount) => {

    let paymentMode = "BY CASH";
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

  getDateByStatus = (status) => {

    var OrderStatusHistory = this.state.OrderStatusHistory
    var date = "--"
    let index = OrderStatusHistory.findIndex(a => a.OrderStatus == status);

     if(index != -1) date = Utilities.getDateByZone(OrderStatusHistory[index].OrderStatusTime, format);

    return date;

  }


  GetOrderType(type) {

    var OrderType = "Delivery";

    if (type == 2)
      OrderType = "Pick-up";

    if (type == 3)
      OrderType = "Room Service";

    if (type == 4)
      OrderType = "Restaurant & Cafe";

    if (type == 6)
      OrderType = "SPA & Fitness";

    if (type == 7)
      OrderType = "Car Rental";

    if (type == 8)
      OrderType = "Travel & Tours";

    if (type == 9)
      OrderType = "Meeting & Events";

    if (type == 10)
      OrderType = "Housekeeping";

    if (type == 11)
      OrderType = "Laundry";

    if (type == 12)
      OrderType = "Shop";

    if (type == 13)
      OrderType = "Luggage Storage";

    return OrderType;

  }

  setOrderTypeIcon = (orderType) => {
    if (orderType == 1) {
      return (
        <span className="info-detail-icon deliver-bg">
          <svgIcon.DeliveryIcon/>
        </span>
      )
    } else if (orderType == 2) {
      return (
        <span className="info-detail-icon collection-bg">
          <svgIcon.CollectionIcon/>
        </span>
      )
    } else if (orderType == 3) {
      return (
        <span className="info-detail-icon eatin-bg">
          {/* <i className="fa fa fa-cutlery" aria-hidden="true"></i> */}
          <svgIcon.RoomDiningIcon/>
        </span>
      )
    }
    else if (orderType == 4) {
      return (
        <span className="info-detail-icon tableBooking-bg">
          {/* <i className="fa fa fa-cutlery" aria-hidden="true"></i> */}
          <svgIcon.BookedIcon/>
        </span>
      )
    }
    else if (orderType == 6) {
      return (
        <span className="info-detail-icon svg-bg detail-orders-icon">
         <svgIcon.SpaIcon/>
        </span>
      )
    }
    else if (orderType == 7) {
      return (
        <span className="info-detail-icon svg-bg detail-orders-icon">
         <svgIcon.CarRentIcon/>
        </span>
      )
    }
    else if (orderType == 8) {
      return (
        <span className="info-detail-icon svg-bg detail-orders-icon">
         <svgIcon.TourPackageIcon/>
        </span>
      )
    }
    else if (orderType == 9) {
      return (
        <span className="info-detail-icon svg-bg detail-orders-icon">
         <svgIcon.ExecutiveLoungeIcon/>
        </span>
      )
    }
    else if (orderType == 10) {
      return (
        <span className="info-detail-icon svg-bg detail-orders-icon">
         <svgIcon.RoomDiningIcon/>
        </span>
      )
    }
    else if (orderType == 11) {
      return (
        <span className="info-detail-icon svg-bg detail-orders-icon">
         <svgIcon.LaundryIcon/>
        </span>
      )
    }
    else if (orderType == 12) {
      return (
        <span className="info-detail-icon ">
         <svgIcon.ShopIcon/>
        </span>
      )
    }

  }
  GetBackgroundColor(type) {


    var color = "#291f84";

    if (type == 2) {

      color = "#0dac4b";
    } else if(type == 3) {

      color = "#ed0000";
    }
    else if(type == 4) {

      color = "#0dac4b";
    }
      return color;

  }


  getOrderStatus=(status, type)=>{


    var orderStatus = ""
    if (status == 0)
    {
       orderStatus="Pending"
    }
    else if (status == 1){
      orderStatus = "Confirmed";
    }

    else if (status == 2 && type!=2)
    {
      orderStatus = "Dispatch";
    }
    else{
      orderStatus = "Delivered";
    }
    return orderStatus;
  }


  getOrderStatusImage=(status, orderType)=>{


    var imageUrl = `${Config.Setting.baseImageURL}/images/order-recieved.gif`

    if (status == 1){

      imageUrl = `${Config.Setting.baseImageURL}/images/order-confirmed.gif`
    }

    else if (status == 2)
    {
      imageUrl = `${Config.Setting.baseImageURL}/images/ready-to-collect.gif`
    }

    else if (status == 3)
    {
      imageUrl = `${Config.Setting.baseImageURL}/images/cancelled.gif`
    }

    else  if (status == 4 && orderType < 4){

      imageUrl = `${Config.Setting.baseImageURL}/images/delivered.gif`

    }
    else  if (status == 4 && orderType >= 4){

      imageUrl = `${Config.Setting.baseImageURL}/images/order-completed.gif`

    }
    return imageUrl;
  }



	renderOption(option){
		return (
      <div className="d-flex flex-wrap pr-0 pr-0 mb-2">
      <div className="mr-4 font-13 mb-1"><span className="color-p mr-1">{Utilities.SpecialCharacterDecode(option.key)}:</span><span className="bold">{Utilities.SpecialCharacterDecode(option.value)}</span></div>
    </div>
      )
   }
  loadOptions = (options) => {

    var htmlOptions = [];
    try {

            for (var option in options) {
              htmlOptions.push(this.renderOption(options[option]));
            }

            return(htmlOptions.map((optionHtml) => optionHtml))
    }
    catch (e) {
        console.log("error ", e.message)
        return "";
    }

  }

  UpdateCompletionTimeApi = async (order) => {

    var response = await EnterpriseOrderService.AddExtraTime(order);
    this.setState({ IsSave: false })
    this.setState({ TimeError: false })
    var result = await response.json();

    if (!result.HasError && result.Dictionary.IsSuccess) {

      this.setState({addExtraTime: false});
      if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.ADMIN_OBJECT))) {

        // Utilities.notify(order.deliverytime + " mins extra added to order #" + order.orderId + ".", "s");
      }
      this.getOrderDetail(Number(this.state.enterpriseId), this.state.orderToken, Number(this.state.orderId));

    }
    else if (result.HasError) {
      this.setState({ TimeError: true, TimeErrorText: result.ErrorCodeCsv })
    }

  }

  AddExtTime = () => {
    if (this.state.IsSave) return;
    this.setState({ IsSave: true })


    if (Number(this.state.OrderDuration) === 0) {
      this.setState({ IsSave: false })
      this.setState({ TimeError: true })
      return;
    }

    let order = {};
    order.enterpriseId = this.state.SelectedOrderEnterpriseId;
    order.orderId = this.state.SelectedOrderId;
    order.deliverytime = this.state.OrderDuration;
    this.UpdateCompletionTimeApi(order);

  }

  PrintPageModal = (token) => {
    this.setState({
      PrintPage: !this.state.PrintPage,
      //token : token
    })
  }

  componentDidMount() {

    var token = this.props.match.params.token;
    var orderId = this.props.match.params.orderId;
    var enterpriseId = this.props.match.params.enterpriseId;
    // var printToken = this.props.match.params.printToken;

    if(token !== undefined){
      this.getOrderDetail(Number(enterpriseId), token, Number(orderId));
      this.state.orderToken = token;
      this.state.orderId = orderId;
      this.state.enterpriseId = enterpriseId;
      // this.state.token = printToken;

    } else {
      this.setState({ ShowLoader: false });
    }
    document.body.style.backgroundColor = "#fff";
  }


  componentWillUnmount() {
    document.body.style.backgroundColor = null;
  }
  ReviewCarouselModal(item, itemOptions) {

    if(Object.keys(item).length == 0) {
      this.setState({ ReviewCarousel: !this.state.ReviewCarousel })
      return;
    }

    var images = Utilities.stringIsEmpty(item.CustomFieldJson) ? [] : JSON.parse(item.CustomFieldJson).Images;

    this.setState({
      ReviewCarousel: !this.state.ReviewCarousel,
      selectedItemImages: images,
      selectedItem: item,
      selectedItemOptions: itemOptions
    })
  }
  // CancelOrderModal = () => {

  //   this.setState({ CancelReason: 0, dropdownOpen: false, IsOtherReason: false });
  //   this.setState({ cancelOrder: true, });

  // }

  CancelOrder() {

    if (this.state.IsSave) return;
    this.setState({ IsSave: true })

    if (Number(this.state.CancelReason) === 0) {
      this.setState({ ReasonError: true, IsSave: false })
      return;
    }

    if (this.state.CancelReason === 'Other') {
      this.setState({ OtherReasonError: true, IsSave: false })
      return;
    }

    this.state.MoveToCancel = true;
    let order = {};
    order.enterpriseId = this.state.SelectedOrderEnterpriseId;
    order.orderId = this.state.SelectedOrderId;
    order.comments = this.state.CancelReason;
    order.status = this.state.MoveToStatus;
    order.deliverytime = this.state.OrderDuration;
    this.UpdateStatusApi(order);
  }

  toggleExtraTimeModal = () => {
    this.setState({ addExtraTime: !this.state.addExtraTime })
  }

  StatusModal = (restId, orderId, status, type,isSupermealDelivery) => {
    let statusText = Number(status) === 0 ? "New" : Number(status) === 1 ? "Confirmed" : (type < 4 ? "Ready" : "Completed")
    let moveToStatusText = Number(status) === 0 ? "Move Order# " + orderId + " to confirmed" : Number(status) === 1 ? (type < 4 ? "Move Order# " + orderId + "  to Ready" : "Mark  Order# " + orderId + " as Completed") : "Mark  Order# " + orderId + " as Completed"
    this.setState({ StatusText: statusText, MoveToStatusText: moveToStatusText });

    this.setState({ OrderDuration: 0, dropdownOpen: false, AcceptErrorText: "Please select time", AcceptError: false, IsSupermealDelivery :isSupermealDelivery });
    this.state.SelectedOrderEnterpriseId = restId;
    this.state.SelectedOrderId = orderId;
    this.state.SelectedOrderType = type;

    let moveStatus = 0

    if (status === 0) {
      moveStatus = 1
    } else if (status === 1) {
      moveStatus = (type < 4) ? 2 : 4
    } else if (status === 2) {
      moveStatus = 4
    }

    this.state.MoveToStatus = moveStatus;

    if (status == 0) {
      if(type < 4){
        this.setState({ moveToStatus: true })
        return
      }
      this.state.OrderDuration = 0;
      this.UpdateStatus(restId, orderId, status)
    }
    else if (status === 1 || status === 2) {
      this.state.OrderDuration = 0;
      this.UpdateStatus(restId, orderId, status)
    }
  }

  HandelSelectDuration(duration) {
    this.setState({ OrderDuration: duration })
  }

  CancelOrderModal = (entId, orderId, status) => {

    this.setState({ CancelReason: 0, dropdownOpen: false, IsOtherReason: false});
    this.state.SelectedOrderEnterpriseId = entId;
    this.state.SelectedOrderId = orderId;
    let moveStatus = 0

    if (status === 0) {
      moveStatus = 3
    } else {
      moveStatus = status + "_3"
    }

    this.state.MoveToStatus = moveStatus;
    this.state.MoveToCancelText = "Cancel order# " + orderId;
    this.setState({ cancelOrder: true, ReasonErrorText: "Please choose reason", ReasonError: false, OtherReasonError: false })
  }


  UpdateStatusApi = async (order) => {

    // console.log("Order", order);
    var response = await EnterpriseOrderService.UpdateOrderStatus(order);
    this.setState({ IsSave: false, moveToStatus: false })
    var result = await response.json();

    if (!result.HasError && result.Dictionary.IsSuccess) {

      if (this.state.MoveToCancel) {

        if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.ADMIN_OBJECT))) {

          // Utilities.notify("Order #" + order.orderId + " is cancelled.", "s");
        }
        this.state.MoveToStatus = 3
      } else if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.ADMIN_OBJECT))) {

        if (this.state.MoveToStatus == 1) {
          // Utilities.notify("Order# " + order.orderId + " is moved to confirmed", "s");
        } else if (this.state.MoveToStatus == 2) {
          // Utilities.notify("Order# " + order.orderId + " is moved to ready", "s");
        } else if (this.state.MoveToStatus == 4) {
          // Utilities.notify("Order# " + order.orderId + " is marked as completed", "s");
        }

      }
      this.setState({cancelOrder: false})
      this.getOrderDetail(Number(this.state.enterpriseId), this.state.orderToken, Number(this.state.orderId));

    }
    else if (result.HasError) {

      this.setState({ ReasonError: true, AcceptError: true, AcceptErrorText: result.ErrorCodeCsv, ReasonErrorText: result.ErrorCodeCsv })
    }

  }


  UpdateStatus() {

    if (this.state.IsSave) return;
    this.setState({ IsSave: true })

    if (Number(this.state.SelectedOrderType) < 4 && Number(this.state.OrderDuration) == 0 && Number(this.state.MoveToStatus) == 1) {
      this.setState({ AcceptError: true, IsSave: false })
      return;
    }

    // , long , string comments, string orderStatus, int deliverytime
    this.state.MoveToCancel = false;
    let order = {};
    order.enterpriseId = this.state.SelectedOrderEnterpriseId;
    order.orderId = this.state.SelectedOrderId;
    order.comments = "";
    order.status = this.state.MoveToStatus;
    order.deliverytime = this.state.OrderDuration;
    this.UpdateStatusApi(order);


  }

  HandelSelectCancelReason(reason) {

    this.setState({ CancelReason: reason, IsOtherReason: reason == "Other" });
  }

  HandleOtherCancelReason(e) {
    let cancelResonText = Utilities.SpecialCharacterEncode(e.target.value)
    this.setState({ CancelReason: cancelResonText });

  }

  toggleCancelModal = () => {
    this.setState({ cancelOrder: !this.state.cancelOrder })
  }

  toggleDropDown = () => this.setState({ dropdownOpen: !this.state.dropdownOpen });

  toggleStatusModal = () => {
    this.setState({
      moveToStatus: !this.state.moveToStatus,
      OrderDuration: new Date()
    })
  }

  orderStatusIcon =(icon, type)=>{
    var orderStatusIcon = ""
    if(icon==0){
     orderStatusIcon = <div><span className='status-icon-svg'><svgIcon.NewOrderIcon/></span><span className='ml-2'>{Labels.New}</span></div>;
    }
    else if(icon==1){
      // if (type >= 4) {
        orderStatusIcon = <div><span className='status-icon-svg'><svgIcon.ConfirmedIcon/></span><span className='ml-2'>{Labels.Confirmed}</span></div>
      // }
      // else{
      //   orderStatusIcon = <div><span className='status-icon-svg'><svgIcon.ReadyIcon/></span><span className='ml-2'>Ready</span></div>

      // }
      }

    else if(icon==2){
      orderStatusIcon = <div><span className='status-icon-svg'><svgIcon.ReadyIcon/></span><span className='ml-2'>{Labels.Ready}</span></div>
    }
    else if(icon==3){
      orderStatusIcon =<div><span className='status-icon-svg'><svgIcon.CancelledIcon/></span><span className='ml-2'>{Labels.Cancelled}</span></div>
    }
    else if(icon==4){
      orderStatusIcon = <div><span className='status-icon-svg'><svgIcon.CompletedIcon/></span><span className='ml-2'>{Labels.Completed}</span></div>
    }
   return orderStatusIcon;
  }

  setOrderStatus = (restId, orderId, orderStatus, type, riderInfo, isSupermealDelivery,preOrderTime) => {

    if (orderStatus < 3) {

    if (!Utilities.stringIsEmpty(preOrderTime)) {
      var date = moment(preOrderTime).format('YYYY-MM-DD HH:mm:ss');
      var today = new Date(moment.tz(Config.Setting.timeZone).format("YYYY-MM-DDTHH:mm:ss"));
      var diff = moment.duration(moment(date).diff(moment(today)));
      var min = parseInt(diff.asMinutes());
      if(min >= Config.Setting.preOrderAcceptDuration && type !== 4) {

          return (

            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown} className={ isSupermealDelivery && orderStatus > 0 ? "padding-dropdown hide-arrow-status" : "padding-dropdown"}>

              <Dropdown.Toggle variant="secondary" >

                <span>{"Pre-Order"}</span>

              </Dropdown.Toggle>

              { isSupermealDelivery && orderStatus > 0 ? '' :
                <Dropdown.Menu>
                  <div className="menu-data-action-btn-wrap">
                    <Dropdown.Item >{isSupermealDelivery && orderStatus > 0 ? '' : <span className="m-b-0 statusChangeLink m-r-20" onClick={() => this.CancelOrderModal(restId, orderId, orderStatus)}><span>{Labels.Cancel_Order}</span></span>} </Dropdown.Item>
                  </div>
                </Dropdown.Menu>}

            </Dropdown>

          )

        }

      }
    }

    let statusText = Number(orderStatus) === 0 ? <div><span className='status-icon-svg'><svgIcon.NewOrderIcon/></span><span className='ml-2'>{Labels.New}</span></div> : Number(orderStatus) === 1 ? <div><span className='status-icon-svg'><svgIcon.ConfirmedIcon/></span><span className='ml-2'>{Labels.Confirmed}</span></div> : type < 4 ? <div><span className='status-icon-svg'><svgIcon.ReadyIcon/></span><span className='ml-2'>{Labels.Ready}</span></div> :""
    let statusClass = Number(orderStatus) === 0 ?'new-bg': Number(orderStatus) === 1 ? 'confirm-bg' : type < 4 ? 'ready-bg' :""
    let moveToStatusText = Number(orderStatus) === 0 ? "Confirm" : Number(orderStatus) === 1 ? (type < 4 ? "Ready" : "Completed") : "Completed"


    if (orderStatus < 3) {


      return (


        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown} className={ isSupermealDelivery && orderStatus > 0 ? `${statusClass} padding-dropdown n-dropdown hide-arrow-status` : `${statusClass} n-dropdown padding-dropdown`}>


          <Dropdown.Toggle variant="secondary" >

            <span>{this.orderStatusIcon(orderStatus, type)}</span>

          </Dropdown.Toggle>

          { isSupermealDelivery && orderStatus > 0 ? '' :
            <Dropdown.Menu>
              <div className="menu-data-action-btn-wrap">
                <Dropdown.Item onClick={() => this.StatusModal(restId, orderId, orderStatus, type,isSupermealDelivery)}> {<span className="m-b-0 statusChangeLink m-r-20 ">
                <span >{moveToStatusText}</span>
              </span> }
                </Dropdown.Item>
                <Dropdown.Item >{orderStatus > 0 && !isSupermealDelivery ? <span className="m-b-0 statusChangeLink m-r-20" onClick={() => this.AddExtraTimeModal(restId, orderId, orderStatus)}><a> {Labels.Add_Extra_Time}</a></span> : ""}</Dropdown.Item>
                <Dropdown.Item >{isSupermealDelivery && orderStatus > 0 ? '' : <span className="m-b-0 statusChangeLink m-r-20" onClick={() => this.CancelOrderModal(restId, orderId, orderStatus)}><span>{Labels.Cancel_order}</span></span>} </Dropdown.Item>
              </div>
            </Dropdown.Menu>}

            { isSupermealDelivery && type === 1 ?  <a className={orderStatus === 0 ? "rider-btn disable-rider" : "rider-btn"} onClick={() => this.OpenRiderModal(orderStatus,orderId)}>Rider</a> : ''}
        </Dropdown>

      )

    } else if (orderStatus === 3) {
      return (
        <Dropdown className="n-dropdown cancelled-bg padding-dropdown hide-arrow-status">
          <Dropdown.Toggle variant="secondary" >
            <div><span className='status-icon-svg'><svgIcon.CancelledIcon/></span><span className='ml-2'>{Labels.Cancelled}</span></div>
          </Dropdown.Toggle>
          {isSupermealDelivery && type === 1 ?  Object.keys(riderInfo).length === 0 ? '' :  <a className={"rider-btn"} onClick={() => this.OpenRiderModal(orderStatus,orderId)}>{Labels.Rider}</a> : ''}
        </Dropdown>
      )
    }

    else if (orderStatus === 4) {
      return (
        <Dropdown className={`n-dropdown completed-bg padding-dropdown ${this.state.UserRole == Constants.Role.SYSTEM_ADMIN_ID || this.state.UserRole == Constants.Role.SYSTEM_OPERATOR_ID || this.state.UserRole == Constants.Role.RESELLER_ADMIN_ID || this.state.UserRole == Constants.Role.RESELLER_MODERATOR_ID ? "" : "hide-arrow-status"}`}>
          <Dropdown.Toggle variant="secondary" >

            <div><span className='status-icon-svg'><svgIcon.CompletedIcon/></span><span className='ml-2'>{Labels.Completed}</span></div>
          </Dropdown.Toggle>

        {this.state.UserRole == Constants.Role.SYSTEM_ADMIN_ID || this.state.UserRole == Constants.Role.SYSTEM_OPERATOR_ID || this.state.UserRole == Constants.Role.RESELLER_ADMIN_ID || this.state.UserRole == Constants.Role.RESELLER_MODERATOR_ID?

        <Dropdown.Menu>
              <div className="menu-data-action-btn-wrap">
                <Dropdown.Item >{isSupermealDelivery && orderStatus > 0 ? '' : <span className="m-b-0 statusChangeLink m-r-20" onClick={() => this.CancelOrderModal(restId, orderId, orderStatus)}><span>{Labels.Cancel_order}</span></span>} </Dropdown.Item>
              </div>
            </Dropdown.Menu>

            : "" }
          {isSupermealDelivery && type === 1 ?  Object.keys(riderInfo).length === 0 ? '' :  <a className={"rider-btn"} onClick={() => this.OpenRiderModal(orderStatus,orderId)}>{Labels.Rider}</a> : ''}
       </Dropdown>
      )
    }

    else if (orderStatus === 6) {
      return (
        <Dropdown className="n-dropdown padding-dropdown hide-arrow-status">
          <Dropdown.Toggle variant="secondary" >
          <div><span className='status-icon-svg'><svgIcon.BookedIcon/></span><span className='ml-2'>{Labels.Booked}</span></div>
          </Dropdown.Toggle>
          {isSupermealDelivery && type === 1 ?  Object.keys(riderInfo).length === 0 ? '' :  <a className={"rider-btn"} onClick={() => this.OpenRiderModal(orderStatus,orderId)}>{Labels.Rider}</a> : ''}
        </Dropdown>
      )
    }
  }

  AddExtraTimeModal = (restId, orderId, status) => {
    this.setState({ OrderDuration: 0, dropdownOpen: false });
    this.state.SelectedOrderEnterpriseId = restId;
    this.state.SelectedOrderId = orderId;
    this.state.MoveToStatus = status;
    this.state.AddExtraTimeText = "Add extra time to order# " + orderId;
    this.setState({ addExtraTime: true, TimeErrorText: "Please select time", TimeError: false })
  }

  render() {

    const {orderDetail, enterpriseDetail} = this.state;
    // console.log('orderDetail', orderDetail)
    // console.log('orderDetail', this.state.countryConfigObj.DecimalPlaces)
    if(this.state.ShowLoader)   return <div className='loader-m-p-center loader-m-center flex-column'>
      <Loader type="Oval" color="#ed0000" height={50} width={50} />
    <div className="loading-label ml-2">Loading.....</div>
    </div>
     var AdditionalCharges = orderDetail.AdditionalChargesJson != "" && JSON.parse(orderDetail.AdditionalChargesJson);

     return (
      <div className='card'>


<div id='header'>
          <div className={this.state.scrolled ? ' sub-h fixed-sub-header  mb-4' : 'sub-h '} style={{ flexWrap: "wrap" }} >
            {/* <div className='d-flex align-items-center justify-content-between mb-4'> */}
            <h3 className="card-title card-new-title d-flex  mb-0 pr-3 ">
              <span className='mr-3 cursor-pointer' onClick={() => this.props.history.goBack()}><MdArrowBack size={24} /> </span>
              <div className='d-flex w-100  flex-md-row flex-column badge-override'>
                <div className='col-xs-12 mb-2 w-100'>
                  <div className='d-flex'>
                  <div className='d-flex mb-1 align-items-center w-100'>
                   <span className='badge-override-res'> {`Order #${orderDetail.Id}`}</span>
                    <span className="badge badge-danger d-flex align-items-center px-2 py-1 ml-auto ml-sm-3" style={{ background: this.GetBackgroundColor(orderDetail.OrderType)}}>
                      {this.setOrderTypeIcon(Number(orderDetail.OrderType))}
                      {this.GetOrderType(orderDetail.OrderType)}
                      </span>
                  </div>

                  </div>
                  {/* <div className="d-flex align-items-center mb-1"><span className="mr-2 font-14 mb-0">{Utilities.SetPaymentMode(orderDetail.OrderPayments, orderDetail.OrderStatus, orderDetail.TotalAmount)}</span></div> */}
                  <div className='d-flex justify-content-md-start justify-content-between mt-2 resp-text'id="ctl00_cphContentBody_checkOrderActivityWrap">
                  <div className="font-14 mb-0 mr-3">Placed on {Utilities.getDateByZone(orderDetail.OrderDate, format, timeZone)} </div>
                  <a href="#checkOrderActivity" className="check-order-activity-b font-12">{Labels.View_activity}</a>
                  </div>

                </div>


<div className='d-flex flex-md-row flex-column justify-content-between w-100'>
                  {/* {
                     orderDetail.OrderType != 4 &&
                     <div class="align-items-center mb-md-0 mb-3  mr-md-5 d-flex flex-md-column align-items-md-start  justify-content-md-start justify-content-between">

                     <span class="font-16">Room No.</span>
                     <span class="font-20 bold"> {orderDetail.RoomNo}</span>
                   </div>
                  }
                  */}

<div className='align-items-center mb-md-0  ml-md-auto status-dropdown d-flex  align-items-md-center justify-content-md-start justify-content-between'>
                <div class="color-p font-14 mr-3">{Labels.Status}:</div>
                   {
                    this.setOrderStatus(Number(orderDetail.EnterpriseId), Number(orderDetail.Id), Number(orderDetail.OrderStatus), Number(orderDetail.OrderType))
                    }
                  {/* <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown} className=" padding-dropdown  padding-dropdown pending-c padding-dropdown confirmed-c padding-dropdown dispatch-c dropdown d-flex justify-content-md-start justify-content-between align-items-center dropdown w-100" >
                    <div className="  color-p font-14 mr-3">Status:</div>
                    <Dropdown.Toggle variant="secondary" className='border-0 font-weight-normal rounded m-0'>
                      <span>{this.getOrderStatus(orderDetail.OrderStatus, orderDetail.OrderType)}</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <div className="menu-data-action-btn-wrap">
                        <Dropdown.Item ><span onClick={() => this.toggleStatusModal()} className="m-b-0 statusChangeLink m-r-20 ">
                          <span>Confirmed</span>
                        </span>
                        </Dropdown.Item>
                        <Dropdown.Item > <span className="m-b-0 statusChangeLink m-r-20" onClick={() => this.CancelOrderModal(orderDetail.EnterpriseId, orderDetail.Id, orderDetail.OrderStatus)}><span>Cancel order</span></span> </Dropdown.Item>
                      </div>
                    </Dropdown.Menu>
                  </Dropdown> */}

                </div>

</div>


              </div>
            </h3>
          </div>
          </div>
         { orderDetail.OrderStatus == 3 && <div className='order-serv-msg'>
          <div className="order-serv-msg-i">Cancellation Reason: {orderDetail.OrderStatusHistory.Notes}</div>
          </div>}

<div className="order-detail-page">

<div>



    <section className="bg-none" style={{display:"none"}}>
        <div className="banner-wrapper">
            {/* <div className="bg-image" style="background-image: url('/assets/images/cover-photo-order-reciept.jpg')">
             */}
                         <div className="bg-image" style={{
      backgroundImage: `url("https://test.supermeal.co.uk/assets/images/cover-photo-order-reciept.jpg")`
    }}>
            </div>
            <div className="menu-heading-desc-wrapper">
                <div className="invoice-wrapper res-category-heading">
                    <h2>{Labels.Your_Order}</h2>
                    {/* style="color: #fff; width: 100%; font-size: 40px; font-weight: bold;" */}
                    <h4 style={{color:'#fff', width:'100%', fontSize:40, fontWeight:'bold'}}>{orderDetail.Id}</h4>
                </div>

            </div>

        </div>
        {/* <a id="ctl00_cphContentBody_btnPrint" className="btn btn-lg blue hidden-print float-right print-detail-btn" style="margin-top: 10px; z-index: 11;" target="_blank" onclick="javascript:window.print();">Download PDF

        </a> */}
    </section>
         {/* <div className="chat-cancel-btn-wrap">





            </div> */}
    <section className="bg-none restaurant-info-id-wrap hidden-print d-none">
        <div className="location-main-wrap ">

            <div className="rest-id-label text-center">

                <img src={this.getOrderStatusImage(orderDetail.OrderStatus, orderDetail.OrderType)}/>


            </div>
        </div>

         {/* <div id="ctl00_cphContentBody_checkOrderActivityWrap" className="check-order-activity-wrap">
            <a href="#checkOrderActivity" className="check-order-activity">View activity for this order </a>
        </div>
         */}

    </section>
    {/* <section className="inovice-detail reviewed-rating-wrap hidden-print" >
                    <div className="invoice-detail-inner-wraper bg-white">
                        <div className="inovce-detail-block inovce-detail-block-new font-20 bold">Your Review <span className="float-right font-16 normal mar-top-5">Date 31 Aug 2022 </span></div>

                <div className="ratingGroupMain">
                    <div className="ratingGroupColumn">
                      <div className="ratingLabel">
                        <span>Taste</span>
                      </div>
                      <div>
                        <StarRatings
                          rating={this.state.taste}
                          starDimension="22px"
                          starRatedColor="#fdd22c"
                          starSpacing="0px"
                        />
                      </div>
                    </div>
                    <div className="ratingGroupColumn">
                      <div className="ratingLabel">
                        <span>Order Time</span>
                      </div>
                      <div>
                        <StarRatings
                          rating={this.state.orderTime}
                          starDimension="22px"
                          starRatedColor="#fdd22c"
                          starSpacing="0px"
                        />
                      </div>
                    </div>

                    <div className="ratingGroupColumn">
                      <div className="ratingLabel">
                        <span>Quality</span>
                      </div>
                      <div>
                        <StarRatings
                          rating={this.state.quality}
                          starDimension="22px"
                          starRatedColor="#fdd22c"
                          starSpacing="0px"
                        />
                      </div>
                    </div>
                    <div className="ratingGroupColumn">
                      <div className="ratingLabel">
                        <span>Price</span>
                      </div>
                      <div>
                        <StarRatings
                          rating={this.state.price}
                          starDimension="22px"
                          starRatedColor="#fdd22c"
                          starSpacing="0px"
                        />
                      </div>
                    </div>
                </div>

                        <div className="address-left-wrapper"><p>Amazing as usual</p><p>Compliments to the chef</p></div>





                    </div>
                </section> */}
    <section className="inovice-detail">

        <div className="invoice-top-wraper">


            <div className="invoice-detail-inner-wraper bg-white" id="your">
                <div className="inovce-detail-block inovce-detail-block-new font-20 bold">{Utilities.SpecialCharacterDecode(orderDetail.Restaurant.Name)}  <a href={enterpriseDetail.ParentSubdomain} target='blank'><span className='font-16'> - {Utilities.SpecialCharacterDecode(enterpriseDetail.ParentName)}</span></a> </div>
                <div className="order-detail-info-wrapper">
                <div className='order-detail-types font-16 p-3'>
                {orderDetail.OrderType == 4 && orderDetail.OrderType != 12 &&
                      <div className='common-type-d-wrap'>
                            <span>Table No:</span>
                            <span className=' bold'>{orderDetail.RestaurantTableBooking.TableNo ? orderDetail.RestaurantTableBooking.TableNo : "-"}</span>
              </div>
            }

  {
      orderDetail.OrderType != 4  &&
      <div className='common-type-d-wrap'>
      <span>{Labels.Room_No}</span>
      <span className='bold'>  {orderDetail.RoomNo !='' ? orderDetail.RoomNo : "-"} </span>
      </div>
    }
    <div className='common-type-d-wrap'>
      <span>{Labels.Total}</span>
      <span className="bold">{orderDetail.Currency}{Utilities.FormatCurrency(Number(orderDetail.TotalAmount), this.state.countryConfigObj.DecimalPlaces)}</span>
      </div>

    <div className='common-type-d-wrap'>
    <span>{Labels.Type}</span>
    <span className='bold'> {this.GetOrderType(orderDetail.OrderType)} </span>
    </div>

    <div className='common-type-d-wrap'>
    <span>{Labels.Payment_Mode}</span>
    <span className='bold'>  {Utilities.SetPaymentMode(orderDetail.OrderPayments, orderDetail.OrderStatus, orderDetail.TotalAmount)} </span>
    </div>

     {orderDetail.VoucherCode != "" && orderDetail.VoucherCode != undefined &&
                       <div className='common-type-d-wrap'>
                         <span>Voucher code</span>
                         <span className=' bold voucher-code'>{orderDetail.VoucherCode}</span>
                       </div>
                       }

    <div className='common-type-d-wrap'>
    <span>{Labels.Contact_Person}</span>
    <div className='order-detail-contact-wrap'>
    <span className='bold'>  {Utilities.SpecialCharacterDecode(orderDetail.ContactPerson)} </span>
    <span className='bold'>  {Utilities.maskString(orderDetail.ContactNumber)} </span>
    {
      orderDetail.ConsumerDetails.PrimaryEmail != " " &&
      <span className='bold'>  {Utilities.maskString(orderDetail.ConsumerDetails.PrimaryEmail)} </span>
    }
    </div>
    </div>
    {orderDetail.OrderType == 11 && this.state.extraFieldJson !="" &&
    <div className='common-type-d-wrap'>
      <span>{Labels.Collection_Details}</span>
      <span className='bold'>{Utilities.getDateByZone(this.state.extraFieldJson.CollectionTime, format, timeZone)}</span>
      <span className='bold'>{Utilities.SpecialCharacterDecode(this.state.extraFieldJson.CollectionDriverInstruction)}</span>
    </div>
       }
      {orderDetail.OrderType == 11 && this.state.extraFieldJson !="" &&
                 <div className='common-type-d-wrap'>
                      <span >Delivery Details</span>
                      <span className='bold'>{Utilities.getDateByZone(this.state.extraFieldJson.DeliveryTime, format, timeZone)}</span>
                      <span  className='bold'>{Utilities.SpecialCharacterDecode(this.state.extraFieldJson.DeliveryDriverInstruction)}</span>
                  </div>
         }
           {orderDetail.OrderType == 4 &&
                      <div className='common-type-d-wrap'>
                            <span>{Labels.Booking_Date}</span>
                            <span className='bold'>  {Utilities.getDateByZone(orderDetail.RestaurantTableBooking.BookedDateTime, format, timeZone)} </span>
                            </div>
            }
             {orderDetail.OrderType == 4 &&
                      <div className='common-type-d-wrap'>
                            <span>{Labels.No_Of_Seats}:</span>
                            <span className=' bold'>{orderDetail.RestaurantTableBooking.NoOfSeat}</span>
                            </div>
            }
             {orderDetail.OrderType == 4 &&
                      <div className='common-type-d-wrap'>

                            <span>{Labels.No_Of_Baby_Seats}:</span>
                            <span className=' bold'>{orderDetail.RestaurantTableBooking.NoOfBabySeat}</span>
                            </div>
            }

            <div className='common-type-d-wrap grid-s-i-wrap'>
            <span>{Labels.Special_Instructions}</span>

                            {
          Utilities.stringIsEmpty(orderDetail.DescriptionNoteDetails) ?<span className='bold'>{Labels.None}</span> :
          Utilities.SpecialCharacterDecode(orderDetail.DescriptionNoteDetails).split("\n").map((note) => {

          return(
            <span class=" ml-1 bold">{Utilities.SpecialCharacterDecode(note)}</span>
          )

          })
            }
            </div>


</div>





                </div>


                <div className="invoice-detail-inner-wraper" id="sum" style={{maxWidth:'800px'}}>
                    <div className="inovce-detail-block inovce-detail-block-new font-20 bold " style={{border:'none', background:'#f2f2f2', paddingTop:'30px'}}>{Labels.Order_Details}</div>
                    <div className="inovce-detail-block inovce-detail-block-first">

                        <div style={{clear:'both'}}></div>

                        {this.state.items.map(item => {

                            var ItemDiscription = Utilities.stringIsEmpty(item.DescriptionNoteIdItemsDetails) ? {} : JSON.parse(item.DescriptionNoteIdItemsDetails);
                            var extras = ItemDiscription.ItemExtra != undefined ? ItemDiscription.ItemExtra : [];
                            var toppings = ItemDiscription.ItemToppings != undefined ? ItemDiscription.ItemToppings : [];

                       return (
                       <div className="customer-order-scroll-wraper">
                            <div className="customer-order-details-wrapper">
                                <div className="item-main-row">
                                    <div className="item-row">
                                        <span className="item-name-label">
                                            <span>{item.Quantity} x  </span>
                                            <span>{Utilities.SpecialCharacterDecode(item.ItemName)}</span></span>
                                        <span className="item-price-label">{Utilities.FormatCurrency(Number(item.Price) * Number(item.Quantity), this.state.countryConfigObj?.DecimalPlaces)}</span>
                                    </div>


                              {/* {extras.length > 0 && <div className="item-heading">{Labels.Extras}</div>} */}
                                {extras.map(extra => {

                                return (

                                    <div className="item-row-inner">
                                      <div className="row-wrap"><span className="item-name-label">{extra.Quantity} x {Utilities.SpecialCharacterDecode(extra.Name)}</span><span className="item-price-label"> {extra.Price > 0 ? currency + ' ' +  Utilities.FormatCurrency(Number(extra.Price * extra.Quantity), this.state.countryConfigObj?.DecimalPlaces) : "Free"} </span></div>
                                    </div>
                                     )
                                    })
                                  }

                                  {toppings.length > 0 && <div className="item-heading">{Labels.Extra} {Labels.Topping}</div>}

                                    {toppings.map(topping => {

                                    return (<div className="item-row-inner">

                                      <div className="row-wrap"><span className="item-name-label">+ {Utilities.SpecialCharacterDecode(topping.Name)}</span><span className="item-price-label">{topping.Price > 0 ? currency + ''+ Utilities.FormatCurrency(Number(topping.Price * topping.Quantity), this.state.countryConfigObj?.DecimalPlaces): "Free"}</span></div>
                                    </div>
                                    )
                                    })
                                  }

                                </div>
                            </div>
                        </div>)
                        })
                        }

                        <div className="order-item-deliver-charges-total-wrap">
                            <div className="order-item-wraper">
                                <div id="dvDiscountVoucher">
                                    <div className="order-item-d-c-inner">
                                        <span className="order-item-ch float-left">{Labels.Items_Cost}:</span>
                                        <span className="order-item-prc float-left">{orderDetail.Currency}{Utilities.FormatCurrency((Number(orderDetail.TotalAmountExTax)), this.state.countryConfigObj?.DecimalPlaces)}</span>
                                    </div>

                                </div>

                                   {orderDetail.DiscountType > 0 ?
                                   <>
                                  <div id="dvDiscountVoucher">
                                    <div className="order-item-d-c-inner">
                                        <span className="order-item-ch float-left">{Labels.Discount_Using} {`(${this.DiscountTypeLabel(orderDetail.DiscountType)})`}:</span>
                                        <span className="order-item-prc float-left">{orderDetail.Currency}{Utilities.FormatCurrency(Number(orderDetail.DiscountedAmount), this.state.countryConfigObj?.DecimalPlaces)}</span>
                                    </div>
                                  </div>
                                 <div className="order-item-d-c-inner">
                                    <span className="order-item-ch float-left"></span>
                                    <span className="order-item-prc float-left">-------</span>
                                 </div>

                                <div className="order-item-d-c-inner">
                                    <span className="order-item-ch float-left">{Labels.Items_Cost_After_Discount}:</span>
                                    <span className="order-item-prc float-left">{orderDetail.Currency}{Utilities.FormatCurrency(Number(orderDetail.TotalAmountExTax) - Number(orderDetail.DiscountedAmount), this.state.countryConfigObj?.DecimalPlaces)}</span>
                                </div>

                                </>
                                :
                                 <div className="order-item-d-c-inner">
                                    <span className="order-item-ch float-left"></span>
                                    <span className="order-item-prc float-left">-------</span>
                                 </div>
                                   }

                                {
                                  orderDetail.ServiceCharge > 0 &&
                                  <div id="dvDiscountVoucher">
                                      <div className="order-item-d-c-inner">
                                          <span className="order-item-ch float-left">{Labels.Service_Charge} @ {orderDetail.ServiceChargePercentage} %</span>
                                          <span className="order-item-prc float-left">{orderDetail.Currency}{Utilities.FormatCurrency((Number(orderDetail.ServiceCharge)), this.state.countryConfigObj?.DecimalPlaces)}</span>
                                      </div>

                                  </div>
                                }


                               {AdditionalCharges != undefined && AdditionalCharges.length > 0 && AdditionalCharges.map((charge) => {

                                 return(

                                   <div className="order-item-d-c-inner">
                                   <span className="order-item-ch float-left">{charge.Label}</span>
                                   <span className="order-item-prc float-left">{orderDetail.Currency}{Utilities.FormatCurrency(Number(charge.Amount), this.state.countryConfigObj?.DecimalPlaces)}</span>
                                  </div>
                                )}
                               )}


                                {
                                  orderDetail.TotalTax > 0 &&
                                  <div id="dvDiscountVoucher">
                                    <div className="order-item-d-c-inner">
                                        <span className="order-item-ch float-left">{Labels.Total_Tax} {`@ ${orderDetail.TaxRate} %`}</span>
                                        <span className="order-item-prc float-left">{orderDetail.Currency}{Utilities.FormatCurrency(Number(orderDetail.TotalTax), this.state.countryConfigObj?.DecimalPlaces)}</span>
                                    </div>
                                </div>
                                }

                              {
                                  orderDetail.TipAmount > 0 &&
                                  <div id="dvDiscountVoucher">
                                    <div className="order-item-d-c-inner">
                                        <span className="order-item-ch float-left">{Labels.Tip_Amount}</span>
                                        <span className="order-item-prc float-left">{orderDetail.Currency}{Utilities.FormatCurrency(Number(orderDetail.TipAmount), this.state.countryConfigObj?.DecimalPlaces)}</span>
                                    </div>
                                </div>
                                }

                                <div className="order-item-d-c-inner no-display">
                                    <span className="order-item-ch float-left">{Labels.Card_Fee}:</span>
                                    <span className="order-item-prc float-left">{Labels.No_Fee}</span>
                                </div>

                                {Utilities.hasPaid(orderDetail.OrderPayments, orderDetail.OrderStatus, orderDetail.TotalAmount) ?

                                 <>
                                 <div className="order-item-d-c-inner">
                                    <span className="order-item-ch float-left"></span>
                                    <span className="order-item-prc float-left">-------</span>
                                 </div>

                                 <div className="order-item-d-c-inner bold">
                                    <span className="order-item-ch float-left">{Labels.Order_Total}:</span>
                                    <span className="order-item-prc float-left">{orderDetail.Currency}{Utilities.FormatCurrency( orderDetail.TotalAmount, this.state.countryConfigObj?.DecimalPlaces)}</span>
                                </div>

                                 <div className="order-item-d-c-inner bold">
                                    <span className="order-item-ch float-left">{Labels.Paid_By} <span>({Utilities.SetPaymentMode(orderDetail.OrderPayments, orderDetail.OrderStatus, orderDetail.TotalAmount)})</span>:</span>
                                    <span className="order-item-prc float-left">-{orderDetail.Currency}{Utilities.FormatCurrency( orderDetail.TotalAmount, this.state.countryConfigObj?.DecimalPlaces)}</span>
                                </div>
                                </>
                                  :
                                <div className="order-total-payable-wrap mt-2 font-weight-normal font-16" style={{paddingRight:"160px"}}>
                                    <span className="order-pay-rs-name font-14">{Labels.Payment_Mode}</span>
                                    <span className="total-pay-rs font-14">{Utilities.SetPaymentMode(orderDetail.OrderPayments, orderDetail.OrderStatus, orderDetail.TotalAmount)}</span>
                                </div>

                                }

                                 <div className="order-item-d-c-inner">
                                    <span className="order-item-ch float-left"></span>
                                    <span className="order-item-prc float-left">-------</span>
                                 </div>

                                <div className="order-total-payable-wrap">
                                    <span className="order-pay-rs-name">{Labels.Total_Payable}:</span>
                                    <span className="total-pay-rs">{orderDetail.Currency}{Utilities.FormatCurrency( Utilities.isCardOrder(orderDetail.OrderPayments, orderDetail.TotalAmount) ? 0 :  Number(orderDetail.TotalAmount), this.state.countryConfigObj?.DecimalPlaces)}</span>
                                </div>
                            </div>
                        </div>
                       {
                          (orderDetail.OrderStatus != 3 && orderDetail.OrderStatus != 4) &&
                          <div className="d-flex p-3 w-100">
                            <span className={`alert alert-${Utilities.hasPaid(orderDetail.OrderPayments, orderDetail.OrderStatus, orderDetail.TotalAmount) ? "success" : "warning"} font-14 bold w-100 text-center mb-0`} style={{padding:"10px"}}>{Utilities.hasPaid(orderDetail.OrderPayments, orderDetail.OrderStatus, orderDetail.TotalAmount) ? "ORDER HAS BEEN PAID" : "ORDER HAS NOT BEEN PAID"}</span>
                          </div>
                       }

                        {orderDetail.CashBackAmount > 0 && orderDetail.OrderStatus != 3 &&

                        <div id="ctl00_cphContentBody_dvCashBack">
                            <div id="spCashBack" className="text-center spCashBack">
                                <span>
                                    <span id="ctl00_cphContentBody_spanCashBack">{orderDetail.ConsumerDetails.DisplayName} {orderDetail.status < 3 ? "will receive" : "has received"} <span className="bold">{currency}{Utilities.FormatCurrency(Number(orderDetail.CashBackAmount), this.state.countryConfigObj?.DecimalPlaces)}</span> cashback on items cost.</span>
                                </span>
                            </div>
                        </div>
                        }
                        <div style={{clear:'both'}}></div>
                    </div>



                </div>


    </div></div></section>

    <section id="all">
        <div className="invoice-detail-inner-wraper hidden-print  mar-top-20">
            <div className="inovce-detail-block inovce-detail-block-new font-20 bold">
                {Labels.Order_Activity}
            </div>
            <div className="scroll-x" id="checkOrderActivity">
                <table>

                    <tbody>

                    {this.state.EnterpriseActivity.map(activity => {
                        return(

                        // <tr><td><div>{activity.DateTime}</div>

                         <tr><td><div>{Utilities.getDateByZone(activity.DateTime, format, timeZone)}</div>
                        <div className="font-16">{Utilities.SpecialCharacterDecode(activity.Message)}</div></td></tr>
                        )})
  }


                    </tbody>
                </table>
            </div>

        </div>


    </section>

    <section className="footer-section" id="parntner">
        <a className="btn btn-primary blue hidden-print" style={{marginTop:10}} target="_blank" href={"/print/" + this.state.orderDetail.OrderToken.TokenCode}>{Labels.Print}</a>

        {/* <div className="order-print-wrap" onClick={() => this.PrintPageModal(this.state.token)}><span>{"Print"}</span></div> */}

    </section>

</div>

</div>


                <Modal size='lg' isOpen={this.state.ReviewCarousel} toggle={() => this.ReviewCarouselModal({})} className={this.props.className} style={{ maxWidth: "55%" }}>
          {/* <ModalHeader toggle={() => this.ReviewCarouselModal()} >
            <div className='d-flex'>
            <div>
            View Review
            </div>

            </div>
            </ModalHeader> */}
          <ModalBody className='res-p-rem'>
            <div className='position-relative carousel-main-wrap mb-3 mt-3'>
              <div className=" d-flex  pr-detail mb-3">
                <div className="mb-2 d-flex w-75 res-w-add">
                  <div className="b-img px-0 cursor-pointer common-image-blur overflow-hidden">
                    <img src="https://cdn.superme.al/s/shoply/enterprise/10/images/51N3JuhLs8L.-SL1000-.jpg" className="w-100" />
                  </div>
                  <div className="d-flex flex-wrap flex-1 w-100">
                    <div className="flex-grow-1 d-flex mr-3">
                      <div className="flex-grow-1 px-3">
                        <div className="bold font-13 mb-1 text-left word-break">{Utilities.SpecialCharacterDecode(this.state.selectedItem.ItemName)}</div>

                          {this.loadOptions(this.state.selectedItemOptions)}
                      </div>
                      <div className=" text-nowrap justify-content-start text-right col-xs-2 flex-column align-items-start flex-column-reverse flex-md-row " style={{ flexDirection: "column" }}>
                        <span className="w-100 bold font-13 mr-5">{currency}{Utilities.FormatCurrency(Number(this.state.selectedItem.Price), this.state.countryConfigObj?.DecimalPlaces)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Carousel
                showThumbs={false}
                showStatus={false}

              >
                <div className='row modal-carousel-setting'>
                  <div className='col-lg-5 custom-carousel-status'>
                    <Carousel>

                    {this.state.selectedItemImages.map(image => {
                  return(
                    <div>
                    <img src={Utilities.generatePhotoURL(image.AbsoluteUrl)} />

                  </div>
                  )

                  })}

                    </Carousel>
                  </div>
                  <div className='col-md-7'>
                    <div className='single-review'>
                      <div className='d-flex align-items-center mb-3'>
                        <div className='rev-img mr-2'>
                        <Avatar className="header-avatar" style={{  marginRight:"10px", }} name={this.state.orderDetail.ConsumerDetails.DisplayName} round={true} size="40" textSizeRatio={1.75} />
                        </div>
                        <h4 className="" id="hReviewerName">{Utilities.SpecialCharacterDecode(this.state.orderDetail.ConsumerDetails.DisplayName)}</h4>
                      </div>
                    </div>
                    <div className='order-review-con'>
                      <div className='review-top-wrap mb-2 d-flex'>
                        <StarRatings
                          rating={Object.keys(this.state.selectedItem).length > 0 ? this.state.selectedItem.Rating : 0}
                          starDimension="22px"
                          starRatedColor="#ffdd33"
                          starSpacing="0px"
                        />
                      </div>
                      <div className='review-bottom-wrap mb-3'>
                        <div className=' mb-2 text-dark font-14 d-flex text-left'>
                          {Utilities.SpecialCharacterDecode(this.state.selectedItem.Reviews)}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

              </Carousel>
            </div>
          </ModalBody>
          <FormGroup className="modal-footer" >
            <div className='mr-auto'> <label id="name" className="control-label mt-2 text-danger"></label>
            </div>
            <div>
              {/* <Button className='mr-2 text-dark' color="secondary" onClick={() => this.ReviewCarouselModal()}>cancel</Button> */}
              <Button color="secondary" onClick={() => this.ReviewCarouselModal({})}>
                {/* <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>   */}
                <span className="comment-text">{Labels.Close}</span>
              </Button>
            </div>
          </FormGroup>
        </Modal>


        <Modal className='date-picker-width' isOpen={this.state.moveToStatus} toggle={() => this.toggleStatusModal()} >
          <ModalHeader>{this.state.MoveToStatusText}</ModalHeader>
          <ModalBody className="move-modal">
          <h5 className="control-label font-weight-500">{this.state.SelectedOrderType === 1 && this.state.IsSupermealDelivery ? "Choose prepration time" : "Select time"}</h5>
              <ul className="time-list-wrapper">

                <li onClick={(e) => this.HandelSelectDuration("15")} className={this.state.OrderDuration=="15"?"bold":""} >15 minutes</li>
                <li onClick={(e) => this.HandelSelectDuration("20")} className={this.state.OrderDuration=="20"?"bold":""} >20 minutes</li>
                <li onClick={(e) => this.HandelSelectDuration("25")} className={this.state.OrderDuration=="25"?"bold":""} >25 minutes</li>
                <li onClick={(e) => this.HandelSelectDuration("30")} className={this.state.OrderDuration=="30"?"bold":""} >30 minutes</li>
                <li onClick={(e) => this.HandelSelectDuration("35")} className={this.state.OrderDuration=="35"?"bold":""} >35 minutes</li>
                <li onClick={(e) => this.HandelSelectDuration("40")} className={this.state.OrderDuration=="40"?"bold":""} >40 minutes</li>
                <li onClick={(e) => this.HandelSelectDuration("45")} className={this.state.OrderDuration=="45"?"bold":""} >45 minutes</li>
                <li onClick={(e) => this.HandelSelectDuration("50")} className={this.state.OrderDuration=="50"?"bold":""} >50 minutes</li>
                <li onClick={(e) => this.HandelSelectDuration("55")} className={this.state.OrderDuration=="55"?"bold":""} >55 minutes</li>
                <li onClick={(e) => this.HandelSelectDuration("60")} className={this.state.OrderDuration=="60"?"bold":""} >1 hour</li>
                <li onClick={(e) => this.HandelSelectDuration("75")} className={this.state.OrderDuration=="75"?"bold":""} >1 hour 15 minutes</li>
                <li onClick={(e) => this.HandelSelectDuration("90")} className={this.state.OrderDuration=="90"?"bold":""} >1 hour 30 minutes</li>
                <li onClick={(e) => this.HandelSelectDuration("105")} className={this.state.OrderDuration=="105"?"bold":""} >1 hour 45 minutes</li>
                <li onClick={(e) => this.HandelSelectDuration("120")} className={this.state.OrderDuration=="120"?"bold":""} >2 hours</li>
              </ul>

{/*
            <DatePicker
              selected={new Date(this.state.OrderDuration)}
              minDate={new Date()}
              onChange={(date) => this.SetDurationTime(date)}
              showTimeSelect
              timeFormat="hh:mm aa"
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="dd/MM/yyyy hh:mm aa"
              className="form-control dateInput"
              inline
            /> */}

          </ModalBody>
          <ModalFooter>
          {this.state.AcceptError ? <div className="error error-t">{this.state.AcceptErrorText}</div> : ""}
            <Button color="secondary" onClick={() => { this.toggleStatusModal() }}>{Labels.Cancel}</Button>
            <Button color="primary" onClick={() => { this.UpdateStatus() }}>


              {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                : <span className="comment-text">{Labels.Confirm}</span>}
            </Button>

          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.addExtraTime} toggle={() => this.toggleExtraTimeModal()} >
            <ModalHeader>{this.state.AddExtraTimeText}</ModalHeader>
            <ModalBody className="move-modal">
              <h5 className="control-label font-weight-500">{Labels.Select_Time}</h5>
              <ul className="time-list-wrapper">
              <li onClick={(e) => this.HandelSelectDuration("5")} className={this.state.OrderDuration=="5"?"bold":""} >05 minutes</li>
                <li onClick={(e) => this.HandelSelectDuration("10")} className={this.state.OrderDuration=="10"?"bold":""}  >10 minutes</li>
                <li onClick={(e) => this.HandelSelectDuration("15")} className={this.state.OrderDuration=="15"?"bold":""} >15 minutes</li>
                <li onClick={(e) => this.HandelSelectDuration("20")} className={this.state.OrderDuration=="20"?"bold":""} >20 minutes</li>
                <li onClick={(e) => this.HandelSelectDuration("25")} className={this.state.OrderDuration=="25"?"bold":""} >25 minutes</li>
                <li onClick={(e) => this.HandelSelectDuration("30")} className={this.state.OrderDuration=="30"?"bold":""} >30 minutes</li>
                <li onClick={(e) => this.HandelSelectDuration("35")} className={this.state.OrderDuration=="35"?"bold":""} >35 minutes</li>
                <li onClick={(e) => this.HandelSelectDuration("40")} className={this.state.OrderDuration=="40"?"bold":""} >40 minutes</li>
                <li onClick={(e) => this.HandelSelectDuration("45")} className={this.state.OrderDuration=="45"?"bold":""} >45 minutes</li>
                <li onClick={(e) => this.HandelSelectDuration("50")} className={this.state.OrderDuration=="50"?"bold":""} >50 minutes</li>
                <li onClick={(e) => this.HandelSelectDuration("55")} className={this.state.OrderDuration=="55"?"bold":""} >55 minutes</li>
                <li onClick={(e) => this.HandelSelectDuration("60")} className={this.state.OrderDuration=="60"?"bold":""} >1 hour</li>
              </ul>
              {/* <select value={this.state.OrderDuration} className="order-date-dropdown form-control custom-select" style={{ height: '36px' }}>
                <option value="0">Time</option>
                <option value="5">05 minutes</option>
                <option value="10">10 minutes</option>
                <option value="15">15 minutes</option>
                <option value="20">20 minutes</option>
                <option value="25">25 minutes</option>
                <option value="30">30 minutes</option>
                <option value="35">35 minutes</option>
                <option value="40">40 minutes</option>
                <option value="45">45 minutes</option>
                <option value="50">50 minutes</option>
                <option value="55">55 minutes</option>
                <option value="60">60 minutes</option>
              </select> */}
            </ModalBody>

            <ModalFooter>
              {this.state.TimeError ? <div className="error error-t">{this.state.TimeErrorText}</div> : ''}

              <Button color="secondary" onClick={() => { this.toggleExtraTimeModal() }}>{Labels.Cancel}</Button>
              <Button color="primary" onClick={() => { this.AddExtTime() }}>

                {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                  : <span className="comment-text">{Labels.Add}</span>}

              </Button>

            </ModalFooter>
          </Modal>


        <Modal isOpen={this.state.cancelOrder} toggle={() => this.toggleCancelModal()} >
          <ModalHeader>{this.state.MoveToCancelText}</ModalHeader>
          <ModalBody className="move-modal">
            <label className="control-label font-weight-500">{Labels.Choose_Reason}</label>

            <ul className="time-list-wrapper">
              {/* <li value="0">Reason</li> */}
              <li onClick={(e) => this.HandelSelectCancelReason("Business closed")} className={this.state.CancelReason=="Business closed"?"bold":""} >Business closed</li>
              <li onClick={(e) => this.HandelSelectCancelReason("Out of radius")} className={this.state.CancelReason=="Out of radius"?"bold":""} >Out of radius</li>
              <li onClick={(e) => this.HandelSelectCancelReason("Fake Order")} className={this.state.CancelReason=="Fake Order"?"bold":""} >Fake Order</li>
              <li onClick={(e) => this.HandelSelectCancelReason("Cancelled by consumer")} className={this.state.CancelReason=="Cancelled by consumer"?"bold":""} >Cancelled by consumer</li>
              <li onClick={(e) => this.HandelSelectCancelReason("Nearest branch closed")} className={this.state.CancelReason=="Nearest branch closed"?"bold":""} >Nearest branch closed</li>
              <li onClick={(e) => this.HandelSelectCancelReason("Items not available")} className={this.state.CancelReason=="Items not available"?"bold":""} >Items not available</li>
              <li onClick={(e) => this.HandelSelectCancelReason("Riders not available")} className={this.state.CancelReason=="Riders not available"?"bold":""} >Riders not available</li>
              <li onClick={(e) => this.HandelSelectCancelReason("Tensed city situation")} className={this.state.CancelReason=="Tensed city situation"?"bold":""} >Tensed city situation</li>
              <li onClick={(e) => this.HandelSelectCancelReason("We are off today")} className={this.state.CancelReason=="We are off today"?"bold":""} >We are off today</li>
              <li onClick={(e) => this.HandelSelectCancelReason("Incorrect contact details provided")} className={this.state.CancelReason=="Incorrect contact details provided"?"bold":""} >Incorrect contact details provided</li>
              <li onClick={(e) => this.HandelSelectCancelReason("Disrupted travel and delivery services")} className={this.state.CancelReason=="Disrupted travel and delivery services"?"bold":""} >Disrupted travel and delivery services</li>
              <li onClick={(e) => this.HandelSelectCancelReason("Other")} className={this.state.CancelReason=="Other"?"bold":""} >Other</li>
            </ul>

            {this.state.IsOtherReason ? <input type="text" id="txtOtherReason" className="form-control " placeholder="Reason" onChange={(e) => this.HandleOtherCancelReason(e)} /> : ''}
            <div className="error error-t"></div>
          </ModalBody>
          <ModalFooter>
          {(this.state.OtherReasonError || this.state.ReasonError) ? <div className="error error-t">{this.state.ReasonErrorText}</div> : ''}
            <Button color="secondary" onClick={() => this.toggleCancelModal()}>{Labels.Close}</Button>
            <Button color="primary" onClick={() => { this.CancelOrder() }}>



              {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                : <span className="comment-text">{Labels.Cancel_Order}</span>}
            </Button>

          </ModalFooter>
        </Modal>


      </div>

    )

  }
}

//#endregion

export default OrderDetail;
