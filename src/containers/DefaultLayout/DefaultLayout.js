import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container,Button, Modal, ModalBody } from 'reactstrap';
import Loader from 'react-loader-spinner';
import Avatar from 'react-avatar';
import *as svgIcon from '../../containers/svgIcon';
import { IoReceiptOutline } from "react-icons/io5";
import Labels from '../language/labels';
import {
  AppAside,
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarNav,
} from '@coreui/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppNavbarBrand } from '@coreui/react';
import supermealLogo from '../../assets/img/brand/logo-admin.png'
import * as navigation from '../../_nav';
import routes from '../../routes';
import * as EnterpriseMenuService from '../../service/EnterpriseMenu';
import * as EnterpriseUserService from '../../service/EnterpriseUsers';
import * as EnterpriseService from '../../service/Enterprise';
import * as CountryService from '../../service/Country';
import * as AuthService from '../../service/Auth';
import * as UserService from '../../service/User';
import * as Utilities from '../../helpers/Utilities';
import Constants from '../../helpers/Constants';
import Config from '../../helpers/Config';
import moment from 'moment';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";
import sound from '../../assets/sound/sound_clip.mp3'
import notificationSound from '../../assets/sound/chat_notification.mp3'
import * as deviceHelpher from '../../helpers/Devices';
import { data } from 'jquery';
import { BsChevronDoubleRight, BsChevronDoubleLeft } from "react-icons/bs";
import { BiSupport } from "react-icons/bi";
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import GlobalData, {parentCountryCode, firebaseVapidKey}  from '../../helpers/GlobalData';
import { config } from 'aws-sdk';
import { BiPieChartAlt2 } from "react-icons/bi";
import { FaRegBuilding } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import { MdOutlineContentCopy } from "react-icons/md";
import { LuArchive } from "react-icons/lu";
import { TbPercentage } from "react-icons/tb";
import showsound from '../../assets/sound/modal_sound_show.mp3'
import hidesound from '../../assets/sound/modal_sound_hide.mp3'
import {getHeaderCountExternal} from '../DefaultLayout/DefaultHeader';

var audio_show = new Audio(showsound);
var audio_hide = new Audio(hidesound);


var audio = new Audio(`${GlobalData.restaurants_data.Supermeal_dev.env_Configuration.CDN_URL + '/' + GlobalData.restaurants_data.Supermeal_dev.env_Configuration.ContentPath + "sound-clip.mp3"}`);
var notificationAudio = new Audio(notificationSound)
//const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));
var interval;

export var PlayNotificationSound;
export var PlayModalSound;
export var PlayOrStop;
export var Notify;
export var checkActiveTab;
export var reloadLogo;
export var orderSupportBubbleNotification;
export var requestBubbleNotification;
export var reloadDefaultLayout;
class DefaultLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      IsMenuModified: false,
      EnterpriseJson: {},
      PublishStatus: 0,
      HasPublished: true,
      UserObject: {},
      modalSessionExpire:false,
      IsSessionExpire: false,
      IsStopped: false,
      currentPage: "/login",
      collapsed: false,
      setCollapsed: false,
      activeTab: 'all-products',
      defaultOpen: '',
      width: window.innerWidth,
      Showlogo: true,
      ordersupportbubbleNotification: false,
      newRequestSupportNotification: false,
      newRequestNotification: false,
      hasEnterpriseImpersonatePermission: false,
    }
    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.REQUEST_NOTIFICATION))) {
      this.state.newRequestNotification = true;
    }
    audio = new Audio(`${GlobalData.restaurants_data.Supermeal_dev.env_Configuration.CDN_URL + '/' + GlobalData.restaurants_data.Supermeal_dev.env_Configuration.ContentPath + "sound-clip.mp3"}`)

    var isRegisterd = localStorage.getItem("Registered");

    if(Utilities.stringIsEmpty(isRegisterd))
    {
      this.deviceRegistration()
    }
    
    this.state.collapsed = window.innerWidth > 998 ? JSON.parse(localStorage.getItem('sideBarState')) : !this.state.collapsed
    this.state.activeTab = this.props.location.pathname
    this.subMenuActive()
    

    var pathName = this.props.location.pathname.toLowerCase();
    var userObject = localStorage.getItem(Constants.Session.USER_OBJECT);
    if(!Utilities.stringIsEmpty(userObject) ) {
      let userObj = JSON.parse(userObject);
    this.state.hasEnterpriseImpersonatePermission = Utilities.HasPermission(userObj.RoleLevel, Constants.Permission.ENTERPRISE_ADMIN_IMPERSONATE) || Utilities.HasPermission(userObj.RoleLevel, Constants.Permission.ENTERPRISE_MANAGER_IMPERSONATE);

      this.state.UserObject = userObj;
      if(userObj.RoleLevel === Constants.Role.ENTERPRISE_ADMIN_ID || userObj.RoleLevel === Constants.Role.ENTERPRISE_MANAGER_ID || userObj.RoleLevel === Constants.Role.STAFF_ID){
      this.GetEnterpriseMenuJson();
      this.GetPublishStatus();
      }
     
    } else {
      Utilities.ClearSession();
      window.location.href = "/login"
    }


    if(pathName.indexOf('/active-requests') != -1)
    {
      localStorage.removeItem(Constants.REQUEST_NOTIFICATION);
    }


    if (isSupported()) {
        
  // this.audio =  new Audio(`${"https://cdn-superme-test.s3.eu-west-1.amazonaws.com/s/butler/sound-clip.mp3"}`)
  this.audio =  new Audio(`${GlobalData.restaurants_data.Supermeal_dev.env_Configuration.CDN_URL + '/' + GlobalData.restaurants_data.Supermeal_dev.env_Configuration.ContentPath + "sound-clip.mp3"}`)
  const messaging = getMessaging();
  onMessage(messaging, (payload) => {
    Notify(payload)
    if(payload.data.ActivityType == "OrderSupportNotification" && payload.data.Type == "1"){
      localStorage.setItem(Constants.ORDERSUPPORT_NOTIFICATION_BUBBLE, JSON.stringify(true))
      this.setState({ ordersupportbubbleNotification: true })
    }
    // ...
  });
  //  messaging.onMessage((payload) => {
  // Notification(payload);
  //  });
}
   


    if(this.state.UserObject.Enterprise.EnterpriseTypeId == 15 && (this.state.UserObject.RoleLevel == Constants.Role.ENTERPRISE_MANAGER_ID 
      || this.state.UserObject.RoleLevel == Constants.Role.STAFF_ID) && 
      (pathName.indexOf('/active-requests') == -1 && pathName.indexOf('/past-requests') == -1 && (pathName.indexOf('/support-types') == -1  )
      && pathName.indexOf('/all-users') == -1    
      ))
    {
      this.props.history.push(`${this.state.UserObject.RoleLevel === Constants.Role.STAFF_ID || this.state.UserObject.Enterprise.TotalComplaints > 0 ? "/active-requests": "/support-types"}`);
      
    }

    if(this.state.UserObject.Enterprise.EnterpriseTypeId != 15 && this.state.UserObject.RoleLevel == Constants.Role.STAFF_ID && 
      (pathName.indexOf('/orders/allorders') == -1) && (pathName.indexOf('/order-detail') == -1) && pathName.indexOf('/reviews')
      && (pathName.indexOf('/services') == -1) && pathName.indexOf('/active-requests') == -1 && pathName.indexOf('/past-requests') == -1 
      && (pathName.indexOf('/order-support') == -1) && (pathName.indexOf('/dashboard') == -1)) 
    {
      this.props.history.push('/orders/allorders');
    }

    if(this.state.UserObject.Enterprise.EnterpriseTypeId != 15 && this.state.UserObject.RoleLevel === Constants.Role.ENTERPRISE_MANAGER_ID 
      && (pathName.indexOf('/orders/allorders') == -1 && pathName.indexOf('/reviews') == -1 && pathName.indexOf('/invoices') == -1  && pathName.indexOf('/menu/status') === -1
      && pathName.indexOf('/settings/general') == -1 && pathName.indexOf('/settings/media') == -1 && pathName.indexOf('/settings/working-hours') == -1  
      && pathName.indexOf('/settings/delivery-hours') == -1 && pathName.indexOf('/settings/addresses') == -1 && pathName.indexOf('/settings/deliveryzones') == -1  
      && pathName.indexOf('/settings/businesssetting') == -1 && pathName.indexOf('/users/all-users') == -1
      && pathName.indexOf('/order-mode') == -1 && pathName.indexOf('/order-support') == -1 && pathName.indexOf('/services') == -1
      && pathName.indexOf('/sitesetting/colors-settings') == -1 && pathName.indexOf('/sitesetting/slider-setting') == -1  
      && pathName.indexOf('/menu/build-menu') == -1 && (pathName.indexOf('/dashboard') == -1) && pathName.indexOf('/past-requests') == -1 && pathName.indexOf('/active-requests') == -1 && pathName.indexOf('/menu/add-ons') == -1    
      && pathName.indexOf('/menu/options') === -1 && pathName.indexOf('/voucher') == -1  && pathName.indexOf('/order-detail') == -1))

    {
      this.props.history.push('/orders/allorders');
    }

    if(this.state.UserObject.Enterprise.EnterpriseTypeId != 15 && this.state.UserObject.RoleLevel === Constants.Role.MARKETING_ADMIN_ID 
      && (pathName.indexOf('/app-notification') === -1 ) && (pathName.indexOf('/new-notification') === -1 ) && (pathName.indexOf('/edit-notification') === -1 ))
    {
      this.props.history.push('/app-notification');
    }

    if (this.state.UserObject.Enterprise.EnterpriseTypeId != 15 && this.state.UserObject.RoleLevel === Constants.Role.ENTERPRISE_ADMIN_ID && (pathName.indexOf('/campaign/themes') != -1 
    || pathName.indexOf('/cuisines') != -1 || pathName.indexOf('/app-notification') != -1 
    || pathName.indexOf('/country-config') != -1 || pathName.indexOf('/group-voucher') != -1 
    || pathName.indexOf('/enterprise/subscription') != -1 || pathName.indexOf('/enterprise/view-vouchers') != -1 || pathName.indexOf('/enterprise/commission-setup') != -1 
    || pathName.indexOf('/reports/user-orders') != -1 || pathName.indexOf('/reports/sendreports') != -1
    || pathName.indexOf('/photo-gallery') != -1 || pathName.indexOf('/duplicate-menu') != -1  || pathName.indexOf('/edit-notification') != -1
    || pathName.indexOf('/campaign/edit') != -1 || pathName.indexOf('/new-notification') != -1 || pathName.indexOf('/enterprise/create-vouchers') != -1 
    || pathName.indexOf('/enterprise/bank-details') != -1  || pathName.indexOf('/enterprise/general-setup') != -1)) {
      
      if(this.state.UserObject.Enterprise.EnterpriseTypeId == 5 && pathName.indexOf('/enterprise/general-setup') == -1)
      {
        this.props.history.push(this.state.UserObject.Enterprise.EnterpriseTypeId == 5 ? '/dashboard' : '/businesses');

      } else if(pathName.indexOf('/enterprise/general-setup') != -1){

      }
      else
      {
      
      this.props.history.push('/menu/build-menu');
      }
    }
    
    this.PublishedUnPublished = this.PublishedUnPublished.bind(this)

  }


  // deviceRegistration = (EnterpriseId) => {
  //   try {
  //     var fcmToken = "";
  //     const messaging = firebase.messaging();
  //     messaging.requestPermission().then(function () {
  //        return messaging.getToken();
  //     }).then(function (token) {
  //      let deviceinfo = deviceHelpher.getDeviceInfo(token, EnterpriseId)
  //        deviceHelpher.saveDeviceInfo(deviceinfo)
  //     }).catch(function (err) {
  //       console.log('Unable to get permission to notify.', err);
  //     });

  //   }
  //   catch (e) {
  //     console.log("Exception deviceRegistration", e)
  //   }
  // }


  deviceRegistration = (EnterpriseId) => {
    try {

      if (isSupported()) {
      const messaging = getMessaging();
      Notification.requestPermission().then((permission)=>{
        if(permission == 'granted'){
          getToken(messaging, { vapidKey: firebaseVapidKey })
        .then((token) => {
            if (token) {
              let deviceinfo = deviceHelpher.getDeviceInfo(token, EnterpriseId)
              deviceHelpher.saveDeviceInfo(deviceinfo)
            } else {
              console.log('No registration token available. Request permission to generate one.');
            }
          }).catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
          });
            return
        }
        Notification.requestPermission()
        console.log('Notification Permission Denied.');
      })
    
        }
    }
    catch (e) {
      console.log("Exception deviceRegistration", e)
    }
  }


  Notify = Notify = async (payload) => { 
    console.log("payload", payload)
    var userObject = localStorage.getItem(Constants.Session.USER_OBJECT);
    let newOrder = Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.NEW_ORDER_LIST)) ? [] : JSON.parse(localStorage.getItem(Constants.Session.NEW_ORDER_LIST));
    let temp = payload;
    let title = temp.notification.body;
    let ActivityParameters = {};
    let message = Utilities.stringIsEmpty(temp.data.Message) ? title : temp.data.Message ;

    getHeaderCountExternal(true);
    
    if( temp.data.ActivityType == "MenuPublishNotification")
    {
      Utilities.notify(message,"s");
      return;
    }

    Utilities.notify(message,"s");
    if(temp.data.ActivityParameters){
      ActivityParameters = JSON.parse(temp.data.ActivityParameters);
    } else if(temp.data){
      ActivityParameters = temp.data
    }
    let userObj = {};
    if(!Utilities.stringIsEmpty(userObject) ) {
       userObj = JSON.parse(userObject);

    if ((userObj.Enterprise.EnterpriseTypeId == 15 || userObj.Enterprise.EnterpriseTypeId == 5) && temp.data.ActivityType == "ComplaintNotification") {
  
            userObj.Enterprise.TotalComplaints = temp.data.TotalComplaints
            localStorage.setItem(Constants.Session.USER_OBJECT, JSON.stringify(userObj))
            localStorage.setItem(Constants.REQUEST_NOTIFICATION, true);
         
            PlayNotificationSound();
          this.setState({UserObject: userObj, newRequestSupportNotification: true})
      } else {


    if(Object.keys(ActivityParameters).length > 0 && Number(ActivityParameters.OrderStatus) == 0 && window.location.pathname.indexOf("reports/orders") == -1) {
      newOrder.push(ActivityParameters.OrderId);
      localStorage.setItem(Constants.Session.NEW_ORDER_LIST,  JSON.stringify(newOrder));
      PlayOrStop(false);
      this.audio = new Audio(sound);
      PlayOrStop(true);

      // Extract token from notification
      const orderToken = payload.data?.OrderToken;
      EnterpriseService.sendPrintRequest(orderToken, "");
      
    } else if(Object.keys(ActivityParameters).length > 0 && Number(ActivityParameters.OrderStatus) !== 0){

        if(newOrder.indexOf(ActivityParameters.OrderId) !== -1){
          newOrder.splice(newOrder.indexOf(ActivityParameters.OrderId),1);
          localStorage.setItem(Constants.Session.NEW_ORDER_LIST,  JSON.stringify(newOrder));
        }
    }

    if(newOrder.length === 0){
      PlayOrStop(false);
    }

    navigator.serviceWorker.getRegistration('/firebase-cloud-messaging-push-scope').then(registration => {
      registration.showNotification(
        temp.notification.title,
        temp.notification
      )
  });
      }
    }

  }

  reloadDefaultLayout = reloadDefaultLayout = () =>{
    this.setState({})
  }

  PlayOrStop = PlayOrStop = async (play) => { 
   
    if(play) {
    this.audio.pause();  
    this.audio.play();
    this.audio.loop = true;
    } else {
      this.audio.pause();  
    }

  }

  PlayNotificationSound = PlayNotificationSound = async () => { 
  
      notificationAudio.pause();  
      notificationAudio.play();
  
  }

  PlayModalSound = PlayModalSound = async (isOpen) => { 
  
    if(isOpen)
      audio_show.play();
    else 
      audio_hide.play();
  
  }

  reloadLogo = reloadLogo = async (photoName) => { 
   
    this.setState({Showlogo: false},() => {
      this.state.UserObject.Enterprise.PhotoName = photoName;
      setTimeout(() => {
        this.setState({Showlogo: true});
    }, 100)

    }) 

    
  }

  Impersonate = async (enterpriseId, enterpriseName) => {

    this.setState({ ImpersonateId: enterpriseId });
    localStorage.setItem(Constants.Session.ENTERPRISE_ID, enterpriseId);
    localStorage.setItem(Constants.Session.ENTERPRISE_NAME, enterpriseName);
    localStorage.removeItem(Constants.Session.PRIVACY_SWITCH)
    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.ENTERPRISE_ID))) {

      let allEnterpriseUsers = await EnterpriseUserService.GetAll(Number(enterpriseId));

      if (allEnterpriseUsers.length === 0) {
        this.setState({ ImpersonateId: 0 })
        return;
      }

      let enterpriseUsers = allEnterpriseUsers.filter(user => {
        return (user.RoleLevel === Constants.Role.ENTERPRISE_ADMIN_ID) && !user.IsDeleted && user.IsActive
      });
      if(this.state.UserObject.RoleLevel == Constants.Role.STAFF_ID){
        enterpriseUsers = allEnterpriseUsers.filter(user => {
          return (user.RoleLevel === Constants.Role.STAFF_ID) && !user.IsDeleted && user.IsActive
        });
      }
      let enterpriseUser = enterpriseUsers[0];
      let loginUser = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT));

      localStorage.setItem(loginUser.RoleLevel === Constants.Role.ENTERPRISE_ADMIN_ID && loginUser.RoleLevel !== Constants.Role.ENTERPRISE_MANAGER_ID ? Constants.Session.PARENT_OBJECT : Constants.Session.ADMIN_OBJECT, JSON.stringify(loginUser));

      let membershipUser = await UserService.GetByMembershipId(enterpriseUser.MembershipUserId);
      membershipUser.Impersonator = enterpriseUser.MembershipUserId;
      membershipUser.RoleLevel = Utilities.HasPermission(loginUser.RoleLevel, Constants.Permission.ENTERPRISE_MANAGER_IMPERSONATE) ? Constants.Role.ENTERPRISE_MANAGER_ID : membershipUser.RoleLevel;
      localStorage.setItem(Constants.Session.IMPERSONATORID, enterpriseUser.MembershipUserId);
      if (localStorage.getItem(Constants.Session.PARENTIMPERSONATORID) === null) {
        localStorage.setItem(Constants.Session.PARENTIMPERSONATORID, enterpriseUser.MembershipUserId);
      }
      localStorage.setItem(Constants.Session.USER_OBJECT, JSON.stringify(membershipUser));
      localStorage.setItem(Constants.Session.ENTERPRISE_TYPE_ID, membershipUser.Enterprise.EnterpriseTypeId);
      let json = await EnterpriseMenuService.GetEnterpriseJson();
      let countyObj = await CountryService.getCountry(membershipUser.EnterpriseRestaurant.CountryId);
      localStorage.setItem(Constants.Session.COUNTRY_CONFIGURATION, JSON.stringify(countyObj))

      if (membershipUser.Enterprise.EnterpriseTypeId == 5) {
        window.location.href = "/dashboard";
      } else if (membershipUser.Enterprise.EnterpriseTypeId == 15) {
        window.location.href = "/support";
      }

      else {

        window.location.href = "/menu/build-menu";
      }

    }
  }


  GetEnterpriseMenuJson = async () => {

    let json = await EnterpriseMenuService.GetEnterpriseJson()
    if (json !== null && json !== undefined) {
      var siteUrl = "";
      if (!Utilities.stringIsEmpty(json.InfoJson)) {
        localStorage.setItem(Constants.Session.ENTERPRISE_INFO_JSON, json.InfoJson)
        siteUrl = JSON.parse(json.InfoJson).Restaurant.SiteUrl;
      }

      // UpdateHeader(siteUrl);
      localStorage.setItem(Constants.Session.SITE_URL, siteUrl)
      this.GetPublishStatus();
      if (this.state.IsMenuModified !== json.IsMenuModified) {
        this.setState({ EnterpriseJson: json, IsMenuModified: json.IsMenuModified })
      }
    }
  }


  componentDidMount() {

    try {

       if(!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.SESSION_START_AT)) && Utilities.stringIsEmpty(localStorage.getItem(Constants.MEMBERSHIP_ID))) {
        interval = setInterval(() => { this.CheckSessionExpiry(); }, 100);
      }
      const orderSupportbubble = JSON.parse(localStorage.getItem(Constants.ORDERSUPPORT_NOTIFICATION_BUBBLE))
      this.setState({ ordersupportbubbleNotification: orderSupportbubble })
    } catch (e) {
      console.log(e);
    }
  }

  orderSupportNotificationBubbleFalse = () => {
    localStorage.setItem(Constants.ORDERSUPPORT_NOTIFICATION_BUBBLE, JSON.stringify(false))
    this.setState({ ordersupportbubbleNotification: false })
  }

  orderSupportBubbleNotification = orderSupportBubbleNotification = (payload) =>{
    if(payload.data.ActivityType == "OrderSupportNotification" && payload.data.Type == "1"){
      localStorage.setItem(Constants.ORDERSUPPORT_NOTIFICATION_BUBBLE, JSON.stringify(true))
      this.setState({ ordersupportbubbleNotification: true })
    }
  }
  requestBubbleNotification = requestBubbleNotification = () =>{
    localStorage.removeItem(Constants.REQUEST_NOTIFICATION);
      this.setState({ newRequestSupportNotification: false, newRequestNotification: false })
  }

  auth = async () => {
    let SessionStartTime = moment(new Date());
    localStorage.setItem(Constants.Session.SESSION_START_AT, SessionStartTime);
    let currentpage =  this.props.location.pathname;
    this.state.currentPage = currentpage
    window.history.pushState('Login', 'Login', '/login');
    await AuthService.getJWTToken();
}

  CheckSessionExpiry() {

    var startAt = localStorage.getItem(Constants.Session.SESSION_START_AT);
    var membershipId= localStorage.getItem(Constants.MEMBERSHIP_ID);

    if(!Utilities.stringIsEmpty(startAt) && Utilities.stringIsEmpty(membershipId)) {

    let sessionStart = !Utilities.stringIsEmpty(startAt) ? moment(startAt) : "";
    let authId = localStorage.getItem(Constants.Session.AUTHENTICATION_TICKET);
    let sessionExpire = moment(new Date());
    let diff = sessionExpire.diff(sessionStart, 'hours');
    let isSessionExpire = !Utilities.stringIsEmpty(sessionStart) ? diff >= Config.Setting.SessionExpiry: true;
     
    if(isSessionExpire || Utilities.stringIsEmpty(startAt) || Utilities.stringIsEmpty(authId))
        {
            this.auth();
            //clearInterval(interval);
            this.ExpireSessionModal();
            sessionStorage.removeItem(Constants.Session.SELECTED_ORDER_QUERY);
          // localStorage.removeItem(Constants.Session.AUTHENTICATION_TICKET);
          // localStorage.removeItem(Constants.Session.ENTERPRISE_ID);
          // localStorage.removeItem(Constants.Session.IMPERSONATORID);
          return;
        } 
    }
  }

  
  ExpireSessionModal= () =>{
    
     if(!this.state.modalSessionExpire){
    this.setState({
      modalSessionExpire: !this.state.modalSessionExpire,
    })
   }
  }


  PublishedUnPublished() {
    let enterpriseJson = this.state.EnterpriseJson;
    this.setState({HasPublished : false});
    if (enterpriseJson !== undefined) {

      if (enterpriseJson.IsActive === true && enterpriseJson.IsMenuModified === false) {
        this.PublishedUnPublishedMenu(false);
        return;
      }

      this.PublishedUnPublishedMenu(true);
    }
  }

  PublishedUnPublishedMenu = async (isPublished) => {

    let message = await EnterpriseMenuService.PublishedUnPublishedMenu(isPublished);
    this.setState({HasPublished : true});
    if (message === '1') {
      this.setState({ IsMenuModified: false })
      Utilities.notify( (isPublished ? 'Menu changes are queued for publishing. Please check status in Menu Status screen.' : 'Menu has been successfully UnPublished.'), "s");
      this.GetEnterpriseMenuJson();
      return;

    }
    Utilities.notify(" Menu not successfully " + (isPublished ? 'RePublished.' : 'UnPublished.'), "e");

  }

  GetPublishStatus = async () => {
    let status = await EnterpriseMenuService.GetMenuStatus();
    if(this.state.PublishStatus !== status)
     this.setState({ PublishStatus: status });
  }



  loading = () => <div className="page-laoder">
    <div>
      <Loader
        type="Oval"
        color="#ed0000"
        height={50}
        width={50} />
      <div className="loading-label">Loading.....</div>
    </div>
  </div>

  async signOut(e) {
    e.preventDefault()
    localStorage.removeItem(Constants.Session.PRIVACY_SWITCH)
    if (Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.ADMIN_OBJECT)) && Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.PARENT_OBJECT))) {
      var response = await UserService.signOut();
      if (response != undefined && response.status == 200) {
        // Utilities.ClearSession();
        // window.location.href = "/Logout";
        this.props.history.push('/Logout');
      }
    } else {
      // window.location.href = "/Logout";
      this.props.history.push('/Logout');
    }
    
  }
   ChangePassword(e) {
    e.preventDefault()
    this.props.history.push('/change-password')
  }

  GoToLiveOrders(e) {
    e.preventDefault()
    var mID = localStorage.getItem(Constants.MEMBERSHIP_ID);
    if(Utilities.stringIsEmpty(mID)){
      this.props.history.push('/orders/allorders')
      this.checkActiveTab('/orders/allorders', true)
    }
    else {
      window.location.href = "/orders/allorders";
      // this.checkActiveTab('/orders/allorders', true)
    }
  }

  Republish(e) {

    this.props.history.push('/menu/status')
  }

  handleToggleSidebar = () => {
    this.setState({
      collapsed: !this.state.collapsed
    }, () => {
      localStorage.setItem('sideBarState', this.state.collapsed)
    })
    //  let Data= localStorage.getItem('sideBarState')
    // this.setState({ collapsed: Data })

  }
  handleToggleSidebarRes = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }
  handleCloseSidebarOnRes = () => {
    setTimeout(() => {
      this.setState({
        collapsed: true
      });
    }, 300);
    
    
  }

  checkActiveTab = checkActiveTab = (currentTab, click) => {
    if(click) this.setState({ activeTab: currentTab },()=>{
      if(window.innerWidth <= 998){
        this.handleCloseSidebarOnRes();
      }
    })
   return this.state.activeTab.indexOf(currentTab) != -1
  }

  subMenuActive = () =>{
    const { activeTab } = this.state;

    if((activeTab == "/sitesetting/colors-settings" || activeTab == "/sitesetting/slider-setting")){
      this.state.defaultOpen =  "themeAppearance"
    }
    if((activeTab == "/dashboard" || activeTab == "/reports/user-orders" || activeTab == "/reports/customersonmap" || activeTab == "/reports/SendReports")){
      this.state.defaultOpen =  "reports"
    }
    if((activeTab == "/menu/status" || activeTab == "/menu/build-menu" || activeTab == "/menu/add-ons" || activeTab == "/menu/options")){
      this.state.defaultOpen =  "buildMenu"
    }
    if((activeTab == "/settings/overview" || activeTab == "/settings/general" || activeTab == "/settings/media" || activeTab == "/settings/working-hours" || activeTab == "/settings/delivery-hours" || activeTab == "/settings/addresses" || activeTab == "/settings/deliveryzones" || activeTab == "/settings/businesssetting")){
      this.state.defaultOpen =  "settings"
    }
    if((activeTab == "/enterprise/general-setup" || activeTab == "/enterprise/general-settings" || activeTab == "/enterprise/addresses" || activeTab == "/enterprise/media" || activeTab == "/enterprise/commission-setup" || activeTab == "/enterprise/bank-details")){
      this.state.defaultOpen =  "generalSetup"
    }
    if((activeTab == "/active-requests" || activeTab == "/past-requests")){
      this.state.defaultOpen =  "request"
    }
    
  }

  GetEnterpriseIcon (type) {

    var icon = <svgIcon.RestaurantIcon/>;
  
    if (type == 12)
    icon =  <svgIcon.CarRentIcon/>;
    else  if (type == 10)
    icon =  <svgIcon.LaundryIcon/>;
    else  if (type == 14)
    icon =  <svgIcon.ExecutiveLoungeIcon/>;
    else  if (type == 11)
    icon =  <svgIcon.SpaIcon/>;
    else  if (type == 13)
    icon =  <svgIcon.TourPackageIcon/>;
    else  if (type == 18)
    icon =  <svgIcon.LuggageIcon/>;
    else  if (type == 4)
    icon =  <svgIcon.MiniBarIcon/>;
    else  if (type == 19)
    icon = <svgIcon.RestaurantIcon/>;

    return icon
  }

  render() {
    let userObject = this.state.UserObject;
    let enterpriseName = "";
    let parentName = ""
    let logo = "";
    let userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
    let UserRole = userObj.RoleLevel;

    if ((userObject !== null && Object.keys(userObject).length !== 0)) {
      enterpriseName = userObject.RoleLevel > 1 ? Utilities.SpecialCharacterDecode(userObject.Enterprise.Name) : "Admin"
      parentName = !Utilities.stringIsEmpty(userObject.Enterprise.ParentName) ? userObject.Enterprise.ParentName : "";
      logo = userObject.RoleLevel > 1 ? Utilities.generatePhotoLargeURL(userObject.Enterprise.PhotoName, true, false) : supermealLogo;
    } else {
      Utilities.ClearSession();
      window.location.href = "/login"
  }

    
    return (
      <div className="app">
     <ToastContainer />
        <AppHeader fixed>
          <Suspense fallback={this.loading()}>
            <DefaultHeader newRequestNotification={this.state.newRequestSupportNotification} newSupportChatNotification={this.state.ordersupportbubbleNotification} handleToggleSidebarRes={() => this.handleToggleSidebarRes()} onLogout={e => this.signOut(e)} onChangePassword={e => this.ChangePassword(e)} GoLiveOrder={e => this.GoToLiveOrders(e)} PathName={this.props.location.pathname.toLowerCase()} />
          </Suspense>
     
        </AppHeader>
        <div className={this.state.IsMenuModified && window.location.pathname.indexOf('/status') === -1 ? " app-body " : "app-body "} >
          
        <ProSidebar
            // active={true}
            // defaultValue={true}
            collapsed={this.state.collapsed}
            onToggle={() => this.handleToggleSidebar()}
          >
            <div className='menu-slide-new'>
              <span className={!!this.state.collapsed ? "aside-toggle justify-content-center" : "aside-toggle "} onClick={() => this.handleToggleSidebar()}>
                <button className='navbar-toggler'>
                  {!!this.state.collapsed ?
                    <BsChevronDoubleRight />
                    :
                    <BsChevronDoubleLeft />
                  }

                </button>


              </span>
            </div>
            { 
            
            this.state.Showlogo ?
            
            userObject.Enterprise.PhotoName!==''?
            <div className='d-flex side-bar-img-new'>
               <AppNavbarBrand className="round-image"
               // full={{ src:logo , width: 100, }}
                style={{  
                  backgroundImage: "url(" + logo + ")",
                  height:  this.state.collapsed ? '50px' :"70px", 
                  width:   this.state.collapsed ? '50px' :"70px",
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  float: 'left',
                  borderRadius: '50%',
                  border: '1px solid #d2d2d2',
                  margin: '20px auto',
                  backgroundRepeat: 'no-repeat',	
                }}
                id = "nav-header-image"
              /></div> :
           <Avatar className="header-avatar" style={{  margin: '20px auto',}} name={enterpriseName} round={true} size={this.state.collapsed ?"50":"70"} textSizeRatio={1.75} />
          : ""   
          }
             {!this.state.collapsed ?
              <div className="dropdown text-center px-2">
                  <a href="/" className=" u-dropdown font-16 font-weight-500 " style={{ color: '#d2d2d2' }} data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{enterpriseName}	</a>
                </div>
               : "" }
                <hr className="border-top" />
            <Menu iconShape="square">

            {userObj.Enterprise.EnterpriseTypeId == 19 ?
              <>
              {
                <MenuItem active={this.checkActiveTab("/menu/build-menu")} onClick={() => this.props.history.push("/menu/build-menu") + this.checkActiveTab("/menu/build-menu", true)} icon={this.GetEnterpriseIcon(userObj.Enterprise.EnterpriseTypeId)}>Products</MenuItem>
                
              }

              {
                 <MenuItem className='position-relative o-support-nav' active={this.checkActiveTab("/order-support")} onClick={() => this.props.history.push("/order-support") + this.checkActiveTab("/order-support", true) + this.orderSupportNotificationBubbleFalse()} icon={<i class="fa fa-commenting-o" aria-hidden="true"></i>}> {Labels.Order_Support} 
                 {
                   !!this.state.ordersupportbubbleNotification &&
                   <span className='o-support-nav-dot'></span>
                 }
               </MenuItem>
              }
              
              <MenuItem active={this.checkActiveTab("/concierge-commission")} onClick={() => this.props.history.push("/concierge-commission") + this.checkActiveTab("/concierge-commission", true)} icon={<TbPercentage style={{height: "16px"}} />}>Commission</MenuItem>
                
              {
                (((UserRole === Constants.Role.ENTERPRISE_ADMIN_ID) || (UserRole === Constants.Role.ENTERPRISE_MANAGER_ID))) &&
                <SubMenu title={'Settings'} defaultOpen={this.state.defaultOpen == "settings"} icon={<IoSettingsOutline  style={{height:"16px"}}/>}>
                  <MenuItem active={this.checkActiveTab("/settings/businesssetting")} onClick={() => this.props.history.push("/settings/businesssetting") + this.checkActiveTab("/settings/businesssetting", true)} >Business Settings</MenuItem>
                  {/* <MenuItem active={this.checkActiveTab("/users/all-users")} onClick={() => this.props.history.push("/users/all-users") + this.checkActiveTab("/users/all-users", true)} >Users</MenuItem> */}
              </SubMenu>
              }
              
              </>
            :

          <>


            {
               (Utilities.HasPermission(UserRole, Constants.Permission.ENTERPRISE_RESTAURANT_READ) && (userObj.Enterprise.IsParent || userObj.Enterprise.ParentId > 0 
                || UserRole == Constants.Role.SYSTEM_ADMIN_ID || UserRole == Constants.Role.SYSTEM_OPERATOR_ID || UserRole == Constants.Role.RESELLER_ADMIN_ID  
                || UserRole ==  Constants.Role.FOORTAL_SUPPORT_ADMIN_ID || UserRole ==  Constants.Role.RESELLER_ADMIN_ID || UserRole ==  Constants.Role.RESELLER_MODERATOR_ID || UserRole ==  Constants.Role.RESELLER_KEY_ACCOUNT_MANAGER_ID) 
                && (userObj.Enterprise.EnterpriseTypeId == 1 || userObj.Enterprise.EnterpriseTypeId == 2)) &&
                <MenuItem active={this.checkActiveTab("/businesses")} onClick={() => this.props.history.push("/businesses") + this.checkActiveTab("/businesses", true)} icon={<FaRegBuilding style={{height: "16px"}} />}>Businesses</MenuItem>
              }
            
            {UserRole != Constants.Role.SYSTEM_ADMIN_ID && UserRole != Constants.Role.SYSTEM_OPERATOR_ID && UserRole != Constants.Role.RESELLER_ADMIN_ID  
                && UserRole !=  Constants.Role.FOORTAL_SUPPORT_ADMIN_ID && UserRole !=  Constants.Role.RESELLER_ADMIN_ID 
                && UserRole !=  Constants.Role.RESELLER_MODERATOR_ID && UserRole !=  Constants.Role.RESELLER_KEY_ACCOUNT_MANAGER_ID &&
                userObj.Enterprise.EnterpriseTypeId != 1 && userObj.Enterprise.EnterpriseTypeId != 2 &&userObj.Enterprise.EnterpriseTypeId != 19 &&userObj.Enterprise.EnterpriseTypeId != 15 &&
              <MenuItem active={this.checkActiveTab("/dashboard")} onClick={() => this.props.history.push("/dashboard") + this.checkActiveTab("/dashboard", true)}  icon={<BiPieChartAlt2  style={{height: "16px"}}/>}>Dashboard</MenuItem>
            }

            {/* { (UserRole != Constants.Role.SYSTEM_ADMIN_ID && UserRole != Constants.Role.SYSTEM_OPERATOR_ID && UserRole != Constants.Role.RESELLER_ADMIN_ID  
                && UserRole !=  Constants.Role.FOORTAL_SUPPORT_ADMIN_ID && UserRole !=  Constants.Role.RESELLER_ADMIN_ID && UserRole !=  Constants.Role.RESELLER_MODERATOR_ID && UserRole !=  Constants.Role.RESELLER_KEY_ACCOUNT_MANAGER_ID) 
                && userObj.Enterprise.EnterpriseTypeId != 1 && userObj.Enterprise.EnterpriseTypeId != 2) &&
            
            } */}

            {
                (userObj.Enterprise.EnterpriseTypeId == 5 && Utilities.HasPermission(UserRole, Constants.Permission.ENTERPRISE_RESTAURANT_READ) 
                && (userObj.Enterprise.IsParent || userObj.Enterprise.ParentId > 0 || UserRole == Constants.Role.SYSTEM_ADMIN_ID || UserRole == Constants.Role.ENTERPRISE_ADMIN_ID
                 || UserRole == Constants.Role.SYSTEM_OPERATOR_ID || UserRole == Constants.Role.RESELLER_ADMIN_ID  || UserRole ==  Constants.Role.FOORTAL_SUPPORT_ADMIN_ID
                 || UserRole == Constants.Role.RESELLER_KEY_ACCOUNT_MANAGER_ID || UserRole == Constants.Role.RESELLER_MODERATOR_ID
                 )) &&
            <MenuItem active={this.checkActiveTab("/services")} onClick={() => this.props.history.push("/services") + this.checkActiveTab("/services", true)} icon={<FaRegBuilding style={{height: "16px"}} />}>Services</MenuItem>
            }


            {
               
                (Utilities.HasPermission(UserRole, Constants.Permission.ENTERPRISE_RESTAURANT_READ) 
                  && (UserRole == Constants.Role.SYSTEM_ADMIN_ID || UserRole == Constants.Role.SYSTEM_OPERATOR_ID 
                  || UserRole == Constants.Role.RESELLER_ADMIN_ID || UserRole == Constants.Role.RESELLER_MODERATOR_ID 
                  || UserRole ==  Constants.Role.FOORTAL_SUPPORT_ADMIN_ID) 
                  && Number(localStorage.getItem(Constants.Session.ENTERPRISE_ID)) != userObj.Enterprise.Id 
                  ) &&
               
               <SubMenu title={Utilities.SpecialCharacterDecode(localStorage.getItem(Constants.Session.ENTERPRISE_NAME))} defaultOpen={this.state.defaultOpen == "generalSetup"} icon={<i className='fa fa-building-o' />}>
                {
                  (Utilities.HasPermission(UserRole, Constants.Permission.ENTERPRISE_RESTAURANT_CREATE) && Number(localStorage.getItem(Constants.Session.ENTERPRISE_TYPE_ID)) != 15) &&
                  <MenuItem active={this.checkActiveTab("/enterprise/general-setup")} onClick={() => this.props.history.push("/enterprise/general-setup") + this.checkActiveTab("/enterprise/general-setup", true)}>General Setup</MenuItem>
                }
                {
                  (Utilities.HasPermission(UserRole, Constants.Permission.ENTERPRISE_RESTAURANT_CREATE) 
                  && (Number(localStorage.getItem(Constants.Session.ENTERPRISE_TYPE_ID)) == Constants.ENTERPRISE_TYPE_IDS.DINING
                  || (Number(localStorage.getItem(Constants.Session.ENTERPRISE_TYPE_ID)) == Constants.ENTERPRISE_TYPE_IDS.TABLE_BOOKING)
                  || (Number(localStorage.getItem(Constants.Session.ENTERPRISE_TYPE_ID)) == Constants.ENTERPRISE_TYPE_IDS.RESTAURANT) )) &&
                  <MenuItem active={this.checkActiveTab("/enterprise/general-settings")} onClick={() => this.props.history.push("/enterprise/general") + this.checkActiveTab("/enterprise/general-settings", true)}>General Settings</MenuItem>
                }

                {
                  (UserRole !=  Constants.Role.FOORTAL_SUPPORT_ADMIN_ID) &&
                  <MenuItem active={this.checkActiveTab("/enterprise/media")} onClick={() => this.props.history.push("/enterprise/media") + this.checkActiveTab("/enterprise/media", true)}>Media</MenuItem>
                }

                {
                  (UserRole !=  Constants.Role.FOORTAL_SUPPORT_ADMIN_ID) &&
                  <MenuItem onClick={() => this.Impersonate(Number(localStorage.getItem(Constants.Session.ENTERPRISE_ID)), localStorage.getItem("EnterpriseName"))}>Impersonate</MenuItem>
                }

              </SubMenu>
              }
              
              { 
               ((UserRole == Constants.Role.SYSTEM_ADMIN_ID || UserRole == Constants.Role.SYSTEM_OPERATOR_ID) || ((UserRole == Constants.Role.RESELLER_ADMIN_ID || UserRole == Constants.Role.RESELLER_MODERATOR_ID || UserRole == Constants.Role.RESELLER_KEY_ACCOUNT_MANAGER_ID) && 
               ((UserRole == Constants.Role.SYSTEM_ADMIN_ID || UserRole == Constants.Role.SYSTEM_OPERATOR_ID || UserRole == Constants.Role.RESELLER_ADMIN_ID || UserRole == Constants.Role.RESELLER_MODERATOR_ID)))) &&
                
                <>
                 <MenuItem active={this.checkActiveTab("/orders/allorders")} onClick={() => this.props.history.push("/orders/allorders") + this.checkActiveTab("/orders/allorders", true)} icon={<IoReceiptOutline  style={{width:15}}/>}>Orders</MenuItem>
                <MenuItem active={this.checkActiveTab("/users/all-users")} onClick={() => this.props.history.push("/users/all-users") + this.checkActiveTab("/users/all-users", true)} icon={<LuUsers style={{height:"16px"}} />}>Users</MenuItem>
                </>
              }


              { (UserRole == Constants.Role.SYSTEM_ADMIN_ID || UserRole == Constants.Role.SYSTEM_OPERATOR_ID)  &&
              
              <>
              {
                ( UserRole !== Constants.Role.ENTERPRISE_MANAGER_ID ) &&
                <MenuItem active={this.checkActiveTab("/duplicate-menu")} onClick={() => this.props.history.push("/duplicate-menu") + this.checkActiveTab("/duplicate-menu", true)} icon={<MdOutlineContentCopy style={{height:"16px"}} />}>Duplicate Menu</MenuItem>
              }
             

              <SubMenu title="Archived Pages" defaultOpen={this.state.defaultOpen == "Country-config"} icon={<LuArchive  style={{height:"16px"}}/>}>

              {
                ((UserRole == Constants.Role.SYSTEM_ADMIN_ID || UserRole == Constants.Role.SYSTEM_OPERATOR_ID) || ((UserRole == Constants.Role.RESELLER_ADMIN_ID || UserRole == Constants.Role.RESELLER_MODERATOR_ID) && (Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.ADMIN_OBJECT))))) &&
                <MenuItem active={this.checkActiveTab("/cuisines")} onClick={() => this.props.history.push("/cuisines") + this.checkActiveTab("/cuisines", true)} >Cuisines</MenuItem>
              }

              {
                (UserRole !== Constants.Role.ENTERPRISE_MANAGER_ID && (parentCountryCode == GlobalData.restaurants_data.Supermeal_dev.countryCode) ) &&
                <MenuItem active={this.checkActiveTab("/Country-config")} onClick={() => this.props.history.push("/Country-config") + this.checkActiveTab("/Country-config", true)} >Country Config</MenuItem>
              }
             
              {
                ((UserRole == Constants.Role.SYSTEM_ADMIN_ID || UserRole == Constants.Role.SYSTEM_OPERATOR_ID) || (((UserRole == Constants.Role.RESELLER_ADMIN_ID || UserRole == Constants.Role.RESELLER_MODERATOR_ID || UserRole == Constants.Role.RESELLER_KEY_ACCOUNT_MANAGER_ID)) && (UserRole == Constants.Role.SYSTEM_ADMIN_ID || UserRole == Constants.Role.SYSTEM_OPERATOR_ID))) &&
                <MenuItem active={this.checkActiveTab("/resellers")} onClick={() => this.props.history.push("/resellers") + this.checkActiveTab("/resellers", true)} >Resellers</MenuItem>
              }


          </SubMenu>



              </>
            }


            {userObj.Enterprise.EnterpriseTypeId != 15 &&  userObj.Enterprise.EnterpriseTypeId != 5 &&
                  <>
                
                {
                    (UserRole > Constants.Role.RESELLER_ADMIN_ID && UserRole != Constants.Role.STAFF_ID && UserRole != Constants.Role.RESELLER_MODERATOR_ID && UserRole != Constants.Role.RESELLER_KEY_ACCOUNT_MANAGER_ID && UserRole != Constants.Role.RESELLER_KEY_ACCOUNT_USER_ID  && (Utilities.HasPermission(UserRole, Constants.Permission.RESTAURANT_CATEGORY_READ) || Utilities.HasPermission(UserRole, Constants.Permission.RESTAURANT_ITEM_READ))) &&
                    <SubMenu title={Utilities.GetEnterpriseType(userObj.Enterprise.EnterpriseTypeId)} defaultOpen={this.state.defaultOpen == "buildMenu"} icon={this.GetEnterpriseIcon(userObj.Enterprise.EnterpriseTypeId)}>
                    {
                      (UserRole === Constants.Role.ENTERPRISE_ADMIN_ID || UserRole === Constants.Role.ENTERPRISE_MANAGER_ID || UserRole == Constants.Role.STAFF_ID) &&
                      <MenuItem active={this.checkActiveTab("/menu/build-menu")} onClick={() => this.props.history.push("/menu/build-menu") + this.checkActiveTab("/menu/build-menu", true)}>Products</MenuItem>
                    }
                  {
                    ((userObj.Enterprise.EnterpriseTypeId != Constants.ENTERPRISE_TYPE_IDS.HOTEL && userObj.Enterprise.EnterpriseTypeId != Constants.ENTERPRISE_TYPE_IDS.CONCIERGE_CHAT && userObj.Enterprise.EnterpriseTypeId != Constants.ENTERPRISE_TYPE_IDS.EXECUTIVE_LOUNGE)) &&
                    <>
                    {
                      <MenuItem active={this.checkActiveTab("/menu/add-ons")} onClick={() => this.props.history.push("/menu/add-ons") + this.checkActiveTab("/menu/add-ons", true)}>Add-ons</MenuItem>
                    }
                    {
                      <MenuItem active={this.checkActiveTab("/menu/options")} onClick={() => this.props.history.push("/menu/options") + this.checkActiveTab("/menu/options", true)}>Options</MenuItem>
                    }
                    </>
                  }
                    {
                      (UserRole === Constants.Role.ENTERPRISE_ADMIN_ID || (UserRole === Constants.Role.ENTERPRISE_MANAGER_ID || UserRole == Constants.Role.STAFF_ID)) &&
                      <MenuItem active={this.checkActiveTab("/menu/status")} onClick={() => this.props.history.push("/menu/status") + this.checkActiveTab("/menu/status", true)}>Status</MenuItem>
                    }
                  </SubMenu>
                  }
                  </>
            }
            
              {
                ((userObj.Enterprise.EnterpriseTypeId != 19 && userObj.Enterprise.EnterpriseTypeId != 15) && ((UserRole === Constants.Role.ENTERPRISE_ADMIN_ID) || (UserRole === Constants.Role.ENTERPRISE_MANAGER_ID) || (UserRole === Constants.Role.STAFF_ID))) &&
                <MenuItem active={this.checkActiveTab("/orders/allorders")} onClick={() => this.props.history.push("/orders/allorders") + this.checkActiveTab("/orders/allorders", true)} icon={<IoReceiptOutline  style={{width:15}}/>}>Orders</MenuItem>
              }


              {
                (((UserRole === Constants.Role.ENTERPRISE_ADMIN_ID) || (UserRole === Constants.Role.ENTERPRISE_MANAGER_ID) || (UserRole === Constants.Role.STAFF_ID) )) && userObj.Enterprise.EnterpriseTypeId != 15 && userObj.EnterpriseRestaurant.RestaurantSettings.HasSupportChat && 
                <MenuItem className='position-relative o-support-nav' active={this.checkActiveTab("/order-support")} onClick={() => this.props.history.push("/order-support") + this.checkActiveTab("/order-support", true) + this.orderSupportNotificationBubbleFalse()} icon={<i class="fa fa-commenting-o" aria-hidden="true"></i>}> {Labels.Order_Support} 
                  {
                    !!this.state.ordersupportbubbleNotification &&
                    <span className='o-support-nav-dot'></span>
                  }
                </MenuItem>
              }

              { (userObj.Enterprise.EnterpriseTypeId == Constants.ENTERPRISE_TYPE_IDS.ROOM_SUPPORT || userObj.Enterprise.EnterpriseTypeId == Constants.ENTERPRISE_TYPE_IDS.HOTEL) &&
              <>
              {
                ((UserRole == Constants.Role.ENTERPRISE_ADMIN_ID || UserRole == Constants.Role.ENTERPRISE_MANAGER_ID || UserRole == Constants.Role.STAFF_ID) && (userObj.Enterprise.EnterpriseTypeId == Constants.ENTERPRISE_TYPE_IDS.HOTEL && Utilities.isExistInCsv(Constants.ENTERPRISE_TYPE_IDS.ROOM_SUPPORT, userObj.EnterpriseRestaurant.ChildTypeIDCsv + ',', ',') || userObj.Enterprise.EnterpriseTypeId == Constants.ENTERPRISE_TYPE_IDS.ROOM_SUPPORT)) &&
                <SubMenu title={'Requests'} className='position-relative o-support-nav' defaultOpen={this.state.defaultOpen == "request"} icon={<svgIcon.Requestlock  style={{width:"15px"}} />}>
                  {
                    (this.state.newRequestSupportNotification || this.state.newRequestNotification) &&
                      <span className='o-support-nav-dot'></span>
                  }
                  {
                    ((UserRole == Constants.Role.ENTERPRISE_ADMIN_ID || UserRole == Constants.Role.ENTERPRISE_MANAGER_ID || UserRole == Constants.Role.STAFF_ID) && (userObj.Enterprise.EnterpriseTypeId == Constants.ENTERPRISE_TYPE_IDS.HOTEL && Utilities.isExistInCsv(Constants.ENTERPRISE_TYPE_IDS.ROOM_SUPPORT, userObj.EnterpriseRestaurant.ChildTypeIDCsv + ',', ',') || userObj.Enterprise.EnterpriseTypeId == Constants.ENTERPRISE_TYPE_IDS.ROOM_SUPPORT)) &&
                    <MenuItem className='position-relative o-support-nav' active={this.checkActiveTab("/active-requests")} onClick={() => this.props.history.push("/active-requests") + this.checkActiveTab("/active-requests", true)} >Active Requests
                      {
                         (this.state.newRequestSupportNotification || this.state.newRequestNotification) &&
                          <span className='o-support-nav-dot'></span>
                      }
                    </MenuItem>
                    
                  }
                  {
                    ((UserRole == Constants.Role.ENTERPRISE_ADMIN_ID || UserRole == Constants.Role.ENTERPRISE_MANAGER_ID || UserRole == Constants.Role.STAFF_ID) && (userObj.Enterprise.EnterpriseTypeId == Constants.ENTERPRISE_TYPE_IDS.HOTEL && Utilities.isExistInCsv(Constants.ENTERPRISE_TYPE_IDS.ROOM_SUPPORT, userObj.EnterpriseRestaurant.ChildTypeIDCsv + ',', ',') || userObj.Enterprise.EnterpriseTypeId == Constants.ENTERPRISE_TYPE_IDS.ROOM_SUPPORT)) &&
                    <MenuItem active={this.checkActiveTab("/past-requests")} onClick={() => this.props.history.push("/past-requests") + this.checkActiveTab("/past-requests", true)}>Past Requests</MenuItem>
                  }
                </SubMenu>
              }

              {/* {
                ((UserRole == Constants.Role.ENTERPRISE_ADMIN_ID || UserRole == Constants.Role.ENTERPRISE_MANAGER_ID || UserRole == Constants.Role.STAFF_ID) && (userObj.Enterprise.EnterpriseTypeId == Constants.ENTERPRISE_TYPE_IDS.HOTEL && Utilities.isExistInCsv(Constants.ENTERPRISE_TYPE_IDS.ROOM_SUPPORT, userObj.EnterpriseRestaurant.ChildTypeIDCsv + ',', ',') || userObj.Enterprise.EnterpriseTypeId == Constants.ENTERPRISE_TYPE_IDS.CONCIERGE_CHAT)) &&
                <SubMenu title={'Concierge'} className='position-relative o-support-nav' defaultOpen={this.state.defaultOpen == "request"} icon={<svgIcon.ConciergeIcon  style={{width:"15px"}} />}>
                    <MenuItem className='position-relative o-support-nav' active={this.checkActiveTab("/menu/build-menu")} onClick={() => this.props.history.push("/menu/build-menu") + this.checkActiveTab("/menu/build-menu", true)} >Product</MenuItem>
                    <MenuItem active={this.checkActiveTab("/concierge-commission")} onClick={() => this.props.history.push("/concierge-commission") + this.checkActiveTab("/concierge-commission", true)}>Commission</MenuItem>
                </SubMenu>
              } */}


            
              {
                (userObj.Enterprise.EnterpriseTypeId == Constants.ENTERPRISE_TYPE_IDS.ROOM_SUPPORT && UserRole != Constants.Role.STAFF_ID) &&
                <MenuItem active={this.checkActiveTab("/support-types")} onClick={() => this.props.history.push("/support-types") + this.checkActiveTab("/support-types", true)} icon={<i className='fa fa-support' />}>Support Types</MenuItem>
              }
              
              </>
            }
              {userObj.Enterprise.EnterpriseTypeId != 15 &&  userObj.Enterprise.EnterpriseTypeId != 5 &&
                <MenuItem active={this.checkActiveTab("/vouchers")} onClick={() => this.props.history.push("/vouchers") + this.checkActiveTab("/vouchers", true)} icon={<i className='fa fa-tag' />}>Voucher</MenuItem>
              }


              {
                ((UserRole === Constants.Role.ENTERPRISE_ADMIN_ID || UserRole === Constants.Role.ENTERPRISE_MANAGER_ID || UserRole === Constants.Role.STAFF_ID) && (Number(localStorage.getItem(Constants.Session.ENTERPRISE_TYPE_ID)) != 15)) &&
                <MenuItem active={this.checkActiveTab("/reviews")} onClick={() => this.props.history.push("/reviews") + this.checkActiveTab("/reviews", true)} icon={<i className='fa fa-star-half-empty' />}>Reviews</MenuItem>
              }
             

              {
                (userObj.Enterprise.EnterpriseTypeId == 5 && ((UserRole === Constants.Role.ENTERPRISE_ADMIN_ID) || (UserRole === Constants.Role.ENTERPRISE_MANAGER_ID))) &&
                <MenuItem active={this.checkActiveTab("/qr-pin")} onClick={() => this.props.history.push("/qr-pin") + this.checkActiveTab("/qr-pin", true)} icon={<i className='fa fa-qrcode' />}>QR PINs</MenuItem>
              }
              
              {
                (((UserRole == Constants.Role.ENTERPRISE_ADMIN_ID) || (UserRole == Constants.Role.ENTERPRISE_MANAGER_ID))) &&
                <SubMenu title={'Settings'} defaultOpen={this.state.defaultOpen == "settings"} icon={<IoSettingsOutline  style={{height:"16px"}}/>}>
                  <MenuItem active={this.checkActiveTab("/settings/businesssetting")} onClick={() => this.props.history.push("/settings/businesssetting") + this.checkActiveTab("/settings/businesssetting", true)}>Business Settings</MenuItem>
                  
                  { userObj.Enterprise.EnterpriseTypeId != 15 &&
                  <MenuItem active={this.checkActiveTab("/sitesetting/colors-settings")} onClick={() => this.props.history.push("/sitesetting/colors-settings") + this.checkActiveTab("/sitesetting/colors-settings", true)} >Theme and Color</MenuItem>
                  }
                  {
                (userObj.Enterprise.EnterpriseTypeId != 15 &&  userObj.Enterprise.EnterpriseTypeId != 5 && UserRole != Constants.Role.STAFF_ID) &&
                <MenuItem active={this.checkActiveTab("/order-mode")} onClick={() => this.props.history.push("/order-mode") + this.checkActiveTab("/order-mode", true)}>Order Modes</MenuItem>
                }

                  { userObj.Enterprise.EnterpriseTypeId != 15 &&
                  <MenuItem active={this.checkActiveTab("/sitesetting/slider-setting")} onClick={() => this.props.history.push("/sitesetting/slider-setting") + this.checkActiveTab("/sitesetting/slider-setting", true)}>Slider</MenuItem>
                  }
                  {
                
                ((
                    (UserRole === Constants.Role.SYSTEM_ADMIN_ID ||
                     UserRole === Constants.Role.SYSTEM_OPERATOR_ID ||
                     UserRole === Constants.Role.RESELLER_ADMIN_ID ||
                     UserRole === Constants.Role.RESELLER_MODERATOR_ID ||
                     UserRole === Constants.Role.RESELLER_KEY_ACCOUNT_MANAGER_ID)
                  ) 
                  
                   ||
                  ((
                    (userObj.Enterprise.EnterpriseTypeId === Constants.ENTERPRISE_TYPE_IDS.ROOM_SUPPORT || 
                     userObj.Enterprise.EnterpriseTypeId === 5) &&
                    (UserRole === Constants.Role.ENTERPRISE_ADMIN_ID || 
                     UserRole === Constants.Role.ENTERPRISE_MANAGER_ID)
                  ) ||
                    (
                      UserRole === Constants.Role.ENTERPRISE_ADMIN_ID ||
                      UserRole === Constants.Role.ENTERPRISE_MANAGER_ID
                    )))  &&

                <MenuItem active={this.checkActiveTab("/users/all-users")} onClick={() => this.props.history.push("/users/all-users") + this.checkActiveTab("/users/all-users", true)} >Users</MenuItem>
              }
              </SubMenu>
              }
</>
  }

            </Menu>
          </ProSidebar>
          {/* <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
              <AppSidebarNav>   
               
               { userObject.Enterprise.PhotoName!==''?
               <AppNavbarBrand className="round-image"
               // full={{ src:logo , width: 100, }}
                style={{  
                  backgroundImage: "url(" + logo + ")",
                  height: '80px',
                  width: '80px',
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  float: 'left',
                  borderRadius: '50%',
                  border: '1px solid #d2d2d2',
                  margin: '20px auto',
                  backgroundRepeat: 'no-repeat',	
                }}
              />:
           <Avatar className="header-avatar" style={{  margin: '20px auto',}} name={enterpriseName} round={true} size="80" textSizeRatio={1.75} />
             }
                <div className="dropdown text-center">
                  <a href="/" className=" u-dropdown font-16 font-weight-500 " style={{ color: '#d2d2d2' }} data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{enterpriseName}	</a>
                </div>
                <hr className="border-top" />
                <AppSidebarNav navConfig={navigation.SetNavigation()} {...this.props} />
              </AppSidebarNav>
            </Suspense>
            <AppSidebarFooter />
          </AppSidebar> */}
        <div className='overlay-sidebar-res' onClick={() => this.handleToggleSidebarRes()}></div>
          <main className="main">
            { /* <div className="warning_message">
          <div className="warning_message_sub_div">
            <p style={{marginBottom:0}}>Some message will be displayed here</p>
          </div>
          <div className="warning_message_sub_div" style={{display:'flex', justifyContent:'flex-end'}}>
            <button className="btn label-success">Publish Menu</button>
          </div>
        </div>
    */}

            <AppBreadcrumb appRoutes={routes} />
            <div className="container-wraper">
              <Container fluid>
                <Suspense fallback={this.loading()}>
                  <Switch>
                    {routes.map((route, idx) => {
                      return route.component ? (
                        <Route
                          key={idx}
                          path={route.path}
                          exact={route.exact}
                          name={route.name}
                          render={(props) => (
                            <route.component {...props} />
                          )} />
                      ) : (null);
                    })}
                    <Redirect from="/" to="/login" />
                  </Switch>
                </Suspense>
              </Container>
            </div>
          </main>
        
        </div>
        <AppFooter>
          <Suspense fallback={this.loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>

       <Modal isOpen={this.state.modalSessionExpire} backdrop={'static'} toggle={this.ExpireSessionModal}  className={this.props.className}>
        <ModalBody>
        <div className="disconnected-modal">
          <div className="cross-time"> <i className="fa fa-shield" aria-hidden="true"></i></div>
        <h2 >Login Session Expired</h2>
         <p>Your login session is expired due to no activity on the site.</p>
        {/* <Button onClick={(e) => Utilities.ClearSession()} color="success" className="btn waves-effect waves-light btn-success"> */}
        <Button onClick={(e) =>  window.location.href = this.state.currentPage} color="success" className="btn waves-effect waves-light btn-success">
        <span className="comment-text">LOG ME BACK IN</span>
        </Button>
        </div>
        </ModalBody>
 </Modal>




      </div>
    );
  }
}

export default DefaultLayout;
