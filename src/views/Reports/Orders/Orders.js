import React, { Component, Fragment } from 'react';
import * as Utilities from '../../../helpers/Utilities';
import Config from '../../../helpers/Config';
import Constants from '../../../helpers/Constants';
import * as EnterpriseOrderService from '../../../service/Orders';
import * as EnterpriseService from '../../../service/Enterprise';
import Loader from 'react-loader-spinner';
import sound from '../../../assets/sound/sound_clip.mp3'
import { Button, Badge, Modal, ModalBody, ModalFooter, ModalHeader, FormGroup } from 'reactstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import Iframe from 'react-iframe'
import ProgressBar from 'react-bootstrap/ProgressBar'
import {Notify, orderSupportBubbleNotification, PlayOrStop, reloadDefaultLayout } from '../../../containers/DefaultLayout/DefaultLayout';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getMessaging, onMessage, isSupported } from "firebase/messaging";
import Datepicker from "react-tailwindcss-datepicker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MUIDataTable from "mui-datatables";
import { MdOutlineBedroomChild } from "react-icons/md";
import { LuImage } from "react-icons/lu";
import Avatar from 'react-avatar';
import { IoCashOutline } from "react-icons/io5";
import { CiBank } from "react-icons/ci";
import { CiCreditCard1 } from "react-icons/ci";
import { Chart } from "react-google-charts";
import { AiOutlineGlobal } from "react-icons/ai";
import { BsCash } from "react-icons/bs";
import { CiCreditCard2 } from "react-icons/ci";
import *as svgIcon from '../../../containers/svgIcon';
import html2canvas from 'html2canvas';
import { BiSolidFilePng } from "react-icons/bi";
import { IoMdDownload } from "react-icons/io";
import { MdKeyboardArrowRight } from "react-icons/md";
import GoogleAnalytics from '../../Components/GoogleAnalytics';
import {getCurrencyConversion} from '../../../service/Country'
import currencyData from '../../../assets/all_countries_data.json';
import { FaCheck } from "react-icons/fa";
const $ = require("jquery");
const moment = require('moment-timezone');

const colors = ['#670066', '#7F007F', '#BE2AED', '#D996FE', '#EFBBFF', '#D996FE', '#BE2AED', '#7F007F', '#670066'];

var audio = new Audio(sound)
var interval;
var currencySymbol = "";
var timeZone = "";
$.DataTable = require("datatables.net");
class Orders extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.onPNGClick = this.onPNGClick.bind(this);
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
      AcceptedOrdersCount: 0,
      DeliveryOrderCount: 0,
      CollectionOrderCount: 0,
      EatInOrderCount: 0,
      BookingOrderCount: 0,
      AppsOrderCount: 0,
      WebOrderCount: 0,
      WhiteLableOrderCount: 0,
      HighValueOrderAmount: 0.00,
      LowValueOrderAmount: 0.00,
      CancelledOrderCount: 0,
      CardOrderCount: 0,
      CODOrderCount: 0,
      PostToRoomOrderCount: 0,
      BankTransferOrderCount: 0,
      COTOrderCount:0,
      CustomersCount: 0,
      RestaurantsCount: 0,
      NewCustomers: 0,
      OrdersPerDay: 0,
      ShowButtonLoader: false,
      countryConfigObj: {},
      pageLoader: true,
      value: {},
      data: [],
      sinceStartDate: new Date(),
      userObject: {},
      showDateRange: false,
      sortedColor: [],
      sortedListData: [],
      showDropdown: false,
      servicesSelection: false,
      isAllServicesSelected: true,
      childEnterprises:[],
      currentServices: "",
      chkAllServices: true,
      serviceSeleted: true,
      selectedService: [],
      selectedServiceIdCsv: "0",
      enterprises: [],
      topSellingItems: [],
      topRooms: [],
      serviceTypeData: [],
      selectedServiceList: [],
      selectedServiceNameCsv: "",
      hasOrders: false,
      hourlyData: [],
      weeklyData: [],
      dashboardReports: [],
      byQuantity: true,
      byOrder: true,
      hourlyDataByOrder: true,
      weeklyDataByOrder: true,
      ticks: [],
      dailyData: [],
      dailyDataByOrder: true,
      selectedRange: "1M", // Default range
      showNoDataMsg: false,
      availableRanges: [], // ✅ new
      viewType: 'Graph',
      sessionViewType: "Country",
      analyticsPropertyId: "0",
      analyticsData: {},
      showCurrencyModal: false,
      tempSelectedCountryObj : null,
      selectedCountryObj : null,
      currencies : [],
      allCurrencyData  : currencyData,
      searchText: '',
      defaultAnalyticsData: {
    "totalActiveUsers": 0, "totalNewUsers": 0,  "totalSessions": 0,  "totalPageViews": 0,  "averageBounceRate": 0, "averageSessionDuration": 0,
    "dailyTrend": [],
    "pages": [],
    "countries": [],
    "browsers": [],
    "devices": []
}

    }
    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.COUNTRY_CONFIGURATION))) {
      this.state.countryConfigObj = JSON.parse(localStorage.getItem(Constants.Session.COUNTRY_CONFIGURATION))
    }


    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
      let userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
      this.state.userObject = userObj;
      this.state.analyticsPropertyId = userObj.EnterpriseRestaurant.RestaurantSettings.AnalyticsPropertyId

      //setting session variables
    localStorage.setItem(Constants.Session.ENTERPRISE_ID, userObj.Enterprise.Id);
    localStorage.setItem(Constants.Session.ENTERPRISE_NAME, userObj.Enterprise.Name);
    localStorage.setItem(Constants.Session.ENTERPRISE_TYPE_ID, userObj.Enterprise.EnterpriseTypeId);
    reloadDefaultLayout();

      this.state.EnterpriseTypeId = userObj.Enterprise.EnterpriseTypeId;
      currencySymbol = Config.Setting.currencySymbol;

      if(userObj.Enterprise.FirstOrderDate != undefined)
        {
          this.state.sinceStartDate = userObj.Enterprise.FirstOrderDate;
        }

        timeZone = Config.Setting.timeZone;
        currencySymbol = Config.Setting.currencySymbol;

      if(userObj.EnterpriseRestaurant.Country != null) {
        timeZone = userObj.EnterpriseRestaurant.Country.TimeZone;
        currencySymbol = userObj.EnterpriseRestaurant.Country.CurrencySymbol;
      }
        this.state.StartDate =new Date(moment.tz(timeZone).subtract(7, 'days').calendar());
        this.state.EndDate =  new Date(moment.tz(timeZone).format("YYYY-MM-DD"));
        this.state.value = {startDate: this.state.StartDate,  endDate: this.state.EndDate}


    }
    // if(!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.SELECTED_REPORT_ORDER_STATUS))) {
    //     this.GetSelectedStatus();
    // }

    this.audio = new Audio(sound);

    this.GetOrdersByStatus = this.GetOrdersByStatus.bind(this);
    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
      this.state.userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
    }
    else {
      this.props.history.push('/login')
    }
  }

  findTotalAmountValue = (orders) => {


    if(orders.length == 0) return;

    // Find the order with the lowest TotalAmount
    const lowestOrder = orders.reduce((minOrder, currentOrder) => {
      const currentAmount = parseFloat(currentOrder.TotalAmount + currentOrder.DiscountedAmount);
      const minAmount = parseFloat(minOrder.TotalAmount + currentOrder.DiscountedAmount);

      return currentAmount < minAmount ? currentOrder : minOrder;
    });

    // Find the order with the highest TotalAmount
    const highestOrder = orders.reduce((maxOrder, currentOrder) => {
      const currentAmount = parseFloat(currentOrder.TotalAmount);
      const maxAmount = parseFloat(maxOrder.TotalAmount);

      return currentAmount > maxAmount ? currentOrder : maxOrder;
    });

    // Update the state with the lowest order
    this.setState({ LowValueOrderAmount: (Utilities.FormatCurrency(Number(lowestOrder.TotalAmount) + Number(lowestOrder.DiscountedAmount), this.state.countryConfigObj?.DecimalPlaces).replace(/,/gi, "")), HighValueOrderAmount: highestOrder.TotalAmount});
  }

    handleViewChange = (viewType) => {
    this.setState({ viewType });
  };

   handleSessionViewChange = (sessionViewType) => {
    this.setState({ sessionViewType });

  };

handleRangeChange = (range) => {
  const now = new Date();
  let start = new Date();

  switch (range) {
    case "1D":
      start.setDate(now.getDate() - 1);
      break;
    case "5D":
      start.setDate(now.getDate() - 5);
      break;
    case "1M":
      start.setMonth(now.getMonth() - 1);
      break;
    case "1Y":
      start.setFullYear(now.getFullYear() - 1);
      break;
    case "5Y":
      start.setFullYear(now.getFullYear() - 5);
      break;
    case "Max":
      start = new Date(moment(this.state.sinceStartDate));
      break;
    default:
      return;
  }

  // Set start time to 00:00:00 and end to 23:59:59
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const filteredOrders = this.state.EnterpriseOrders.filter(order => {
    const orderDate = new Date(order.OrderDate);
    return orderDate >= start && orderDate <= end;
  });

  this.setState({ selectedRange: range }, () => this.calculateDailyData(filteredOrders));
};

computeRangeAvailability = () => {
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  const enterpriseOrders = this.state.EnterpriseOrders || [];

  const ranges = {
    "1D": new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1),
    "5D": new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5),
    "1M": new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()),
    "1Y": new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),
    "5Y": new Date(now.getFullYear() - 5, now.getMonth(), now.getDate()),
    "Max": new Date(moment(this.state.sinceStartDate))
  };

  const availableRanges = [];

  Object.entries(ranges).forEach(([range, start]) => {
    start.setHours(0, 0, 0, 0);

    const hasData = enterpriseOrders.some(order => {
      const orderDate = new Date(order.OrderDate);
      return orderDate >= start && orderDate <= now;
    });

    if (hasData) availableRanges.push(range);
  });

  this.setState({ availableRanges });
};


  calculateDailyData1 = (data) => {
  const dailyMap = {};
  this.setState({ showNoDataMsg: false });
  data.forEach((order) => {
    const dateKey = moment(order.OrderDate).format("DD MMM YY");
    if (!dailyMap[dateKey]) dailyMap[dateKey] = 0;
    dailyMap[dateKey] += this.state.dailyDataByOrder ? 1 : parseFloat(order.TotalAmount || 0);
  });

  const sortedDates = Object.keys(dailyMap).sort();
  const formattedData = sortedDates.map((date) => [date, dailyMap[date]]);

if (formattedData.length === 0) {
  this.setState({
    dailyData: [],
    showNoDataMsg: true
  });
  return;
}

if (formattedData.length === 0) {
  this.setState({
    dailyData: [["Date", this.state.dailyDataByOrder ? "Orders" : "Amount"], [new Date(), 0]],
  });
  return;
}

  const header = ["Date", this.state.dailyDataByOrder ? "Orders" : "Amount"];
  this.setState({ dailyData: [header, ...formattedData] });
};


calculateDailyData = (data) => {
  const dailyMap = {};
  this.setState({ showNoDataMsg: false });

  // Populate dailyMap with order totals
  data.forEach((order) => {
    const dateKey = moment(order.OrderDate).format("DD MMM YY");
    if (!dailyMap[dateKey]) dailyMap[dateKey] = 0;
    dailyMap[dateKey] += this.state.dailyDataByOrder ? 1 : parseFloat(this.convertCurr(order.TotalAmount) || 0);
  });

  // Generate full date range from start to end date
  const startDate = new Date(this.state.StartDate);
  const endDate = new Date(this.state.EndDate);
  const allDates = [];

  while (startDate <= endDate) {
    const key = moment(startDate).format("DD MMM YY");
    allDates.push(key);
    startDate.setDate(startDate.getDate() + 1);
  }

  // Format chart data with 0 for missing dates
  const formattedData = allDates.map(date => [date, dailyMap[date] || 0]);

  if (formattedData.length === 0) {
    this.setState({
      dailyData: [],
      showNoDataMsg: true
    });
    return;
  }

  const header = ["Date", this.state.dailyDataByOrder ? "Orders" : "Amount"];
  this.setState({ dailyData: [header, ...formattedData] });
};

 calculateHourlyData = (data) => {
    const hoursMap = {};

    // Initialize hoursMap with all 24 hours
    const hours = Array.from({ length: 24 }, (_, i) =>
      new Date(0, 0, 0, i).toLocaleString("en-US", {
        hour: "numeric",
        hour12: true,
      })
    );
    hours.forEach((hour) => {
      hoursMap[hour] = 0; // Set initial count to 0
    });

    // Count orders by hour
    data.forEach((order) => {
      const date = new Date(order.OrderDate);
      const hour = date.toLocaleString("en-US", {
        hour: "numeric",
        hour12: true,
      });
      if (hoursMap[hour] !== undefined) {
        if(this.state.hourlyDataByOrder){
          hoursMap[hour]++;
        } else
        {
          hoursMap[hour] += parseFloat(this.convertCurr(order.TotalAmount) || 0); // Add TotalAmount
        }
      }
    });

    // Convert to an array suitable for rendering
    const formattedData = Object.entries(hoursMap).map(([hour, orders], index) => [
      hour, // Show hour text only for even hours
      orders,
    ]);


    this.setState({
      hourlyData: [["Hours", this.state.hourlyDataByOrder ? "Orders" : "Amount"], ...formattedData],
    });
  };

  // calculateWeeklyData = (data) => {
  //   const daysMap = {
  //     Sunday: 0,
  //     Monday: 0,
  //     Tuesday: 0,
  //     Wednesday: 0,
  //     Thursday: 0,
  //     Friday: 0,
  //     Saturday: 0,
  //   };

  //   // Count orders by day of the week
  //   data.forEach((order) => {
  //     const date = new Date(order.OrderDate);
  //     const dayName = date.toLocaleString("en-US", { weekday: "long" });
  //     if (daysMap[dayName] !== undefined) {

  //       if(this.state.weeklyDataByOrder){

  //         daysMap[dayName]++;
  //       } else
  //       {
  //         daysMap[dayName] += parseFloat(order.TotalAmount || 0); // Add TotalAmount
  //       }

  //     }
  //   });

  //   // Convert to an array suitable for rendering
  //   const formattedData = Object.entries(daysMap).map(([day, orders]) => [
  //     day,
  //     orders,
  //   ]);

  //   console.log("Weekly Data", formattedData);

  //   this.setState({
  //     weeklyData: [["Days", this.state.weeklyDataByOrder ? "Orders" : "Amount"], ...formattedData],
  //   });
  // };


// Service Selection Work Start


calculateWeeklyData = (data) => {
  const daysMap = {
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
    Sunday: 0,
  };

  // Count orders by day of the week
  data.forEach((order) => {
    const date = new Date(order.OrderDate);
    const dayName = date.toLocaleString("en-US", { weekday: "long" });
    if (daysMap[dayName] !== undefined) {
      if (this.state.weeklyDataByOrder) {
        daysMap[dayName]++;
      } else {
        //daysMap[dayName] += parseFloat(parseFloat(order.TotalAmount).toFixed(2) || 0); // Add TotalAmount
        daysMap[dayName] += parseFloat(this.convertCurr(order.TotalAmount) || 0); // Add TotalAmount
      }
    }
  });

    // Find the maximum value for the y-axis
    const maxValue = Math.max(...Object.values(daysMap));
    const minValue = Math.min(...Object.values(daysMap));

    if(maxValue > 0){

      // Generate dynamic ticks for y-axis
      var tickInterval = Math.ceil(maxValue / 5); // Divide the range into 5 parts
      if(tickInterval == 1) tickInterval++;
      const ticks = [];
      for (let i = 0; i <= maxValue + tickInterval + 2 ; i += tickInterval) {
        ticks.push(i);
      }

      this.setState({ticks: ticks});
    }

  // Convert to an array suitable for rendering with annotations
  const formattedData = Object.entries(daysMap).map(([day, value]) => [
    day,
    value,
    //value > 0 ? `${this.state.weeklyDataByOrder ? value + "" : this.state.selectedCountryObj?.currencySymbol || currencySymbol+ parseFloat(value).toFixed(2)}` : null, // Add annotation text
   // value > 0 ? `${this.state.weeklyDataByOrder ? value + "" : this.state.selectedCountryObj?.currencySymbol || currencySymbol+ this.convertCurr(value)}` : null, // Add annotation text
   value > 0
  ? this.state.weeklyDataByOrder
    ? `${value}`
    : `${this.state.selectedCountryObj?.currencySymbol || currencySymbol}${parseFloat(value).toFixed(2)}`
  : null
  ]);


  this.setState({
    weeklyData: [
      ["Days", this.state.weeklyDataByOrder ? "Orders" : "Amount", { role: "annotation" }],
      ...formattedData,
    ],
  });
};


  GetAllChildEnterprises = async (parentId) => {
    let data = await EnterpriseService.GetAllServices(parentId, this.state.userObject.Id)
    if(data.length > 0 ){
        data = data.filter((val) => !val.IsChurned && !val.IsExternal && !val.IsDeleted && val.IsActive && val.EnterpriseTypeId != 15)
        this.setState({ childEnterprises: data })
      }
          data.forEach(service => {
            service.IsSelected = true;
          });

          this.setState({enterprises: data, chkAllServices: true, serviceSeleted: true}, () => this.GetSelectedServices(data))
    this.GetEnterpriseOrders();
  }

  GetSelectedServices = (services) => {

    if(!Utilities.stringIsEmpty(sessionStorage.getItem(Constants.Session.SELECTED_ORDER_QUERY))){

      let Dates = String(sessionStorage.getItem(Constants.Session.SELECTED_ORDER_QUERY)).split('|');
      this.state.StartDate = Dates[0]
      this.state.EndDate = Dates[1]
      this.state.value = {startDate:  Dates[0],  endDate: Dates[1]}
      this.setState({startDate: Dates[0], EndDate: Dates[1]})
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

  } else
  {
    services.forEach(service =>
      {
        service.IsSelected = true;
      })
  }
}
  this.handleServiceSelection(services);
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

      if(service.Id == 0 || service.Id == undefined || service.IsExternal) return;

      if(!service.IsSelected) isCheckedAll = false;

      if(service.IsSelected) serviceSeleted = true;

    });

  }

  this.setState({enterprises: services, chkAllServices: isCheckedAll, serviceSeleted: serviceSeleted})

}

handleServiceSelection = () => {

  var serviceIdCsv = ""
  var serviceNameCsv = ""
  var services = this.state.enterprises;
  var isAllSelected = true;
  var selectedService = [];
  var selectedServiceCount = 0;
  //localStorage.removeItem(Constants.Session.SELECTED_ORDER_QUERY)
  services.forEach((service, index) => {

    if(service.Id == 0 || service.Id == undefined || service.IsExternal) return;

    if(service.IsSelected == undefined || service.IsSelected)
    {
      selectedService.push(service);
      serviceIdCsv += service.Id + Config.Setting.csvSeperator
      if(selectedServiceCount < 2) serviceNameCsv += Utilities.SpecialCharacterDecode(service.Name) + ','
      selectedServiceCount++;
    } else
    {
      isAllSelected = false;
    }

  });

  selectedService = selectedService;
  serviceIdCsv = Utilities.FormatCsv(serviceIdCsv, Config.Setting.csvSeperator);
  serviceNameCsv = Utilities.FormatCsv(serviceNameCsv, ', ');

  this.setState({servicesSelection: false, selectedService: selectedService, selectedServiceNameCsv: serviceNameCsv , selectedServiceIdCsv: serviceIdCsv, SelectRange: false, isAllServicesSelected: isAllSelected}, () => {

         if(serviceIdCsv != "")
      localStorage.setItem(Constants.Session.SELECTED_ORDER_QUERY, `${this.state.selectedServiceIdCsv}`)
    this.GetEnterpriseOrders()
  })


}

  SelectRangeModal = () => {

    if(this.state.SelectRange) {

    this.setState({
      SelectRange: !this.state.SelectRange,
    });

    return;
  }

    var isCheckedAll = true;
    var services = this.state.selectedService;
    var enterpises = this.state.childEnterprises;
    this.setState({
      SelectRange: !this.state.SelectRange,
    }, () => {


      if(services.length > 0) {

        enterpises.forEach(enterprise => {

      if(enterprise.EnterpriseId == 0 || enterprise.EnterpriseId == undefined) return;

      var service = services.find(s => s.EnterpriseId == enterprise.EnterpriseId);

      enterprise.IsSelected = service != undefined

    })

  } else
  {
    enterpises.forEach(enterprise => {
      enterprise.IsSelected = true;
    })
    isCheckedAll = true;
  }

  this.setState({enterprises: enterpises, chkAllServices: this.state.isAllServicesSelected})
  }

    )
}

// Service Selection Work End
  onPNGClick() {

    this.setState({showDateRange: true},() => {
      if (this.ref.current === null) {
        return;
      }

      html2canvas(this.ref.current, {
        scale: 3,
        allowTaint: true, // Allows cross-origin images without CORS headers, but disables CORS security checks
        useCORS: true // Allows cross-origin images to be captured properly
      })
      .then((canvas) => {
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `Superbutler-${this.state.userObject.Enterprise.Name}-Statistics-${moment(this.state.StartDate).format("DD MMM yyyy")}-${moment(this.state.EndDate).format("DD MMM yyyy")}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        this.setState({showDateRange: false});
        console.log(err);
      });

      this.setState({showDateRange: false});

    });

  }

  // SetSelectedStatus(){

  //   let selectedStatus = "";
  //   selectedStatus += (this.state.ChkAll? 1 : 0) + Config.Setting.csvSeperator;
  //   selectedStatus += (this.state.ChkNew? 1 : 0) + Config.Setting.csvSeperator;
  //   selectedStatus += (this.state.ChkInKitchen? 1 : 0) + Config.Setting.csvSeperator;
  //   selectedStatus += (this.state.ChkReady? 1 : 0) + Config.Setting.csvSeperator;
  //   selectedStatus += (this.state.ChkDelivered? 1 : 0) + Config.Setting.csvSeperator;
  //   selectedStatus += (this.state.ChkCancelled? 1 : 0) + Config.Setting.csvSeperator;
  //   selectedStatus += (this.state.ChkBooking? 1 : 0) + Config.Setting.csvSeperator;
  //   selectedStatus += (this.state.ChkPreOrder? 1 : 0) + Config.Setting.csvSeperator;
  //   selectedStatus = Utilities.FormatCsv(selectedStatus, Config.Setting.csvSeperator)
  //   selectedStatus += '|' +  moment(this.state.StartDate).format("YYYY-MM-DD") + '^' + moment(this.state.EndDate).format("YYYY-MM-DD");

  //   localStorage.setItem(Constants.Session.SELECTED_REPORT_ORDER_STATUS,selectedStatus);
  // }

  // GetSelectedStatus(){

  //   if(!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.SELECTED_REPORT_ORDER_STATUS))){

  //   let states = String(localStorage.getItem(Constants.Session.SELECTED_REPORT_ORDER_STATUS)).split('|');
  //   let dateRange = states[1].split('^');
  //   let selectedStatus = states[0].split(Config.Setting.csvSeperator);

  //   this.state.ChkAll = selectedStatus[0] == "1";
  //   this.state.ChkNew = selectedStatus[1] == "1";
  //   this.state.ChkInKitchen = selectedStatus[2] == "1";
  //   this.state.ChkReady = selectedStatus[3] == "1";
  //   this.state.ChkDelivered = selectedStatus[4] == "1";
  //   this.state.ChkCancelled = selectedStatus[5] == "1";
  //   this.state.ChkBooking = selectedStatus[6] == "1";
  //   this.state.ChkPreOrder  = selectedStatus[7] == "1";
  //   this.state.StartDate = new Date(dateRange[0]);
  //   this.state.EndDate =  new Date(dateRange[1]);

  //   this.state.value = {startDate: this.state.StartDate,  endDate: this.state.EndDate}
  //   }

  // }

SetStatisticsValues = (orders) => {

  var customerIdCSV = "";
  var restaurantCSV = "";
  this.state.AcceptedOrdersCount = 0;
  this.state.DeliveryOrderCount = 0;
  this.state.CollectionOrderCount = 0;
  this.state.DeliveryOrderCount = 0;
  this.state.CollectionOrderCount = 0;
  this.state.EatInOrderCount = 0
  this.state.BookingOrderCount = 0;
  this.state.AppsOrderCount = 0;
  this.state.WebOrderCount = 0;
  this.state.WhiteLableOrderCount = 0;
  this.state.HighValueOrderAmount = 0;
  this.state.LowValueOrderAmount = 0;
  this.state.CancelledOrderCount = 0;
  this.state.CardOrderCount = 0;
  this.state.CODOrderCount = 0;
  this.state.COTOrderCount = 0;
  this.state.PostToRoomOrderCount = 0;
  this.state.BankTransferOrderCount = 0;
  this.state.CustomersCount = 0;
  this.state.RestaurantsCount = 0;
  this.state.NewCustomers = 0;


  orders.forEach((order) => {

    // Setting Order type states
    if(order.OrderType == 1) this.state.DeliveryOrderCount += 1;
    else if(order.OrderType == 3) this.state.EatInOrderCount += 1;
    else if(order.OrderType == 4 || order.OrderType == 2) this.state.BookingOrderCount += 1;



    // Setting Order source states
    if(order.Source.indexOf("App") != -1) this.state.AppsOrderCount += 1;
    else if(order.Source.indexOf("White Label") != -1) this.state.WhiteLableOrderCount += 1;
    else  this.state.WebOrderCount += 1;

    // Setting Order Amount States
    // var totalAmount = (Utilities.FormatCurrency(Number(order.TotalAmount) + Number(order.DiscountedAmount), this.state.countryConfigObj?.DecimalPlaces).replace(/,/gi, ""));
    // if(totalAmount > Number(this.state.HighValueOrderAmount)) this.state.HighValueOrderAmount = Utilities.FormatCurrency(totalAmount, this.state.countryConfigObj?.DecimalPlaces).replace(/,/gi, "");

    // console.log("totalAmount", totalAmount)
    // console.log("totalAmount set LowValueOrderAmount", this.state.LowValueOrderAmount)
    // if(totalAmount < (Number(this.state.LowValueOrderAmount)) || this.state.LowValueOrderAmount == 0) {

    //   this.state.LowValueOrderAmount = Utilities.FormatCurrency(totalAmount, this.state.countryConfigObj?.DecimalPlaces).replace(/,/gi, "");
    //   console.log("totalAmount set", this.state.LowValueOrderAmount)
    //   console.log("totalAmount set11", totalAmount < Number(this.state.LowValueOrderAmount) || this.state.LowValueOrderAmount == 0)
    // }


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
    if(order.OrderStatus != 3){

      this.state.AcceptedOrdersCount += 1;

    }


    // Setting Payment By States
    // var isCardOrder = true;
    order.PaymentModes.forEach(mode => {
      if(Number(mode.PaymentMode) == 1 ) {
          this.state.CODOrderCount += 1
          return
      } else if((Number(mode.PaymentMode) === 4) || Number(mode.PaymentMode) === 2){
        this.state.CardOrderCount += 1
      } else if(Number(mode.PaymentMode) === 5) {
        this.state.COTOrderCount += 1
      } else if((Number(mode.PaymentMode) === 6)){
        this.state.PostToRoomOrderCount += 1
      } else if((Number(mode.PaymentMode) === 7)){
        this.state.BankTransferOrderCount += 1
      }
    });

  });

  this.findTotalAmountValue(orders);

  try {
    // Transform API data into chart format
    const transformedData = [
     ["Payment Type", "Value"],
     ["Online Payment", this.state.CardOrderCount],
     ["Cash Orders", this.state.CODOrderCount],
     ["Pay by Card (Terminal)", this.state.COTOrderCount],
     ["Post to Room", this.state.PostToRoomOrderCount],
     ["Bank Transfer", this.state.BankTransferOrderCount],
   ];

   // Sort the data (excluding the header row)
   const sortedData = transformedData
     .slice(1) // Exclude header
     .sort((a, b) => b[1] - a[1]); // Sort by value in descending order

   // Update the state with sorted data and colors
   this.setState({
     data: [["Payment Type", "Value"], ...sortedData],});

   var listData = [
    { label: "Online Payment", count: this.state.CardOrderCount, icon: <AiOutlineGlobal />, color: "#670066" },
    { label: "Cash Orders", count: this.state.CODOrderCount, icon: <BsCash />, color: "#7F007F" },
    { label: "Pay by Card (Terminal)", count: this.state.COTOrderCount, icon: <svgIcon.cardTerminal />, color: "#BE2AED" },
    { label: "Post to Room", count: this.state.PostToRoomOrderCount, icon: <svgIcon.Inroomlock />, color: "#D996FE" },
    { label: "Bank Transfer", count: this.state.BankTransferOrderCount, icon: <CiBank />, color: "#EFBBFF" },
  ];

  var dataSorted = listData.sort((a, b) => b.count - a.count);
  var colors = [];
  dataSorted.forEach(sdata => {
    colors.push(sdata.color);
  });
  this.setState({sortedColor: colors, sortedListData: dataSorted});


 } catch (error) {
   console.error("Error fetching data:", error);
 }


  var firstOrder = moment(moment(this.state.StartDate).format("YYYY-MM-DD"));
  var lastOrder =  moment(moment(this.state.EndDate).format("YYYY-MM-DD"));
  var totalDays = lastOrder.diff(firstOrder, 'days');
  this.state.OrdersPerDay = totalDays > 0 ? (Number(orders.length)/Number(totalDays+1)).toFixed(2) : (orders.length).toFixed(2);

}

  HandleCheckAll(e) {

    var isChecked = e.target.checked;
    this.setState({ ChkNew: isChecked, ChkInKitchen: isChecked, ChkReady: isChecked, ChkCancelled: isChecked, ChkDelivered: isChecked, ChkBooking: isChecked, ChkPreOrder: isChecked,  ChkAll: isChecked }, () => {
      this.setState({ ShowLoader: true });
      this.GetOrdersByStatus();
      // this.SetSelectedStatus();
    })


  }
  servicesSelectionModal() {

    if(this.state.servicesSelection) {

      this.setState({
        servicesSelection: !this.state.servicesSelection,
        childEnterprises: JSON.parse(this.state.currentServices)
      });

      return;
    }

    var isCheckedAll = true;
    var services = this.state.selectedService;
    var currentServices = JSON.stringify(this.state.childEnterprises);
    var enterpises = this.state.childEnterprises;
    this.setState({
      servicesSelection: !this.state.servicesSelection,
    }, () => {

      if(services.length > 0) {

        enterpises.forEach(enterprise => {

      if(enterprise.EnterpriseId == 0 || enterprise.EnterpriseId == undefined) return;

      var service = services.find(s => s.EnterpriseId == enterprise.EnterpriseId);

      enterprise.IsSelected = service != undefined

    })

  } else
  {
    enterpises.forEach(enterprise => {
      enterprise.IsSelected = true;
    })
    isCheckedAll = false;
  }

  this.setState({enterprises: enterpises, chkAllServices: this.state.isAllServicesSelected, currentServices: currentServices})
  }


    )

}

  currencySelectionModal() {
    this.setState({
      showCurrencyModal: !this.state.showCurrencyModal,
      searchText : '',
    });
  }

  selectCountry(country) {
   this.setState({
      selectedCountryObj: country,
      showCurrencyModal: !this.state.showCurrencyModal,
      dailyDataByOrder : true,
      hourlyDataByOrder: true,
      weeklyDataByOrder: true,
    }, () => {
      this.calculateDailyData(this.state.EnterpriseOrders)
      this.calculateHourlyData(this.state.EnterpriseOrders)
      this.calculateWeeklyData(this.state.EnterpriseOrders)
    });
  }

  getVisibleCountries = () => {
  const { allCurrencyData, searchText, selectedCountryObj } = this.state;

  const search = searchText.trim().toLowerCase();

  // 1. Filter countries by name, code, or currency
  const filtered = allCurrencyData.filter((item) => {
    return (
      item.country.toLowerCase().includes(search) ||
      item.code.toLowerCase().includes(search) ||
      (item.currencyCode && item.currencyCode.toLowerCase().includes(search))
    );
  });

  // 2. Move selected country to top
  if (selectedCountryObj) {
    return [
      selectedCountryObj,
      ...filtered.filter((item) => item.code !== selectedCountryObj.code),
    ];
  }

 return filtered;
};


  convertCurr(amount) {
    const {  userObject, currencies,selectedCountryObj,countryConfigObj } = this.state;
    const userCountry = userObject?.EnterpriseRestaurant?.Country
    if (selectedCountryObj) {
      return Utilities.convertCurrency(amount,userCountry?.IsoCode3,selectedCountryObj?.currencyCode,currencies)
    } else {
      return Utilities.FormatCurrency(amount, countryConfigObj?.DecimalPlaces)
    }
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

  HandleDateChange = (date) => {
    var startDateFormat = 'YYYY-MM-DD 00:00:00';
    var endDateFomat = 'YYYY-MM-DD 23:59:59';


    if(date.startDate == null || date.startDate == undefined)
    {
      this.setState({value: {startDate: this.state.StartDate,  endDate: this.state.EndDate}});
      return;
    }


    let isDateValid = true;
    this.setState({
      StartDate: moment(date.startDate).format(startDateFormat),
      EndDate: moment(date.endDate).format(endDateFomat),
      value: date
    },()=>{
      sessionStorage.setItem(Constants.Session.SELECTED_ORDER_QUERY, `${this.state.StartDate}|${this.state.EndDate}`)
      this.GetEnterpriseOrders()
    })

    // if(isEndDate) {

    //     isDateValid = date > this.state.StartDate
    //     this.setState({ EndDate: date, ValidDate: isDateValid },() => {
    //         // this.GetEnterpriseOrders();
    //     });
    // }
    // else {

    //     if(this.state.EndDate !== ""){
    //     isDateValid = date < this.state.EndDate
    //     }
    //     this.setState({ StartDate: date, ValidDate: isDateValid },() => {
    //         // this.GetEnterpriseOrders();
    //     });
    // }


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
            var today = new Date(moment.tz(timeZone).format("YYYY-MM-DDTHH:mm:ss"));
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
          Number(mode.PaymentMode) == 1 ? totalCashAmount += Number(mode.Amount) : totalCardsAmount += Number(mode.Amount)
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
          ShowLoader: false, TotalOrders: orders.length, TotalCardsAmount: totalCardsAmount, TotalCashAmount: totalCashAmount, TotalAmount: totalAmount + totalCancelledAmount, TotalCancelledAmount: totalCancelledAmount,
          ChkAll: this.state.ChkNew && this.state.ChkInKitchen && this.state.ChkReady && this.state.ChkDelivered && this.state.ChkCancelled && this.state.ChkBooking && this.state.ChkPreOrder

        });

        this.bindDataTable();
      }
        .bind(this),
      100
    );

    this.setState({ ShowLoader: false });
  }

  GetOrdersCount(orders, status, isPreOrder) {


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

      filterOrder = filterOrder.filter(order => {

        if (!Utilities.stringIsEmpty(order.PreOrderTime)) {

          var date = moment(order.PreOrderTime).format('YYYY-MM-DD HH:mm:ss');
          var today = new Date(moment.tz(timeZone).format("YYYY-MM-DDTHH:mm:ss"));
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
          var today = new Date(moment.tz(timeZone).format("YYYY-MM-DDTHH:mm:ss"));
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

  GetEnterpriseOrders = async () => {

    // if(this.state.userObject.Enterprise.EnterpriseTypeId == Constants.ENTERPRISE_TYPE_IDS.HOTEL) {
    //   this.GetGoogleAnalyticsData();
    // }
    this.setState({ ShowLoader: true });
    var data = await EnterpriseOrderService.GetBy(moment(this.state.StartDate).format("YYYY-MM-DDT00:00:00"), moment(this.state.EndDate).format("YYYY-MM-DDT23:59:59"),0, this.state.selectedServiceIdCsv);
    this.setState({ShowLoader: false})
    var orders = data;
    this.SetStatisticsValues(orders);
    if (data.length > 0) {
      this.setState({ IsParent: data[0].IsParent === '1' });

     data.forEach((order) => {
      order.OrderDate = Utilities.getDateByZone(order.OrderDate, "YYYY-MM-DDTHH:mm", timeZone)
     })
    }

    this.setState({ EnterpriseOrders: Utilities.stringIsEmpty(data) ? [] : data, FilterOrders: data, ShowButtonLoader: false}, ()=> {
      this.MergeColumnsForSearch(this.state.FilterOrders);
    });
     this.calculateDailyData(data);
    //  this.computeRangeAvailability();
     this.GetOrdersByStatus();
    // this.SetSelectedStatus();

    var serviceTypeData = []
    var services = this.state.selectedService;
    var hasOrders = false;
    services.forEach(service => {

      if(service.Id == 0 || service.Id == undefined || service.IsExternal) return;
      var serviceData = []

      serviceData.push(Utilities.SpecialCharacterDecode(service.Name));
      var serviceOrders = data.filter(o => o.EnterpriseId == service.Id)
      serviceData.push(serviceOrders.length);
      service.TotalOrders = serviceOrders.length;
      if(serviceOrders.length > 0) hasOrders = true
      serviceTypeData.push(serviceData);
    });


    var selectedServiceList =  services.sort((a, b) => b.TotalOrders - a.TotalOrders);

   // Sort the data (excluding the header row)
   const sortedData = serviceTypeData
     .sort((a, b) => b[1] - a[1]); // Sort by value in descending order

   // Update the state with sorted data and colors
   this.setState({selectedServiceList: selectedServiceList, hasOrders: hasOrders,
    serviceTypeData: [["Service", "Value"], ...sortedData],
   });
   this.calculateHourlyData(data);
   this.calculateWeeklyData(data);
   this.GetReportData();
  }


  GetReportData = async () => {

    this.setState({ ShowLoader: true });
    var data = await EnterpriseOrderService.GetReportBy(moment(this.state.StartDate).format("YYYY-MM-DD"), moment(this.state.EndDate).format("YYYY-MM-DD"), this.state.selectedServiceIdCsv);
    this.setState({ ShowLoader: false });
    if (!data.HasError && data !== undefined) {

      if (data.Dictionary.DashboardReports != undefined) {

        var reports = data.Dictionary.DashboardReports;

        this.setState({
          dashboardReports: reports,
          topSellingItems: this.state.byQuantity ? reports.TopSellingItemsByQuantity : reports.TopSellingItemsByRevenue,
          topRooms: this.state.byOrder ? reports.TopRoomsByOrder : reports.TopRoomsByRevenue
        })

      }

  }

    this.setState({ShowLoader: false, pageLoader: false})

  }


  GetGoogleAnalyticsData = async () => {

    this.setState({ ShowLoader: true });
    var data = await EnterpriseService.GetGoogleAnalytics(moment(this.state.StartDate).format("YYYY-MM-DD"), moment(this.state.EndDate).format("YYYY-MM-DD"), this.state.analyticsPropertyId);

    if (data != undefined && !data.HasError && data !== undefined) {
      console.log("dataaaaa: ", data);
      this.setState({ analyticsData: data})
    } else
    {
      this.setState({ analyticsData: this.state.defaultAnalyticsData})
    }

    this.setState({ShowLoader: false, pageLoader: false})

  }

  handleChangeRoomsBy = (byOrder) => {

    var reports = this.state.dashboardReports;
    if(byOrder)
    {
      this.setState({topRooms: reports.TopRoomsByOrder, byOrder: true})
      return;
    }

    this.setState({topRooms: reports.TopRoomsByRevenue, byOrder: false})

  }


  handleChangeSellingItemsBy = (byQuantity) => {

    var reports = this.state.dashboardReports;
    if(byQuantity)
    {

      this.setState({topSellingItems: reports.TopSellingItemsByQuantity, byQuantity: true})
      return;
    }

    this.setState({topSellingItems: reports.TopSellingItemsByRevenue, byQuantity: false})

  }

  formatBounceRate = (rate) => {
    return (rate * 100).toFixed(1) + "%";
  }

  formatSessionDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.round(duration % 60);
    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  }

  componentDidMount() {
    // This method is called when the component is first added to the document
    this.getCurrenciesRates()
    this.GetAllChildEnterprises(Utilities.GetEnterpriseIDFromSessionObject());
    //  this.GetReportData();
  }

  getCurrenciesRates = async () => {
    try {
      const result = await getCurrencyConversion();
      console.log('result.conversion_rates', result.conversion_rates);

      if (result.conversion_rates) {
        // this.context.setCurrencyRates(result.conversion_rates);
       this.setState({currencies: result.conversion_rates})
      }
      const countryObj = currencyData?.find((item) => item?.code === this.state.userObj?.EnterpriseRestaurant?.Country?.IsoCode2);
      if (countryObj) {
        this.setState({selectedCountryObj : countryObj})
      }
    } catch (error) {
      console.log('err', error);
    }
  };

  componentWillUnmount() {
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
          let paymentMode = "BY CASH";
          order.PaymentModes.forEach(mode => {
         if (Number(mode.PaymentMode) == 1) {
          paymentMode = "BY CASH";

          if (Number(order.OrderStatus) === 4) {
            paymentMode = "PAID CASH";
          }
      } else if (Number(mode.PaymentMode) == 2) {
        paymentMode = "BY CARD";
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

    order.AllColumns =  Utilities.SpecialCharacterDecode(mergedColumns);
    this.setState({FilterOrders: filterOrders});

  });
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


  setOrderStatus = (orderStatus, type, preOrderTime) => {

    let statusText = Number(orderStatus) === 0 ? "New" : Number(orderStatus) === 1 ? "In-Kitchen" : "Ready";

    if (orderStatus < 3) {

    if (!Utilities.stringIsEmpty(preOrderTime)) {
      var date = moment(preOrderTime).format('YYYY-MM-DD HH:mm:ss');
      var today = new Date(moment.tz(timeZone).format("YYYY-MM-DDTHH:mm:ss"));
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

      //   <Dropdown.Toggle variant="secondary" className="mt-0" >
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

    let paymentMode = "BY CASH";
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
  SetPaymentModeIcons(paymentModes, status, payableAmount) {
    let paymentModeIcon = <IoCashOutline />
    paymentModes.forEach(mode => {
      if (Number(mode.PaymentMode) == 1) {
        paymentModeIcon = <IoCashOutline />
      } else  if (Number(mode.PaymentMode) == 2) {
        paymentModeIcon = <CiCreditCard1 />
      } else if (Number(mode.PaymentMode) === 6 && Number(payableAmount > 0)) {
        paymentModeIcon = <MdOutlineBedroomChild />
      } else if (Number(mode.PaymentMode) === 7 && Number(payableAmount > 0)) {
        paymentModeIcon = <CiBank />
      }
    });
    return paymentModeIcon
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
      var today = new Date(moment.tz(timeZone).format("YYYY-MM-DD"));

      if (moment(date).isSame(today, 'day')) {
        return moment(orderDate).format('h:mm a')
      }
    }

    return moment(orderDate).format('DD MMM YYYY  h:mm a')

  }


  setWaitingSince = (orderDate) => {


    orderDate = new Date(orderDate);
    var date2 = new Date(moment.tz(timeZone).format("YYYY-MM-DDTHH:mm:ss"));

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


  loading = () => <div className="allorders-loader all-order-loader-new">
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



  // google analytics code rendering starts

  renderTopPagesGraph = () => {
    const { analyticsData } = this.state;

    if(Object.keys(analyticsData).length === 0 ) {
      return(<div>{this.loading()}</div>)
    }

     let data;
    if(analyticsData.dailyTrend.length === 0 ) {
      return(<div className='ana-nothing-wrap'> Nothing to Show</div>)
    } else
    {
     data = [
      ["Page Path", "Page Views"],
      ...analyticsData.pages.map(page => [page.PagePath,  page.PageViews])
    ];

     var data1 = [
      ["Page Path", "Sessions"],
      ...analyticsData.pages.map(page => [page.PagePath,  page.Sessions])
    ];
  }
    return (
      // <Chart
      //   chartType="BarChart"
      //   width="100%"
      //   height="400px"
      //   data={data}
      //   options={{
      //     chartArea: { width: '90%', height: '70%' },
      //     hAxis: { title: "Sessions" },
      //     vAxis: { title: "Page Path" },
      //     colors: ['#670066', '#7F007F']
      //   }}
      // />
      <div>
      <Chart
            chartType="AreaChart"
            width="100%"
            height="400px"
            data={data}
            options={{
              legend: 'none',
              chartArea: { left: 70, right: 10, top: 20, bottom: 100 },
              hAxis: { textPosition: 'none' },
              vAxis: {
                // title: this.state.dailyDataByOrder ? "Number of Orders" : 'Amount',
                titleTextStyle: { italic: false, color: "#000", bold: true },
                format: '0',
              },
              colors: ['#670066']
            }}
                  />
{/*
                        <Chart
            chartType="AreaChart"
            width="100%"
            height="400px"
            data={data1}
            options={{
              legend: 'none',
              chartArea: { left: 70, right: 10, top: 20, bottom: 100 },
              hAxis: { textPosition: 'none' },
              vAxis: {
                // title: this.state.dailyDataByOrder ? "Number of Orders" : 'Amount',
                titleTextStyle: { italic: false, color: "#000", bold: true },
                format: '0',
              },
              colors: ['#670066']
            }}
                  /> */}
                  </div>
    );
  };

  renderTopPagesTable = () => {
    const { analyticsData } = this.state;

    return (
      <div className="analytics-table-wrap px-4">
        <table className="analytics-table w-100">
          <thead>
            <tr>
              <th>Page Path</th>
              <th>Sessions</th>
              <th>Page Views</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(analyticsData).length > 0 && analyticsData.pages.map((page, index) => (
              <tr key={index}>
                <td>{page.PagePath}</td>
                <td>{page.Sessions}</td>
                <td>{page.PageViews}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };


  renderSessionsChart = (dataType) => {
  const { analyticsData } = this.state;

   if(Object.keys(analyticsData).length === 0 ) {
      return(<div>{this.loading()}</div>)
    }

     let data;
    if(analyticsData.dailyTrend.length === 0 ) {
      return(<div className='ana-nothing-wrap'> Nothing to Show</div>)
    } else

    {

      // var data1 = [
      //   ["Country", "Sessions"],
      //   ...analyticsData.countries.map(country => [country.Country, country.Sessions])
      // ];


      // var data2 = [
      //   ["Browser", "Sessions"],
      //   ...analyticsData.browsers.map(browser => [browser.Browser, browser.Sessions])
      // ];

      //  var data3 = [
      //   ["Device Category", "Sessions"],
      //   ...analyticsData.devices.map(device => [device.DeviceCategory, device.Sessions])
      // ];

  // Dynamically choose the data source based on the `dataType`
  switch (dataType.toLocaleLowerCase()) {
    case "country":
      data = [
        ["Country", "Sessions"],
        ...analyticsData.countries.map(country => [country.Country, country.Sessions])
      ];
      break;

    case "browser":
      data = [
        ["Browser", "Sessions"],
        ...analyticsData.browsers.map(browser => [browser.Browser, browser.Sessions])
      ];
      break;

    case "device":
      data = [
        ["Device Category", "Sessions"],
        ...analyticsData.devices.map(device => [device.DeviceCategory, device.Sessions])
      ];
      break;

    default:
      data = [];
      break;
  }
  }

  return (

    <div>

    <Chart
      chartType="BarChart"
      width="100%"
      height="400px"
      data={data}
      options={{
        legend: 'none',
        chartArea: { width: '80%', height: '70%' },
        hAxis: {
          //title: "Sessions",
          minValue: 0,
        },
        vAxis: {
          //title: dataType.charAt(0).toUpperCase() + dataType.slice(1), // Capitalize first letter
          textStyle: { color: "#000", fontSize: 12 },
        },
        colors: ['#670066']
      }}
    />
        {/* <Chart
      chartType="BarChart"
      width="100%"
      height="200px"
      data={data2}
      options={{
        legend: 'none',
        chartArea: { width: '80%', height: '70%' },
        hAxis: {
          //title: "Sessions",
          minValue: 0,
        },
        vAxis: {
          //title: dataType.charAt(0).toUpperCase() + dataType.slice(1), // Capitalize first letter
          textStyle: { color: "#000", fontSize: 12 },
        },
        colors: ['#670066']
      }}
    />
        <Chart
      chartType="BarChart"
      width="100%"
      height="200px"
      data={data3}
      options={{
        legend: 'none',
        chartArea: { width: '80%', height: '70%' },
        hAxis: {
          //title: "Sessions",
          minValue: 0,
        },
        vAxis: {
          //title: dataType.charAt(0).toUpperCase() + dataType.slice(1), // Capitalize first letter
          textStyle: { color: "#000", fontSize: 12 },
        },
        colors: ['#670066']
      }}
    /> */}
    </div>
  );
};


  // renderSessionsByCountries = () => {
  //   const { analyticsData } = this.state;

  //   if(Object.keys(analyticsData).length === 0) {
  //     return this.loading();
  //   }

  //   const data = [
  //     ["Country", "Sessions"],
  //     ...analyticsData.countries.map(country => [country.Country, country.Sessions])
  //   ];

  //   return (
  //     <Chart
  //       chartType="BarChart"
  //       width="100%"
  //       height="400px"
  //       data={data}
  //       options={{
  //         chartArea: { width: '90%', height: '70%' },
  //         hAxis: { title: "Sessions" },
  //         vAxis: { title: "Country" },
  //         colors: ['#670066']
  //       }}
  //     />
  //   );
  // };

  // renderSessionsByBrowsers = () => {
  //   const { analyticsData } = this.state;

  //   const data = [
  //     ["Browser", "Sessions"],
  //     ...analyticsData.browsers.map(browser => [browser.Browser, browser.Sessions])
  //   ];

  //   return (
  //     <Chart
  //       chartType="BarChart"
  //       width="100%"
  //       height="400px"
  //       data={data}
  //       options={{
  //         chartArea: { width: '90%', height: '70%' },
  //         hAxis: { title: "Sessions" },
  //         vAxis: { title: "Browser" },
  //         colors: ['#670066']
  //       }}
  //     />
  //   );
  // };

  // renderSessionsByDevices = () => {
  //   const { analyticsData } = this.state;

  //   const data = [
  //     ["Device Category", "Sessions"],
  //     ...analyticsData.devices.map(device => [device.DeviceCategory, device.Sessions])
  //   ];

  //   return (
  //     <Chart
  //       chartType="BarChart"
  //       width="100%"
  //       height="400px"
  //       data={data}
  //       options={{
  //         chartArea: { width: '90%', height: '70%' },
  //         hAxis: { title: "Sessions" },
  //         vAxis: { title: "Device Category" },
  //         colors: ['#670066']
  //       }}
  //     />
  //   );
  // };



  // google analytics code rendering ends







  render() {
const { viewType, sessionViewType, analyticsData,selectedCountryObj } = this.state;


    if(this.state.pageLoader) return  this.loading()
    var orders =  this.state.FilterOrders
    return (
      <Fragment>
        <div className="card dashboard-page" id="orderWrapper">
          {this.state.ShowLoader && <div className="grid-box-overlay-l">{<Loader type="Oval" color="#ed0000" height={50} width={50} />}</div>}
        <div className=" card-new-title p-l-r-0 mb-0 dash-sticky">

               <div className="d-flex align-items-center p-l-r card-body tailwind-date-picker-main w-100 dashboard-main-wrap flex-wrap" style={{gap:"10px 0px"}}>
                <div className='resp-down-btn d-flex align-items-center mr-2'>
          <h3 className="card-title card-new-title ml-0 mb-0 pl-0 mr-0">Dashboard</h3>
                <div className='tailwind-date-picker-wrap  tailwind ml-2 relative' style={{ width: 250 }}>

                  <Datepicker
                  placement="bottom-start"
                    showShortcuts={true}
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
                    value={this.state.value}
                    onChange={(date) => this.HandleDateChange(date)}
                    displayFormat={"DD MMM YYYY"}
                    readOnly={true}
                  />
                </div>
          </div>

          <div className='services-d-down ml-0 mt-md-0 ml-0 mr-auto'>
                <div className="display-n-services">

      {this.state.userObject.Enterprise.IsParent &&
        <div className='display-n-services-inner'>
             <span> Services: </span>

              {

              this.state.isAllServicesSelected ?
              <span className='add-cat-btn mr-2' onClick={() => this.servicesSelectionModal()}>All services </span> :

                    <span onClick={() => this.servicesSelectionModal()} className='mx-2 add-cat-btn selected-serv-btn'>
            <span className='mr-1'>{this.state.selectedServiceNameCsv} </span>
                     {this.state.selectedService.length > 2 ? <span>and</span> : <span className='d-none'>+</span>  }  {this.state.selectedService.length > 2 ? `${this.state.selectedService.length - 2} more` : '' }</span>


              }

              <span> Currency: </span>
             {

              !this.state.selectedCountryObj ?

              <span className='add-cat-btn mx-2' onClick={() => this.currencySelectionModal()}><img className='selected-country-image' src="https://flagcdn.com/w40/gb.png" alt={``} /> {this.state.selectedCountryObj?.currencySymbol == undefined || this.state.selectedCountryObj?.currencySymbol == null ? currencySymbol : this.state.selectedCountryObj?.currencySymbol}</span> :

                    <span onClick={() => this.currencySelectionModal()} className='mx-2 add-cat-btn selected-serv-btn'>
                       <img className='selected-country-image' src={this.state.selectedCountryObj?.flag} alt={``} />
            <span className='mr-1'>{this.state.selectedCountryObj?.currencySymbol} </span></span>


              }
                <button onClick={this.onPNGClick} title='Download PNG' className="btn btn-primary mt-md-0 ml-0 ml-md-auto hide-on-web"><IoMdDownload className='font-20' /> </button>
            </div>
        }

                </div>

                      </div>
          <button onClick={this.onPNGClick} title='Download PNG' className="btn btn-primary hide-on-mob ml-0 mt-3 mt-md-0"><IoMdDownload className='font-20' /> <span className='hide-1100'> Download </span></button>

        </div>

            </div>
          <div ref={this.ref} className="card-body">
          {this.state.ShowButtonLoader &&   <p className="info-msg-on-label font-12 " role="alert">Working on your request, please wait.</p>}

          {this.state.showDateRange &&
          <span className='ml-4 font-16 bold'> {`${moment(this.state.StartDate).format("DD MMM yyyy")}~${moment(this.state.EndDate).format("DD MMM yyyy")}`}</span>
          }



          <div className='order-main-summary-wrap'>
          <div className="analytics-total-wrap">
                <div className="analytics-r-label">
                  <span className="top-label">Total Orders</span>
                  <span className='top-value'>{this.state.TotalOrders}</span>
                </div>
                <div className="analytics-r-label ">
                  <span className="top-label">Total Value</span>
                  <span className='top-value'>{selectedCountryObj?.currencySymbol || currencySymbol}{this.convertCurr(this.state.TotalAmount)}</span>
                </div>
                <div className="analytics-r-label">
                  <span className="top-label">Average Value</span>
                  <span className='top-value'>{selectedCountryObj?.currencySymbol || currencySymbol}
                    {/* {this.state.TotalAmount > 0 ? Utilities.FormatCurrency(Number(this.state.TotalAmount) / Number(this.state.TotalOrders), this.state.countryConfigObj?.DecimalPlaces) : "0.00"} */}
                    {this.state.TotalAmount > 0 ? this.convertCurr(Number(this.state.TotalAmount) / Number(this.state.TotalOrders)) : "0.00"}
                  </span>
                </div>
                <div className="analytics-r-label">
                  <span className="top-label">Orders per Day </span>
                  <span className='top-value'>{this.state.OrdersPerDay}</span>
                </div>
                <div className="analytics-r-label">
                  <span className="top-label">Orders per Guest </span>
                  <span className='top-value'>{Number(this.state.TotalOrders) > 0 ? parseFloat(Number(this.state.TotalOrders)/Number(this.state.CustomersCount)).toFixed(2) : "0.00"}</span>
                </div>
                <div className="analytics-r-label">
                  <span className="top-label">Cancelled ({this.GetOrdersCount(this.state.EnterpriseOrders, 3)}) </span>
                  <span className='top-value' style={{ color: "#ed0000" }}>{selectedCountryObj?.currencySymbol || currencySymbol}{this.convertCurr(this.state.TotalCancelledAmount)}</span>
                </div>
              </div>
              </div>

          <div className="order-status-main-wrap mb-4 order-status-main-wrap-new">

           {this.state.userObject.Enterprise.IsParent &&
            <div className="order-list-col-1">
              <span className='font-16 d-flex mb-3 bold'>By Service</span>

                {
                    this.state.hasOrders ?
                    <div className='chart-center'>
                    <Chart
                    chartType="PieChart"
                    data={this.state.serviceTypeData}
                    options={{
                      chartArea: {
                        width: '90%', // Takes full width of the container
                        height: '90%' // Adjusts height proportionally
                      },

                      colors: colors,

                      legend:'none',
                      pieSliceTextStyle: {
                        fontSize: 16, // Increases font size
                        bold: true, // Makes text bold
                      },

                    }}
                    width="200px" // Container width
                    height="200px" // Container height
                    // legendToggle
                  />
                  </div>
                  :
                  <div className='empty-round-cirle-p'>
                  <div className='empty-round-cirle'>
                  <span>Nothing to present</span>
                  </div>
                  </div>
                }

                <ul className='mt-3'>

                  {this.state.selectedServiceList.length > 0 &&
                        this.state.selectedServiceList.map((service, index) => {
                          return(
                            <li>
                            <div style={{background: colors[index]}} className='orders-pallate'></div>
                            <span className="list-n-label">
                              {Utilities.SpecialCharacterDecode(service.Name)}
                            </span>
                            <span className="bold">{service.TotalOrders}
                              </span>
                          </li>
                          )

                        })

                  }

                </ul>
            </div>
            }
            <div className="order-list-col-1">
              <span className='font-16 d-flex mb-3 bold'>By Order Type</span>
                  {
                    (this.state.EatInOrderCount != 0 || this.state.BookingOrderCount != 0) ?
                     <div className='chart-center'>
                    <Chart
                    chartType="PieChart"
                    data={[
                      ["Task", this.state.TotalOrders.toString()],
                      ["Room Service", this.state.EatInOrderCount],
                      ["Restaurant & Cafe", this.state.BookingOrderCount],
                    ]}
                    options={{
                      chartArea: {
                        width: '90%', // Takes full width of the container
                        height: '90%' // Adjusts height proportionally
                      },

                      colors: ['#D996FE', '#EFBBFF'],
                      legend:'none',
                      pieSliceTextStyle: {
                        fontSize: 16, // Increases font size
                        bold: true, // Makes text bold
                      },

                    }}
                    width="200px" // Container width
                    height="200px" // Container height
                    // legendToggle
                  />
                  </div>
                  :
                  <div className='empty-round-cirle-p'>
                  <div className='empty-round-cirle'>
                  <span>Nothing to present</span>
                  </div>
                  </div>
                }

                <ul className='mt-3'>
                  <li>
                    <div style={{background:"#D996FE"}} className='orders-pallate'></div>
                    {/* <i className="fa fa fa-cutlery"></i> */}
                        <svgIcon.RoomDiningIcon/>
                    <span className="list-n-label" style={{ marginLeft: '5px' }}>
                       Room Service
                    </span>
                    <span className="bold">{this.state.EatInOrderCount}
                      {/* {this.GetPercentage(this.state.EatInOrderCount,this.state.TotalOrders)} */}
                      </span>
                  </li>
                  <li>
                  <div style={{background:"#EFBBFF"}} className='orders-pallate'></div>
                  <svgIcon.AtRestaurantIcon width={'18pt'} height={'18pt'} />
                    <span className="list-n-label" style={{ marginLeft: '5px' }}>
                       Restaurant & Cafe
                    </span>
                    <span className="bold">{this.state.BookingOrderCount}
                      {/* {this.GetPercentage(this.state.BookingOrderCount,this.state.TotalOrders)} */}
                      </span>
                  </li>
                </ul>
            </div>

            <div className="order-list-col-1">
            <span className='font-16 d-flex mb-3 bold'>By Fulfilment</span>
            {
              (this.state.AcceptedOrdersCount != 0 || this.state.CancelledOrderCount != 0) ?
               <div className='chart-center'>
              <Chart
                  chartType="PieChart"
                  data={[
                      ["Task", this.state.TotalOrders.toString()],
                      ["Fulfilled Orders", this.state.AcceptedOrdersCount],
                      ["Cancelled Orders", this.state.CancelledOrderCount],


                  ]}
                  options={{
                    chartArea: {
                      width: '90%', // Takes full width of the container
                      height: '90%' // Adjusts height proportionally
                    },
                    colors: ['#D996FE', '#EFBBFF'],
                    legend:'none',
                    pieSliceTextStyle: {
                      fontSize: 16, // Increases font size
                      bold: true, // Makes text bold
                    },

                  }}
                  width="200px" // Container width
                  height="200px" // Container height
                  // legendToggle
                />
                </div>
                :
                <div className='empty-round-cirle-p'>
                <div className='empty-round-cirle'>
                <span>Nothing to present</span>
                </div>
                </div>
            }
                <ul className='mt-3'>
                <li>
                <div style={{background:"#D996FE"}} className='orders-pallate'></div>
                    <i className="fa fa-check"></i>
                    <span className="list-n-label">
                      Fulfilled
                    </span>
                    <span className="bold">{this.state.AcceptedOrdersCount}</span>
                  </li>
                  <li>
                  <div style={{background:"#EFBBFF"}} className='orders-pallate'></div>
                    <i className="fa fa-ban text-danger"></i>
                    <span className="list-n-label">
                      Cancelled
                    </span>
                    <span className="bold text-danger">{this.state.CancelledOrderCount}</span>
                  </li>

                </ul>
            </div>
            <div className="order-list-col-1">
            <span className='font-16 d-flex mb-3 bold'>By Payment Type</span>
            {
               (this.state.CardOrderCount != 0 || this.state.CODOrderCount != 0 || this.state.PostToRoomOrderCount != 0 || this.state.BankTransferOrderCount != 0 || this.state.COTOrderCount != 0) ?
                <div className='chart-center'>
               <Chart
                   chartType="PieChart"

                  data={this.state.data}
                   options={{
                     chartArea: {
                       width: '90%', // Takes full width of the container
                       height: '90%' // Adjusts height proportionally
                     },
                     colors: ['#670066', '#7F007F', '#BE2AED', '#D996FE', '#EFBBFF'], // Apply colors dynamically
                     legend:'none',
                     pieSliceTextStyle: {
                      fontSize: 16, // Increases font size
                      bold: true, // Makes text bold
                    },

                   }}
                   width="200px" // Container width
                   height="200px" // Container height

                  //  legendToggle
                 />
                 </div>
                 :
                 <div className='empty-round-cirle-p'>
                 <div className='empty-round-cirle'>
                 <span>Nothing to present</span>
                 </div>
                 </div>
            }
                <ul className="mt-3">
        {this.state.sortedListData.map((item, index) => (
          <li key={index}>
            <div style={{background: `${colors[index]}`}} className='orders-pallate'></div>
            {item.icon}
            <span className="list-n-label ml-2">{Utilities.SpecialCharacterDecode(item.label)}</span>
            <span className="bold">
              {item.count}
              {/* Uncomment below if you want to show percentages */}
              {/* ({this.getPercentage(item.count, this.state.TotalOrders)}) */}
            </span>
          </li>
        ))}
      </ul>
            </div>
          </div>

          <div className="order-status-main-wrap mb-5 by-bal-by-guest-wrap">

            <div className="order-list-col-1">
            <span className='font-16 d-flex mb-3 bold'>By Order Value</span>
                <ul>
                  <li>
                    <i className="fa fa-arrow-up"></i>
                    <span className="list-n-label">
                      Highest Value
                    </span>
                    <span className="bold">{selectedCountryObj?.currencySymbol || currencySymbol}{this.convertCurr(this.state.HighValueOrderAmount)}</span>
                  </li>
                  <li>
                    <i className="fa fa-arrow-down"></i>
                    <span className="list-n-label">
                      Lowest Value
                    </span>
                    <span className="bold">{selectedCountryObj?.currencySymbol || currencySymbol}{this.convertCurr(this.state.LowValueOrderAmount)}</span>
                  </li>
                  <li>
                    <i className="fa fa-arrows-h" style={{fontSize:20}}></i>
                    <span className="list-n-label">
                      Avg.value
                    </span>
                    <span className="bold">{selectedCountryObj?.currencySymbol || currencySymbol}{this.state.TotalAmount > 0 ? this.convertCurr(Number(this.state.TotalAmount) / Number(this.state.TotalOrders)) : "0.00"}</span>
                  </li>
                </ul>
            </div>
            <div className="order-list-col-1">
            <span className='font-16 d-flex mb-3 bold'>By Guest</span>
                <ul>
                  <li>
                    <i className="fa fa-users"></i>
                    <span className="list-n-label">
                     Guests
                    </span>
                    <span className="bold">{this.state.CustomersCount}</span>
                  </li>
                  <li>
                    <i className="fa fa-user"></i>
                    <span className="list-n-label">
                     Orders per Guest
                    </span>
                    <span className="bold">{Number(this.state.TotalOrders) > 0 ? parseFloat(Number(this.state.TotalOrders)/Number(this.state.CustomersCount)).toFixed(2) : "0.00"}</span>
                  </li>
                  <li>
                    <i className="fa fa-building"></i>
                    <span className="list-n-label">
                     Order per Day
                    </span>
                    <span className="bold">{this.state.OrdersPerDay}</span>
                  </li>

                </ul>
            </div>

          </div>

          <div className="order-status-main-wrap top-ten-wrap mb-5">
            <div className='top-ten-main-wrap w-100'>

            {this.state.topRooms.length > 0  &&
              <div className='top-ten-left'>
                <div className='mb-3 d-flex align-items-center justify-content-between'>
              <span class="d-flex font-16 bold">Top 10 Rooms</span>
              <div className='iten-d-down top-10-d-down'>
                                    <Dropdown >
                  <Dropdown.Toggle id="dropdown-basic">
                    <span class="m-b-0 statusChangeLink w-100">
                      <div className='d-flex assign-text-img align-items-center justify-content-between w-100'>
                        <span className='mr-2'>{this.state.byOrder ? "By Orders" : "By Value" }</span>
                        <span className='theme-d-wrap'></span>
                      </div>
                    </span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                  <Dropdown.Item onClick={() => this.handleChangeRoomsBy(true)}>
                      <span class="m-b-0 statusChangeLink w-100">
                        <div className="orderlink-wraper my-0">
                        <span className="button-link" > By Orders <span className="badge badge-info"></span></span>
                        </div>
                      </span>
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => this.handleChangeRoomsBy(false)}>
                      <span class="m-b-0 statusChangeLink w-100">
                        <div className="orderlink-wraper my-0">
                        <span className="button-link" > By Value <span className="badge badge-info"></span></span>
                        </div>
                      </span>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                          </div>
              </div>
              <div className='top-ten-outer'>



                {this.state.topRooms.map((room, index) => {

                  return (
              <div className='top-ten-inner mb-2'>
                  <span className='t-count'>{index + 1}.</span>
                  <span className='t-room-no'>Room No. {room.RoomNo}</span>
                  {/* <span className='t-room-count'> {this.state.byOrder ? room.TotalOrder : currencySymbol + Utilities.FormatCurrency(room.TotalAmount, this.state.countryConfigObj?.DecimalPlaces)}</span> */}
                                    <span className='t-room-count'> {this.state.byOrder ? room.TotalOrder : `${selectedCountryObj?.currencySymbol || currencySymbol}${this.convertCurr(room.TotalAmount)}`}</span>
                </div>
                  )
                })}



                </div>
              </div> }
              {this.state.topSellingItems.length > 0  &&
              <div className='top-ten-left'>
                  <div className='mb-3 d-flex align-items-center justify-content-between'>
              <span class="d-flex font-16 bold">Top 10 Selling Items</span>
              <div className='iten-d-down top-10-d-down'>
                                    <Dropdown >
                  <Dropdown.Toggle id="dropdown-basic">
                    <span class="m-b-0 statusChangeLink w-100">
                      <div className='d-flex assign-text-img align-items-center justify-content-between w-100'>
                        <span className='mr-2'>{this.state.byQuantity ? "By Quantity" : "By Value" }</span>
                        <span className='theme-d-wrap'></span>
                      </div>
                    </span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                  <Dropdown.Item onClick={() => this.handleChangeSellingItemsBy(true)}>
                      <span class="m-b-0 statusChangeLink w-100">
                        <div className="orderlink-wraper my-0">
                        <span className="button-link" > By Quantity <span className="badge badge-info"></span></span>
                        </div>
                      </span>
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => this.handleChangeSellingItemsBy(false)}>
                      <span class="m-b-0 statusChangeLink w-100">
                        <div className="orderlink-wraper my-0">
                        <span className="button-link" > By Value <span className="badge badge-info"></span></span>
                        </div>
                      </span>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                          </div>
              </div>
              <div className='top-ten-outer'>




            {this.state.topSellingItems.map((item, index) => {

              return (


                    <div className="top-ten-inner">
                      <span className="t-count">{index + 1}.</span>
                      <span className="t-img-wrap">
                        {Utilities.stringIsEmpty(item.PhotoName) ?
                             <LuImage className='mr-2' style={{fontSize: 30}} />
                          :

                        <img src={Utilities.generatePhotoLargeURL(item.PhotoName, true, false)}/>
                        }
                      </span>
                      <span className="t-room-no">{Utilities.SpecialCharacterDecode(item.Name)}</span>
                      {/* <span className="t-room-count">{this.state.byQuantity ? item.TotalSold : currencySymbol + Utilities.FormatCurrency(item.TotalAmount, this.state.countryConfigObj?.DecimalPlaces)}</span> */}
                          <span className="t-room-count">{this.state.byQuantity ? item.TotalSold : `${selectedCountryObj?.currencySymbol || currencySymbol}${item.TotalAmount}`}</span>
                    </div>
              )
            })}

                </div>
              </div>
              }
            </div>
        </div>



 <div className="high-demand-wrap mb-5 px-0">
    <div className='mb-3 d-flex align-items-center px-4'>
      <span class="d-flex font-16 bold mr-4">Daily Orders</span>

                    <div className='iten-d-down top-10-d-down'>
                                    <Dropdown >
                  <Dropdown.Toggle id="dropdown-basic">
                    <span class="m-b-0 statusChangeLink w-100">
                      <div className='d-flex assign-text-img align-items-center justify-content-between w-100'>
                        <span className='mr-2'>{this.state.dailyDataByOrder ? "By Order" : "By Value" }</span>
                        <span className='theme-d-wrap'></span>
                      </div>
                    </span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                 <Dropdown.Item onClick={() => this.setState({ dailyDataByOrder: true }, () => this.calculateDailyData(this.state.EnterpriseOrders))}>
                      <span class="m-b-0 statusChangeLink w-100">
                        <div className="orderlink-wraper my-0">
                        <span className="button-link" > By Order <span className="badge badge-info"></span></span>
                        </div>
                      </span>
                    </Dropdown.Item>
                  <Dropdown.Item onClick={() => this.setState({ dailyDataByOrder: false }, () => this.calculateDailyData(this.state.EnterpriseOrders))}>
                      <span class="m-b-0 statusChangeLink w-100">
                        <div className="orderlink-wraper my-0">
                        <span className="button-link" > By Value <span className="badge badge-info"></span></span>
                        </div>
                      </span>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                          </div>

      <div className="ml-5 d-flex">
      </div>
    </div>
{this.state.showNoDataMsg ? (
    <div className="bold px-4">No data available for the selected range.</div>
  ) : (

    <Chart
      chartType="AreaChart"
      width="100%"
      height="400px"
      data={this.state.dailyData}
      options={{
        legend:'none',
        chartArea: {
          left: 70,
          right: 10,
          top: 20,
          bottom: 100,
        },
        hAxis: {

           textPosition: 'none'  // ✅ Hides x-axis labels and ticks
        },
        vAxis: {
          title: this.state.dailyDataByOrder ? "Number of Orders" : 'Amount',
          titleTextStyle: { italic: false, color: "#000", bold: true },
          format: '0'
        },
        colors: ['#670066']
      }}
    />
    )}
  </div>

          <div className='high-demand-wrap mb-5 px-0'>
          <div className='mb-3 d-flex align-items-center px-4'>
              <span class="d-flex font-16 bold mr-4">High-Demand Hours</span>
              <div className='iten-d-down top-10-d-down'>
                                    <Dropdown >
                  <Dropdown.Toggle id="dropdown-basic">
                    <span class="m-b-0 statusChangeLink w-100">
                      <div className='d-flex assign-text-img align-items-center justify-content-between w-100'>
                        <span className='mr-2'>{this.state.hourlyDataByOrder ? "By Order" : "By Value" }</span>
                        <span className='theme-d-wrap'></span>
                      </div>
                    </span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                  <Dropdown.Item onClick={() => { this.setState({hourlyDataByOrder: true}, () => this.calculateHourlyData(this.state.EnterpriseOrders)); }}>
                      <span class="m-b-0 statusChangeLink w-100">
                        <div className="orderlink-wraper my-0">
                        <span className="button-link" > By Order <span className="badge badge-info"></span></span>
                        </div>
                      </span>
                    </Dropdown.Item>
                  <Dropdown.Item onClick={() => { this.setState({hourlyDataByOrder: false}, () => this.calculateHourlyData(this.state.EnterpriseOrders)); }}>
                      <span class="m-b-0 statusChangeLink w-100">
                        <div className="orderlink-wraper my-0">
                        <span className="button-link" > By Value <span className="badge badge-info"></span></span>
                        </div>
                      </span>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                          </div>
              </div>
          <div className="order-status-main-wrap mt-0 ">

          <Chart
      chartType="ComboChart"
      width="100%"
      height="500px" // Explicit height for the chart
      data={this.state.hourlyData}
      options={{
        // title: "High-Demand Hours",
        vAxis: {
          title: this.state.hourlyDataByOrder ? "Number of Orders" : "Value",
          titleTextStyle: { italic: false, color: "#000", bold: true },
          format: "0",
        },
        hAxis: {
          title: "Hours",
          titleTextStyle: { italic: false, color: "#000", bold: true },
          slantedText: true, // No slant for shorter
          slantedTextAngle: 45, // Angle in degrees (e.g., 45 for diagonal)
          // showTextEvery: 1, // Ensure all labels are displayed

        },
        seriesType: "bars",
        colors: ["#670066"],
        bar: { groupWidth: "50%" }, // Adjust bar width for proportionality
        legend:'none',
        chartArea: {
          left: 70,
          right: 10,
          top: 20,
          bottom: 100,
        },
      }}
    />

          </div>
          </div>

          <div className='high-demand-wrap mb-5 px-0'>
          <div className='mb-3 d-flex align-items-center px-4'>
              <span class="d-flex font-16 bold mr-4">High-Demand Days</span>
              <div className='iten-d-down top-10-d-down'>
                                    <Dropdown >
                  <Dropdown.Toggle id="dropdown-basic">
                    <span class="m-b-0 statusChangeLink w-100">
                      <div className='d-flex assign-text-img align-items-center justify-content-between w-100'>
                        <span className='mr-2'>{this.state.weeklyDataByOrder ? "By Order" : "By Value" }</span>
                        <span className='theme-d-wrap'></span>
                      </div>
                    </span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                  <Dropdown.Item onClick={() => { this.setState({weeklyDataByOrder: true}, () => this.calculateWeeklyData(this.state.EnterpriseOrders)); }}>
                      <span class="m-b-0 statusChangeLink w-100">
                        <div className="orderlink-wraper my-0">
                        <span className="button-link" > By Order <span className="badge badge-info"></span></span>
                        </div>
                      </span>
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => { this.setState({weeklyDataByOrder: false}, () => this.calculateWeeklyData(this.state.EnterpriseOrders)); }}>
                      <span class="m-b-0 statusChangeLink w-100">
                        <div className="orderlink-wraper my-0">
                        <span className="button-link" > By Value <span className="badge badge-info"></span></span>
                        </div>
                      </span>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                          </div>
              </div>
          <div className="order-status-main-wrap mt-0 ">
          <Chart
      chartType="ComboChart"
      width="100%"
      height="500px" // Explicit height for the chart
      data={this.state.weeklyData}
      options={ {
        // title: "High-Demand Days",
        vAxis: {
          title: this.state.weeklyDataByOrder ? "Number of Orders" : "Value",
          titleTextStyle: { italic: false, color: "#000", bold: true },
          format: "0",
          ...(this.state.ticks.length > 0 && { ticks: this.state.ticks })
        },
        hAxis: {
          title: "Days",
          titleTextStyle: { italic: false, color: "#000", bold: true },
          slantedText: true, // No slant for shorter text
          slantedTextAngle: 45, // Angle in degrees (e.g., 45 for diagonal)
        },

        seriesType: "bars",
        colors: ["#670066"],
        bar: { groupWidth: "50%" }, // Adjust bar width for proportionality
        legend:'none',
        chartArea: {
          left: 70,
          right: 10,
          top: 20,
          bottom: 100,

        },
        annotations: {
          alwaysOutside: true, // Position the labels outside the bars
          textStyle: {
            fontSize: 12,
            color: "#000",
            bold: true,
          },
        },
      }}
    />

          </div>
              </div>

            <hr style={{maxWidth:"80%"}}/>
  {this.state.userObject.Enterprise.EnterpriseTypeId == Constants.ENTERPRISE_TYPE_IDS.HOTEL
  && !Utilities.stringIsEmpty(this.state.analyticsPropertyId)  &&
          <GoogleAnalytics EndDate={this.state.EndDate} StartDate={this.state.StartDate}/>
  }
          </div>

          <Modal isOpen={this.state.servicesSelection} toggle={() => this.servicesSelectionModal()} className={this.props.className}>
          <ModalHeader toggle={() => this.servicesSelectionModal()} >Services</ModalHeader>
          <ModalBody className='services-selection-wrap'>

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

                          <span className='services-img-dashboard'>

                          { enterprise.PhotoName != "" ?
                            <img src={Utilities.generatePhotoLargeURL(enterprise.PhotoName, true, false)} />
                            :
                            <div className="user-avatar-web">
                            <Avatar className="header-avatar" name={enterpriseName} round={true} size="35" textSizeRatio={2} />
                          </div>
                          }
                          </span>
                          <span className="button-link"  > {enterpriseName} {isExistInCsv} <span className="badge badge-info"></span></span>
                        </label>
                      </li>

                      )

                    })
                    :

                    <div>No service found.</div>

                    }

                  </ul>
                </div>



          </ModalBody>
          <FormGroup className="modal-footer" >
            <div className='mr-auto'> <label id="name" class="control-label mt-2 text-danger"></label>
            </div>
            <div>
              <Button className='mr-2 text-dark' color="secondary" onClick={() => this.servicesSelectionModal()}>Cancel</Button>
              <Button color="primary" onClick={() => this.handleServiceSelection()} disabled={!this.state.serviceSeleted}>
              {/* <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>   */}
              <span className="comment-text" >Done</span>
              </Button>
            </div>
          </FormGroup>
        </Modal>

        <Modal isOpen={this.state.showCurrencyModal} toggle={() => this.currencySelectionModal()} className={this.props.className}>
          <ModalHeader toggle={() => this.currencySelectionModal()} >Currencies</ModalHeader>
          <div class="dataTables_filter w-100 mb-0 d-country-selection-search" style={{padding:"20px"}}>
                    <input type="search" className="form-control common-serch-field" placeholder="Search" onChange={(e) => this.setState({ searchText: e.target.value })}/>
                  </div>
          <ModalBody className='d-country-selection-wrap pt-0'>

                   <ul className='d-flex flex-column d-country-selection-list'>
                    {this.getVisibleCountries()?.map((item) => {
                      return (
                        <li className={`mb-2 d-country-selection-list-s ${this.state.selectedCountryObj != undefined && item.code == this.state.selectedCountryObj.code ? 'active' : ""}`} key={item.code} onClick={() => this.selectCountry(item)}>
                        <label className='cursor-pointer' htmlFor={"chk"+item.code}>
                          <span className='services-img-dashboard'>
                            <img src={item.flag} alt={``} />
                          </span>
                          <span className="button-link"  > {item.country}</span>
                            <span className="country-sel-check" style={{display:"none"}}>
                              <FaCheck />
                            </span>
                        </label>
                      </li>
                      )
                    })}
                  </ul>
          </ModalBody>
        </Modal>

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
