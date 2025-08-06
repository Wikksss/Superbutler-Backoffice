import React, { Component, Fragment } from 'react';
import * as Utilities from '../../../helpers/Utilities';
import Config from '../../../helpers/Config';
import Constants from '../../../helpers/Constants';
import * as EnterpriseOrderService from '../../../service/Orders';
import * as EnterpriseService from '../../../service/Enterprise';
import * as DeviceService from '../../../service/Device';
import * as EnterpriseUsers from '../../../service/EnterpriseUsers';
import Loader from 'react-loader-spinner';
import sound from '../../../assets/sound/sound_clip.mp3'
import {ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle, FormGroup, Button, Badge, Modal, ModalBody, ModalFooter, ModalHeader, } from 'reactstrap';
// import { FormGroup, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader, Table, Alert } from 'reactstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import Iframe from 'react-iframe'
import ProgressBar from 'react-bootstrap/ProgressBar'
import { Notify, orderSupportBubbleNotification, PlayOrStop } from '../../../containers/DefaultLayout/DefaultLayout';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import MUIDataTable from "mui-datatables";
import *as svgIcon from '../../../containers/svgIcon';
import Labels from '../../../containers/language/labels';
import Datepicker from "react-tailwindcss-datepicker";
import Avatar from 'react-avatar';
import Select from 'react-dropdown-select';
import { FaVolumeHigh } from "react-icons/fa6";
import { IoVolumeMute } from "react-icons/io5";
import { getMessaging, onMessage, isSupported } from "firebase/messaging";
import { FiUser } from "react-icons/fi";
import { FaCheck } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { FaExpandAlt, FaCompressAlt } from "react-icons/fa";
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import arrayMove from 'array-move';
import * as OrderDetailService from '../../../service/OrderDetail';

const $ = require("jquery");
const moment = require('moment-timezone');

var audio = new Audio(sound)
var interval;
var timeZone = '';
var currencySymbol = '';
var snozeinterval;
var snoozeTimeProgressInterval;
$.DataTable = require("datatables.net");

var menuTopItems_metaItemPrefix = "metaitem";
var metaItems = new Array();
const regex = /(<([^>]+)>)/ig;

const STATUS = {
  0: 'New',
  1: 'Confirmed',
  2: 'Ready',
  4: 'Completed',
};

const SortableItem = sortableElement(({ item, onDelete, discountPrice }) =>

  <div className="kds-main-p" style={{ display: "block" }}>
  <div className='kds-main-inner'>

  </div>

</div>

);

const SortableContainer = sortableContainer(({ items, onDelete }) => {
    if (items === undefined) { return; }
    return (
        <ol>
             <div className="common-theme-wrap ">
                    <div className='positioning-row row d-inline-flex w-100'>
            {items.map((value, index) => {

                return (

                    <SortableItem key={`item-${index}`} style={{ zIndex: 100000 }} item={value}  index={index} />

                )
            })}
              </div></div>
        </ol>
    );
});




class AllOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userObj: [],
      EnterpriseOrders: [],
      FilterOrders: [],
      ShowLoader: true,
      openIframeModal: false,
      openRiderModal: false,
      moveToStatus: false,
      cancelOrder: false,
      addExtraTime: false,
      confirmation: false,
      deviceStatus: false,
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
      Notification: {},
      ConfirmationMsg: "",
      devices: [],
      DeviceEnterpriseId: 0,
      DeviceEnterpriseName: '',
      UserRole: 0,
      PrintPage:false,
      token: '',
      SelectRange: false,
      enterprises: [],
      chkAllServices: true,
      serviceSeleted: true,
      selectedService: [],
      selectedServiceIdCsv: "0",
      currentServices: "",
      startDate: moment(),
      endDate: moment(),
      value: {},
      selectedParentEnterpriseId: 0,
      opt: [],
      allEnterprises: [],
      isAllServicesSelected: true,
      lifeTimeDate: moment(),
      countryConfigObj: {},
      childEnterprises:[],
      snozeTime:"",
      progressbarCheckbox: true,
      snozeDropdown: false,
      snozeLabel: "",
      totalMilliseconds: 0,
      timeString: "",
      sinceStartDate: new Date(),
      assignUser: false,
      loadingUser: false,
      users: [],
      parentUsers: [],
      selectedOrder: {},
      activeTab: "allOrders",
      // activeTab: "kds",
      isExpanded: false,
      KDScolumns: [],
      movingId: 0,
      kdsLoader: false,
      orderItems: {}, // Add this line to store order items
    }
    this.contentRef = React.createRef();
    var snoozeTime = localStorage.getItem(Constants.snoozeTime)
    this.state.snozeTime = snoozeTime != "" ? JSON.parse(snoozeTime) : snoozeTime
    this.state.startDate = moment().add(-7, 'day').format('YYYY-MM-DD 00:00:00');
    this.state.endDate = moment().format('YYYY-MM-DD 23:59:59');
    this.state.value = {startDate: new Date(this.state.startDate),  endDate: new Date(),}
    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.COUNTRY_CONFIGURATION))) {
      this.state.countryConfigObj = JSON.parse(localStorage.getItem(Constants.Session.COUNTRY_CONFIGURATION))
    }
    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
      let userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
      this.state.userObj = userObj;
      this.state.EnterpriseTypeId = userObj.Enterprise.EnterpriseTypeId;

      if(userObj.Enterprise.FirstOrderDate != undefined)
      {
        this.state.sinceStartDate = userObj.Enterprise.FirstOrderDate;
      }

      localStorage.setItem(Constants.Session.ENTERPRISE_ID, userObj.Enterprise.Id);
      localStorage.setItem(Constants.Session.ENTERPRISE_NAME, userObj.Enterprise.Name);
      localStorage.setItem(Constants.Session.ENTERPRISE_TYPE_ID, userObj.Enterprise.EnterpriseTypeId);
      this.state.UserRole = userObj.RoleLevel;

      timeZone = Config.Setting.timeZone;
      currencySymbol = Config.Setting.currencySymbol;

    if(userObj.EnterpriseRestaurant.Country != null) {
      timeZone = userObj.EnterpriseRestaurant.Country.TimeZone;
      currencySymbol = userObj.EnterpriseRestaurant.Country.CurrencySymbol;
    }

    this.audio = new Audio(sound);
    // const firebaseConfig = {
    //   apiKey: "AIzaSyDHRnN_B-KGuHsUBUIKxjN7oSEX4S4g8rM",
    //   authDomain: "superbutler-7c566.firebaseapp.com",
    //   projectId: "superbutler-7c566",
    //   storageBucket: "superbutler-7c566.appspot.com",
    //   messagingSenderId: "477573516701",
    //   appId: "1:477573516701:web:3e30c1f157f1c96822b374",
    //   measurementId: "G-BBZ3XCDR9K"
    // };
    // const firebaseApp  = firebase.initializeApp(firebaseConfig);
    const messaging = getMessaging();

    // let isSupported = firebase.messaging.isSupported();
    if (isSupported() && userObj.Enterprise.EnterpriseTypeId != 15) {
    if (userObj.Enterprise.EnterpriseTypeId != 15) {

      // const messaging = firebase.messaging();
      // console.log("messaging", messaging);

      let newOrder = Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.NEW_ORDER_LIST)) ? [] : JSON.parse(localStorage.getItem(Constants.Session.NEW_ORDER_LIST));
      // onMessage(messaging, (payload) => {
      //   console.log('Message received. ', payload);
      //   // ...
      // });
      onMessage(messaging, (payload) => {

        if(payload.data.ActivityType == "OrderSupportNotification"){
          if(orderSupportBubbleNotification){
            orderSupportBubbleNotification(payload)
          }
          return

        }

        Notify(payload);
        // console.log('Message received.', payload);
        this.Refresh();
        let temp = payload;
        let title = temp.notification.body;
        let ActivityParameters = {};
        let message = Utilities.stringIsEmpty(temp.notification.body) ? title : temp.notification.body;
        if (temp.data.ActivityParameters) {
          ActivityParameters = JSON.parse(temp.data.ActivityParameters);
        }

        if (Object.keys(ActivityParameters).length > 0 && Number(ActivityParameters.OrderStatus) === 0) {
          newOrder.push(ActivityParameters.OrderId);
          localStorage.setItem(Constants.Session.NEW_ORDER_LIST, JSON.stringify(newOrder));
          if (this.state.snozeTime == ""){
            PlayOrStop(false);
            PlayOrStop(true);
          }
          this.setState({ IsStopped: false });
        } else if (Object.keys(ActivityParameters).length > 0 && Number(ActivityParameters.OrderStatus) !== 0) {

          if (newOrder.indexOf(ActivityParameters.OrderId) !== -1) {
            newOrder.splice(newOrder.indexOf(ActivityParameters.OrderId), 1);
            localStorage.setItem(Constants.Session.NEW_ORDER_LIST, JSON.stringify(newOrder));
          }
        }

        if (newOrder.length === 0) {
          PlayOrStop(false);
        }

        if(this.state.openRiderModal && this.state.SelectedOrderId === Number(ActivityParameters.OrderId)){
          this.OpenRiderModal(Number(ActivityParameters.OrderStatus),Number(ActivityParameters.OrderId))
        }

        this.GetOrdersByStatus()

      });

    }
    }
    }


    if(!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.SELECTED_ORDER_STATUS))) {
      this.GetSelectedStatus();
  }


    if(!Utilities.stringIsEmpty(localStorage.getItem(Constants.ORDER_VIEW_TYPE))) {

      if(localStorage.getItem(Constants.ORDER_VIEW_TYPE) == "kds")
        {
          setTimeout(() => {
          this.handleTabChange("kds");
        }, 1);
      }

  }

    this.GetOrdersByStatus = this.GetOrdersByStatus.bind(this);
    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
      this.state.userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
    }
    else {
      this.props.history.push('/login')
    }
  }

  // KDS work start here

  SortModal() {
    this.setState({
        Sort: !this.state.Sort,
    }, () => {
        this.setSortState()
    });
}
setSortState = () => {
    try {

        let sortCSV = [];
        let temp = this.state.topItem
        for (var u = 0; u < temp.length; u++) {
            sortCSV.push(temp[u].ID);
        }
        sortCSV = sortCSV.toString()
        this.state.SortCategories = temp;
        this.state.SortCategoriesIdCsv = sortCSV
        this.setState({
            SortCategories: this.state.SortCategories,
            SortCategoriesIdCsv: this.state.SortCategoriesIdCsv

        })
    }
    catch (e) {
        console.log("setSortState Exception", e)
    }
}

onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ FilterOrders }) => ({
      FilterOrders: arrayMove(FilterOrders, oldIndex, newIndex),
    }));

};

groupOrdersByStatus = (orders) => {
  const grouped = {
    New: [],
    Confirmed: [],
    Ready: [],
    Completed: [],
  };

  orders.forEach((order) => {
    const key = STATUS[order.OrderStatus] || 'New';
    grouped[key].push(order);
  });

  this.setState({KDScolumns: grouped});
  return grouped;
};


getHeaderColor = (status) => {
  switch (status) {
    case 'Confirmed':
      return '#e1f7ff';
    case 'Ready':
      return '#fff1cf';
    case 'Completed':
      return '#d5ffbd';
    default:
      return '#f2f2f2';
  }
};

toggleExpand = (orderId) => {
  if (this.dragging) return; // Prevent toggle while dragging

  this.setState((prevState) => ({
    [`expanded_${orderId}`]: !prevState[`expanded_${orderId}`],
  }));
};

onBeforeCapture = () => {
  this.dragging = true;
};

onDragEnd = (result) => {
  const { source, destination } = result;

  // Clear dragging flag
  this.dragging = false;

  // If dropped outside any list
  if (!destination) return;
  this.setState({movingId: Number(result.draggableId)});

  // No movement
  if (
    source.droppableId === destination.droppableId &&
    source.index === destination.index
  ) {
    this.setState({movingId: 0});
    return;
  }

  const sourceCol = source.droppableId;
  const destCol = destination.droppableId;

  const sourceItems = Array.from(this.state.KDScolumns[sourceCol]);
  const destItems = Array.from(this.state.KDScolumns[destCol]);

  const [movedItem] = sourceItems.splice(source.index, 1);

  // Update status based on destination
  var moveToStatus = parseInt(
    Object.keys(STATUS).find((key) => STATUS[key] === destCol)
  );
  if(moveToStatus < Number(movedItem.OrderStatus))
    {
      this.setState({movingId: 0});
      return;
    }

  if(movedItem != undefined) {
    this.StatusModal(Number(movedItem.EnterpriseId), Number(movedItem.Id), Number(movedItem.OrderStatus), Number(movedItem.OrderType), moveToStatus)
  }

  //if(Number(movedItem.OrderType) < 4 && moveToStatus == 1) return;

  destItems.splice(destination.index, 0, movedItem);

  this.setState((prevState) => ({
    KDScolumns: {
      ...prevState.KDScolumns,
      [sourceCol]: sourceItems,
      [destCol]: destItems,
    },
  }));
};

renderOrderCard = (order, status, provided, index) => {
  const color = this.getHeaderColor(status);
  const isExpanded = this.state[`expanded_${order.Id}`] || false;
  const items = this.state.orderItems[order.Id] || [];
  let moveToStatusText = Number(order.OrderStatus) === 0 ? "Confirm" : Number(order.OrderStatus) == 1 ? (order.OrderType < 4 ? "Ready" : "Completed") : "Completed"

  // Fetch items if not already loaded
  if (!this.state.orderItems[order.Id]) {
    this.getOrderItems(order.Id, order.EnterpriseId);
  }

  if(this.state.movingId == order.Id) {
    return     <div className="loader-menu-inner">
    <Loader type="Oval" color="#ed0000" height={50} width={50} />
    <div className="loading-label">Loading.....</div>
  </div>
  }

  return (
    <div
      className="kds-top"
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={{ marginBottom: '10px',
        minHeight: '100px',
        background: 'white',
        borderRadius: '8px', ...provided.draggableProps.style }}
      onDoubleClick={() => this.props.history.push(`/order-detail/${order.EnterpriseId}/${order.OrderToken}/${order.Id}`)}
    >
      <div className="kds-hdr" {...provided.dragHandleProps} style={{ background: color }}>
      <div className="kds-f-row">
          <span>{new Date(order.OrderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {/* <span>5 mins</span> */}
        </div>

        <div className="kds-f-row">
          <span className='f-12 font-20'>#{order.Id}</span>
          <div className="t-price">{order.Currency}{Utilities.FormatCurrency(Number(order.TotalAmount), this.state.countryConfigObj?.DecimalPlaces)}</div>
        </div>
        <div className="kds-f-row">
        <span>  {order.TableNo ? `Table# ${order.TableNo}` : order.RoomNo ? `Room# ${order.RoomNo}` : 'Room N/A'}</span>

        </div>

        <div className="kds-f-row">
        <div>
                        {/* <div className="order-id">{this.setOrderTypeIcon(Number(order.OrderType))} <span>#{order.Id}</span></div> */}
                        {/* {this.state.EnterpriseTypeId == 1 || this.state.IsParent ||this.state.EnterpriseTypeId == Constants.ENTERPRISE_TYPE_IDS.HOTEL?

                          <div style={{marginTop:"10px", fontWeight:"600", fontSize:"13px", display:"flex", alignItems:"center"}}>
                            <span><img src={Utilities.generatePhotoLargeURL(`${order.EnterpriseLogo}`, true, false)}
                            style={{ width:"33px", border:"1px solid #d2d2d2", borderRadius:"50%", marginRight:"10px", fontWeight:"bold"}}/></span>
                            <span>{Utilities.SpecialCharacterDecode(order.RestaurantName)}</span></div>
                          : ""
                          } */}

                          <span>{this.GetOrderType(order.OrderType)}</span>

                      </div>
        </div>

      </div>

      <div className="kds-order-info p-2">
        <div
          className="kds-expdand-col"
          style={{
            maxHeight: this.dragging ? '0px' : isExpanded ? '500px' : '0px',
            overflow: 'hidden',
            transition: this.dragging ? 'none' : 'max-height 0.3s ease',
          }}
        >


    {items && items.map((item, index) => {
          const ItemDiscription = Utilities.stringIsEmpty(item.DescriptionNoteIdItemsDetails) ? {} : JSON.parse(item.DescriptionNoteIdItemsDetails);
          const extras = ItemDiscription.Extras || [];
          const toppings = ItemDiscription.Toppings || [];

          return (
            <div key={index} className="kds-info-row">
              <div className="kds-o-label">
                <span>{item.Quantity} x {Utilities.SpecialCharacterDecode(item.ItemName)}</span>
                {extras.map((extra, idx) => (
                  <div key={idx} className="kds-extra-item">
                    + {extra.Quantity} x {Utilities.SpecialCharacterDecode(extra.Name)}
                  </div>
                ))}
                {toppings.map((topping, idx) => (
                  <div key={idx} className="kds-topping-item">
                    + {Utilities.SpecialCharacterDecode(topping.Name)}
                  </div>
                ))}
              </div>
              <span className="kds-o-label-r">
                {order.Currency}{Utilities.FormatCurrency(Number(item.Price) * Number(item.Quantity), this.state.countryConfigObj?.DecimalPlaces)}
              </span>
            </div>
          );
        })}

      <div className='pl-3 pt-2'>

          <div className="kds-info-row">
            <span className="kds-o-label">Items cost:</span>
            <span className="kds-o-label-r">{order.Currency}{Utilities.FormatCurrency(Number(order.TotalAmount), this.state.countryConfigObj?.DecimalPlaces)}</span>
          </div>
          <div className="kds-info-row">
            <span className="kds-o-label">Total Tax @ 20%</span>
            <span className="kds-o-label-r">{order.Currency}{((order.TotalAmount * 0.2).toFixed(2))}</span>
          </div>
          <div className="kds-info-row">
            <span className="kds-o-label bold">Total Payable:</span>
            <span className="kds-o-label-r bold">
              {order.Currency}{(order.TotalAmount * 1.2).toFixed(2)}
            </span>
          </div>
          <div className="kds-info-row">
            <span className="kds-o-label">Payment mode:</span>
            <span className="kds-o-label-r">{this.SetPaymentMode(order.PaymentModes, order.OrderStatus, order.TotalAmount)}</span>
          </div>
          </div>

          <div className={`d-flex justify-content-between ${order.OrderStatus < 3 ? "" : "pl-4 pr-4"} mt-2`}>

          {order.OrderStatus < 3 &&
<span
   className={`d-flex align-items-center ml-0 add-cat-btn`}
  onClick={() => this.StatusModal(order.EnterpriseId, order.Id, order.OrderStatus, order.OrderType)}
 ><span className='font-12'>{moveToStatusText}</span></span>
          }

     <span
   className={`d-flex align-items-center ml-1 add-cat-btn`}
   onClick={() => this.CancelOrderModal(order.EnterpriseId, order.Id, order.OrderStatus)}
   ><span className={order.OrderStatus < 3 ? `font-12` : 'font-14'}>{"Cancel"}</span></span>

     <a href={"/print/" + order.Token} target="_blank">   <span
                   className={`d-flex align-items-center ml-1 add-cat-btn`}

                 ><span className={order.OrderStatus < 3 ? `font-12` : 'font-14'}>{"Print"}<i className="fa fa-print ml-1" aria-hidden="true"> </i></span></span></a>


   </div>

               </div>

        <span
          className="cursor-pointer text-primary kds-expand font-16 d-flex justify-content-end align-items-center mt-1"
          onClick={() => this.toggleExpand(order.Id)}
        >
          {isExpanded ? <FaCompressAlt /> : <FaExpandAlt />}
        </span>
      </div>
    </div>
  );
}

renderColumn = (statusKey) => {

  const orders = this.state.KDScolumns[statusKey];

  return (
    <Droppable droppableId={statusKey} key={statusKey}>
      {(provided) => (
        <div className='' ref={provided.innerRef}
        {...provided.droppableProps}>
        <div
          className="kds-col mx-2"
        >
          <h5 className="text-center">{statusKey}</h5>
          {orders != undefined && orders.length > 0 && orders.map((order, index) => (
            <Draggable
              key={order.Id.toString()}
              draggableId={order.Id.toString()}
              index={index}
            >
              {(provided) =>
                this.renderOrderCard(order, statusKey, provided)
              }
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
        </div>
      )}
    </Droppable>
  );
};

  // KDS work end here

  SelectRangeModal() {

    if(this.state.SelectRange) {

    this.setState({
      SelectRange: !this.state.SelectRange,
      childEnterprises: JSON.parse(this.state.currentServices)
    });

    return;
  }

    var isCheckedAll = true;
    var services = this.state.selectedService;
    var currentServices = JSON.stringify(this.state.childEnterprises);
    var enterpises = this.state.childEnterprises;
    this.setState({
      SelectRange: !this.state.SelectRange,
    }, () => {


      if(services.length > 0) {

        enterpises.forEach(enterprise => {

      if(enterprise.EnterpriseId == 0 || enterprise.EnterpriseId == undefined) return;

      var service = services.find(s => s.EnterpriseId == enterprise.EnterpriseId);

      enterprise.IsSelected = service != undefined

      // if(!enterprise.IsSelected)
      // {
      //   isCheckedAll = false;
      // }

    })

  } else
  {
    enterpises.forEach(enterprise => {
      enterprise.IsSelected = true;
    })
    isCheckedAll = true;
  }

  this.setState({enterprises: enterpises, chkAllServices: this.state.isAllServicesSelected, currentServices: currentServices})
  }


    )

}

handleValueChange = (newValue) => {

  var startDateFormat = 'YYYY-MM-DD 00:00:00';
  var endDateFomat = 'YYYY-MM-DD 23:59:59';

  this.setState({
    startDate: moment(newValue.startDate).format(startDateFormat),
    endDate: moment(newValue.endDate).format(endDateFomat),
    value: newValue,
  }, () => {

    sessionStorage.setItem(Constants.Session.SELECTED_ORDER_QUERY, `${this.state.startDate}|${this.state.endDate}`)
    this.GetEnterpriseOrders();
  })




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
    selectedStatus += '|' + this.state.SelectedDuration;
    localStorage.setItem(Constants.Session.SELECTED_ORDER_STATUS,selectedStatus);
  }

  GetSelectedStatus = () => {

    if(!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.SELECTED_ORDER_STATUS))){

    let states = String(localStorage.getItem(Constants.Session.SELECTED_ORDER_STATUS)).split('|');
    let duration = states[1];
    let selectedStatus = states[0].split(Config.Setting.csvSeperator);

    this.state.ChkAll = selectedStatus[0] == "1";
    this.state.ChkNew = selectedStatus[1] == "1";
    this.state.ChkInKitchen = selectedStatus[2] == "1";
    this.state.ChkReady = selectedStatus[3] == "1";
    this.state.ChkDelivered = selectedStatus[4] == "1";
    this.state.ChkCancelled = selectedStatus[5] == "1";
    this.state.ChkBooking = selectedStatus[6] == "1";
    this.state.ChkPreOrder  = selectedStatus[7] == "1";
    this.state.SelectedDuration = duration;
    }

  }

  GetSelectedServices = (services) => {

    if(!Utilities.stringIsEmpty(sessionStorage.getItem(Constants.Session.SELECTED_ORDER_QUERY))){

      let Dates = String(sessionStorage.getItem(Constants.Session.SELECTED_ORDER_QUERY)).split('|');
      this.state.startDate = Dates[0]
      this.state.endDate = Dates[1]
      this.state.value = {startDate:  Dates[0],  endDate: Dates[1]}
      this.setState({startDate: Dates[0], endDate: Dates[1]})

    }

    if((this.state.userObj.Enterprise.EnterpriseTypeId == 1 || this.state.userObj.Enterprise.EnterpriseTypeId == 2 || this.state.userObj.Enterprise.EnterpriseTypeId == 5) && services.length > 0 && services != undefined){

    let serviceIdCsv = String(localStorage.getItem(Constants.Session.SELECTED_ORDER_QUERY));

    if(serviceIdCsv != "0" && serviceIdCsv != "" && serviceIdCsv != "null") {
    services.forEach(service =>
    {
      var isServiceSelected = Utilities.isExistInCsv(String(service.Id), serviceIdCsv + Config.Setting.csvSeperator, Config.Setting.csvSeperator )
      service.IsSelected = isServiceSelected;
    })
    this.state.selectedServiceIdCsv = serviceIdCsv
    this.setState({enterprises: services});
  }
  else
  {
    services.forEach(service =>
      {
        service.IsSelected = true;
      })
  }
}
  this.handleServiceSelection(services);
  }


  GetAllEntterprises = async (searchKeyword) => {

    this.setState({ ShowLoader: true });

    if(this.state.userObj.Enterprise.EnterpriseTypeId == 1 || this.state.userObj.Enterprise.EnterpriseTypeId == 2) {

    let data = await EnterpriseService.GetAllParentEnterprise(1,1000, searchKeyword, true, true);

    var options = [{id: 0, name: "All", label: "All",  value: 0}]
    this.setState({values: options})
    if(data != undefined && data.length > 0)
      data = data.filter((val) => !val.IsChurned && !val.IsExternal && !val.IsDeleted && val.IsActive && val.EnterpriseTypeId != 15)
    {
      data.forEach(enterprise => {

        if(enterprise.EnterpriseId == undefined || enterprise.EnterpriseId == 0) return;


        // if(enterprise.ParentId == 0){
        options.push({id: enterprise.Id, name: Utilities.SpecialCharacterDecode(enterprise.Name),  value: enterprise.Id, label: Utilities.SpecialCharacterDecode(enterprise.Name)})
        // }
       });
    }

    this.setState({opt: options, selectedServiceIdCsv: "", selectedParentEnterpriseId: 0, allEnterprises: data}, () => {
      this.GetSelectedServices([]);


    });
    this.setState({ ShowLoader: false });
    return;
  }

      this.state.selectedParentEnterpriseId = Utilities.GetEnterpriseIDFromSessionObject();
      this.state.selectedServiceIdCsv = "";
      //this.GetAllEnterpriseServices();
      this.GetAllChildEnterprises()
  }

  generateUserIdCsv = () => {

    var parentUsers = this.state.parentUsers;
    var users = this.state.users;
    var userIdCsv = "";

    parentUsers.forEach(user => {
      if(user.IsSelected) userIdCsv += user.Id + ","
    });

    users.forEach(user => {
      if(user.IsSelected) userIdCsv += user.Id + ","
    });

    userIdCsv = Utilities.FormatCsv(userIdCsv, ',')

    return userIdCsv;
  }


  setAssigneeLocally = () => {

    var parentUsers = this.state.parentUsers;
    var users = this.state.users;
    var assigneeNameCsv = "";
    var assigneePhotoNameCsv = "";
    var filterOrders = this.state.FilterOrders;
    var enterpriseOrders = this.state.EnterpriseOrders;

    parentUsers.forEach(user => {
      if(user.IsSelected) {
        assigneeNameCsv += Utilities.stringIsEmpty(user.FirstName) ? user.DisplayName :`${user.FirstName} ${user.SurName},`
        assigneePhotoNameCsv += (Utilities.stringIsEmpty(user.PhotoName) ? "" : user.PhotoName) + ","
      }
    });

    users.forEach(user => {
      if(user.IsSelected) {
        assigneeNameCsv += Utilities.stringIsEmpty(user.FirstName) ? user.DisplayName :`${user.FirstName} ${user.SurName},`
        assigneePhotoNameCsv += (Utilities.stringIsEmpty(user.PhotoName) ? "" : user.PhotoName) + ","
      }
    });

    var index = filterOrders.findIndex(o => o.Id == this.state.selectedOrder.Id)

    if(index != -1) {
      filterOrders[index].AssignTo = this.generateUserIdCsv();
      filterOrders[index].AssigneeName = Utilities.FormatCsv(assigneeNameCsv, ",");
      filterOrders[index].AssigneePhotoName = Utilities.FormatCsv(assigneePhotoNameCsv, ",");
    }

     index = enterpriseOrders.findIndex(o => o.Id == this.state.selectedOrder.Id)

    if(index != -1) {
      enterpriseOrders[index].AssignTo = this.generateUserIdCsv();
      enterpriseOrders[index].AssigneeName = Utilities.FormatCsv(assigneeNameCsv, ",");
      enterpriseOrders[index].AssigneePhotoName = Utilities.FormatCsv(assigneePhotoNameCsv, ",");
    }

    this.setState({assignUser: false, FilterOrders: filterOrders})

  }


  handleCheckUser = (e, i, isParentUser) => {

    var checked = e.target.checked;
    var parentUsers = this.state.parentUsers;
    var users = this.state.users;

    if(isParentUser){
      parentUsers[i].IsSelected = checked;
    } else
    {
      users[i].IsSelected = checked;
    }

    this.setState({parentUsers: parentUsers, users: users})

  }


  handleCheckServices = (e, i, isAll) => {

    var checked = e.target.checked;
    var services = this.state.childEnterprises;
    var isCheckedAll = true;
    var serviceSeleted = false;
    if(isAll)
    {
      serviceSeleted = checked;
      isCheckedAll = checked;
      services.forEach(service => {
        service.IsSelected = checked;
      });
    } else {

      services[i].IsSelected = checked
      services.forEach(service => {

        if(service.Id == 0 || service.Id == undefined) return;

        if(!service.IsSelected) isCheckedAll = false;

        if(service.IsSelected) serviceSeleted = true;

      });

    }

    this.setState({enterprises: services, chkAllServices: isCheckedAll, serviceSeleted: serviceSeleted})

  }

  handleServiceSelection = (services) => {


    var serviceIdCsv = ""
    var services = services;
    var isAllSelected = true;
    var selectedService = this.state.selectedService;
    selectedService = [];
    localStorage.removeItem(Constants.Session.SELECTED_ORDER_QUERY)
    services.forEach(service => {

      if(service.Id == 0 || service.Id == undefined) return;

      if(service.IsSelected == undefined || service.IsSelected)
      {
        selectedService.push(service);
        serviceIdCsv += service.Id + Config.Setting.csvSeperator
      } else
      {
        isAllSelected = false;
      }

    });

    selectedService = selectedService;
    // selectedService = isAllSelected ? [] : selectedService;
    serviceIdCsv = Utilities.FormatCsv(serviceIdCsv, Config.Setting.csvSeperator);

    this.setState({selectedService: selectedService, selectedServiceIdCsv: serviceIdCsv, SelectRange: false, isAllServicesSelected: isAllSelected}, () => {

      if(serviceIdCsv != "")
      localStorage.setItem(Constants.Session.SELECTED_ORDER_QUERY, `${this.state.selectedServiceIdCsv}`)

      this.GetEnterpriseOrders()
    })


  }

  HandleCheckAll(e) {

    var isChecked = e.target.checked;
    this.setState({ ChkNew: isChecked, ChkInKitchen: isChecked, ChkReady: isChecked, ChkCancelled: isChecked, ChkDelivered: isChecked, ChkBooking: isChecked, ChkPreOrder: isChecked,  ChkAll: isChecked }, () => {
      this.setState({ ShowLoader: true });
      this.GetOrdersByStatus();
      this.SetSelectedStatus();
    })

  }
  assignUserModal = (order) => {

    if(order != undefined && !Utilities.stringIsEmpty(order.AssignTo) && this.state.userObj.RoleLevel == Constants.Role.STAFF_ID) return;

    this.setState({
      assignUser: !this.state.assignUser,
      selectedOrder: order,
      users: [],
      parentUsers: [],
      loadingUser: true

    }, () => {

      if(this.state.assignUser){
        this.GetAllUsers(order);
      }

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
    this.SetSelectedStatus();

  }

  OrderSorting = (orders) => {

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



  GetOrdersByStatus = () => {

    let orders = this.state.EnterpriseOrders;

    let accptedOrders = orders.filter(order => {
      return (Number(order.OrderStatus) !== 3)
    })

    let selected = true

    let order = orders.filter(order => {

      switch (Number(order.OrderStatus)) {

        case 0:
          // if (!Utilities.stringIsEmpty(order.PreOrderTime)) {
          //   var date = moment(order.PreOrderTime).format('YYYY-MM-DD HH:mm:ss');
          //   //var today = moment(new Date()).format('YYYY-MM-DD H:mm:ss');
          //   var today = new Date(moment.tz(Config.Setting.timeZone).format("YYYY-MM-DDTHH:mm:ss"));
          //   var diff = moment.duration(moment(date).diff(moment(today)));
          //   var hours = parseInt(diff.asHours());
          //   var min = parseInt(diff.asMinutes());
          //   selected = min < Config.Setting.preOrderAcceptDuration && this.state.ChkNew  || (min >= Config.Setting.preOrderAcceptDuration && this.state.ChkPreOrder && Number(order.OrderType) !== 4) ;
            // } else {
               selected = this.state.ChkNew
              // };

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
        this.setState({
          ShowLoader: false, kdsLoader: false, TotalOrders: orders.length, TotalCardsAmount: totalCardsAmount, TotalCashAmount: totalCashAmount, TotalAmount: totalAmount + totalCancelledAmount, TotalCancelledAmount: totalCancelledAmount,
          ChkAll: this.state.ChkNew && this.state.ChkInKitchen && this.state.ChkReady && this.state.ChkDelivered && this.state.ChkCancelled && this.state.ChkBooking && this.state.ChkPreOrder

        }, () => {
          setTimeout(() => {
            const searchInput = document.querySelector('input[placeholder="Search"]');
            if (searchInput) {
              searchInput.blur();
              console.log(searchInput, "searchInput")
            }
          }, 50);
        });

        this.bindDataTable();
      }
        .bind(this),
      100
    );

  }

  GetOrdersCount = (orders, status, isPreOrder) => {


    if (orders === null) {
      return;
    }

    let filterOrder = orders.filter(order => {
      return (Number(order.OrderStatus) === status)
    });


    if (Number(status) === 0 && filterOrder.length === 0) {
      PlayOrStop(false);
    }

    if (Number(status) === 0 && filterOrder.length > 0 && !isPreOrder) {

      // filterOrder = filterOrder.filter(order => {

      //   if (!Utilities.stringIsEmpty(order.PreOrderTime)) {

      //     var date = moment(order.PreOrderTime).format('YYYY-MM-DD HH:mm:ss');
      //     // var today = moment(new Date()).format('YYYY-MM-DD H:mm:ss');
      //     var today = new Date(moment.tz(Config.Setting.timeZone).format("YYYY-MM-DDTHH:mm:ss"));
      //     var diff = moment.duration(moment(date).diff(moment(today)));
      //     var hours = parseInt(diff.asHours());
      //     var min = parseInt(diff.asMinutes());
      //     return min < Config.Setting.preOrderAcceptDuration ;
      //   }

      //   else { return true };

      // });

      if (this.state.snozeTime == "" && filterOrder.length > 0) {
        PlayOrStop(true);
      } else {
        PlayOrStop(false);
      }
    }

    // if (Number(status) === 0 && filterOrder.length > 0 && isPreOrder) {

    //   filterOrder = filterOrder.filter(order => {

    //     if (!Utilities.stringIsEmpty(order.PreOrderTime)) {

    //       var date = moment(order.PreOrderTime).format('YYYY-MM-DD HH:mm:ss');
    //       // var today = moment(new Date()).format('YYYY-MM-DD H:mm:ss');
    //       var today = new Date(moment.tz(Config.Setting.timeZone).format("YYYY-MM-DDTHH:mm:ss"));
    //       var diff = moment.duration(moment(date).diff(moment(today)));
    //       var hours = parseInt(diff.asHours());
    //       var min = parseInt(diff.asMinutes());
    //       return min >= Config.Setting.preOrderAcceptDuration && Number(order.OrderType) !== 4;
    //     }

    //     else { return false };

    //   });

    // }

    return filterOrder.length > 0 ? filterOrder.length : "";
  }

  GetAllUsers = async(order) => {
    const enterpriseId = order.EnterpriseId;
    const enterpriseCsv = `${enterpriseId},${order.ParentID}`;
    this.setState({loadingUser: true});
    var data = await EnterpriseUsers.GetEnterpriseUsers(enterpriseCsv);
    console.log("data: ", data);

    if(data.length > 0) {

      if (this.state.userObj.RoleLevel == Constants.Role.STAFF_ID)
      {
        var users = data.filter(u => u.Id == this.state.userObj.Id)
        this.setState({ users: users, parentUsers: [] })
      } else
      {

        var parentUsers = data.filter(u => u.EnterpriseId == order.ParentID && !u.IsDeleted && u.IsActive)
        var users = data.filter(u => u.EnterpriseId != order.ParentID && !u.IsDeleted && u.IsActive)

        parentUsers = parentUsers.sort((a, b) => {
          // Compare items to place the user's object at the top
          if (a.Id === this.state.userObj.Id) return -1; // Place `a` before `b`
          if (b.Id === this.state.userObj.Id) return 1;  // Place `b` before `a`
          return 0; // No change in order
        });


        users = users.sort((a, b) => {
          // Compare items to place the user's object at the top
          if (a.Id === this.state.userObj.Id) return -1; // Place `a` before `b`
          if (b.Id === this.state.userObj.Id) return 1;  // Place `b` before `a`
          return 0; // No change in order
        });


        parentUsers.forEach(user => {
          user.IsSelected = Utilities.isExistInCsv(user.Id, order.AssignTo + ',', ',')
        });

        users.forEach(user => {
          user.IsSelected = Utilities.isExistInCsv(user.Id, order.AssignTo + ',', ',')
        });


        this.setState({ users: users, parentUsers: parentUsers })
      }

    }

    this.setState({loadingUser: false});
  }


  GetEnterpriseOrders = async (orderStatus) => {

    this.setState({ ShowLoader: true});

    var selectedServiceIdCsv = this.state.selectedServiceIdCsv == "" ? "0" : this.state.selectedServiceIdCsv

    var data = await EnterpriseOrderService.Get(this.state.selectedParentEnterpriseId ,-1, this.state.SelectedDuration, this.state.startDate, this.state.endDate, selectedServiceIdCsv);
    var orders = data;
    if (data.length > 0) {
      this.setState({ IsParent: data[0].IsParent === '1' });
    }


    this.setState({ EnterpriseOrders: Utilities.stringIsEmpty(data) ? [] : data, FilterOrders: data, ProgressWidth: 30 }, ()=> {
      this.MergeColumnsForSearch(this.state.FilterOrders);
    });

    this.groupOrdersByStatus(data);
    this.GetOrdersByStatus();

  }

  UpdateAssigneeApi = async () => {

    var userIds = this.generateUserIdCsv();

    var response = await EnterpriseOrderService.UpdateAssignee(this.state.selectedOrder.Id, userIds);

    this.setState({assigneeLoader: true});


    var result = await response.json();

    if (!result.HasError && result.Dictionary.IsUpdated) {

      Utilities.notify("Assigned" + " successfully", "s");
      this.setAssigneeLocally();


    } else  if (result.HasError) {
      Utilities.notify("Failed to assign: " +  result.ErrorCodeCsv, "e");
    }

    this.setState({assignUser: false, assigneeLoader: false})

  }

  UpdateCompletionTimeApi = async (order) => {

    // this.setState({ ShowLoader: true });
    var response = await EnterpriseOrderService.AddExtraTime(order);
    this.setState({ IsSave: false })
    this.setState({ TimeError: false })
    var result = await response.json();

    if (!result.HasError && result.Dictionary.CompletionTime) {

      if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.ADMIN_OBJECT))) {

        // Utilities.notify(order.duration + " mins extra added to order #" + order.orderId + ".", "s");
      }
      var orders = this.state.FilterOrders

      var index = Utilities.GetObjectArrId(order.orderId, orders)

      if (result.Dictionary.CompletionTime !== undefined) {
        orders[index].CompletionTime = result.Dictionary.CompletionTime;
      }

      this.setState({ FilterOrders: orders, addExtraTime: false }, ()=> {
        this.MergeColumnsForSearch(this.state.FilterOrders);

      });

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


  UpdateStatusApi = async (order) => {

    // console.log("Order", order);
    var response = await EnterpriseOrderService.UpdateOrderStatus(order);
    this.setState({ IsSave: false, movingId: 0 })
    var result = await response.json();

    if (!result.HasError && result.Dictionary.IsSuccess) {
      var orders = this.state.FilterOrders

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

      var index = Utilities.GetObjectArrId(order.orderId, orders)

      orders[index].OrderStatus = this.state.MoveToStatus;

      if (result.Dictionary.CompletionTime != undefined) {
        orders[index].CompletionTime = result.Dictionary.CompletionTime;
      }

      this.setState({ FilterOrders: orders, moveToStatus: false, cancelOrder: false }, ()=> {
        this.MergeColumnsForSearch(this.state.FilterOrders);
      });

    }
    else if (result.HasError) {

      this.setState({ ReasonError: true, AcceptError: true, AcceptErrorText: result.ErrorCodeCsv, ReasonErrorText: result.ErrorCodeCsv })
    }

  }

  UpdateStatus = () => {

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


    this.GetEnterpriseOrders(-1)
  }


  CancelOrder = () => {

    if (this.state.IsSave) return;
    this.setState({ IsSave: true })

    if (Number(this.state.CancelReason) === 0) {
      this.setState({ ReasonError: true, IsSave: false })
      return;
    }

    if (this.state.CancelReason == 'Other') {
      this.setState({ OtherReasonError: true, IsSave: false })
      return;
    }

    this.state.MoveToCancel = true;
    let order = {};
    order.enterpriseId = this.state.SelectedOrderEnterpriseId;
    order.orderId = this.state.SelectedOrderId;
    order.comments = this.state.CancelReason;
    order.status = this.state.MoveToStatus;
    order.deliverytime = 0;
    this.UpdateStatusApi(order);
  }


  HandleChangeDuration = (value) => {

    this.state.SelectedDuration = Number(value);
    this.SetSelectedStatus();
    this.GetEnterpriseOrders(-1);

  }

  Refresh = () => {
    this.setState({ ShowLoader: true });
    this.GetEnterpriseOrders(-1);
  }

  HardRefresh = () => {
    this.setState({ ShowLoader: true,});
    // clearInterval(snozeinterval)
    // PlayOrStop(false)
    this.GetEnterpriseOrders(-1);
    // clearInterval(interval);
    // this.ShowProgressBar();
  }



  componentDidMount() {

    // This method is called when the component is first added to the document
    if(this.state.activeTab != "kds"){

      this.GetAllEntterprises();
    }

    // this.GetAllEnterpriseServices()

    // if(this.state.userObj.Enterprise.EnterpriseTypeId == 5 || this.state.userObj.Enterprise.EnterpriseTypeId == 1){
    // this.GetAllEnterpriseServices()
    // } else
    // {
    //   this.GetEnterpriseOrders(-1);
    // }



    this.ShowProgressBar();

  }

  componentWillUnmount() {
    this.clearSnoozeInterval()
    PlayOrStop(false);
  }

  clearSnoozeInterval = () =>{
    clearInterval(snoozeTimeProgressInterval)
    localStorage.setItem(Constants.snoozeTime,'')
    this.setState({  snozeTime:'', snoozeLabel: "", timeString: "",  totalMilliseconds: 0 })
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
    if (orderType == 1) {
      return (
        <span className="info-detail-icon deliver-bg">
          <svgIcon.DeliveryIcon/>
        </span>
      )
    } else if (orderType == 2) {
      return (
        <span className="info-detail-icon collection-bg">
          {/* <i className="fa fa-shopping-bag" aria-hidden="true"></i> */}
          <svgIcon.CollectionIcon/>

        </span>
      )
    } else if (orderType == 3) {
      return (
        <span className="info-detail-icon eatin-bg">
  <svgIcon.RoomDiningIcon/>
        </span>
      )
    }
    else if (orderType == 4) {
      return (
        <span className="info-detail-icon tableBooking-bg">
             <svgIcon.BookedIcon/>
        </span>
      )
    }
    else if (orderType == 6) {
      return (
        <span className="info-detail-icon svg-bg all-orders-icon">
         <svgIcon.SpaIcon/>
        </span>
      )
    }
    else if (orderType == 7) {
      return (
        <span className="info-detail-icon svg-bg all-orders-icon">
         <svgIcon.CarRentIcon/>
        </span>
      )
    }
    else if (orderType == 8) {
      return (
        <span className="info-detail-icon svg-bg all-orders-icon">
         <svgIcon.TourPackageIcon/>
        </span>
      )
    }
    else if (orderType == 9) {
      return (
        <span className="info-detail-icon svg-bg all-orders-icon">
         <svgIcon.ExecutiveLoungeIcon/>
        </span>
      )
    }
    else if (orderType == 10) {
      return (
        <span className="info-detail-icon svg-bg all-orders-icon">
         <svgIcon.RoomDiningIcon/>
        </span>
      )
    }
    else if (orderType == 11) {
      return (
        <span className="info-detail-icon svg-bg all-orders-icon">
         <svgIcon.LaundryIcon/>
        </span>
      )
    }
    else if (orderType == 12) {
      return (
        <span className="info-detail-icon shoptable-bg">
         <svgIcon.ShopIcon/>
        </span>
      )
    }
  }

  HandelSelectDuration(duration) {
    this.setState({ OrderDuration: duration })
  }


  HandelSelectCancelReason(reason) {

    this.setState({ CancelReason: reason, IsOtherReason: reason == "Other" });
  }

  handleTabChange = (tab) => {

    if(tab == this.state.activeTab) return;

    if(tab == "kds"){
      // if(this.state.progressbarCheckbox)
      // localStorage.setItem("ProgressBarChecked", true)
      // this.handleChangeCheckbox(false);
      this.setState({kdsLoader: true});
      this.state.startDate = moment().format('YYYY-MM-DD 00:00:00');
      this.state.endDate = moment().format('YYYY-MM-DD 23:59:59');
      this.setState({value: {startDate: new Date(this.state.startDate),  endDate: this.state.endDate}});
      localStorage.setItem(Constants.ORDER_VIEW_TYPE, tab)

    } else
    {
      // var progressBarChecked = localStorage.getItem("ProgressBarChecked") ==  undefined
      // this.handleChangeCheckbox(progressBarChecked);
      // localStorage.removeItem("ProgressBarChecked");
      localStorage.removeItem(Constants.ORDER_VIEW_TYPE)
      if(!Utilities.stringIsEmpty(sessionStorage.getItem(Constants.Session.SELECTED_ORDER_QUERY))){

        let Dates = String(sessionStorage.getItem(Constants.Session.SELECTED_ORDER_QUERY)).split('|');
        this.state.startDate = Dates[0]
        this.state.endDate = Dates[1]
        this.state.value = {startDate:  Dates[0],  endDate: Dates[1]}
        this.setState({startDate: Dates[0], endDate: Dates[1]})

      }

    }
    this.GetEnterpriseOrders();
    this.setState({ activeTab: tab });
  };

  HandleOtherCancelReason(e) {
    let cancelResonText = Utilities.SpecialCharacterEncode(e.target.value)
    this.setState({ CancelReason: cancelResonText });
  }


  MergeColumnsForSearch = (filterOrders) => {

    filterOrders.forEach((order)=> {

      var allColumns = Object.keys(order).map(function(key) {

        if(key == 'OrderType'){
          let paymentMode = "BY CASH";
          order.PaymentModes.forEach(mode => {
         if (Number(mode.PaymentMode) === 1 && Number(order.TotalAmount > 0)) {
          paymentMode = "BY CASH";
          if (Number(order.OrderStatus) === 4) {
            paymentMode = "PAID CASH";
          }
      } else if(Number(mode.PaymentMode) === 5 && Number(order.TotalAmount > 0)){
        paymentMode = "CARD ON DELIVERY";
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
orderStatusClasses =(status)=>{

  var orderStatus = 'new-bg';

  if(status==1){
     orderStatus = 'confirm-bg';
  }
  else if(status==2){
     orderStatus = 'ready-bg';
  }
  else if(status==3){
     orderStatus = 'cancelled-bg';
  }
  else if(status==4){
     orderStatus = 'completed-bg';
  }
 return orderStatus;
}

orderStatusIcon =(icon, type)=>{
  var orderStatusIcon = ""
  if(icon==0){
   orderStatusIcon = <div><span className='status-icon-svg'><svgIcon.NewOrderIcon/></span><span className='ml-2'>New</span></div>;
  }
  else if(icon==1){
    // if (type >= 4) {
      orderStatusIcon = <div><span className='status-icon-svg'><svgIcon.ConfirmedIcon/></span><span className='ml-2'>Confirmed</span></div>
    // }
    // else{
    //   orderStatusIcon = <div><span className='status-icon-svg'><svgIcon.ReadyIcon/></span><span className='ml-2'>Ready</span></div>

    // }
    }

  else if(icon==2){
    orderStatusIcon = <div><span className='status-icon-svg'><svgIcon.ReadyIcon/></span><span className='ml-2'>Ready</span></div>
  }
  else if(icon==3){
    orderStatusIcon =<div><span className='status-icon-svg'><svgIcon.CancelledIcon/></span><span className='ml-2'>Cancelled</span></div>
  }
  else if(icon==4){
    orderStatusIcon = <div><span className='status-icon-svg'><svgIcon.CompletedIcon/></span><span className='ml-2'>Completed</span></div>
  }
 return orderStatusIcon;
}

  setOrderStatus = (restId, orderId, orderStatus, type, riderInfo, isSupermealDelivery,preOrderTime) => {

    let statusText = Number(orderStatus) === 0 ? "New" : Number(orderStatus) === 1 ? "Confirmed" : type < 4 ? "Ready" :""
    let moveToStatusText = Number(orderStatus) === 0 ? "Confirm" : Number(orderStatus) === 1 ? (type < 4 ? "Ready" : "Completed") : "Completed"


    if (orderStatus < 3) {


      return (


        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown} className={ isSupermealDelivery && orderStatus > 0 ? `${this.orderStatusClasses(orderStatus)} padding-dropdown hide-arrow-status` : `${this.orderStatusClasses(orderStatus)} padding-dropdown`}>
        <div className="t-label">STATUS</div>


          <Dropdown.Toggle variant="secondary" >

            {this.orderStatusIcon(orderStatus, type)}

          </Dropdown.Toggle>

          { isSupermealDelivery && orderStatus > 0 ? '' :
            <Dropdown.Menu>
              <div className="menu-data-action-btn-wrap">
                <Dropdown.Item > {<span className="m-b-0 statusChangeLink m-r-20 " onClick={() => this.StatusModal(restId, orderId, orderStatus, type)}>
                <span >{moveToStatusText}</span>
              </span> }
                </Dropdown.Item>
                <Dropdown.Item >{orderStatus > 0 && !isSupermealDelivery ? <span className="m-b-0 statusChangeLink m-r-20" onClick={() => this.AddExtraTimeModal(restId, orderId, orderStatus)}><a> Add extra time</a></span> : ""}</Dropdown.Item>
                <Dropdown.Item >{isSupermealDelivery && orderStatus > 0 ? '' : <span className="m-b-0 statusChangeLink m-r-20" onClick={() => this.CancelOrderModal(restId, orderId, orderStatus)}><span>Cancel order</span></span>} </Dropdown.Item>
              </div>
            </Dropdown.Menu>}

            { isSupermealDelivery && type === 1 ?  <a className={orderStatus === 0 ? "rider-btn disable-rider" : "rider-btn"} onClick={() => this.OpenRiderModal(orderStatus,orderId)}>Rider</a> : ''}
        </Dropdown>

      )

    } else if (orderStatus === 3) {
      return (
        <Dropdown className={`padding-dropdown hide-arrow-status ${this.orderStatusClasses(orderStatus)}`}>
          <div className="t-label">STATUS</div>
          <Dropdown.Toggle variant="secondary" >
          {this.orderStatusIcon(orderStatus, type)}
          </Dropdown.Toggle>
          {isSupermealDelivery && type === 1 ?  Object.keys(riderInfo).length === 0 ? '' :  <a className={"rider-btn"} onClick={() => this.OpenRiderModal(orderStatus,orderId)}>Rider</a> : ''}
        </Dropdown>
      )
    }

    else if (orderStatus === 4) {
      return (
        <Dropdown className={`padding-dropdown ${this.orderStatusClasses(orderStatus)} ${this.state.UserRole == Constants.Role.SYSTEM_ADMIN_ID || this.state.UserRole == Constants.Role.SYSTEM_OPERATOR_ID || this.state.UserRole == Constants.Role.RESELLER_ADMIN_ID || this.state.UserRole == Constants.Role.RESELLER_MODERATOR_ID? "" : `${this.orderStatusClasses(orderStatus)} hide-arrow-status`}`}>
          <div className="t-label">STATUS</div>
          <Dropdown.Toggle variant="secondary" >
          {this.orderStatusIcon(orderStatus, type)}
          </Dropdown.Toggle>

        {this.state.UserRole == Constants.Role.SYSTEM_ADMIN_ID || this.state.UserRole == Constants.Role.SYSTEM_OPERATOR_ID || this.state.UserRole == Constants.Role.RESELLER_ADMIN_ID || this.state.UserRole == Constants.Role.RESELLER_MODERATOR_ID?

        <Dropdown.Menu>
              <div className="menu-data-action-btn-wrap">
                <Dropdown.Item >{isSupermealDelivery && orderStatus > 0 ? '' : <span className="m-b-0 statusChangeLink m-r-20" onClick={() => this.CancelOrderModal(restId, orderId, orderStatus)}><span>Cancel order</span></span>} </Dropdown.Item>
              </div>
            </Dropdown.Menu>

            : "" }
          {isSupermealDelivery && type === 1 ?  Object.keys(riderInfo).length === 0 ? '' :  <a className={"rider-btn"} onClick={() => this.OpenRiderModal(orderStatus,orderId)}>Rider</a> : ''}
       </Dropdown>
      )
    }

    else if (orderStatus === 6) {
      return (
        <Dropdown className={`${this.orderStatusClasses(orderStatus)} padding-dropdown hide-arrow-status`}>
          <div className="t-label">STATUS</div>
          <Dropdown.Toggle variant="secondary" >
          <div><span className='status-icon-svg'><svgIcon.BookedIcon/></span><span className='ml-2'>Booked</span></div>
          </Dropdown.Toggle>
          {isSupermealDelivery && type === 1 ?  Object.keys(riderInfo).length === 0 ? '' :  <a className={"rider-btn"} onClick={() => this.OpenRiderModal(orderStatus,orderId)}>Rider</a> : ''}
        </Dropdown>
      )
    }
  }

  setPreOrderTime = (preOrderTime, orderType, status, completionTime, extraFieldJson) => {
    var ServingTime = ""
    if(extraFieldJson != undefined && extraFieldJson != ""){
        for (var i = 0; i < extraFieldJson.length; i++) {
          extraFieldJson = extraFieldJson.replace(new RegExp("\\" + "^", "gi"), '"');
        }
        ServingTime = this.SetDateFormat(JSON.parse(extraFieldJson).DeliveryTime, status)
        return (<div ><div><span className="Common-label-all-order">{Labels.Delivery_Time}</span></div><span className="common-o-label">{ServingTime}</span></div>)
    }
    ServingTime = !Utilities.stringIsEmpty(preOrderTime) && Number(status) === 0 ? this.SetDateFormat(preOrderTime, status) : Number(status) > 0 && Number(status) != 3 ? this.SetDateFormat(completionTime, status) : "-";

    return (<div ><div><span className="Common-label-all-order">{Labels.Order_Time}</span></div><span className="common-o-label">{ServingTime}</span></div>)
  }

  GetOrderType = (type) => {

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


  SetPaidClass = (paymentModes, status, payableAmount) => {

    let className = "value-paid";
    paymentModes.forEach(mode => {
      if ((Number(mode.PaymentMode) === 1 || Number(mode.PaymentMode) === 5 || Number(mode.PaymentMode) === 6  || Number(mode.PaymentMode) === 7 ) && Number(status) !== 4 && Number(payableAmount > 0)) {
        className = "value-paid not-paid";
      }
    });
    return className;

  }

  SetPaymentMode = (paymentModes, status, payableAmount) => {

    let paymentMode = "";
    paymentModes.forEach(mode => {
      if (Number(mode.PaymentMode) == 1) {
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

  ShowPaymentMode = (paymentModes,status,payableAmount) => {

    let show = true;
    paymentModes.forEach(mode => {
      if ((Number(mode.PaymentMode) === 1 || Number(mode.PaymentMode) === 5 || Number(mode.PaymentMode) === 6 || Number(mode.PaymentMode) === 7) && Number(status) === 4) {
        show = false;
      }
    });
    return show;
  }

  SetDateFormat = (orderDate, status) => {

    if (Number(status) == 0 || Number(status) == 1 || Number(status) == 2) {

      var date = Utilities.getDateByZone(orderDate, "YYYY-MM-DD", timeZone);
      // var today = moment(new Date()).format('YYYY-MM-DD');
      var today = new Date(moment.tz(Config.Setting.timeZone).format("YYYY-MM-DD"));

      if (moment(date).isSame(today, 'day')) {
        return Utilities.getDateByZone(orderDate, "h:mm a", timeZone);//moment(orderDate).format('h:mm a')
      }
    }

    return Utilities.getDateByZone(orderDate, "DD MMM YYYY  h:mm a", timeZone);

  }

  viewOrderDetail = (token, id) => {
      this.setState({
      openIframeModal: true,
      iframeUrl: Config.Setting.baseUrl + '/m/' + token,
      SelectedOrderId: id,

    })
  }

printView = (token) => {

  window.open(Config.Setting.baseUrl + '/print/' + token);

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
  PrintPageModal = (token) => {
    this.setState({
      PrintPage: !this.state.PrintPage,
      token : token
    })
  }


  OpenRiderModal = async (orderStatus, orderId) => {
   let selectedOrder =[]
   selectedOrder = this.state.EnterpriseOrders.filter(a=>a.Id==orderId)
   if(selectedOrder.length >0 ){
    selectedOrder = selectedOrder[0];
    this.setState({
        PickupTime: moment(selectedOrder.PickupTime).format("DD MMM YYYY  h:mm a"),
        EstDeliveryTime: moment(selectedOrder.CompletionTime).format("DD MMM YYYY  h:mm a"),
      })
    }
    this.setState({ RiderInfo: {}, });
    if (orderStatus > 0) {
      this.setState({
        openRiderModal: true,
        SelectedOrderId: orderId
      });
      var data = await EnterpriseOrderService.GetRiderInfo(orderId);
      if (Object.keys(data).length > 0) {
        this.setState({
          RiderInfo: data,
        });
      }
    }

  }

  toggleDropDown = () => this.setState({ dropdownOpen: !this.state.dropdownOpen });

  toggleStatusModal = () => {
    this.setState({ moveToStatus: !this.state.moveToStatus, movingId: 0, filterOrders: this.state.EnterpriseOrders

    }, () => this.groupOrdersByStatus(this.state.EnterpriseOrders))

  }

  toggleCancelModal = () => {
    this.setState({ cancelOrder: !this.state.cancelOrder, IsSave: false })
  }

  toggleExtraTimeModal = () => {
    this.setState({ addExtraTime: !this.state.addExtraTime })
  }
  toggleConfirmationModal = (order, type) => {

    if(order == undefined) {
      this.setState({ confirmation: !this.state.confirmation})
      return;
    }


    var notification = {};
    notification.EnterpriseId = order.EnterpriseId;
    notification.OrderId = order.Id;
    notification.OrderStatus = order.OrderStatus;
    notification.Type = type;
    var confirmationMsg = `Resend notification of order #${ order.Id} to device?`
     if(type == 3) {
      confirmationMsg = "Send test notification to device?";

    }

    this.setState({ confirmation: !this.state.confirmation, Notification: notification, ConfirmationMsg: confirmationMsg })
  }
  toggleDeviceStatusModal =async (enterpriseId, enterpriseName) => {

    this.setState({ deviceStatus: !this.state.deviceStatus })
    // console.log("enterpriseId: ", enterpriseId);

    if(enterpriseId > 0) {

    var data = await DeviceService.GetDevicesStatus(enterpriseId);

    var devices = data;
    // console.log("devices:", devices)
    if (data.length > 0) {
      this.setState({ devices: devices, DeviceEnterpriseId: enterpriseId, DeviceEnterpriseName: enterpriseName });
    }
  }

  }

  StatusModal = (restId, orderId, status, type, moveStatus) => {

    let statusText = Number(status) === 0 ? "New" : Number(status) === 1 ? "Confirmed" : (type < 4 ? "Ready" : "Completed")
    let moveToStatusText = Number(status) == 0 ? "Move Order# " + orderId + " to confirmed" : Number(status) === 1 ? (type < 4 ? "Move Order# " + orderId + "  to Ready" : "Mark  Order# " + orderId + " as Completed") : "Mark  Order# " + orderId + " as Completed"

    this.setState({ StatusText: statusText, MoveToStatusText: moveToStatusText });

    this.setState({ OrderDuration: 0, dropdownOpen: false, AcceptErrorText: "Please select time", AcceptError: false});
    this.state.SelectedOrderEnterpriseId = restId;
    this.state.SelectedOrderId = orderId;
    this.state.SelectedOrderType = type;

  if(moveStatus == undefined){
    moveStatus = 0

    if (status === 0) {
      moveStatus = 1
    } else if (status === 1) {
      moveStatus = (type < 4) ? 2 : 4
    } else if (status === 2) {
      moveStatus = 4
    }
  }

    this.state.MoveToStatus = moveStatus;

    if (status == 0) {
      if(type < 4 && moveStatus == 1){
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

  CancelOrderModal = (restId, orderId, status) => {

    this.setState({ CancelReason: 0, dropdownOpen: false, IsOtherReason: false});
    this.state.SelectedOrderEnterpriseId = restId;
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

  AddExtraTimeModal = (restId, orderId, status) => {
    this.setState({ OrderDuration: 0, dropdownOpen: false });
    this.state.SelectedOrderEnterpriseId = restId;
    this.state.SelectedOrderId = orderId;
    this.state.MoveToStatus = status;
    this.state.AddExtraTimeText = "Add extra time to order# " + orderId;
    this.setState({ addExtraTime: true, TimeErrorText: "Please select time", TimeError: false })
  }


  PlayAndStopProgressbar = () => {
    if (!this.state.IsStopped) {
      // PlayOrStop(false);
      clearInterval(interval);
      // clearInterval(snozeinterval)
      // if(this.state.snozeTime !=""){
      //   this.ShowProgressBar();
      // }
    } else {
      // if(this.state.snozeTime !=""){
      //   clearInterval(interval);
      // }
      this.ShowProgressBar();
    }
    this.setState({ IsStopped: !this.state.IsStopped })
  }

  ShowProgressBar = () => {
    this.ChangeProgressBar();
    interval = setInterval(() => { if ((!this.state.IsStopped) ) this.ChangeProgressBar(); }, 1000);

  }

  selectSnozeTime = (e, snozeLabel) =>{
    if(e.target.value == "off"){
      localStorage.setItem(Constants.snoozeTime, '')
      PlayOrStop(true);
      this.setState({ snozeTime:'', snoozeLabel: "", timeString: "",  totalMilliseconds: 0})
      clearInterval(snoozeTimeProgressInterval)
      clearInterval(snozeinterval)
      return;
    }
    clearInterval(snoozeTimeProgressInterval)
    this.setState({ snozeTime: e.target.value, snozeLabel: snozeLabel, totalMilliseconds: Number(e.target.value) })
    localStorage.setItem(Constants.snoozeTime, JSON.stringify(e.target.value))
    PlayOrStop(false);
    // clearInterval(interval);
    // this.setState({ IsStopped: true })
    this.snoozeTimeProgress()
    snozeinterval = setInterval(() => {
      PlayOrStop(true);
      this.setState({ snozeTime:'', snoozeLabel: "",  totalMilliseconds: 0, timeString: "" })
      // this.PlayAndStopProgressbar();
      localStorage.setItem(Constants.snoozeTime, '')
      clearInterval(snoozeTimeProgressInterval)
      clearInterval(snozeinterval)
    }, Number(e.target.value));

  }

  snoozeTimeProgress = () =>{
      snoozeTimeProgressInterval = setInterval(() => {
      this.setState((prevState) => {
        const newTime = prevState.totalMilliseconds - 1000;
        if (newTime <= 0) {
          clearInterval(snoozeTimeProgressInterval)
          return { totalMilliseconds: 0, timeString: "Snooze" };
        }
        return {
          totalMilliseconds: newTime,
          timeString: this.convertMillisecondsToMinutesAndSeconds(newTime)
        };
      });
    }, 1000);

  }

  convertMillisecondsToMinutesAndSeconds = (totalMilliseconds) => {
    const totalSeconds = Math.floor(totalMilliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes === 0) {
      return `${seconds} seconds`;
    } else {
      return `${minutes} minutes ${seconds} seconds`;
    }
  }




  ChangeProgressBar = () => {

    if(!this.dragging){

    this.setState({ ProgressWidth: this.state.ProgressWidth > 1 ? this.state.ProgressWidth - 1 : 30 }, () => {
      if (this.state.ProgressWidth == 1) {
        this.Refresh();
      }
    }
    )
  }

  }


 SendPushyNotification = () => {

  var notification = this.state.Notification

  if(notification.Type == 3){
    this.SendTestNotification(notification)
    this.toggleConfirmationModal();
    return;
  }

  this.ResendOrderNotification(notification)

 }

  ResendOrderNotification = async (notification) => {

    var sent = await EnterpriseOrderService.SendPushyNotification(notification);
    if(sent == '1') {
      Utilities.notify("Resent order " + notification.OrderId + " successfully", "s");
      this.toggleConfirmationModal();
    } else {
      Utilities.notify("Resend order failed", "e");
    }

  }

  SendTestNotification = async (notification) => {

    var sent = await EnterpriseOrderService.SendPushyNotification(notification);

    if(sent == '1') {
      Utilities.notify("Test notification has been sent", "s");
    } else {
      Utilities.notify("Test notification failed", "e");
    }

  }

  GetAllChildEnterprises = async () => {
    this.setState({ ShowLoader: true });
    let data = await EnterpriseService.GetAllServices(this.state.selectedParentEnterpriseId, this.state.userObj.Id);
    if(data.length > 0 ) {
        data = data.filter((val) => !val.IsChurned && !val.IsExternal && !val.IsDeleted && val.IsActive && val.EnterpriseTypeId != 15)
        this.setState({ childEnterprises: data, enterprises: data })
      }
    this.GetSelectedServices(data);
    this.setState({ ShowLoader: false });
  }

  setValues = (newValues) => {

	if (newValues.length == 0)  return;

    var services = [];
    var serviceIdCsv = "";
    var allEnterprises = this.state.allEnterprises;
    this.setState({ values: newValues, selectedParentEnterpriseId: newValues[0].id }
      ,() => {
        this.GetAllChildEnterprises()
        allEnterprises.forEach(service => {

          if(service.ParentId == newValues[0].id)
          {
            services.push({Id: service.EnterpriseId, Name: service.Name, PhotoName: service.PhotoName , EnterpriseTypeId: service.EnterpriseTypeId, IsSelected: newValues[0].id > 0});
            service.IsSelected = true;
            if(newValues[0].id > 0)
            serviceIdCsv += service.Id + Config.Setting.csvSeperator

          }

        });
        serviceIdCsv = Utilities.FormatCsv(serviceIdCsv, Config.Setting.csvSeperator);
        this.setState({enterprises: services, chkAllServices: true, selectedServiceIdCsv: serviceIdCsv})
        // this.GetSelectedServices(services);
        this.handleServiceSelection(services);
        this.setState({ ShowLoader: false });
      }
      );
  };

  handleChangeCheckbox = (isChecked) =>{
    this.setState({ progressbarCheckbox: isChecked })
    this.PlayAndStopProgressbar()
    this.setState({});
  }

  toggleSnoozeDropdown() {
    this.setState({
      snozeDropdown: !this.state.snozeDropdown
    });
  }

  getOrderItems = async (orderId, enterpriseId) => {
    try {
      let response = await OrderDetailService.Get(orderId, enterpriseId);
      if (response.Message === undefined) {
        this.setState(prevState => ({
          orderItems: {
            ...prevState.orderItems,
            [orderId]: response
          }
        }));
      }
    } catch (error) {
      console.log('Error fetching order items:', error.message);
    }
  }

  render() {
    var orders =  this.state.FilterOrders
    const { KDScolumns } = this.state;

    const columns = [
      {
        name: "AllColumns",
        label: " ",
        options: {
          sort: false,
          filter: true,
          customBodyRender: (value, tableMeta, updateValue) => (
            <div className="all-order-row">
              <div className="all-order-inner-row">
                <div className="left-order-row" onClick={() => this.props.history.push(`/order-detail/${orders[tableMeta.rowIndex].EnterpriseId}/${orders[tableMeta.rowIndex].OrderToken}/${orders[tableMeta.rowIndex].Id}`)}>
                  <div>

                    <div className="order-id-type-wrap">

                      <div>
                        <div className="order-id">{this.setOrderTypeIcon(Number(orders[tableMeta.rowIndex].OrderType))} <span>#{orders[tableMeta.rowIndex].Id}</span></div>
                        {this.state.EnterpriseTypeId == 1 || this.state.IsParent ||this.state.EnterpriseTypeId == Constants.ENTERPRISE_TYPE_IDS.HOTEL?

                          <div style={{marginTop:"10px", fontWeight:"600", fontSize:"13px", display:"flex", alignItems:"center"}}>
                            <span><img src={Utilities.generatePhotoLargeURL(`${orders[tableMeta.rowIndex].EnterpriseLogo}`, true, false)}
                            style={{ width:"33px", border:"1px solid #d2d2d2", borderRadius:"50%", marginRight:"10px", fontWeight:"bold"}}/></span>
                            <span>{Utilities.SpecialCharacterDecode(orders[tableMeta.rowIndex].RestaurantName)}</span></div>
                          : ""
                          }

                      </div>
                    </div>
                    <div>


                </div>
                  </div>

                  <div>
                    <div className="row-n">
                      <div className="Common-label-all-order">{this.setPreOrderTime(orders[tableMeta.rowIndex].PreOrderTime, Number(orders[tableMeta.rowIndex].OrderType), orders[tableMeta.rowIndex].OrderStatus, orders[tableMeta.rowIndex].CompletionTime, orders[tableMeta.rowIndex].ExtraFieldJson)}  </div>

                    </div>
                    <div className="row-n">
                      <div className="Common-label-all-order">{Labels.Placed_On}</div>
                      <div className="time-placed-wrapper"><span className="time-label-format">{this.SetDateFormat(orders[tableMeta.rowIndex].OrderDate, orders[tableMeta.rowIndex].OrderStatus)}</span></div>
                    </div>

                  </div>
                </div>
                <div className="right-order-row">
                  <div className='add-flex-on-web'>
                  <div onClick={() => this.props.history.push(`/order-detail/${orders[tableMeta.rowIndex].EnterpriseId}/${orders[tableMeta.rowIndex].OrderToken}/${orders[tableMeta.rowIndex].Id}`)}>

                  <div className="restaurant-name-wrapper "><span className="commmon-label  m-b-5">
                      {Utilities.SpecialCharacterDecode(orders[tableMeta.rowIndex].ConsumerName)}</span><span className="user-order-count m-l-5">{orders[tableMeta.rowIndex].OrderTotalCount}</span>
                      {Number(orders[tableMeta.rowIndex].OrderStatus) === 0 || Number(orders[tableMeta.rowIndex].OrderStatus) === 1 || Number(orders[tableMeta.rowIndex].OrderStatus) === 2 || ((Number(orders[tableMeta.rowIndex].OrderStatus) === 4 || Number(orders[tableMeta.rowIndex].OrderStatus) === 3)
                    && (this.state.userObj.RoleLevel == 1 || this.state.userObj.RoleLevel == 2 || this.state.userObj.RoleLevel == 3 || this.state.userObj.RoleLevel == 16  || this.state.userObj.RoleLevel == 14 || this.state.userObj.RoleLevel == 15)) ? <span>
                      {/* <div className="commmon-label common-label-color ">{Utilities.maskString(orders[tableMeta.rowIndex].MobileNo)}</div> */}
                      {/* {
                        orders[tableMeta.rowIndex].ConsumerEmail != " " &&
                        <div className="commmon-label common-label-color common-email-consumer-wrap">{Utilities.maskString(orders[tableMeta.rowIndex].ConsumerEmail)}</div>
                      } */}
                      {
                        orders[tableMeta.rowIndex].OrderType != 4 &&
                      <div className="m-b-5 common-label-color">{Labels.Room_No} <span className='bold text-dark'>{orders[tableMeta.rowIndex].RoomNo !='' ? orders[tableMeta.rowIndex].RoomNo : "-"}</span></div>
                      }
                      {
                        orders[tableMeta.rowIndex].OrderType == 4 && orders[tableMeta.rowIndex].OrderType != 12 &&
                        <div className='common-label-color'>{Labels.Table_No} <span className='bold text-dark'>{orders[tableMeta.rowIndex].TableNo != '' ? orders[tableMeta.rowIndex].TableNo : "-"}</span></div>
                      }
                      {/* <p className="commmon-label common-label-color m-b-10" style={{ whiteSpace:'nowrap' }}>{orders[tableMeta.rowIndex].ConsumerEmail}</p> */}
                      {/* <p className="Common-label-all-order m-b-0">Contact person</p>
                      <p className="common-o-label m-b-0">{(orders[tableMeta.rowIndex].ContactPerson !== undefined ? orders[tableMeta.rowIndex].ContactPerson : "") + ' ' + orders[tableMeta.rowIndex].ContactNo}</p> */}

                    </span> : ""}
                    </div>
                  </div>
                  <div onClick={() => this.props.history.push(`/order-detail/${orders[tableMeta.rowIndex].EnterpriseId}/${orders[tableMeta.rowIndex].OrderToken}/${orders[tableMeta.rowIndex].Id}`)}>
                    <div className="order-total-r-wrap">
                      <div className="t-label"> {Labels.ORDER_TOTAL}</div>
                      <div className="t-price">{orders[tableMeta.rowIndex].Currency}{Utilities.FormatCurrency(Number(orders[tableMeta.rowIndex].TotalAmount), this.state.countryConfigObj?.DecimalPlaces)}</div>
                      {this.ShowPaymentMode(orders[tableMeta.rowIndex].PaymentModes, orders[tableMeta.rowIndex].OrderStatus, orders[tableMeta.rowIndex].TotalAmount) ? <div className={this.SetPaidClass(orders[tableMeta.rowIndex].PaymentModes, orders[tableMeta.rowIndex].OrderStatus, orders[tableMeta.rowIndex].TotalAmount)}>{this.SetPaymentMode(orders[tableMeta.rowIndex].PaymentModes, orders[tableMeta.rowIndex].OrderStatus, orders[tableMeta.rowIndex].TotalAmount)}</div> : ""}
                    </div>
                  </div>
                  </div>

                        {

                        !Utilities.stringIsEmpty(orders[tableMeta.rowIndex].AssignTo) && !Utilities.stringIsEmpty(orders[tableMeta.rowIndex].AssigneeName) ?
                          <div className='order-assign-to-wrap' onClick={() => this.assignUserModal(orders[tableMeta.rowIndex])}>
                            <span className='t-label mb-2'> Assign to</span>
                            <div className={`order-assign-u-overlaped`} style={orders[tableMeta.rowIndex].AssigneeName.split(',').length > 2 ? {paddingRight: 35} : orders[tableMeta.rowIndex].AssigneeName.split(',').length > 1 ? {paddingRight: 20} : {}}>

                      {
                         orders[tableMeta.rowIndex].AssigneeName.split(',').map((assignee, index) => {
                         var photoName = orders[tableMeta.rowIndex].AssigneePhotoName.split(',')[index]
                          return(

                        Utilities.stringIsEmpty(photoName) ?
                           <Avatar className={`header-avatar ${index > 0 ? "assign-o-image overlaped" : ""}`} name={assignee} round={true} size="35" textSizeRatio={2} />
                           :
                           <img className={`assign-o-image ${index > 0 ? "overlaped" : ""}`} src={Utilities.generatePhotoLargeURL(photoName, true, false)}/>
                      )})
                    }
                      {orders[tableMeta.rowIndex].AssigneeName.split(',').length > 2 && <span className='overlap-count'>+{orders[tableMeta.rowIndex].AssigneeName.split(',').length -2}</span>}
                      </div>
                    </div>
                    :
                    <div className='order-assign-to-wrap' onClick={() => this.assignUserModal(orders[tableMeta.rowIndex])}>
                            <span className='t-label mb-2'> Assign to</span>
                    <span className='assign-to-img'><FiUser /></span>
                    </div>

                        }
                </div>
              </div>
              <div className="row-order-wrap">
                <div className="order-row-flex-none">
                  <div className="dropdown-print-wrap">
                    {
                      this.setOrderStatus(Number(orders[tableMeta.rowIndex].EnterpriseId), Number(orders[tableMeta.rowIndex].Id), Number(orders[tableMeta.rowIndex].OrderStatus), Number(orders[tableMeta.rowIndex].OrderType), orders[tableMeta.rowIndex].RiderInfo, Number(orders[tableMeta.rowIndex].IsSupermealDelivery) === 1, orders[tableMeta.rowIndex].PreOrderTime)
                    }
                    {/* <div className="order-print-wrap" onClick={() => this.PrintPageModal( orders[tableMeta.rowIndex].Token )}> */}
                    <div className="order-print-wrap">

                   {/* <i className="fa fa-print"> </i> */}

                      <a href={"/print/" + orders[tableMeta.rowIndex].Token} target="_blank"><i className="fa fa-print"> </i></a>

                    </div>
                  </div>
                </div>


                <div className="actions-option-btn">

                  <div className="show-res">
                    <Dropdown>
                      <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                        <span>
                          <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
                        </span>
                        <span>
                          {Labels.Options}
                        </span>
                      </Dropdown.Toggle>

                      <Dropdown.Menu >
                        <div>

                          <span className="m-b-0 statusChangeLink m-r-20" onClick={() => this.toggleConfirmationModal(orders[tableMeta.rowIndex], 2)}  >
                            <span>
                              <i className="fa fa-repeat font-18" aria-hidden="true"></i>
                              {Labels.Resend_Notification}
                            </span>
                          </span>

                          <span className="m-b-0 statusChangeLink m-r-20" onClick={() => this.toggleConfirmationModal(orders[tableMeta.rowIndex], 3)}>
                            <span>
                              <i className="fa fa-paper-plane font-18"></i>
                              {Labels.Send_Test_Notification}
                            </span>
                          </span>
                          <span className="m-b-0 statusChangeLink m-r-20" onClick={() => this.toggleDeviceStatusModal(orders[tableMeta.rowIndex].EnterpriseId)}  >
                            <span>

                              <i className="fa fa-mobile " style={{ fontSize: 20 }} aria-hidden="true"></i>
                              {Labels.Device_Info}
                            </span>
                          </span>
                        </div>
                      </Dropdown.Menu>
                    </Dropdown>

                  </div>

                </div>

              </div>

            </div>
          )
        }
      },
    ];

    const options = {
      searchOpen: false,
      searchAlwaysOpen: true,
      searchPlaceholder: "Search",
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
            noMatch: this.state.ShowLoader ? this.loading() : "Sorry, no matching records found",
            toolTip: "Sort",
            columnHeaderTooltip: column => `Sort for ${column.label}`
          }
      },
      onTableChange: this.saveSettings
  };
    return (
      <Fragment>
        <div className="card hidden-print date-range-c-select" id="orderWrapper">
        <div className="all-order-drop-down  card-new-title mb-2">
              <h3 className="order-drop-dwon-set mr-4 mb-3 mb-md-0 w-100">
                <div className='d-flex align-items-center'>
                {Labels.Orders}
                {/* <button onClick={() => EnterpriseService.sendPrintRequest("ca91rkwf", "")}> Print</button> */}
                <select className="order-date-dropdown form-control custom-select d-none" value={this.state.SelectedDuration} style={{ height: '36px' }} onChange={(e) => this.HandleChangeDuration(e.target.value)}>
                  <option value={0}>{Labels.Today}</option>
                  <option value={1}>{Labels.Yesterday}</option>
                  <option value={7}>{Labels.Seven_Days}</option>
                  <option value={30}>{Labels.Thirty_Days}</option>
                  <option value={90}>{Labels.Three_Months}</option>
                  <option value={180}>{Labels.Six_Months}</option>
                  <option value={-1}>{Labels.Since_Start}</option>
                </select>

              {(this.state.userObj.Enterprise.EnterpriseTypeId == 1 || this.state.userObj.Enterprise.EnterpriseTypeId == 2) &&

                <div className='custom-r-select-dd mr-3'>
                <Select className='form-control ml-3' placeholder='Select' options={this.state.opt} labelField="name" valueField="id" onChange={(values) => this.setValues(values)} values={[{id: 0, name: "All", label: "All",  value: 0}]}   />
                </div>
              }
              </div>
              <div className='d-flex'>
              <span
                className={`d-flex align-items-center ml-md-2 ml-0 ${this.state.activeTab === "allOrders" ? "active btn btn-primary" : " add-cat-btn"}`}
                onClick={() => this.handleTabChange("allOrders")}
                style={{height:33}}
              >
                All Orders
              </span>
              <span
                className={`d-flex align-items-center ml-2 ${this.state.activeTab === "kds" ? "active btn btn-primary" : "add-cat-btn"}`}
                onClick={() => this.handleTabChange("kds")}
                style={{height:33}}
              >
                KDS
              </span>
              </div>
              </h3>

          {/* <div className='cursor-pointer input-not-selct' onClick={() => this.SelectRangeModal()}>
            <span className='form-control'>Select date range</span>
          </div> */}

          {this.state.activeTab != "kds" &&

          <div className='d-flex'>
          <div className='position-relative'>
          <div className='tailwind-date-picker-wrap new-p tailwind' style={{ width: 280 }}>
            <Datepicker
              showShortcuts={true}
              showFooter={true}
              value={this.state.value}
              onChange={(e) => this.handleValueChange(e)}
              displayFormat={"DD MMM YYYY"}
              maxDate={moment().format('YYYY-MM-DD')}
              readOnly={true}
              configs={{
                shortcuts: {
                  today: {
                    text: "Today",
                    period: {
                      start: new Date(),
                      end: new Date(),
                    },
                  },
                  yesterday: {
                    text: "Yesterday",
                    period: {
                      start: new Date(new Date().setDate(new Date().getDate() - 1)),
                      end: new Date(new Date().setDate(new Date().getDate() - 1)),
                    },
                  },
                  last7Days: {
                    text: "Last 7 days",
                    period: {
                      start: new Date(new Date().setDate(new Date().getDate() - 7)),
                      end: new Date(new Date().setDate(new Date().getDate() - 1)),
                    },
                  },
                  last30Days: {
                    text: "Last 30 days",
                    period: {
                      start: new Date(new Date().setDate(new Date().getDate() - 30)),
                      end: new Date(new Date().setDate(new Date().getDate() - 1)),
                    },
                  },
                  thisMonth: {
                    text: "This Month",
                    period: {
                      start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                      end: new Date(),
                    },
                  },
                  lastMonth: {
                    text: "Last Month",
                    period: {
                      start: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
                      end: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
                    },
                  },
                  last6Months: {
                    text: "Last 6 Months",
                    period: {
                      start: new Date(new Date().setMonth(new Date().getMonth() - 6)),
                      end: new Date(),
                    },
                  },
                  thisYear: {
                    text: "This Year",
                    period: {
                      start: new Date(new Date().getFullYear(), 0, 1),
                      end: new Date(),
                    },
                  },
                  lastYear: {
                    text: "Last Year",
                    period: {
                      start: new Date(new Date().getFullYear() - 1, 0, 1),
                      end: new Date(new Date().getFullYear() - 1, 11, 31),
                    },
                  },
                  ...(new Date(this.state.sinceStartDate) !== new Date()
                  ? {
                    lifetime: {
                      text: "Lifetime",
                      period: {
                        start: new Date(moment(this.state.sinceStartDate)),
                        end: new Date(),
                      },
                    },
                  }
                  : {}),
                },

                footer: {
                  cancel: "Cancel",
                  apply: "Apply",
                },
                }}
            />
          </div>
          </div>
          <span className='date-p-down-i mt-2'><i class="fa fa-angle-down"></i></span>
          </div>
          }

            </div>


          { (this.state.userObj.Enterprise.EnterpriseTypeId == 5 || ((this.state.userObj.Enterprise.EnterpriseTypeId == 1 || this.state.userObj.Enterprise.EnterpriseTypeId == 2)&& this.state.selectedParentEnterpriseId != 0)) &&

            <div className='display-n-services ml-3' style={{ display: this.state.activeTab === "allOrders" ? "block" : "none" }}>

            <div>
             <span> Showing orders: </span>

              {

              this.state.isAllServicesSelected ?
              <span>All services </span> :
                this.state.selectedService.map((service)=>{

                  if(service.Id == 0 || service.Id == undefined || service.EnterpriseTypeId == 15 ) return

                  var orders = this.state.EnterpriseOrders.filter(o => o.EnterpriseId == service.Id)

                return(
                    <span className='service-name'>{Utilities.SpecialCharacterDecode(service.Name)}({orders.length})</span>
                    )

                })

              }
               {!this.state.ShowLoader ?
            <span className='ml-1 text-primary cursor-pointer' onClick={() => this.SelectRangeModal()}>change</span>
            :
            <span className='ml-1 text-primary cursor-pointer'>change</span>
            }

            </div>

            </div>
  }

{this.state.activeTab != "kds" ?
          <div className="card-body">
          {/* <div className="order-r">
                <div className="total-r-label ">
                  <span className="t-label">{Labels.Total_Orders}</span>
                  <span>{this.state.TotalOrders}</span>
                </div>
                <div className="total-r-label r ">
                  <span className="t-label">{Labels.Total_Amount}</span>
                  <span>{currencySymbol}{Utilities.FormatCurrency(this.state.TotalAmount, this.state.countryConfigObj?.DecimalPlaces)}</span>
                </div>
                <div className="total-r-label ">
                  <span className="t-label">{Labels.Cash_Total}</span>
                  <span>{currencySymbol}{Utilities.FormatCurrency(this.state.TotalCashAmount, this.state.countryConfigObj?.DecimalPlaces)}</span>
                </div>
                <div className="total-r-label r">
                  <span className="t-label">{Labels.Online_Payments} </span>
                  <span>{currencySymbol}{Utilities.FormatCurrency(this.state.TotalCardsAmount, this.state.countryConfigObj?.DecimalPlaces)}</span>
                </div>
                <div className="total-r-label r">
                  <span className="t-label">{Labels.Cancelled} ({this.GetOrdersCount(this.state.EnterpriseOrders, 3)}) </span>
                  <span style={{ color: "#ed0000" }}>{currencySymbol}{Utilities.FormatCurrency(this.state.TotalCancelledAmount, this.state.countryConfigObj?.DecimalPlaces)}</span>
                </div>
              </div> */}
            <div className="orderlink-wraper">

              <ul>
                <li>
                  <label htmlFor="chkAll">
                    <input type="checkbox" onChange={(e) => this.HandleCheckAll(e)} checked={this.state.ChkAll} value={this.state.ChkAll} className="form-checkbox" name="chkAll" id="chkAll" /> <span className="button-link" > {Labels.All} <span className="badge badge-info">{!Utilities.stringIsEmpty(this.state.EnterpriseOrders) ? (this.state.EnterpriseOrders.length > 0 ? this.state.EnterpriseOrders.length : '') : ""}</span></span>
                  </label>
                </li>
                {/* <li>
                  <label htmlFor="chkPreOrder">
                    <input type="checkbox" onChange={(e) => this.HandleOrderStatusCheck(e, 7)} checked={this.state.ChkPreOrder} value={this.state.ChkPreOrder} className="form-checkbox" name="chkBooking" id="chkPreOrder" /> <span className="button-link " > Pre-Order(s) <span className="badge badge-info">{this.GetOrdersCount(this.state.EnterpriseOrders, 0,true)}</span></span>
                  </label>
                </li> */}
                <li>
                  <label htmlFor="chkNew">
                    <input type="checkbox" onChange={(e) => this.HandleOrderStatusCheck(e, 0)} checked={this.state.ChkNew} value={this.state.ChkNew} className="form-checkbox" name="chkNew" id="chkNew" /> <span className="button-link " > {Labels.New} <span className="badge badge-info">{this.GetOrdersCount(this.state.EnterpriseOrders, 0)}</span></span>
                  </label>
                </li>
                <li>
                  <label htmlFor="chkInKitchen">
                    <input type="checkbox" onChange={(e) => this.HandleOrderStatusCheck(e, 1)} checked={this.state.ChkInKitchen} value={this.state.ChkInKitchen} className="form-checkbox" name="chkInKitchen" id="chkInKitchen" /> <span className="button-link " > {Labels.Confirmed} <span className="badge badge-info">{this.GetOrdersCount(this.state.EnterpriseOrders, 1)}</span></span>
                  </label>
                </li>
                {
                  this.state.EnterpriseTypeId != 4 && this.state.EnterpriseTypeId < 6 &&
                  <li>
                    <label htmlFor="chkReady">
                      <input type="checkbox" onChange={(e) => this.HandleOrderStatusCheck(e, 2)} checked={this.state.ChkReady} value={this.state.ChkReady} className="form-checkbox" name="chkReady" id="chkReady" /> <span className="button-link " > {Labels.Ready} <span className="badge badge-info">{this.GetOrdersCount(this.state.EnterpriseOrders, 2)}</span></span>
                    </label>
                  </li>
                }
                <li>
                  <label htmlFor="chkDelivered">
                    <input type="checkbox" onChange={(e) => this.HandleOrderStatusCheck(e, 4)} checked={this.state.ChkDelivered} value={this.state.ChkDelivered} className="form-checkbox" name="chkDelivered" id="chkDelivered" /> <span className="button-link " > {Labels.Completed} <span className="badge badge-info">{this.GetOrdersCount(this.state.EnterpriseOrders, 4)}</span></span>
                  </label>
                </li>
                <li>
                  <label htmlFor="chkCancelled">
                    <input type="checkbox" onChange={(e) => this.HandleOrderStatusCheck(e, 3)} checked={this.state.ChkCancelled} value={this.state.ChkCancelled} className="form-checkbox" name="chkCancelled" id="chkCancelled" /> <span className="button-link " > {Labels.Cancelled} <span className="badge badge-info">{this.GetOrdersCount(this.state.EnterpriseOrders, 3)}</span></span>
                  </label>
                </li>
                {/* <li>
                  <label htmlFor="chkBooking">
                    <input type="checkbox" onChange={(e) => this.HandleOrderStatusCheck(e, 6)} checked={this.state.ChkBooking} value={this.state.ChkBooking} className="form-checkbox" name="chkBooking" id="chkBooking" /> <span className="button-link " > Booking <span className="badge badge-info">{this.GetOrdersCount(this.state.EnterpriseOrders, 6)}</span></span>
                  </label>
                </li> */}



                {/* <li onClick={(e) => this.GetOrdersByStatus(this.state.EnterpriseOrders, -1)}><button className={this.state.SelectedStatus === -1 ? "button-link active" : "button-link"}>All<Badge color="info">{this.state.EnterpriseOrders.length > 0 ? this.state.EnterpriseOrders.length : 0}</Badge></button></li>
  <li onClick={(e) => this.GetOrdersByStatus(this.state.EnterpriseOrders, 0)}><button className={this.state.SelectedStatus === 0 ? "button-link active" : "button-link"}>New<Badge color="info">{this.GetOrdersCount(this.state.EnterpriseOrders, 0)}</Badge></button></li>
  <li onClick={(e) => this.GetOrdersByStatus(this.state.EnterpriseOrders, 1)}><button className={this.state.SelectedStatus === 1 ? "button-link active" : "button-link"}>In-Kitchen<Badge color="info">{this.GetOrdersCount(this.state.EnterpriseOrders, 1)}</Badge></button></li>
  <li onClick={(e) => this.GetOrdersByStatus(this.state.EnterpriseOrders, 2)}><button className={this.state.SelectedStatus === 2 ? "button-link active" : "button-link"}>Ready<Badge color="info">{this.GetOrdersCount(this.state.EnterpriseOrders, 2)}</Badge></button></li>
  <li onClick={(e) => this.GetOrdersByStatus(this.state.EnterpriseOrders, 4)}><button className={this.state.SelectedStatus === 4 ? "button-link active" : "button-link"}>Delivered<Badge color="info">{this.GetOrdersCount(this.state.EnterpriseOrders, 4)}</Badge></button></li>
  <li onClick={(e) => this.GetOrdersByStatus(this.state.EnterpriseOrders, 3)}><button className={this.state.SelectedStatus === 3 ? "button-link active" : "button-link"}>Cancelled<Badge color="info">{this.GetOrdersCount(this.state.EnterpriseOrders, 3)}</Badge></button></li>
  <li onClick={(e) => this.GetOrdersByStatus(this.state.EnterpriseOrders, 6)}><button className={this.state.SelectedStatus === 6 ? "button-link active" : "button-link"}>Booking<Badge color="info">{this.GetOrdersCount(this.state.EnterpriseOrders, 6)}</Badge></button></li> */}

              </ul>

            </div>
            <div className="all-order-res-scroll new-table-set single-scroll-order-p">
              {/* <button className="btn btn-primary pull-right" onClick={() => this.Refresh()}><i className="fa fa-refresh" aria-hidden="true"></i><span className="h-res" style={{ margin: '10px' }}>Refresh</span></button> */}

              <div className="progres-bar-wrap">
                {/* <div className="referesh-label">Page will refresh after <span id="spRefreshTime">30</span>sec.</div>
            <ProgressBar now={this.state.ProgressWidth} />
             <a className={this.state.IsStopped ? "pause-btn active" : "pause-btn"} onClick={() => this.PlayAndStopProgressbar()} >
               <span><i className="fa fa-stop" aria-hidden="true"></i></span>
                 <span id="spStop" >Stop</span>
                <span id="spStopped" className="no-display">Stopped</span>
                                </a> */}
                  {/* <AvForm>
                      <div className="flex row">
                          <AvField type="checkbox" name="chkNav" value={this.state.navNewTab} checked={this.state.navNewTab}
                              onChange={(e) => this.AssignValues(e.target.checked)}
                              className="form-checkbox" />
                          <Label htmlFor={"chkNav"} className="modal-label-head">New Tab</Label>

                      </div>
                  </AvForm> */}

                 <div className='resp-refr-wrap'>
                <div className="count-down-wrap">
                <input type="checkbox" className="form-checkbox refresh-chk-box" onChange={(e) => { this.handleChangeCheckbox(e.target.checked) }} name="progressbarCheckbox" id="progressbarCheckbox" checked={this.state.progressbarCheckbox} value={this.state.progressbarCheckbox} />
                  {/* <div className="count-down-text-wrap"> */}
                    <span className="count-down-text">
                    Auto-refresh in <span style={{color:"#ed0000"}}> {this.state.ProgressWidth} </span> seconds.
                                    </span>
                    {/* <span>
                      {Labels.Refresh}
                                    </span> */}
                  {/* </div> */}
                  {/* <div className="countdown">
                    {this.state.ProgressWidth}
                  </div> */}
                  {/* <div className="countdown stop-btn-order" onClick={() => this.PlayAndStopProgressbar()}>
                    {!this.state.IsStopped ? <i className="fa fa-pause" aria-hidden="true"></i> : <i className="fa fa-play" aria-hidden="true"></i>}
                  </div> */}




                </div>
                <div className="stop-btn-order c-down-refresh" onClick={() => this.HardRefresh()}>
                <i className="fa fa-refresh" aria-hidden="true"></i>
                  <span>Refresh</span>

                  </div>
                  </div>

                <ButtonDropdown className='order-snooze-dropdown'  isOpen={this.state.snozeDropdown} toggle={()=>this.toggleSnoozeDropdown()} >
                      <DropdownToggle caret color="secondary" className="btn-on" >
                      {this.state.snozeTime =="" ? <FaVolumeHigh className='font-20' /> : <IoVolumeMute className='font-20' />}
                        {this.state.timeString == "" ? "Snooze" : `Snooze for ${this.state.timeString}`}
                      </DropdownToggle>
                      <DropdownMenu>
                          <DropdownItem onClick={(e) => this.selectSnozeTime(e,'')} value="off" >Snooze off</DropdownItem>
                          <DropdownItem onClick={(e) => this.selectSnozeTime(e,'Snooze for 1 mins')} value="60000" >1 mins</DropdownItem>
                          <DropdownItem onClick={(e) => this.selectSnozeTime(e,'Snooze for 2 mins')} value="120000" >2 mins</DropdownItem>
                          <DropdownItem onClick={(e) => this.selectSnozeTime(e,'Snooze for 3 mins')} value="180000" >3 mins</DropdownItem>
                          <DropdownItem onClick={(e) => this.selectSnozeTime(e,'Snooze for 4 mins')} value="240000" >4 mins</DropdownItem>
                          <DropdownItem onClick={(e) => this.selectSnozeTime(e,'Snooze for 5 mins')} value="300000" >5 mins</DropdownItem>
                          <DropdownItem onClick={(e) => this.selectSnozeTime(e,'Snooze for 10 mins')} value="600000" >10 mins</DropdownItem>
                          <DropdownItem onClick={(e) => this.selectSnozeTime(e,'Snooze for 15 mins')} value="900000" >15 mins</DropdownItem>
                      </DropdownMenu>
                    </ButtonDropdown>

                {/* <select style={{width:"180px", marginLeft:"20px"}} className="select2 form-control custom-select res-snooze-drop" onChange={(e) => this.selectSnozeTime(e)} value={this.state.snozeTime} >

                      <option value="">Select Snooze Time</option>
                      <option value="60000">1 mins</option>
                      <option value="120000">2 mins</option>
                      <option value="180000">3 mins</option>
                      <option value="240000">4 mins</option>
                      <option value="300000">5 mins</option>
                      <option value="600000">10 mins</option>
                      <option value="900000">15 mins</option>


                    </select>  */}


              </div>


              {this.state.ShowLoader ? this.loading() :
              <div className='mui-search-open'>
              <MUIDataTable
                title={""}
                data={this.state.FilterOrders}
                columns={columns}
                options={options}
              />
              </div>
               }
                {/* {this.renderData(this.state.FilterOrders)} */}
            </div>

          </div>
:

            <div>
              {Object.keys(KDScolumns).length > 0 &&

                            <div className='sortable-nav sortable-item  sortable-new-wrap kds-main-p'>

                                {/* <SortableContainer
                                    items={orders}
                                    onSortEnd={this.onSortEnd}
                                    hideSortableGhost={true}
                                    distance={1}
                                    axis={'xy'}
                                    >
                                </SortableContainer> */}

{this.state.kdsLoader ? this.loading() :

<DragDropContext onDragEnd={this.onDragEnd}
onBeforeCapture={this.onBeforeCapture}>
        <div className="kds-main-inner w-100">
          {/* {Object.keys(KDScolumns).map((statusKey) => this.renderColumn(statusKey))} */}
          {this.renderColumn(Labels.New)}
          {this.renderColumn(Labels.Confirmed)}
          {this.renderColumn(Labels.Ready)}
          {this.renderColumn(Labels.Completed)}
        </div>
      </DragDropContext>
  }
                                        </div>
                        }

</div>
  }



            {/* </div>

        </div> */}

          <Modal style={{maxWidth:"400px"}} isOpen={this.state.SelectRange} toggle={() => this.SelectRangeModal()} className={this.props.className}>
          <ModalHeader toggle={() => this.SelectRangeModal()} >Services</ModalHeader>
          <ModalBody className='services-m-selection'>

             <div className='services-selection'>
                <div className="orderlink-wraper my-0">

                  <ul className='d-flex flex-column'>
                  <li className='mb-2'>
                        <label htmlFor="chkservice1">
                          <input type="checkbox"  checked={this.state.chkAllServices} value={this.state.chkAllServices} onChange={(e) => this.handleCheckServices(e,'-1',true)} className="form-checkbox" name="chkservice1" id="chkservice1" />
                           <span className="button-link" > {"All"} <span className="badge badge-info"></span></span>
                        </label>
                      </li>

                    {this.state.enterprises.length > 0 ?

                    this.state.enterprises.map((enterprise, i) => {

                      if(enterprise.Id == 0 || enterprise.Id == undefined || enterprise.EnterpriseTypeId == 15 || enterprise.IsExternal || enterprise.IsDeleted || !enterprise.IsActive)  return;

                      let enterpriseName = Utilities.SpecialCharacterDecode(enterprise.Name);

                      let isExistInCsv = Utilities.isExistInCsv(enterprise.Id, this.state.selectedServiceIdCsv + Config.Setting.csvSeperator, Config.Setting.csvSeperator)

                      var orders = this.state.FilterOrders.filter(o => o.EnterpriseId == enterprise.Id)

                      return (

                        <li className='mb-2'>
                        <label className='cursor-pointer' htmlFor={"chk"+enterprise.Id}>

                          <input type="checkbox" checked={enterprise.IsSelected} value={enterprise.IsSelected} onChange={(e) => this.handleCheckServices(e,i,false)}
                          className="form-checkbox" name={"chk"+enterprise.Id} id={"chk"+enterprise.Id}  />

                          <span className=' services-img'>

                          { enterprise.PhotoName != "" ?
                            <img src={Utilities.generatePhotoLargeURL(enterprise.PhotoName, true, false)} />
                            :
                            <div className="user-avatar-web">
                            <Avatar className="header-avatar" name={enterpriseName} round={true} size="25" textSizeRatio={2} />
                          </div>
                          }
                          </span>
                          <span className="button-link"  > {enterpriseName} {isExistInCsv && `(${orders.length})`} <span className="badge badge-info"></span></span>
                        </label>
                      </li>

                      )

                    })
                    :

                    <div>No service found.</div>

                    }

                  </ul>
                </div>
             </div>

          </ModalBody>
          <FormGroup className="modal-footer" >
            <div className='mr-auto'> <label id="name" class="control-label mt-2 text-danger"></label>
            </div>
            <div>
              <Button className='mr-2 text-dark' color="secondary" onClick={() => this.SelectRangeModal()}>Cancel</Button>
              <Button onClick={() => this.handleServiceSelection(this.state.enterprises)} color="primary" disabled={!this.state.serviceSeleted}>
              {/* <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>   */}
                 <span className="comment-text" >Done</span>
              </Button>
            </div>
          </FormGroup>
        </Modal>

          <Modal isOpen={this.state.openIframeModal} toggle={() => this.toggleModal()} >
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
          {/* status type modal starts here */}

          <Modal isOpen={this.state.moveToStatus} toggle={() => this.toggleStatusModal()} >
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
              {/* <select value={this.state.OrderDuration} onChange={(e) => this.HandelSelectDuration(e)} className="order-date-dropdown form-control custom-select" style={{ height: '36px' }}>
                <option value="0">Time</option>
                <option value="15">15 minutes</option>
                <option value="20">20 minutes</option>
                <option value="25">25 minutes</option>
                <option value="30">30 minutes</option>
                <option value="35">35 minutes</option>
                <option value="40">40 minutes</option>
                <option value="45">45 minutes</option>
                <option value="50">50 minutes</option>
                <option value="55">55 minutes</option>
                <option value="60">1 hour</option>
                <option value="75">1 hour 15 minutes</option>
                <option value="90">1 hour 30 minutes</option>
                <option value="105">1 hour 45 minutes</option>
                <option value="120">2 hours</option>
              </select> */}
            </ModalBody>
            <ModalFooter>
              {this.state.AcceptError ? <div className="error error-t">{this.state.AcceptErrorText}</div> : ''}
              <Button color="secondary" onClick={() => { this.toggleStatusModal() }}>{Labels.Cancel}</Button>
              <Button color="primary" onClick={() => { this.UpdateStatus() }}>


                {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                  : <span className="comment-text">{Labels.Move}</span>}
              </Button>

            </ModalFooter>
          </Modal>


          <Modal isOpen={this.state.cancelOrder} toggle={() => this.toggleCancelModal()} >
            <ModalHeader>{this.state.MoveToCancelText}</ModalHeader>
            <ModalBody  className="move-modal">
             <label className="control-label font-weight-500">{Labels.Choose_Reason}</label>

              <ul className="time-list-wrapper">
                {/* <li value="0">{Labels.Reason}</li> */}
                <li onClick={(e) => this.HandelSelectCancelReason("Business closed")} className={this.state.CancelReason=="Business closed"?"bold":""} >{Labels.Business_Closed}</li>

<li onClick={(e) => this.HandelSelectCancelReason("Out of radius")} className={this.state.CancelReason=="Out of radius"?"bold":""} >{Labels.Out_Of_Radius}</li>

<li onClick={(e) => this.HandelSelectCancelReason("Fake Order")} className={this.state.CancelReason=="Fake Order"?"bold":""} >{Labels.Fake_Order}</li>

<li  onClick={(e) => this.HandelSelectCancelReason("Cancelled by consumer")} className={this.state.CancelReason=="Cancelled by consumer"?"bold":""} >{Labels.Cancelled_By_Consumer}</li>

<li onClick={(e) => this.HandelSelectCancelReason("Items not available")} className={this.state.CancelReason=="Items not available"?"bold":""} >{Labels.Items_Not_Available}</li>


<li onClick={(e) => this.HandelSelectCancelReason("We are off today")} className={this.state.CancelReason=="We are off today"?"bold":""} >{Labels.We_Are_Off_Today}</li>

{this.state.selectedOrder != undefined && Object.keys(this.state.selectedOrder).length > 0 && this.state.selectedOrder.OrderType == 1 &&
  <>
<li onClick={(e) => this.HandelSelectCancelReason("Riders not available")} className={this.state.CancelReason=="Riders not available"?"bold":""} >{Labels.Riders_Not_Available}</li>

<li onClick={(e) => this.HandelSelectCancelReason("Nearest branch closed")} className={this.state.CancelReason=="Nearest branch closed"?"bold":""} >{Labels.Nearest_Branch_Closed}</li>

<li onClick={(e) => this.HandelSelectCancelReason("Tensed city situation")} className={this.state.CancelReason=="Tensed city situation"?"bold":""} >{Labels.Tensed_City_Situation}</li>

<li onClick={(e) => this.HandelSelectCancelReason("Incorrect contact details provided")} className={this.state.CancelReason=="Incorrect contact details provided"?"bold":""} >{Labels.Incorrect_Contact_Details_Provided}</li>

<li onClick={(e) => this.HandelSelectCancelReason("Disrupted travel and delivery services")} className={this.state.CancelReason=="Disrupted travel and delivery services"?"bold":""} >{Labels.Disrupted_Travel_And_Delivery_Services}</li>

<li onClick={(e) => this.HandelSelectCancelReason("Other")} className={this.state.CancelReason=="Other"?"bold":""} >{Labels.Other}</li>
  </>
  }

              </ul>

              {this.state.IsOtherReason ? <input type="text" id="txtOtherReason" className="form-control " placeholder="Reason" onChange={(e) => this.HandleOtherCancelReason(e)} /> : ''}
              {this.state.OtherReasonError ? <div className="error error-t">{this.state.OtherReasonErrorText}</div> : ''}
              {/* <select value={this.state.CancelReason} onChange={(e) => this.HandelSelectCancelReason(e)} className="order-date-dropdown form-control custom-select" style={{ height: '36px' }}>
                <option value="0">Reason</option>

                <option value="Restaurant closed" onClick={(e) => this.HandelSelectCancelReason()}>Restaurant closed</option>

                <option value="Out of radius">Out of radius</option>

                <option value="Fake Order">Fake Order</option>

                <option value="Cancelled by consumer">Cancelled by consumer</option>

                <option value="Nearest branch closed">Nearest branch closed</option>

                <option value="Items not available">Items not available</option>

                <option value="Riders not available">Riders not available</option>

                <option value="Tensed city situation">Tensed city situation</option>

                <option value="We are off today">We are off today</option>
                <option value="Incorrect contact details provided">Incorrect contact details provided</option>
                <option value="Disrupted travel and delivery services">Disrupted travel and delivery services</option>
                <option value="10">Others</option>
              </select> */}
            </ModalBody>
            <ModalFooter>
              {this.state.ReasonError ? <div className="error error-t">{this.state.ReasonErrorText}</div> : ''}
              <Button color="secondary" onClick={() => { this.toggleCancelModal() }}>{Labels.Close}</Button>
              <Button color="primary" onClick={() => { this.CancelOrder() }}>



                {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                  : <span className="comment-text">{Labels.Cancel_Order}</span>}
              </Button>

            </ModalFooter>
          </Modal>


          <Modal isOpen={this.state.addExtraTime} toggle={() => this.toggleExtraTimeModal()} >
            <ModalHeader>{this.state.AddExtraTimeText}</ModalHeader>
            <ModalBody className="move-modal">
              <h5 className="control-label font-weight-500">Select time</h5>
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

          <Modal size="lg" isOpen={this.state.openRiderModal} toggle={() => this.toggleRiderModal()} >
            {/* <ModalHeader toggle={() => this.toggleRiderModal()} className="order-copy"></ModalHeader> */}
            <ModalBody className="rider-modal-wrap">
              <div className="rider-wrap">
                <div className="rider-left">
                  <h3>{Labels.Rider_Information}</h3>
                  <div className="rider-detail">
                    <div className="rider-row">
                      <span>
                        {Labels.Order_Id}
                      </span>
                      <span>
                        #{Object.keys(this.state.RiderInfo).length > 0 ? this.state.RiderInfo.ASSIGN.OrderId : this.state.SelectedOrderId}
                      </span>
                    </div>
                    <div className="rider-row">
                      <span>
                        {Labels.Pick_Up_Time}
                      </span>
                      <span>
                        {(this.state.PickupTime != "") ?
                          this.state.PickupTime
                          :
                          "-"
                        }
                      </span>
                    </div>
                    <div className="rider-row">
                      <span>
                        {Labels.Est_Delivery_Time}
                      </span>
                      <span>
                        {(this.state.EstDeliveryTime != "") ?
                          this.state.EstDeliveryTime
                          :
                          "-"
                        }
                      </span>
                    </div>
                    <div className="rider-row">
                      <span>
                        {Labels.Name}
                      </span>
                      <span>
                        {Object.keys(this.state.RiderInfo).length > 0 ? this.state.RiderInfo.ASSIGN.Name : '-'}
                      </span>
                    </div>
                    <div className="rider-row">
                      <span>
                        {Labels.Contact_Number}
                      </span>
                      <span>
                      {Object.keys(this.state.RiderInfo).length > 0 ? this.state.RiderInfo.ASSIGN.Phone : '-'}
                      </span>
                    </div>

                  </div>
                  <h3>{Labels.Riders_activity} </h3>
                  <div className="rider-assign-wraper">

                  <div className={this.state.RiderInfo.ASSIGN !== undefined ? "rider-row-dark" : "rider-row-gray"}>
                      <span>
                      {Labels.Assigned}
                      </span>
                      <span>
                      {this.state.RiderInfo.ASSIGN !== undefined && Object.keys(this.state.RiderInfo.ASSIGN).length > 0 ? moment(this.state.RiderInfo.ASSIGN.Time).format('DD MMM YYYY hh:mm a') : '-' }
                      </span>
                    </div>


                    <div className={this.state.RiderInfo.PICKUP !== undefined ? "rider-row-light": "rider-row-gray"}>
                      <span>
                        {Labels.Picked_Up}
                      </span>
                      <span>
                     {this.state.RiderInfo.PICKUP !== undefined && Object.keys(this.state.RiderInfo.PICKUP).length > 0 ? moment(this.state.RiderInfo.PICKUP.Time).format('DD MMM YYYY hh:mm a') : '-' }
                      </span>
                    </div>


                    <div className={this.state.RiderInfo.DONE !== undefined ? "rider-row-green" : "rider-row-gray"}>
                      <span>
                      {Labels.Delivered}
                      </span>
                      <span>
                      {this.state.RiderInfo.DONE !== undefined && Object.keys(this.state.RiderInfo.DONE).length > 0 ? moment(this.state.RiderInfo.DONE.Time).format('DD MMM YYYY hh:mm a') : '-' }
                      </span>
                    </div>
                  </div>
                </div>
                <div className="rider-right">



                { this.state.RiderInfo.PICKUP !== undefined && this.state.RiderInfo.DONE === undefined ?
                      <Iframe
                     src={this.state.RiderInfo.PICKUP !== undefined && Object.keys(this.state.RiderInfo.PICKUP).length > 0 ? this.state.RiderInfo.PICKUP.TrackingUrl : ''}
                      width="100%"
                      height='450px'
                      frameBorder='0'
                      /> :

                      this.state.RiderInfo.ASSIGN === undefined ?<div className="center-rider-wrap"> <h2>{Labels.No_Rider_Assigned_Yet}</h2></div>  :

                      this.state.RiderInfo.PICKUP  === undefined ? <div className="center-rider-wrap"> <i className="fa fa-clock-o" aria-hidden="true"></i> <h2>{Labels.Waiting_For_Pickup}</h2></div> :

                      <div className="center-rider-wrap"><span className="thanks-alert-icon">
                      <i className="fa fa-check" aria-hidden="true"></i>
                  </span> <h2>{Labels.Order_Has_Been_Delivered}</h2>
                  </div>

                      }

                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <div>  <Button color="secondary" onClick={() => {
                this.toggleRiderModal()
              }}>{Labels.Close}</Button></div>
            </ModalFooter>
          </Modal>

          <Modal isOpen={this.state.confirmation} size="sm" toggle={() => this.toggleConfirmationModal()} >
            <ModalHeader>Confirmation</ModalHeader>
            <ModalBody className="move-modal">
            <p>
           {this.state.ConfirmationMsg}
            </p>
            </ModalBody>

            <ModalFooter>
              <Button color="secondary" onClick={() => { this.toggleConfirmationModal() }}>{Labels.Cancel}</Button>
              <Button color="primary" onClick={() => this.SendPushyNotification()} > {Labels.Confirm}  </Button>

            </ModalFooter>
          </Modal>

          <Modal isOpen={this.state.deviceStatus}  size="lg" toggle={() => this.toggleDeviceStatusModal()} >
            <ModalHeader>{Labels.Devices_Status}</ModalHeader>
            <ModalBody className=" devices-status-m-wrap">



             { this.state.deviceLoader ? '' : this.state.devices.map((device) => { return <div className="order-r">
                <div className="status-id-row w-100">{device.DeviceSerial}
                  <span className={`badge badge-${Number(Utilities.GetOrderStatusDateDifferenceInSec(device.LastSeenTime, device.SystemDateTime)) < 300000 ? "success" : "danger"} ml-3 font-12 font-weight-normal mr-3`}>{Number(Utilities.GetOrderStatusDateDifferenceInSec(device.LastSeenTime, device.SystemDateTime)) < 300000 ? "Online" : "Offline"}</span>
                  <span className="d-t-label"><i className="fa fa-clock-o mr-1"></i>{device.LastSeenTimeFormatted}</span>

                  <a className="ml-auto btn-primary btn-sm font-weight-normal">
                    <i className="fa fa-file-text-o mr-1" aria-hidden="true"></i> {Labels.Pull_Logs}</a>
                  <a className="btn-sm btn-danger ml-2 font-weight-normal"><i className="fa fa-trash-o mr-1" aria-hidden="true"></i>{Labels.Clear_Data}</a>
                </div>
                <div className="total-r-label ">
                  <span className="t-label">{Labels.Placed_At}</span><span>{Utilities.SpecialCharacterDecode(device.RestaurantName)}</span>
                </div>
                <div className="total-r-label r ">
                  <span className="t-label">{Labels.Location}</span>
                  <span>{`${device.Area} ${device.City} ${device.CountryCode}`}</span>
                </div>
                <div className="total-r-label flex-none ">
                  <span className="t-label">{Labels.App_Version}</span>
                  <span>{device.AppVersion}</span></div>
                <div className="total-r-label r">
                  <span className="t-label">{Labels.Device_Model}</span>
                  <span>{device.Manufacturer} {device.Model}<br/>{device.Build}</span></div>
                <div className="total-r-label r">
                  <span className="t-label">{Labels.Resource_Status}</span>
                  <span>
                    <span className="font-weight-normal mr-2">{Labels.RAM}</span>{device.RAM}</span>

                  <span className="font-13 bold">
                    <span className="font-weight-normal mr-2">{Labels.Storage}</span>
                    {device.Storage}</span>
                </div>
                <div className="total-r-label r">
                  <span className="t-label">{Labels.Connectivity_IP}</span>
                  <span>{device.ConnectivityType}
                    </span>
                </div>
              </div>}) }
            </ModalBody>

            <ModalFooter>


              <Button color="secondary" onClick={() => { this.toggleDeviceStatusModal() }}>Close</Button>
              {/* <Button color="success" >
               Confirm
              </Button> */}

            </ModalFooter>
          </Modal>

          <Modal isOpen={this.state.assignUser} toggle={() => this.assignUserModal({})} className={this.props.className}>
          <ModalHeader toggle={() => this.assignUserModal({})} >Assign to</ModalHeader>
          <ModalBody className='order-assign-u-m'>


         {
         this.state.loadingUser ?
              <div className="loader-menu-inner">
              <Loader type="Oval" color="#ed0000" height={50} width={50} />
              <div className="loading-label">Loading.....</div>
            </div> :
         <>

         {this.state.parentUsers.length > 0 && <span>Hotel Users</span>}
          {this.state.parentUsers.length > 0 &&

          this.state.parentUsers.map((user, i)=>{
              return(
                <div className='order-assign-inner cursor-pointer'>

                          <input type="checkbox" checked={user.IsSelected} value={user.IsSelected} onChange={(e) => this.handleCheckUser(e,i, true)}
                          className="form-checkbox flex-shrink-0" name={"chk"+user.Id} id={"chk"+user.Id}  />

              { Utilities.stringIsEmpty(user.PhotoName) ?
              <Avatar className="header-avatar" name={Utilities.stringIsEmpty(user.FirstName) ? user.DisplayName :`${user.FirstName} ${user.SurName}` } round={true} size="35" textSizeRatio={2} />
              :
              <img className='assign-o-image' src={Utilities.generatePhotoLargeURL(user.PhotoName, true, false)}/>
              }
              <div className='order-assign-email-user'>
                <div className='d-flex flex-column'>
                <span className={this.state.selectedOrder.AssingTo == user.Id ? "bold" : ""}>{Utilities.stringIsEmpty(user.FirstName) ? user.DisplayName :`${user.FirstName} ${user.SurName}` } <span className='ml-1'>{user.Id == this.state.userObj.Id ? "(You)" : ""}</span></span>

                <span class={`alert alert-secondary enterprise-txt mb-0 p-1 px-2 font-12 ${user.RoleLevel == Constants.Role.ENTERPRISE_ADMIN_ID ? "admin-color" :  user.RoleLevel == Constants.Role.ENTERPRISE_MANAGER_ID ? "manager-color" : "staff-color" }`}>
                {user.RoleLevel == Constants.Role.ENTERPRISE_ADMIN_ID ? <RiAdminFill/>  :  user.RoleLevel == Constants.Role.ENTERPRISE_MANAGER_ID ? <FaUserTie/> : <i class="fa fa-user"></i> }
                {user.RoleLevel == Constants.Role.ENTERPRISE_ADMIN_ID ? Constants.Role.ENTERPRISE_ADMIN  :  user.RoleLevel == Constants.Role.ENTERPRISE_MANAGER_ID ? Constants.Role.ENTERPRISE_MANAGER : Constants.Role.ENTERPRISE_USER }
                  </span>
                </div>
                {/* { this.state.selectedOrder.AssignTo == user.Id &&
                <div className='ml-auto'>
                  <span className='staff-check'><FaCheck /></span>
                </div>
                } */}
              </div>
              </div>)
            })
          }


      {this.state.users.length > 0 && <span>Service Users {this.state.selectedOrder.AssingTo}</span>}
      {this.state.users.length > 0 &&

        this.state.users.map((user,i)=> {
          return(
            <div className='order-assign-inner cursor-pointer'>

      <input type="checkbox" checked={user.IsSelected} value={user.IsSelected} onChange={(e) => this.handleCheckUser(e,i, false)}
                          className="form-checkbox flex-shrink-0" name={"chk"+user.Id} id={"chk"+user.Id}  />
        { Utilities.stringIsEmpty(user.PhotoName) ?
              <Avatar className="header-avatar" name={Utilities.stringIsEmpty(user.FirstName) ? user.DisplayName :`${user.FirstName} ${user.SurName}` } round={true} size="35" textSizeRatio={2} />
              :
              <img className='assign-o-image' src={Utilities.generatePhotoLargeURL(user.PhotoName, true, false)} />
          }
      <div className='order-assign-email-user'>
        <div className='d-flex flex-column'>
        <span className={this.state.selectedOrder.AssingTo == user.Id ? "bold" : ""}>{Utilities.stringIsEmpty(user.FirstName) ? user.DisplayName :`${user.FirstName} ${user.SurName}` }</span>
        <span class={`alert alert-secondary enterprise-txt mb-0 p-1 px-2 font-12 ${user.RoleLevel == Constants.Role.ENTERPRISE_ADMIN_ID ? "admin-color" :  user.RoleLevel == Constants.Role.ENTERPRISE_MANAGER_ID ? "manager-color" : "staff-color" }`}>
        {user.RoleLevel == Constants.Role.ENTERPRISE_ADMIN_ID ? <RiAdminFill/>  :  user.RoleLevel == Constants.Role.ENTERPRISE_MANAGER_ID ? <FaUserTie/> : <i class="fa fa-user"></i> }
        {user.RoleLevel == Constants.Role.ENTERPRISE_ADMIN_ID ? Constants.Role.ENTERPRISE_ADMIN  :  user.RoleLevel == Constants.Role.ENTERPRISE_MANAGER_ID ? Constants.Role.ENTERPRISE_MANAGER : Constants.Role.ENTERPRISE_USER }
          </span>
        </div>
        {/* { this.state.selectedOrder.AssignTo == user.Id &&
                <div className='ml-auto'>
                  <span className='staff-check'><FaCheck /></span>
                </div>
                } */}
      </div>
      </div>)
        })
      }

</>
      }
          </ModalBody>
          <FormGroup className="modal-footer" >
            <div className='mr-auto'> <label id="name" class="control-label mt-2 text-danger"></label>
            </div>
            <div>
              <Button className='mr-2 text-dark' color="secondary" onClick={() => this.assignUserModal()}>Cancel</Button>
              <Button color="primary"  onClick={() => {this.UpdateAssigneeApi()}} >
              {this.state.assigneeLoader ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
             : <span className="comment-text">Done</span>
            }
              </Button>
            </div>
          </FormGroup>
        </Modal>

        </div>


      </Fragment>

    );
  }
}

export default AllOrders;
