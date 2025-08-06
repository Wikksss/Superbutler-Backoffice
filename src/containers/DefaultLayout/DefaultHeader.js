import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, Button, Modal, ModalBody, ModalFooter, ModalHeader, Label } from 'reactstrap';
import PropTypes from 'prop-types';
import Avatar from 'react-avatar';
import Dropdown from 'react-bootstrap/Dropdown';
import { AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import { PlayModalSound } from '../../containers/DefaultLayout/DefaultLayout';
import logo from '../../assets/img/brand/logo.png'
import sygnet from '../../assets/img/brand/sygnet.svg'
import * as Utilities from '../../helpers/Utilities';
import Constants from '../../helpers/Constants';
import * as EnterpriseSettingService from '../../service/EnterpriseSetting';
import * as EnterpriseMenuService from '../../service/EnterpriseMenu';
import * as EnterpriseService from '../../service/Enterprise';
import Config from '../../helpers/Config';
import Loader from 'react-loader-spinner';
//import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppSwitch } from '@coreui/react';
import GlobalData from '../../helpers/GlobalData';
import { IoIosTabletLandscape } from "react-icons/io";
import Labels from '../language/labels';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import *as svgIcon from '../svgIcon';
import { IoReceiptOutline } from "react-icons/io5";
import { FiX, FiArrowRight  } from "react-icons/fi";
import { enable, disable } from 'darkreader';
import { FaVolumeHigh } from "react-icons/fa6";
import { IoVolumeMute } from "react-icons/io5";
import { MdOutlineLightMode } from "react-icons/md";
import { IoMoonOutline } from "react-icons/io5";
import moment from 'moment';

const propTypes = {
  children: PropTypes.node,
};

export var SetMenuStatus;
export var reloadSupportChatButton;
export var getHeaderCountExternal;
var intervalId;
var localStorageIntervalId;
var soundIntervalId;
const defaultProps = {};
var pathName = ""

class DefaultHeader extends Component {


  constructor(props) {
    super(props);
    this.buttonRef = React.createRef();
    this.popUpRef = React.createRef();
    this.bgRef = React.createRef();
    this.contentRef = React.createRef();
    this.state = {
      userObj: [],
      displayName: "",
      photoUrl: "",
      TakeOnlineOrder: true,
      TakeOnlineOrderModel: false,
      EnterpriseQuickSetting: {},
      hours_Days_Data: [],
      tempQuickSetting: {},
      ShowQuickSetting: false,
      dropdownOpen: false,
      dropdownOpen1: false,
      dropdownOpen2: false,
      dropdownOpen3: false,
      dropdownOpen4: false,
      dropdownOpen5: false,
      dropdownOpen6: false,
      IsMenuModified: false,
      HasPublished: true,
      modalpublshshow: false,
      UserObject: {},
      ShowLoader: true,
      IsSaving: false,
      PublishStatus: false,
      newRequestNotification: false,
      newSupportChatNotification: false,
      guestPrivacy: true,
      DarkMode: false,
      intervalId: null,
      timeString: "",
      snozeDropdown: false,
      snoozeTime: 30,
      defaultSnoozeTime: 30,
      headerCount: {Orders: 0, Chats: 0,  Requests: 0},
      isLeader: false,
      loggedInEnterpriseId: 0,
      snoozed:false,
      
    }

    this.leaderKey = 'modalLeaderTab';

    var enterpriseInfoJson = localStorage.getItem(Constants.Session.ENTERPRISE_INFO_JSON)
     pathName = this.props.PathName;
    if(!Utilities.stringIsEmpty(enterpriseInfoJson))
    {
      var jsonInfo = JSON.parse(enterpriseInfoJson);
      this.state.defaultSnoozeTime = jsonInfo.Restaurant.HeadetCountInteval
      this.state.defaultSnoozeTime = this.state.snoozeTime = jsonInfo.Restaurant.HeadetCountInteval
    }

    this.TakeOnlineOrderModelShowHide = this.TakeOnlineOrderModelShowHide.bind(this);
    this.PublishedUnPublishedModal = this.PublishedUnPublishedModal.bind(this);
    this.SetMenuStatus = this.SetMenuStatus.bind(this);
    this.toggle = this.toggle.bind(this);
    this.toggle1 = this.toggle1.bind(this);
    this.toggle2 = this.toggle2.bind(this);
    this.toggle3 = this.toggle3.bind(this);
    this.toggle4 = this.toggle4.bind(this);
    this.toggle5 = this.toggle5.bind(this);
    this.toggle6 = this.toggle6.bind(this);

    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
      var userObject = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
      this.state.UserObject = userObject;
      this.state.loggedInEnterpriseId = userObject.Enterprise.Id;
    }

    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.REQUEST_NOTIFICATION))) {
      this.state.newRequestNotification = true;
    }

    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.ORDERSUPPORT_NOTIFICATION_BUBBLE))) {
      const orderSupportbubble = JSON.parse(localStorage.getItem(Constants.ORDERSUPPORT_NOTIFICATION_BUBBLE))
      this.state.newSupportChatNotification = orderSupportbubble;
    }

    if(!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.PRIVACY_SWITCH))){
      this.state.guestPrivacy = JSON.parse(localStorage.getItem(Constants.Session.PRIVACY_SWITCH))
    }else if(!this.state.UserObject.EnterpriseRestaurant.RestaurantSettings.GuestPrivacy){
      this.state.guestPrivacy = this.state.UserObject.EnterpriseRestaurant.RestaurantSettings.GuestPrivacy
      localStorage.setItem(Constants.Session.PRIVACY_SWITCH, this.state.UserObject.EnterpriseRestaurant.RestaurantSettings.GuestPrivacy)
    }else{
      localStorage.setItem(Constants.Session.PRIVACY_SWITCH, this.state.guestPrivacy)
    }
  }

  componentWillReceiveProps(props) {
   if(this.state.UserObject.RoleLevel === Constants.Role.ENTERPRISE_ADMIN_ID
    || this.state.UserObject.RoleLevel === Constants.Role.ENTERPRISE_MANAGER_ID
    || this.state.UserObject.RoleLevel === Constants.Role.STAFF_ID ){
    SetMenuStatus();
   }
  }


  tryToBecomeLeader = () => {
    const currentLeader = localStorage.getItem(this.leaderKey);
    if (!currentLeader || this.isExpired(currentLeader)) {
      this.setAsLeader();
    }
  };

  setAsLeader = () => {
    const timestamp = Date.now();
    localStorage.setItem(this.leaderKey, JSON.stringify({ tabId: this.getTabId(), timestamp }));
    this.setState({ isLeader: true }, () => this.startInterval(this.state.snoozeTime));
  };

  releaseLeadership = () => {
    const currentLeader = JSON.parse(localStorage.getItem(this.leaderKey) || '{}');
    if (currentLeader?.tabId === this.getTabId()) {
      localStorage.removeItem(this.leaderKey);
    }
  };

  handleStorageEvent = (e) => {
  if (e.key === this.leaderKey) {
    const currentLeader = JSON.parse(e.newValue || '{}');

    if (!currentLeader?.tabId || this.isExpired(currentLeader)) {
      this.tryToBecomeLeader(); // Attempt to become leader if expired or cleared
    } else if (currentLeader?.tabId !== this.getTabId()) {
      this.setState({ isLeader: false });
      clearInterval(intervalId);
    }
  }
};

  isExpired = (leaderObj) => {
    const expiryMs = 35 * 1000; // little more than 30s

    if(Utilities.stringIsEmpty(leaderObj)) return true;

    return (Date.now() - new Date(JSON.parse(leaderObj).timestamp).getTime()) > expiryMs;
  };

  getTabId = () => {
    if (!window.__TAB_ID__) {
      window.__TAB_ID__ = Math.random().toString(36).substring(2);
    }
    return window.__TAB_ID__;
  };

  SetMenuStatus = SetMenuStatus = async (isMenuModified) => {

    let status = await EnterpriseMenuService.GetMenuStatus();
    let json = await EnterpriseMenuService.GetEnterpriseJson();

    if(this.state.PublishStatus !== status){
     this.setState({ PublishStatus: status });
    }

    if(json != null){
    if(this.state.IsMenuModified !== json.IsMenuModified){
    this.setState({ IsMenuModified: json.IsMenuModified});
   }
  } else
  {
    this.setState({ IsMenuModified: true});
  }

  }


  PublishedUnPublished() {

    this.PublishedUnPublishedMenu(true);

  }

  reloadSupportChatButton = reloadSupportChatButton = () =>{
    this.setState({})
  }

  PublishedUnPublishedMenu = async (isPublished) => {

    this.setState({ IsSaving: true });

    let json = await EnterpriseMenuService.GetEnterpriseJson()

    if (json !== null && json !== undefined && !json.IsMenuModified) {
      Utilities.notify("Menu is already published.", "s");
      this.setState({ modalpublshshow: false, IsSaving: false });
      return;
    }

    let status = await EnterpriseMenuService.GetMenuStatus();
    if (status === 1) {
      Utilities.notify("Menu is already in Queue. Your changes will be published.", "s");
      this.setState({modalpublshshow: false, IsSaving: false,PublishStatus: status });
      return;
    }

    let message = await EnterpriseMenuService.PublishedUnPublishedMenu(isPublished);
    this.setState({ modalpublshshow: false, IsSaving: false,PublishStatus: status });
    if (message === '1') {
      // localStorage.setItem(Constants.Session.MENU_STATUS, status)
      // this.setState({ PublishStatus: status});
      SetMenuStatus();
      Utilities.notify((isPublished ? 'Menu changes are queued for publishing. Please check status in Menu Status screen.' : 'Menu has been successfully UnPublished.'), "s");
      return;

    }
    Utilities.notify(" Menu not successfully " + (isPublished ? 'RePublished.' : 'UnPublished.'), "e");

  }
  componentDidMount() {

  try {
    const saved = localStorage.getItem('darkMode') === 'true';

    if (saved) {
      this.setState({ DarkMode: true });

      // ✨ Remove iframe if it appears after reload
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (
              node.tagName === 'IFRAME' &&
              node.style &&
              node.style.zIndex === '2147483647'
            ) {
              console.warn('Blocking iframe detected on load and removed.');
              node.remove();
            }
          });
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Auto disconnect observer after a few seconds
      setTimeout(() => {
        observer.disconnect();
        console.log('MutationObserver disconnected after load.');
      }, 10000);

      // 🌓 Activate dark mode
      if (typeof enable === 'function') {
        try {
          enable({
            brightness: 100,
            contrast: 90,
            sepia: 10,
          });
        } catch (err) {
          console.error('DarkReader enable failed in try block:', err);
        }
      } else {
        console.warn('"enable" is not a function. Possible hot reload issue.');
      }
    }
  } catch (outerError) {
    console.error('componentDidMount error:', outerError);
  }

    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {

      var userObject = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT));
      let AdminObject = JSON.parse(localStorage.getItem(Constants.Session.ADMIN_OBJECT))
      let parentObject = JSON.parse(localStorage.getItem(Constants.Session.PARENT_OBJECT))

      this.setState({
        userObj: userObject,
        displayName: parentObject !== null ? `${parentObject.FirstName}` : (AdminObject !== null ? `${AdminObject.FirstName}` : `${userObject.FirstName}`),
        userPhotoName: parentObject !== null ? `${parentObject.PhotoName}` : (AdminObject !== null ? `${AdminObject.PhotoName}` : `${userObject.PhotoName}`),
        photoUrl: userObject.PhotoName
      });
      this.fillHoursDaysDropDown()
      // this.GetEnterpriseQuickSetting()
    }


    // if(!Utilities.stringIsEmpty(localStorage.getItem("headerSnoozeTime")))
    // {
    //   this.updateTimeOnLocalStorage()
    // }

     this.startInterval(this.state.defaultSnoozeTime); // start with 30 seconds
     this.getHeaderCount(true);
     this.GetEnterpriseQuickSetting();
     this.tryToBecomeLeader();
     window.addEventListener('storage', this.handleStorageEvent);
     window.addEventListener('beforeunload', this.releaseLeadership);
  }

   componentWillUnmount() {
     clearInterval(intervalId);
  }

  startInterval = (seconds) => {
  if (intervalId) clearInterval(intervalId);

  var snoozeTime = sessionStorage.getItem("headerSnoozeTime");
   if(!Utilities.stringIsEmpty(snoozeTime)) {
        const targetTime = new Date(snoozeTime);
        const now = new Date();

        const diffMs = targetTime - now; // Difference in milliseconds
        const diffSeconds = Math.floor(diffMs / 1000); // Convert to seconds
      seconds = diffSeconds < this.state.defaultSnoozeTime ?  this.state.defaultSnoozeTime : diffSeconds;
      this.state.snoozeTime = seconds;
      this.state.snoozed = true;
      }

  intervalId = setInterval(() => {

      var snoozeTime = sessionStorage.getItem("headerSnoozeTime");
      if(Utilities.stringIsEmpty(snoozeTime) || new Date(snoozeTime) < new Date())
      {
        sessionStorage.removeItem("headerSnoozeTime");
        if (this.state.isLeader) {
          this.getHeaderCount(false);
        } else
        {
        this.handleStorageEvent();
        var headerCounts = localStorage.getItem("headerCounts");
        if(!Utilities.stringIsEmpty(headerCounts))
          {
            this.setState({headerCount: JSON.parse(headerCounts)});
          }
        }
      }
    }, seconds * 1000);
};

  startSoundInterval = (seconds) => {
    if (soundIntervalId) {
      clearInterval(soundIntervalId);
    }
     soundIntervalId = setInterval(() => {
      PlayModalSound(true);
      }, seconds * 1000);
  };


  // updateTimeOnLocalStorage = () =>
  // {
  //   localStorageIntervalId = setInterval(() => {
  //     var snoozeTime = localStorage.getItem("headerSnoozeTime");

  //     if(snoozeTime < moment())
  //     {
  //       localStorage.removeItem("headerSnoozeTime");
  //       clearInterval(localStorageIntervalId);
  //       return;
  //     }
  //     },1000);
  // }

  handleSnooze = (seconds, title) => {
    clearInterval(intervalId);
    this.setState({ timeString: title, snoozeTime: seconds});
    var selectedMin = seconds * 1000;
    if (seconds == 0) {
      sessionStorage.removeItem("headerSnoozeTime");
      this.startInterval(this.state.defaultSnoozeTime); // resume regular 30 sec
      this.setState({snoozeTime: this.state.defaultSnoozeTime, snoozed:false});

    } else {
       this.setState({snoozed:true});
       const now = new Date();
       sessionStorage.setItem("headerSnoozeTime", new Date(now.getTime() + selectedMin)) // 60000 ms = 1 min);
       this.closePopUp();
      setTimeout(() => {
        this.startInterval(this.state.defaultSnoozeTime); // resume regular 30 sec after snooze
        this.setState({timeString: '', snoozeTime: this.state.defaultSnoozeTime});
      }, selectedMin);
    }
  };

    toggleSnoozeDropdown() {
    this.setState({
      snozeDropdown: !this.state.snozeDropdown
    });
  }


  fillHoursDaysDropDown() {
    let hours = Config.Setting.goOfflineHours.split(',')
    let days = Config.Setting.goOfflineDays.split(',')

    let hoursDaysArr = []
    for (let i = 0; i < hours.length; i++) {
      hoursDaysArr.push({ value: hours[i] + "_h", text: "Off for " + hours[i] + " hours" })
    }

    for (let i = 0; i < days.length; i++) {
      let momentDate = Utilities.GetDate();
      let offlineTillDate = momentDate.add(parseInt(days[i]), 'days');
      if (days[i] === "0") {
        hoursDaysArr.push({ value: days[i] + "_d", text: "Off for today" })
      } else if (days[i] === "1") {
        hoursDaysArr.push({ value: days[i] + "_d", text: "Off for " + days[i] + " day" })
      } else {
        hoursDaysArr.push({ value: days[i] + "_d", text: "Off for " + days[i] + " days - Till " + offlineTillDate.format('DD-MMM-YYYY') })
      }

    }

    this.setState({
      hours_Days_Data: hoursDaysArr
    })

  }

  setOfflineTillDate(value, typeId) {
    // var momentDate = Utilities.GetDate();
    // let offlineTillDate = ""
    // let durationArr = value.split('_')
    // let hours = 0;
    // if(durationArr.length > 1){
    //    if(durationArr[1] === "h"){
    //       hours = parseInt(durationArr[0]);
    // offlineTillDate = momentDate.add(parseInt(durationArr[0]), 'hours');
    // console.log(momentDate.add(parseInt(durationArr[0]), 'hours').format('YYYY-MM-DD HH:mm:ss'))
    //  }
    //  else if(durationArr[1] === "d"){
    //       hours = parseInt(durationArr[0]) * 24;
    //  offlineTillDate = momentDate.add(parseInt(durationArr[0]), 'days')
    //  offlineTillDate.set("hour", 23);
    //  offlineTillDate.set("minute", 59);
    //  offlineTillDate.set("second", 0);
    //  offlineTillDate.set("millisecond", 0);
    //  console.log(offlineTillDate.format('YYYY-MM-DD HH:mm:ss'))

    //  }

    var enterpriseSettng = this.state.EnterpriseQuickSetting

    if (typeId === 1) {

      //enterpriseSettng.OrderingOfflineTillDateTime = offlineTillDate.format('YYYY-MM-DD HH:mm:ss');
      enterpriseSettng.OrderingOfflineTill = value;
    }
    else if (typeId === 2) {
      //enterpriseSettng.DeliveryOfflineTillDateTime = offlineTillDate.format('YYYY-MM-DD HH:mm:ss');
      enterpriseSettng.DeliveryOfflineTill = value;
    }
    else if (typeId === 3) {
      //enterpriseSettng.TakeawayOfflineTillDateTime = offlineTillDate.format('YYYY-MM-DD HH:mm:ss');
      enterpriseSettng.TakeawayOfflineTill = value;
    }
    else if (typeId === 4) {
      //enterpriseSettng.EatinOfflineTillDateTime = offlineTillDate.format('YYYY-MM-DD HH:mm:ss');
      enterpriseSettng.EatinOfflineTill = value;
    }
    else if (typeId === 5) {
      //enterpriseSettng.CreaditCardOfflineTillDateTime = offlineTillDate.format('YYYY-MM-DD HH:mm:ss');
      enterpriseSettng.CreaditCardOfflineTill = value;
    }
    else if (typeId === 6) {
      //enterpriseSettng.CashOnDeliveryOfflineTillDateTime = offlineTillDate.format('YYYY-MM-DD HH:mm:ss');
      enterpriseSettng.CashOnDeliveryOfflineTill = value;
    }

    this.setState({
      EnterpriseQuickSetting: enterpriseSettng
    });
    // }
  }

  SaveUpdateQuickSetting = async () => {
    if (this.state.EnterpriseQuickSetting.OfflineTillSelectedValue === "") {
      return
    }
    var isScheduled = await EnterpriseSettingService.ScheduleEnterpriseQuickSetting(this.state.EnterpriseQuickSetting);
    if (isScheduled === "1") {
      this.setState({ TakeOnlineOrder: this.state.EnterpriseQuickSetting.TakeOnlineOrder });
      // toast.success("Saved successfully " , {position: "top-right",autoClose: 4000,});
      this.TakeOnlineOrderModelShowHide();
      this.GetEnterpriseQuickSetting();
      return;
    }
    // toast.error("Scheduled failed [" + isScheduled +  "]", {position: "top-right",autoClose: 4000,});
  }

  GetEnterpriseQuickSetting = async () => {

    var data = await EnterpriseSettingService.GetQuickSetting();

    if (data !== null) {
      // data.IsCardAccepted = 1 ;
      var quickSetting = {
        TakeOnlineOrderText: data.TakeOnlineOrder === 1 ? "On" : data.OrderingOfflineTillSelectedValue === "0" ? "Off" : data.OrderingOfflineTillSelectedValue,
        IsDeliveryOfferedText: data.IsDeliveryOffered === 1 ? "On" : data.DeliveryOfflineTillSelectedValue === "0" ? "Off" : data.DeliveryOfflineTillSelectedValue,
        IsTakeawayOfferedText: data.IsTakeawayOffered === 1 ? "On" : data.TakeawayOfflineTillSelectedValue === "0" ? "Off" : data.TakeawayOfflineTillSelectedValue,
        IsDineInOfferedText: data.IsDineInOffered === 1 ? "On" : data.EatinOfflineTillSelectedValue === "0" ? "Off" : data.EatinOfflineTillSelectedValue,
        IsCardAcceptedText: data.IsCardAccepted === 1 ? "On" : data.CreaditCardOfflineTillSelectedValue === "0" ? "Off" : data.CreaditCardOfflineTillSelectedValue,
        IsCashAcceptedText: data.IsCashAccepted === 1 ? "On" : data.CashOnDeliveryOfflineTillSelectedValue === "0" ? "Off" : data.CashOnDeliveryOfflineTillSelectedValue
      }

      this.setState({
        EnterpriseQuickSetting: data,
        tempQuickSetting: quickSetting,
        TakeOnlineOrder: data.TakeOnlineOrder,
        ShowQuickSetting: data.EnterpriseID !== undefined,
      })
    }
  }

  changeToggleValue(e, checked) {
    let quickSetting = this.state.EnterpriseQuickSetting;
    //let tempSetting = this.state.tempQuickSetting;
    let control = e.target.name;

    if (control === "chkCash") {
      quickSetting.IsCashAccepted = checked ? 1 : 0
    } else {
      quickSetting.IsCardAccepted = checked ? 1 : 0
    }
    this.setState(
      {
        EnterpriseQuickSetting: quickSetting,
      })


  }


  changeValue(e, dropDown) {
    let quickSetting = this.state.EnterpriseQuickSetting;
    //this.setOfflineTillDate(e.currentTarget.value,1);
    let tempSetting = this.state.tempQuickSetting;

    if (dropDown === "TakeOnlineOrder") {
      quickSetting.TakeOnlineOrder = e.currentTarget.value === "1" ? 1 : 0;
      this.setOfflineTillDate(e.currentTarget.value, 1);
      if (e.currentTarget.value === "0" || e.currentTarget.value === "1") {
        quickSetting.OrderingOfflineTillSelectedValue = e.currentTarget.value;
      }
      else {
        quickSetting.OrderingOfflineTillSelectedValue = e.currentTarget.textContent;
      }

      tempSetting.TakeOnlineOrderText = e.currentTarget.textContent;
    }
    else if (dropDown === "IsDeliveryOffered") {
      quickSetting.IsDeliveryOffered = e.currentTarget.value === "1" ? 1 : 0
      this.setOfflineTillDate(e.currentTarget.value, 2);
      if (e.currentTarget.value === "0" || e.currentTarget.value === "1") {
        quickSetting.DeliveryOfflineTillSelectedValue = e.currentTarget.value;
      }
      else {
        quickSetting.DeliveryOfflineTillSelectedValue = e.currentTarget.textContent;
      }
      tempSetting.IsDeliveryOfferedText = e.currentTarget.textContent;
    }
    else if (dropDown === "IsTakeawayOffered") {
      quickSetting.IsTakeawayOffered = e.currentTarget.value === "1" ? 1 : 0
      this.setOfflineTillDate(e.currentTarget.value, 3);
      if (e.currentTarget.value === "0" || e.currentTarget.value === "1") {
        quickSetting.TakeawayOfflineTillSelectedValue = e.currentTarget.value;
      }
      else {
        quickSetting.TakeawayOfflineTillSelectedValue = e.currentTarget.textContent;
      }
      tempSetting.IsTakeawayOfferedText = e.currentTarget.textContent;
    }
    else if (dropDown === "IsDineInOffered") {
      quickSetting.IsDineInOffered = e.currentTarget.value === "1" ? 1 : 0
      this.setOfflineTillDate(e.currentTarget.value, 4);
      if (e.currentTarget.value === "0" || e.currentTarget.value === "1") {
        quickSetting.EatinOfflineTillSelectedValue = e.currentTarget.value;
      }
      else {
        quickSetting.EatinOfflineTillSelectedValue = e.currentTarget.textContent;
      }
      tempSetting.IsDineInOfferedText = e.currentTarget.textContent;
    }
    else if (dropDown === "IsCardAccepted") {
      quickSetting.IsCardAccepted = e.currentTarget.value === "1" ? 1 : 0
      this.setOfflineTillDate(e.currentTarget.value, 5);
      if (e.currentTarget.value === "0" || e.currentTarget.value === "1") {
        quickSetting.CreaditCardOfflineTillSelectedValue = e.currentTarget.value;
      }
      else {
        quickSetting.CreaditCardOfflineTillSelectedValue = e.currentTarget.textContent;
      }

      tempSetting.IsCardAcceptedText = e.currentTarget.textContent;
    }
    else if (dropDown === "IsCashAccepted") {
      quickSetting.IsCashAccepted = e.currentTarget.value === "1" ? 1 : 0
      this.setOfflineTillDate(e.currentTarget.value, 6);
      if (e.currentTarget.value === "0" || e.currentTarget.value === "1") {
        quickSetting.CashOnDeliveryOfflineTillSelectedValue = e.currentTarget.value;
      }
      else {
        quickSetting.CashOnDeliveryOfflineTillSelectedValue = e.currentTarget.textContent;
      }
      tempSetting.IsCashAcceptedText = e.currentTarget.textContent;
    }
    this.setState(
      {
        EnterpriseQuickSetting: quickSetting,
        tempQuickSetting: tempSetting
      })
    //alert(e.currentTarget.value)
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }
  toggle1() {
    this.setState({
      dropdownOpen1: !this.state.dropdownOpen1
    });
  }
  toggle2() {
    this.setState({
      dropdownOpen2: !this.state.dropdownOpen2
    });
  }
  toggle3() {
    this.setState({
      dropdownOpen3: !this.state.dropdownOpen3
    });
  }
  toggle4() {
    this.setState({
      dropdownOpen4: !this.state.dropdownOpen4
    });
  }
  toggle5() {
    this.setState({
      dropdownOpen5: !this.state.dropdownOpen5
    });
  }
  toggle6() {
    this.setState({
      dropdownOpen6: !this.state.dropdownOpen6
    });
  }
  TakeOnlineOrderModelShowHide = () => {
    if (!this.state.TakeOnlineOrderModel) {
      this.GetEnterpriseQuickSetting()
    }

    this.setState({
      TakeOnlineOrderModel: !this.state.TakeOnlineOrderModel,
    })
  }
  PublishedUnPublishedModal = () => {

    this.setState({
      modalpublshshow: !this.state.modalpublshshow,
    })
  }

  changeStatus = () => {
    this.setState({

      TakeOnlineOrderModel: false
    })
  }

  guestPrivacySwitchHandler = (e) =>{
      localStorage.setItem(Constants.Session.PRIVACY_SWITCH, e)
      this.setState({ guestPrivacy: e })
      window.location.href = window.location.href
  }

   openPopUp = () => {
    this.setState({snoozed: false})
    PlayModalSound(true)
    clearInterval(intervalId);
    this.startSoundInterval(this.state.snoozeTime)
    const button = this.buttonRef.current;
    const popUp = this.popUpRef.current;
    const bg = this.bgRef.current;

    popUp.style.width = `${button.offsetWidth}px`;
    popUp.style.height = `${button.offsetHeight}px`;
    popUp.style.top = `${button.getBoundingClientRect().top}px`;
    popUp.style.left = `${button.getBoundingClientRect().left}px`;
    popUp.style.display = 'block';

    button.style.visibility = 'visible';

    setTimeout(() => {
       button.classList.add('pop-up-open');
      popUp.classList.add('pop-up-open');
      bg.classList.add('active');
      this.contentRef.current.style.opacity = 1;
    }, 350);
  };

  closePopUp = () => {
    PlayModalSound(false);
    this.startInterval(this.state.snoozeTime);
    clearInterval(soundIntervalId);
    const button = this.buttonRef.current;
    const popUp = this.popUpRef.current;
    const bg = this.bgRef.current;

    this.contentRef.current.style.opacity = 0;
    popUp.style.visibility = 'visible';
    popUp.style.padding = '0';

    button.classList.remove('pop-up-open');
    popUp.classList.remove('pop-up-open');
    bg.classList.remove('active');

    setTimeout(() => {
      button.style.visibility = 'visible';
      popUp.removeAttribute('style');
    }, 500);
  };




handleDarkToggle = async (checked) => {
  this.setState({ DarkMode: checked });
  localStorage.setItem('darkMode', checked); // ✅ Save to localStorage

  // Remove unwanted iframe after toggle
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (
          node.tagName === 'IFRAME' &&
          node.style &&
          node.style.zIndex === '2147483647'
        ) {
          console.warn('Blocking iframe detected and removed.');
          node.remove();
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  setTimeout(() => {
    observer.disconnect();
    console.log('MutationObserver stopped.');
  }, 10000);

  try {
    if (checked) {
      await enable({
        brightness: 100,
        contrast: 90,
        sepia: 10,
      });
    } else {
      await disable();
    }
  } catch (error) {
    console.error('Dark mode toggle error:', error);
  }
};

   getHeaderCount = getHeaderCountExternal = async (onLoad) => {

    var response = await EnterpriseService.GetHeaderCount(this.state.loggedInEnterpriseId);

    if (response != undefined && !response.HasError) {

      if (response.Dictionary.HeaderCount) {

        this.setState({headerCount: JSON.parse(response.Dictionary.HeaderCount)}, () => localStorage.setItem("headerCounts", response.Dictionary.HeaderCount))

        setTimeout(() => {

          var headerCount = this.state.headerCount;

          //this.setHeaderCountData(headerCount);
          if(headerCount.Orders > 0 || headerCount.Chats > 0 || headerCount.Requests > 0 ) {

              if(Utilities.stringIsEmpty(sessionStorage.getItem("headerSnoozeTime")) && !onLoad)
              {
                this.openPopUp();
              }
            }
          }
          , 500);
          }

  }
  }

redirectToOrder = (e) => {
  this.setHeaderCountData(); 
  setTimeout(() => {
    this.props.GoLiveOrder(e); 
    this.closePopUp()
  }, 500);
}

setHeaderCountData = () => {

   var headerCount = this.state.headerCount;

  if(headerCount.Orders > 0) {

                if(Utilities.stringIsEmpty(sessionStorage.getItem(Constants.Session.SELECTED_ORDER_QUERY)))
                {
                  sessionStorage.setItem(Constants.Session.SELECTED_ORDER_QUERY, `${moment(headerCount.OldestOrderDate).format("YYYY-MM-DD 00:00:00")}|${moment().format('YYYY-MM-DD 23:59:59')}`)
                }
                else
                {
                        let Dates = String(sessionStorage.getItem(Constants.Session.SELECTED_ORDER_QUERY)).split('|');
                        var startDate = Dates[0]
                        if(moment(startDate).format("YYYY-MM-DD 00:00:00") > moment(headerCount.OldestOrderDate).format("YYYY-MM-DD 00:00:00"))
                        {
                          sessionStorage.setItem(Constants.Session.SELECTED_ORDER_QUERY, `${moment(headerCount.OldestOrderDate).format("YYYY-MM-DD 00:00:00")}|${moment().format('YYYY-MM-DD 23:59:59')}`)
                        }
                }
                  }

                  if(headerCount.Requests > 0) {
                    var days = this.getDaysBetweenDates(moment(headerCount.OldestRequestDate).format("YYYY-MM-DD 00:00:00"));

                     if(!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.SELECTED_COMPLAINTS_STATUS))){

                      var sessionStatuses = localStorage.getItem(Constants.Session.SELECTED_COMPLAINTS_STATUS)
                      var statusesArray = sessionStatuses.split('|');
                      var selectedDays = statusesArray[0];

                      if(days > selectedDays)
                      {
                        localStorage.setItem(Constants.Session.SELECTED_COMPLAINTS_STATUS, `${this.getSelectOption(days)}|${statusesArray[1]}`)
                      }

                    } else
                    {
                      localStorage.setItem(Constants.Session.SELECTED_COMPLAINTS_STATUS, `${this.getSelectOption(days)}|-1`)
                    }

                  }
}



  getSelectOption = (days) => {

  if (days === 0) return 0;       // Today
  else if (days === 1) return 1;  // Yesterday
  else if (days <= 7) return 7;   // Last Week
  else if (days <= 30) return 30; // Last Month
  else if (days <= 90) return 90; // Last 3 Months
  else if (days <= 180) return 180; // Last 6 Months
  else return -1;                // Default to Lifetime
}

  getDaysBetweenDates = (date) => {
  var d1 = new Date(date);
  const d2 = new Date();

  // Calculate difference in time (milliseconds)
  const diffTime = Math.abs(d2 - d1);

  // Convert to days
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}



  GenerateTakeOnlineOrderModel() {


    if (this.state.EnterpriseQuickSetting !== undefined || this.state.ShowQuickSetting) {
      return (
        <Modal isOpen={this.state.TakeOnlineOrderModel} toggle={this.TakeOnlineOrderModelShowHide} className={this.props.className}>
          <ModalHeader toggle={this.TakeOnlineOrderModelShowHide}>Quick Settings</ModalHeader>
          <ModalBody>

            <div className="res-status-wrap">
              <div className="res-status-row">
                <div className="res-status-title bold" style={{ color: '#333333' }}>
                  Online ordering
      </div>
                <div className="res-status-dropdown">
                  <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle caret color="secondary" className={this.state.EnterpriseQuickSetting.TakeOnlineOrder === 1 ? "btn-on" : "btn-off"}>
                      {this.state.tempQuickSetting.TakeOnlineOrderText}
                    </DropdownToggle>
                    <DropdownMenu>
                      {
                        this.state.EnterpriseQuickSetting.TakeOnlineOrder === 1 ?
                          <DropdownItem onClick={(e) => this.changeValue(e, "TakeOnlineOrder")} value="0" >Off</DropdownItem>
                          : <DropdownItem onClick={(e) => this.changeValue(e, "TakeOnlineOrder")} value="1">On</DropdownItem>
                      }
                      {
                        this.state.hours_Days_Data.map((item, key) => {
                          return <DropdownItem key={key} value={item.value} onClick={(e) => this.changeValue(e, "TakeOnlineOrder")} >{item.text}</DropdownItem>
                        })}
                    </DropdownMenu>
                  </ButtonDropdown>
                </div>
              </div>
              <div className={this.state.EnterpriseQuickSetting.TakeOnlineOrder === 0 ? "res-status-inner-wrap row-disable" : "res-status-inner-wrap"}>
                <div className="status-overlay"></div>
                <div className="res-status-row ">
                  <div className="res-status-title">
                    Delivery
      </div>
                  <div className="res-status-dropdown">
                    <ButtonDropdown isOpen={this.state.dropdownOpen1} toggle={this.toggle1}>
                      <DropdownToggle caret color="secondary" className={this.state.EnterpriseQuickSetting.IsDeliveryOffered === 1 ? "btn-on" : "btn-off"}>
                        {this.state.tempQuickSetting.IsDeliveryOfferedText}
                      </DropdownToggle>
                      <DropdownMenu>
                        {
                          this.state.EnterpriseQuickSetting.IsDeliveryOffered === 1 ?
                            <DropdownItem onClick={(e) => this.changeValue(e, "IsDeliveryOffered")} value="0" >Off</DropdownItem>
                            : <DropdownItem onClick={(e) => this.changeValue(e, "IsDeliveryOffered")} value="1">On</DropdownItem>
                        }
                        {
                          this.state.hours_Days_Data.map((item, key) => {
                            return <DropdownItem key={key} value={item.value} onClick={(e) => this.changeValue(e, "IsDeliveryOffered")} >{item.text}</DropdownItem>
                          })}
                      </DropdownMenu>
                    </ButtonDropdown>
                  </div>
                </div>
                <div className="res-status-row ">
                  <div className="res-status-title">
                    Pick-up
      </div>
                  <div className="res-status-dropdown">
                    <ButtonDropdown isOpen={this.state.dropdownOpen2} toggle={this.toggle2}>
                      <DropdownToggle caret color="secondary" className={this.state.EnterpriseQuickSetting.IsTakeawayOffered === 1 ? "btn-on" : "btn-off"}>
                        {this.state.tempQuickSetting.IsTakeawayOfferedText}
                      </DropdownToggle>
                      <DropdownMenu>
                        {
                          this.state.EnterpriseQuickSetting.IsTakeawayOffered === 1 ?
                            <DropdownItem onClick={(e) => this.changeValue(e, "IsTakeawayOffered")} value="0" >Off</DropdownItem>
                            : <DropdownItem onClick={(e) => this.changeValue(e, "IsTakeawayOffered")} value="1">On</DropdownItem>
                        }
                        {
                          this.state.hours_Days_Data.map((item, key) => {
                            return <DropdownItem key={key} value={item.value} onClick={(e) => this.changeValue(e, "IsTakeawayOffered")} >{item.text}</DropdownItem>
                          })
                        }

                      </DropdownMenu>
                    </ButtonDropdown>
                  </div>
                </div>
                <div className="res-status-row ">
                  <div className="res-status-title">
                    EatIn
      </div>
                  <div className="res-status-dropdown">
                    <ButtonDropdown isOpen={this.state.dropdownOpen3} toggle={this.toggle3}>
                      <DropdownToggle caret color="secondary" className={this.state.EnterpriseQuickSetting.IsDineInOffered === 1 ? "btn-on" : "btn-off"}>
                        {this.state.tempQuickSetting.IsDineInOfferedText}
                      </DropdownToggle>
                      <DropdownMenu>
                        {
                          this.state.EnterpriseQuickSetting.IsDineInOffered === 1 ?
                            <DropdownItem onClick={(e) => this.changeValue(e, "IsDineInOffered")} value="0" >Off</DropdownItem>
                            : <DropdownItem onClick={(e) => this.changeValue(e, "IsDineInOffered")} value="1">On</DropdownItem>
                        }
                        {
                          this.state.hours_Days_Data.map((item, key) => {
                            return <DropdownItem key={key} value={item.value} onClick={(e) => this.changeValue(e, "IsDineInOffered")} >{item.text}</DropdownItem>
                          })}
                      </DropdownMenu>
                    </ButtonDropdown>
                  </div>
                </div>
              </div>
              <div className="res-status-row" style={{ marginTop: '30px;' }}>
                <div className="res-status-title bold" style={{ color: '#333333' }}>
                  Payment options
      </div>
              </div>
              <div className={this.state.EnterpriseQuickSetting.TakeOnlineOrder === 0 ? "res-status-inner-wrap  row-disable " : "res-status-inner-wrap"}>
                {this.state.EnterpriseQuickSetting.IsCardAccepted === 1 ? <div className="res-status-row row-disable">
                  <div className="status-overlay"></div>
                  <div className="res-status-title">
                    Card
      </div>
                  <div className="res-status-dropdown row-disable switch-toggle-wrap">
                    <AppSwitch name="chkCard" checked={this.state.EnterpriseQuickSetting.IsCardAccepted === 1 ? true : false} className={'mx-1'} variant={'3d'} color={'success'} label dataOn={'\u2713'} dataOff={'\u2715'} />


                    <ButtonDropdown isOpen={this.state.dropdownOpen4} toggle={this.toggle4} style={{ display: 'none' }}>
                      <DropdownToggle caret color="secondary" className="btn-on">
                        {this.state.tempQuickSetting.IsCardAcceptedText}
                      </DropdownToggle>
                      <DropdownMenu>
                        {
                          this.state.EnterpriseQuickSetting.IsCardAccepted === 1 ?
                            <DropdownItem onClick={(e) => this.changeValue(e, "IsCardAccepted")} value="0" >Off</DropdownItem>
                            : <DropdownItem onClick={(e) => this.changeValue(e, "IsCardAccepted")} value="1">On</DropdownItem>
                        }
                        {
                          this.state.hours_Days_Data.map((item, key) => {
                            return <DropdownItem key={key} value={item.value} onClick={(e) => this.changeValue(e, "IsCardAccepted")} >{item.text}</DropdownItem>
                          })}
                      </DropdownMenu>
                    </ButtonDropdown>
                  </div>
                </div> : ""}
                <div className="status-overlay"></div>
                <div className="res-status-row ">
                  <div className="res-status-title">
                    Cash on delivery
      </div>
                  <div className="res-status-dropdown switch-toggle-wrap">
                    <AppSwitch name="chkCash" onChange={(e) => this.changeToggleValue(e, e.target.checked)} checked={this.state.EnterpriseQuickSetting.IsCashAccepted === 1 ? true : false} className={'mx-1'} variant={'3d'} color={'success'} label dataOn={'\u2713'} dataOff={'\u2715'} />


                    <ButtonDropdown isOpen={this.state.dropdownOpen5} toggle={this.toggle5} style={{ display: 'none' }}>
                      <DropdownToggle caret color="secondary" className="btn-on">
                        {this.state.tempQuickSetting.IsCashAcceptedText}
                      </DropdownToggle>
                      <DropdownMenu>
                        {
                          this.state.EnterpriseQuickSetting.IsCashAccepted === 1 ?
                            <DropdownItem onClick={(e) => this.changeValue(e, "IsCashAccepted")} value="0" >Off</DropdownItem>
                            : <DropdownItem onClick={(e) => this.changeValue(e, "IsCashAccepted")} value="1">On</DropdownItem>
                        }
                        {
                          this.state.hours_Days_Data.map((item, key) => {
                            return <DropdownItem key={key} value={item.value} onClick={(e) => this.changeValue(e, "IsCashAccepted")} >{item.text}</DropdownItem>
                          })}

                      </DropdownMenu>
                    </ButtonDropdown>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>

            <Button color="secondary" onClick={this.TakeOnlineOrderModelShowHide}>Cancel</Button>
            <Button disabled={this.state.EnterpriseQuickSetting.OfflineTillSelectedValue === ""} color="success" onClick={() => { this.SaveUpdateQuickSetting() }}>Save</Button>
          </ModalFooter>
        </Modal>

      );
    } else {
      return (null)
    }
  }

  render() {


    let ShoplyUrl = "https://www.supershoply.com/App_Themes/theme-shoply/images/logo.png"
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;
    let AdminObject = JSON.parse(localStorage.getItem(Constants.Session.ADMIN_OBJECT))
    let parentObject = JSON.parse(localStorage.getItem(Constants.Session.PARENT_OBJECT))
    let Url = "/menu/build-menu"
    let loginUser = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT));
    if (loginUser.Enterprise.EnterpriseTypeId == 5 || loginUser.RoleLevel == Constants.Role.SYSTEM_ADMIN_ID || loginUser.RoleLevel == Constants.Role.SYSTEM_OPERATOR_ID
      || loginUser.RoleLevel == Constants.Role.FOORTAL_SUPPORT_ADMIN_ID || loginUser.RoleLevel == Constants.Role.FOORTAL_SUPPORT_USER_ID
      || loginUser.RoleLevel == Constants.Role.RESELLER_ADMIN_ID || loginUser.RoleLevel == Constants.Role.RESELLER_MODERATOR_ID  ){
      Url = loginUser.Enterprise.EnterpriseTypeId == 5 ? '/dashboard' : '/businesses';
    } else if(loginUser.Enterprise.EnterpriseTypeId == 15){
      Url = loginUser.RoleLevel == Constants.Role.STAFF_ID || loginUser.Enterprise.TotalComplaints > 0 ? "/active-requests": "/support-types";

    }

    return (
      <React.Fragment>
        {/* <ToastContainer /> */}
         <div className="morph-modal-wrapper">
        {/* <button
          id="pop-up-btn"
          ref={this.buttonRef}
          onClick={this.openPopUp}
        >
          Open Pop Up
        </button> */}

        <div id="pop-up" ref={this.popUpRef}>
          <div className="content-wrap" ref={this.contentRef}>
            <div className="icon-close mb-3">
                <h5 class="modal-title">Action Required</h5>
              <div className='p-2' onClick={this.closePopUp}>
               <FiX className='font-20'  />
               </div>
               </div>
               <p className='text-left' style={{maxWidth:"400px", color:"#fff"}}>You have new orders, new chats, and new requests that require your immediate attention.</p>
              <div className='content-wrap-inner'>
                { loginUser.Enterprise.EnterpriseTypeId !== Constants.ENTERPRISE_TYPE_IDS.ROOM_SUPPORT && loginUser.Enterprise.EnterpriseTypeId !== Constants.ENTERPRISE_TYPE_IDS.CONCIERGE_CHAT &&
                <div onClick={(e) => this.redirectToOrder(e)} className='content-s-wrap-p'>
                 <div className={`${this.state.headerCount.Orders > 0 && "horizontal-shake"} content-s-wrap`}>
                 <IoReceiptOutline />
                 <span className='morph-count'>{this.state.headerCount.Orders}</span>
                  <span className='morph-status'>New Orders</span>
                </div>
                <button className='golden-btn' ><span className='resp-text-h'> View </span> <FiArrowRight className='font-20 ml-3' /></button>
                </div>

                }


                { loginUser.RoleLevel !== Constants.Role.MARKETING_ADMIN_ID &&
                  loginUser.Enterprise.EnterpriseTypeId != Constants.ENTERPRISE_TYPE_IDS.ROOM_SUPPORT &&
                  loginUser.EnterpriseRestaurant.RestaurantSettings.HasSupportChat &&
                <div className='content-s-wrap-p' >
                  <Link to="/order-support" onClick={() => this.closePopUp()} >
                 <div className={`${this.state.headerCount.Chats > 0 && "horizontal-shake"} content-s-wrap `}>
                 <i class="fa fa-commenting-o" aria-hidden="true"></i>
                 <span className='morph-count'>{this.state.headerCount.Chats}</span>
                  <span className='morph-status'>New Chats</span>
                </div>
                  <button className='golden-btn' ><span className='resp-text-h'> View </span><FiArrowRight className='font-20 ml-3' /></button>
                </Link>
                </div>

                }

                {((loginUser.RoleLevel == Constants.Role.ENTERPRISE_ADMIN_ID || loginUser.RoleLevel == Constants.Role.ENTERPRISE_MANAGER_ID || loginUser.RoleLevel == Constants.Role.STAFF_ID) && (loginUser.Enterprise.EnterpriseTypeId == Constants.ENTERPRISE_TYPE_IDS.HOTEL && Utilities.isExistInCsv(Constants.ENTERPRISE_TYPE_IDS.ROOM_SUPPORT, loginUser.EnterpriseRestaurant.ChildTypeIDCsv + ",", ',') || loginUser.Enterprise.EnterpriseTypeId == Constants.ENTERPRISE_TYPE_IDS.ROOM_SUPPORT)) &&
                  <div className='content-s-wrap-p '>
                    <Link to="/active-requests" onClick={() => {this.setHeaderCountData(); this.closePopUp()}} >
                 <div className={`${this.state.headerCount.Requests > 0 && "horizontal-shake"} content-s-wrap `}>
               <svgIcon.Requestlock  />
                 <span className='morph-count'>{this.state.headerCount.Requests}</span>
                  <span className='morph-status'>New Requests</span>
                </div>
                <button className='golden-btn'><span className='resp-text-h'> View </span> <FiArrowRight className='font-20 ml-3' /></button>
              </Link>
              </div>

            }
              </div>
              <hr style={{borderColor:"#b8b7b7"}} />
              <div className='snooze-p-wrap'>
                <h5 class="modal-title">Snooze the popup</h5>
                               <ButtonDropdown className='order-snooze-dropdown'  isOpen={this.state.snozeDropdown} toggle={()=>this.toggleSnoozeDropdown()} >
                                     <DropdownToggle caret color="secondary" className="btn-on" style={{minWidth:"130px"}} >
                                       {this.state.timeString == "" ? "Snooze for" : `${this.state.timeString}`}
                                     </DropdownToggle>
                                     <DropdownMenu>

                                         <DropdownItem onClick={(e) => this.handleSnooze(300,'Snooze for 5 mins')}>5 mins</DropdownItem>
                                         <DropdownItem onClick={(e) => this.handleSnooze(600,'Snooze for 10 mins')}>10 mins</DropdownItem>
                                         <DropdownItem onClick={(e) => this.handleSnooze(900,'Snooze for 15 mins')}>15 mins</DropdownItem>
                                         <DropdownItem onClick={(e) => this.handleSnooze(1800,'Snooze for 30 mins')}>30 mins</DropdownItem>
                                         <DropdownItem onClick={(e) => this.handleSnooze(3600,'Snooze for 1 hour')}>1 hour</DropdownItem>
                                         <DropdownItem onClick={(e) => this.handleSnooze(7200,'Snooze for 2 hours')}>2 hours</DropdownItem>
                                     </DropdownMenu>
                                   </ButtonDropdown>
                                   </div>
           <div>

           </div>
          </div>
        </div>

        <div id="pop-up-bg" ref={this.bgRef} className=""></div>
      </div>
        <div  className={GlobalData.restaurants_data.Supermeal_dev.Platform == "core"?"headerMain core-header":"headerMain shoply-header"}>



          <Modal isOpen={this.state.modalpublshshow} toggle={this.PublishedUnPublishedModal} className={this.props.className}>
            <ModalHeader toggle={this.PublishedUnPublishedModal}>Publish Menu</ModalHeader>
            <ModalBody>
              <p> Your menu has been modified. Do you want to republish it? </p>
            </ModalBody>
            <ModalFooter>
              {/* <Button color="primary" onClick={(e) => this.PublishedUnPublished()}>Publish</Button> */}

              <div className="bottomBtnsDiv" style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', marginRight: '10px' }}>

                <Button color="secondary" style={{ marginRight: 10 }} onClick={() => this.PublishedUnPublishedModal()}>Cancel</Button>
                {/* <Button color="success" >Save</Button> */}
                <Button onClick={(e) => this.PublishedUnPublished()} color="success" className="btn waves-effect waves-light btn-success pull-right">
                  {this.state.IsSaving ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                    : <span className="comment-text">Publish</span>}
                </Button>
              </div>

            </ModalFooter>
          </Modal>
          <div className="headerLogoTogglerDiv">
            <AppSidebarToggler className="d-md-down-none toggleButtonMain d-lg-none" display="lg" />
            {/* <AppSidebarToggler className="d-lg-none" display="md" mobile /> */}
            <button onClick={() => this.props.handleToggleSidebarRes()} type="button" className="d-lg-none navbar-toggler" data-sidebar-toggler="true"><span className="navbar-toggler-icon"></span></button>

                <a href={Url} className= "core-logo m-l-15  m-r-15">
                  {this.state.DarkMode ? (
                <img src={Utilities.generatePhotoURL('/images/superbuter-logo-whiteicon-ai.png')} alt="Dark Logo" />
              ) : (
                <img src={Utilities.generatePhotoURL('/images/logo-horizontal.png')} alt="Light Logo" />
              )}
                </a>

            <div className="headerInfoDiv" id="pop-up-btn" ref={this.buttonRef}>
            {/* {loginUser.Enterprise.EnterpriseTypeId != 15 && window.location.pathname.indexOf("/orders/allorders") === -1 && loginUser.RoleLevel !== Constants.Role.MARKETING_ADMIN_ID ?  */}
{/* <> */}
{loginUser.Enterprise.EnterpriseTypeId !== Constants.ENTERPRISE_TYPE_IDS.ROOM_SUPPORT && loginUser.Enterprise.EnterpriseTypeId !== Constants.ENTERPRISE_TYPE_IDS.CONCIERGE_CHAT &&
          <div className='d-flex flex-column'>
          <div onClick={(e) => this.redirectToOrder(e)} className={`${this.state.headerCount.Orders > 0 && "horizontal-shake"} btn m-l-15 m-r-15 font-16 btn-success live-order-btn o-support-nav ${ window.location.pathname.indexOf("/orders/allorders") === -1 && loginUser.RoleLevel !== Constants.Role.MARKETING_ADMIN_ID ? "" : "active" }`}>
          {/* <div className={`btn m-l-15 m-r-15 font-16 btn-success live-order-btn o-support-nav ${ window.location.pathname.indexOf("/orders/allorders") === -1 && loginUser.RoleLevel !== Constants.Role.MARKETING_ADMIN_ID ? "" : "active" }`}> */}

           {/* <span className="heartbit-wrap">
                        <span>
                         <i className="fa fa-wifi  font-16  onlyIcon" aria-hidden="true"></i>
                        </span>
                        <span className="heartbit"></span>
                        </span> */}

                        <div className='web-filled-c'>
                        <IoReceiptOutline />
                        </div>
                          <div className='pro-item-content'>
                      <span className='d-none d-sm-flex mx-2 pr-2'>Orders</span>
                     {this.state.headerCount.Orders > 0 &&  <span className='o-support-nav-count'>{this.state.headerCount.Orders}</span>}
                      </div>

   </div>
    <span className='resp-lab-h font-10 d-sm-none d-flex text-left'>Orders</span>
   </div>
  }

{
// window.location.pathname.indexOf("/order-support") === -1 &&
loginUser.RoleLevel !== Constants.Role.MARKETING_ADMIN_ID &&
loginUser.Enterprise.EnterpriseTypeId != Constants.ENTERPRISE_TYPE_IDS.ROOM_SUPPORT &&
loginUser.EnterpriseRestaurant.RestaurantSettings.HasSupportChat?
    <div className='d-flex flex-column'>
<a href='/order-support' className={`${this.state.headerCount.Chats > 0 && "horizontal-shake"} btn m-l-15  m-r-15 font-16 btn-success live-order-btn o-support-nav ${window.location.pathname.indexOf("/order-support") === -1 && loginUser.RoleLevel !== Constants.Role.MARKETING_ADMIN_ID && loginUser.Enterprise.EnterpriseTypeId != Constants.ENTERPRISE_TYPE_IDS.ROOM_SUPPORT && loginUser.EnterpriseRestaurant.RestaurantSettings.HasSupportChat? "" : "active" }`}>
<div className='web-filled-c'><i class="fa fa-commenting-o" aria-hidden="true"></i> </div>
   <div className='pro-item-content'>
                         <span className='d-flex align-items-center' style={{gap:5}}>  <span className='d-none d-sm-flex mx-2'> {Labels.Order_Support} </span>{this.state.newSupportChatNotification} {this.props.newSupportChatNotification}</span>
                         {this.state.headerCount.Chats > 0 &&  <span className='o-support-nav-count'>{this.state.headerCount.Chats}</span>}
                        </div>
      </a>
       <span className='resp-lab-h font-10 d-sm-none d-flex text-left'>Chats</span>

  </div>

  : "" }


{((loginUser.RoleLevel == Constants.Role.ENTERPRISE_ADMIN_ID || loginUser.RoleLevel == Constants.Role.ENTERPRISE_MANAGER_ID || loginUser.RoleLevel == Constants.Role.STAFF_ID) && (loginUser.Enterprise.EnterpriseTypeId == Constants.ENTERPRISE_TYPE_IDS.HOTEL && Utilities.isExistInCsv(Constants.ENTERPRISE_TYPE_IDS.ROOM_SUPPORT, loginUser.EnterpriseRestaurant.ChildTypeIDCsv + ",", ',') || loginUser.Enterprise.EnterpriseTypeId == Constants.ENTERPRISE_TYPE_IDS.ROOM_SUPPORT)) &&

    //  window.location.pathname.indexOf("/active-requests") === -1 &&
    <div className='d-flex flex-column'>
     <a href='/active-requests' onClick={() => this.setHeaderCountData()} className={`${this.state.headerCount.Requests > 0 && "horizontal-shake"} btn m-l-15  m-r-15 font-16 btn-success live-order-btn o-support-nav ${((loginUser.RoleLevel == Constants.Role.ENTERPRISE_ADMIN_ID || loginUser.RoleLevel == Constants.Role.ENTERPRISE_MANAGER_ID || loginUser.RoleLevel == Constants.Role.STAFF_ID) && (loginUser.Enterprise.EnterpriseTypeId == Constants.ENTERPRISE_TYPE_IDS.HOTEL && Utilities.isExistInCsv(Constants.ENTERPRISE_TYPE_IDS.ROOM_SUPPORT, loginUser.EnterpriseRestaurant.ChildTypeIDCsv + ",", ',') || loginUser.Enterprise.EnterpriseTypeId == Constants.ENTERPRISE_TYPE_IDS.ROOM_SUPPORT)) && window.location.pathname.indexOf("/active-requests") === -1 ? "" : "active"}`}>
      <div className='web-filled-c'> <svgIcon.Requestlock  /> </div>
                         <div className='pro-item-content'>
                         <span className='d-flex align-items-center' style={{gap:5}}>     <span className='d-none d-sm-flex mx-2'> Requests </span></span>

                         {this.state.headerCount.Requests > 0 && <span className='o-support-nav-count'>{this.state.headerCount.Requests}</span>}
                         </div>
      </a>
        <span className='resp-lab-h font-10 d-sm-none d-flex text-left'> Requests </span>
        </div>
  }
  {
    this.state.snoozed &&

   <div className='d-flex flex-column header-snooze-btn'>
     <a onClick={(e) => this.handleSnooze(0,'')} className='btn m-l-15  m-r-15 font-16 btn-success live-order-btn o-support-nav'>
      {/* <div className='web-filled-c'> <svgIcon.SnoozeOff  /> </div> */}
                         <div className='pro-item-content'>
                         <span className='d-flex align-items-center' style={{gap:5}}>     <span className='d-none d-sm-flex ml-2'> Snoozed </span> <FiX className='font-20 text-black'  /></span>
                         </div>
      </a>
        <span className='resp-lab-h font-10 d-sm-none d-flex text-left'> Snoozed </span>
        </div>
}
{/* <button onClick={() => this.openPopUp()}>openpop</button> */}


</div>
          </div>

          <div className="headerInfoDiv">
            {window.location.pathname.indexOf("/status") === -1 && (this.state.UserObject.RoleLevel === Constants.Role.ENTERPRISE_ADMIN_ID || this.state.UserObject.RoleLevel === Constants.Role.ENTERPRISE_MANAGER_ID) ? <div className={this.state.UserObject.RoleLevel === Constants.Role.ENTERPRISE_ADMIN_ID ? "" : "no-display"} id="menuPublishAlert" >

              { this.state.ShowQuickSetting && this.state.IsMenuModified ?

              (this.state.PublishStatus === 1 || this.state.PublishStatus === 2 ?
                <div className="font-16 btn button republish-btn m-r-15 float-btn-fixed">
       <span className="heartbit-wrap">
                        <span>
                         <i className="fa fa-exclamation-triangle  font-16 m-r-7 onlyIcon" aria-hidden="true"></i>
                        </span>
                        <span className="heartbit"></span>
                        </span>
                <span>Queued</span>
              </div> :
                    <div className="right-alert">
                    <button className="font-16 btn republish-btn m-r-15 float-btn-fixed" onClick={(e) => this.PublishedUnPublishedModal()}>
                      <span className="heartbit-wrap">
                        <span>
                         <i className="fa fa-exclamation-triangle  font-16 m-r-7 onlyIcon" aria-hidden="true"></i>
                        </span>
                        <span className="heartbit"></span>
                        </span>
                      <span> Republish Menu</span>
                    </button>
                  </div>
                )
                : ""
              }
            </div>
              // </div>
          : ""  }
            <div className="display-flex-imp align-items-center m-r-15">

              {loginUser.Enterprise.EnterpriseTypeId == 16 && this.state.ShowQuickSetting ?
                this.state.TakeOnlineOrder === 1 ?
                  <div className="text-center m-b-0 " title="You are currently online">
                    <Button onClick={this.TakeOnlineOrderModelShowHide} className="font-16  btn btn-success" >
                      <i className="fa fa-cog m-r-7 onlyIcon font-16" ></i>
                      <span className="statusSpan">Quick Settings</span>
                    </Button>
                  </div> :
                  <div className="text-center m-b-0 " title="You are currently offline">
                    <Button onClick={this.TakeOnlineOrderModelShowHide} className="font-16 btn btn-danger ">
                      <i className="fa fa-cog font-18 m-r-7 onlyIcon"></i>
                      <span className="statusSpan">Quick Settings</span>
                    </Button>
                  </div>
                : ""}
            </div>

            <div className='d-flex hide-on-mobile'>
              <div
                className="d-flex align-items-center justify-content-end mr-3"
                style={{ cursor: 'pointer' }}
                onClick={() => this.handleDarkToggle(!this.state.DarkMode)}
              >
                {this.state.DarkMode ? (
                  <MdOutlineLightMode size={28}  />
                ) : (
                  <IoMoonOutline size={28}  />
                )}
              </div>
        </div>
            {((loginUser.RoleLevel == Constants.Role.ENTERPRISE_ADMIN_ID && loginUser.Enterprise.EnterpriseTypeId == Constants.ENTERPRISE_TYPE_IDS.HOTEL && this.state.UserObject.EnterpriseRestaurant.RestaurantSettings.GuestPrivacy || (loginUser.RoleLevel == Constants.Role.SYSTEM_ADMIN_ID || loginUser.RoleLevel == Constants.Role.SYSTEM_OPERATOR_ID))) &&

     //  window.location.pathname.indexOf("/active-requests") === -1 &&
     <div className="d-flex align-items-center mr-4 hide-on-mobile" style={{gap:10}}>
     <Label check for="chkAllowActivitySms">{Labels.Guest_Privacy}</Label>

         <BootstrapSwitchButton
             checked={this.state.guestPrivacy}
             onChange={(event) => this.guestPrivacySwitchHandler(event)}
             onlabel='Activate'
             offlabel='Deactivate'
             size="xs"
             style="min-xs xs-toggle-btn"
             onstyle="primary"
         />


     </div>
   }
            <Nav navbar>
              <AppHeaderDropdown direction="down">
                <ButtonDropdown isOpen={this.state.dropdownOpen6} toggle={this.toggle6} >
                  <DropdownToggle nav className="m-r-20 d-flex align-items-center">

                    {

                                      !Utilities.stringIsEmpty(this.state.userPhotoName)  ?
                                      <div className='order-assign-u-m'>
                                                                    <img src= {Utilities.generatePhotoLargeURL(this.state.userPhotoName, true, false)}  className='assign-o-image' style={{width: 40}}/>

                                                                    </div>:
                  <Avatar className="header-avatar" name={this.state.displayName} round={true} size="40" textSizeRatio={1.75} />
                    }
                    <div className="ds-nametext">{Utilities.SpecialCharacterDecode(this.state.displayName)} <i className="fa fa-angle-down m-r-5"></i>
</div>
                  </DropdownToggle>
                  <DropdownMenu right style={{ right: 'auto' }}>

                    <DropdownItem onClick={e => this.props.onLogout(e)}><i className="fa fa-power-off m-r-10"></i>{parentObject !== null ? "Back to " + Utilities.SpecialCharacterDecode(parentObject.Enterprise.Name) : (AdminObject !== null ? "Back to Admin panel" : "Logout")}</DropdownItem>
                   { AdminObject === null && parentObject === null ?  <DropdownItem onClick={e => this.props.onChangePassword(e)}><i className="fa fa-key m-r-10"></i>{"Change Password"}</DropdownItem> : ""}
                   <div className='hide-on-web'>
                      <DropdownItem>
                         <span className="link-t-c m-b-0 w-100 font-14" style={{fontSize:14}}>
                        <div className="d-flex align-items-center w-100 justify-content-between" style={{ gap: 10 }}>
                          <Label check htmlFor="chkAllowActivitySms">
                            {/* {this.state.DarkMode ? 'Light Mode' : 'Dark Mode'} */}
                            Dark Mode
                          </Label>

                          <BootstrapSwitchButton
                            checked={this.state.DarkMode}
                            onlabel="Activate"
                            offlabel="Deactivate"
                            size="xs"
                            style="min-xs xs-toggle-btn"
                            onstyle="primary"
                            onChange={this.handleDarkToggle}
                          />
                        </div>
                         </span>

                      </DropdownItem>
                       {((loginUser.RoleLevel == Constants.Role.ENTERPRISE_ADMIN_ID && loginUser.Enterprise.EnterpriseTypeId == Constants.ENTERPRISE_TYPE_IDS.HOTEL && this.state.UserObject.EnterpriseRestaurant.RestaurantSettings.GuestPrivacy || (loginUser.RoleLevel == Constants.Role.SYSTEM_ADMIN_ID || loginUser.RoleLevel == Constants.Role.SYSTEM_OPERATOR_ID))) &&
                      <DropdownItem>
                        <span className="link-t-c m-b-0 w-100 font-14" style={{fontSize:14}}>
                        <div className="d-flex align-items-center w-100 justify-content-between" style={{ gap: 10 }}>
                          <Label check for="chkAllowActivitySms">{Labels.Guest_Privacy}</Label>

                            <BootstrapSwitchButton
                              checked={this.state.guestPrivacy}
                              onChange={(event) => this.guestPrivacySwitchHandler(event)}
                              onlabel='Activate'
                              offlabel='Deactivate'
                              size="xs"
                              style="min-xs xs-toggle-btn"
                              onstyle="primary"
                            />


                        </div>
                         </span>

                      </DropdownItem>
                       }
                       </div>
                  </DropdownMenu>
                </ButtonDropdown>
              </AppHeaderDropdown>
            </Nav>
          </div>
        </div>
        {this.GenerateTakeOnlineOrderModel()}
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
