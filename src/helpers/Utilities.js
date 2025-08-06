import UrlConstant from './URLConstants';
import Constants from './Constants';
import Config from './Config';
import *as svgIcon from '../containers/svgIcon';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const moment = require('moment-timezone');
const regExpDecimal = /^[0-9]+(\.[0-9]{0,2})?$/;
// a global month names array
const gsMonthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'];


export let stringIsEmpty = (str) => {
    return (!str || /^\s*$/.test(str));
};


export let generatePhotoURL = (photoName) => {

    return Config.Setting.baseImageURL + photoName;

}

export let generatePhotoLargeURL = (photoName, forceNull, isCover,check) => {
   

    if((photoName !== undefined) && (decodeURIComponent(photoName).split('/').length > 1))
    {
        return Config.Setting.baseImageURL + photoName
    }
   
    if (photoName === null || photoName === "" || photoName === undefined) {
        if (forceNull === true) { return "" }
        return generatePhotoThumbURL(photoName, forceNull, isCover)
    }
    return ((isCover !== undefined && isCover === true) ? UrlConstant.ThumbImageURL.replace("images", "uncropped-images") : UrlConstant.LargeImageURL) + photoName.substring(0, 3) + "/" + photoName.substring(3, 6) + "/" + photoName;
}

export let RemoveDefinedSpecialChars = (e) => {

    let initVal = e.target.value.replace(/"/gi, "").replace(/\\/gi, "");

    let specialChars = ";/:^#|`~[]{}<>?";

    for (var i = 0; i < specialChars.length; i++) {
        initVal = initVal.replace(new RegExp("\\" + specialChars[i], 'gi'), "");
    }

    e.target.value = initVal;
    // console.log(e.target.value);
}

export let RemoveSpecialChars = (e) => {

    let initVal = e.target.value.replace(/"/gi, "").replace(/\\/gi, "");

    let specialChars = "!@$^&%*()+=[]/{}|:<>?,.*;";

    for (var i = 0; i < specialChars.length; i++) {
        initVal = initVal.replace(new RegExp("\\" + specialChars[i], 'gi'), "");
    }

    e.target.value = initVal;
    // console.log(e.target.value);
}

export let RemoveSpecialCharsFromString = (value) => {

    let initVal = value.replace(/"/gi, "").replace(/\\/gi, "");

    let specialChars = "!#@$^&%*()+=[]/{}|:<>?,*;'";

    for (var i = 0; i < specialChars.length; i++) {
        initVal = initVal.replace(new RegExp("\\" + specialChars[i], 'gi'), "");
    }

    return initVal;
    // console.log(e.target.value);
}

export let FormatCurrency = (number, decimals) => {
    var separator = "."; // Default to period as decimal separator
    number = Number(number);
    decimals = (decimals === undefined || decimals === null) ? 2 : decimals; // Default to 2 decimals
    var divider = (decimals === 2) ? 100 : 1;

    var value = "";

    if (Number(decimals) === 0) {
        value = number.toLocaleString().split(separator)[0];
    }
    else {

        if (number.toLocaleString().split('.').length > 2) {
            value = (Math.floor(number * (1000)) / divider).toLocaleString();
        }
        else {

            value = number.toLocaleString();
        }
        value = value.toLocaleString().split(separator)[0] + ((value.toLocaleString().split('.').length > 1) ? "." + ((value.split('.')[1].length === 1) ? value.split('.')[1] + "0" : value.split('.')[1].substr(0, 2)) : ".00");
    }

    return value;
}


export let ValidateDecimals = (e) => {

    let value = e.target.value;
    // remove all characters that aren't digit or dot
    value = value.replace(/[^0-9.]/g, '');
    // replace multiple dots with a single dot
    value = value.replace(/\.+/g, '.');
    value = value.replace(/(.*\.{[0-9][0-9][0-9]}?).*/g, '$1');

    // replace multiple zeros with a single one
    value = value.replace(/^0+(.*)$/, '0$1');
    // remove leading zero
    value = value.replace(/^0([^.].*)$/, '$1');

    e.target.value = value;
}

export let ValidateDecimalInteger = (e) => {

    let value = e.target.value;
    // remove all characters that aren't digit or dot or -
    value = value.replace(/[^0-9.-]/g, '');
    // replace multiple dots with a single dot
    value = value.replace(/\.+/g, '.');
    value = value.replace(/(.*\.{[0-9][0-9][0-9]}?).*/g, '$1');

    // replace multiple zeros with a single one
    value = value.replace(/^0+(.*)$/, '0$1');
    // remove leading zero
    value = value.replace(/^0([^.].*)$/, '$1');
    var regex = /^[+-]?[0-9]*(?:\.[0-9]{1,2})?$/
    if(!(regex.test(value))){
        if(value.slice(-1) !='.')
            value = value.slice(0, -1)
    }
    e.target.value = value;
}


export let FormatCsv = (csv, csvSeperator) => {

    if (csv == null || csv === "") return "";

    if (csv.lastIndexOf(csvSeperator) !== -1) {
        csv = csv.substring(0, csv.length - csvSeperator.length);
    }

    return csv;
}

export let GetEnterpriseIDFromSession = () => {

    let userObject = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
    return userObject.Enterprise.Id
}

export let GetCurrencySymbol = () => {

    let countryConfig = JSON.parse(localStorage.getItem(Constants.Session.COUNTRY_CONFIGURATION))
    if(countryConfig != undefined && countryConfig != null){
        return countryConfig.CurrencySymbol;
    }
    return Config.Setting.currencySymbol
    
}

export let GetEnterpriseIDFromSessionObject = () => {

    return localStorage.getItem(Constants.Session.ENTERPRISE_ID);
}
export let generatePhotoThumbURL = (photoName, forceNull, isCover) => {
    if (photoName === null || photoName === "") {
        if (forceNull === true) {
            return "";
        }
        photoName = "000000000_no-image.jpg";
    }
    return ((isCover !== undefined && isCover === true) ? UrlConstant.ThumbImageURL.replace("images", "uncropped-images") : UrlConstant.ThumbImageURL) + photoName.substring(0, 3) + "/" + photoName.substring(3, 6) + "/" + photoName;
}

export let GetDate = (dateTimeValue) => {
    var date = moment();
    var momentDate = moment.tz(date, Config.Setting.timeZone);
    if (!stringIsEmpty(dateTimeValue) && moment.isMoment(dateTimeValue)) {
        momentDate = moment(dateTimeValue.format(Constants.DATE_FORMATE_DD_MM_YYYY), Config.Setting.timeZone);
    }
    return momentDate;
}

export let FormatDate = (stringDate) => {
    // stringDate may be json date or string date
    return moment(stringDate);
}

export let GetObjectArrId = (id, arrObject) => {

    var rowId = "-1";
    for (var arrobj = 0, arrlen = arrObject.length; arrobj < arrlen; arrobj++) {
        if (Number(arrObject[arrobj].Id) === Number(id) || Number(arrObject[arrobj].ID) === Number(id)) {
            rowId = arrobj;
            break;
        }
    }
    return rowId;
}

export let SortByName = (x, y) => {
    return ((x.Name.toLowerCase() === y.Name.toLowerCase()) ? 0 : ((x.Name.toLowerCase() > y.Name.toLowerCase()) ? 1 : -1));
}

export let isExistInCsv = (val, csv, seperator) => {

    if ((csv === "") || (val === "")) return false;

    var arrList = FormatCsv(csv, seperator).split(seperator);
    var flag = false;

    arrList.forEach(value => {
        if (value === String(val)) {
            flag = true;
        }
    })

    return flag;
}

export let GetRoleName = (roleId) => {

    switch (Number(roleId)) {
        case 0:
            return "Consumer";
        case 1:
            return "System_Admin";
        case 2: 
        case 16:
            return "Moderator";
        case 4:
            return "Admin";
        case 3:
            return "Reseller Admin";
        case 5:
        case 17:
            return "Manager";
        case 6: 
            return "Staff"
        case 18:
            return "User";
        case 7:
            return "Corporate_Admin";
        case 8:
            return "Anonymous";
        case 9:
            return "Advertiser";
        case 14:
            return "Foortal_Restaurant_Admin";
        default:
            return "";
    }
}

export let HasPermission = (roleLevel, permission) => {

    try {
        let permissions = null;

        if (!stringIsEmpty(localStorage.getItem(Constants.Session.ALL_PERMISSION))) {
            permissions = JSON.parse(localStorage.getItem(Constants.Session.ALL_PERMISSION))
        }

        return (permissions.hasOwnProperty(permission)) && (permissions[permission].split(',').indexOf(roleLevel.toString()) > -1);

    }
    catch (e) {
        return false;
    }

}

export let SpecialCharacterDecode = (text) => {

    if (stringIsEmpty(text)) {
        return text;
    }

    text = text.replace(/&#34;/gi, '"');
    text = text.replace(/&#39;/gi, "'");
    text = text.replace(/&#96;/gi, '`');
    text = text.replace(/&#145;/gi, '‘');
    text = text.replace(/&#146;/gi, '’');
    text = text.replace(/gi&#147;/gi, '“');
    text = text.replace(/&#148;/gi, '”');
    text = text.replace(/&lt;/gi, "<");
    text = text.replace(/&gt;/gi, ">");
    text = text.replace(/<br>/gi, "\n");
    text = text.replace(/&#47;/gi, "/");
    text = text.replace(/&#43;/gi, "+");
    text = text.replace(/&#163;/gi, "£");
    text = text.replace(/&amp;/gi, "&");
    text = text.replace(/amp;/gi, "");
    text = text.replace(/&#%5C/gi, "\\");
    text = text.replace(/&#126;/gi, "~");
    text = text.replace(/&quot;/gi, '"');
    return text;
}

export let SpecialCharacterEncode = (text) => {

    if (stringIsEmpty(text)) {
        return text;
    }

    text = text.replace(/"/gi, "&#34;");
    text = text.replace(/'/gi, "&#39;");
    text = text.replace(/`/gi, "&#96;");
    text = text.replace(/‘/gi, "&#145;");
    text = text.replace(/’/gi, "&#146;");
    text = text.replace(/“/gi, "&#147;");
    text = text.replace(/”/gi, "&#148;");
    text = text.replace(/\//gi, "&#47;");
    text = text.replace(/\\/gi, "&#%5C");
    text = text.replace(/</gi, "&lt;");
    text = text.replace(/>/gi, "&gt;");
    text = text.replace(/\r?\n|\r/g, "<br>");
    text = text.replace(/(?:\\[rn]|[\r\n]+)+/g, "<br>");
    text = text.replace(/\xA0/g, " ");
    text = text.replace(/%x000A/g, ""); //U+000A 
    text = text.replace(/%x000C/g, "");//U+000C

    return text;
}

export let GetDateDifferenceInTime = (date, timeZone) => {

    if(timeZone == undefined) timeZone = Config.Setting.timeZone;
    date = new Date(date);
    var date2 = new Date(moment.tz(timeZone).format("YYYY-MM-DDTHH:mm:ss"));

    var sec = date2.getTime() - date.getTime();
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
    days = Math.floor(sec / day);
    sec -= days * day;
    hours = Math.floor(sec / hour);
    sec -= hours * hour;
    minutes = Math.floor(sec / minute);
    sec -= minutes * minute;
    seconds = Math.floor(sec / second);

    if (days >= 7) {
        var month = gsMonthNames[date.getMonth()].substr(0, 3);
        day = (date.getDate().toString().length === 1) ? "0" + date.getDate() : date.getDate();
        var year = date.getFullYear();
        return day + " " + month + " " + year;
        //return this.GetDateFormat(date);
    } else

        if (days > 1 && days < 7) {
            return days + ' days ago';
        } else if (days === 1) {
            return days + ' day ago';
        } else if (hours > 1) {
            return hours + '  hours ago';
        } else if (hours === 1) {
            return hours + ' hour ago';
        } else if (minutes > 1) {
            return minutes + ' mins ago';
        } else if (minutes === 1) {
            return minutes + ' min ago';
        } else if (seconds >= 0) {
            return seconds + '  sec ago';
        }
    return '0  sec ago';
}


export let GetWaitingTime = (date, averageTime, timeZone, resolvedOn) => {

    moment.tz.setDefault(moment.tz.guess());

    date = getDateByZone(moment(date).format("YYYY-MM-DDTHH:mm:ss"), "DD MMM YYYY HH:mm:ss", timeZone)
    
    date = new Date(date);
    var date2 = new Date(moment.tz(timeZone).format("YYYY-MM-DDTHH:mm:ss"));

    if(resolvedOn != undefined)
    date2 = new Date(getDateByZone(moment(resolvedOn).format("YYYY-MM-DDTHH:mm:ss"), "DD MMM YYYY HH:mm:ss", timeZone))

    if(averageTime > 0){

        var sec = new Date(date2).getTime() - date.getTime();

        var diffMinutes = sec / (60 * 1000);
        if(resolvedOn == undefined)
            return diffMinutes > averageTime;
    }


    var sec = date2.getTime() - date.getTime();

    var time =''
    if (isNaN(sec)) {
        //alert("Input data is incorrect!");
        time = '';
    }

    if (sec < 0) {
        //alert("The second date ocurred earlier than the first one!");
        time = '0  sec ago';
    }

    
    var second = 1000, minute = 60 * second, hour = 60 * minute, day = 24 * hour;
    var days = 0, hours = 0, minutes = 0, seconds = 0;
    days = Math.floor(sec / day);
    sec -= days * day;
    hours = Math.floor(sec / hour);
    sec -= hours * hour;
    minutes = Math.floor(sec / minute);
    sec -= minutes * minute;
    seconds = Math.floor(sec / second);

    if (days >= 7) {
        var month = gsMonthNames[date.getMonth()].substr(0, 3);
        day = (date.getDate().toString().length === 1) ? "0" + date.getDate() : date.getDate();
        var year = date.getFullYear();
        time = day + " " + month + " " + year;
    } else

        if (days > 1 && days < 7) {
            time = days + ' days ago';
        } else if (days == 1) {
            time = days + ' day ago';
        } else if (hours >= 1) {
            time = minutes > 0 ? `${hours} hours ${minutes} mins ago` : hours +'  hours ago';
        } else if (minutes >= 1) {
            time = minutes + ' mins ago';
        } else if (seconds >= 0) {
            time = seconds + '  sec ago';
        }
    return resolvedOn == undefined ? time : (diffMinutes > averageTime ? time : '') ;
}


export let notify = (msg, t) => {
    if (t === 's')
        toast.success(msg, { position: "top-center", autoClose: 4000 });
    else if (t === 'e')
        toast.error(msg, { position: "top-center", autoClose: 4000 });
};

export let IsNumber = (number) => {

    if (!regExpDecimal.test(Number(number))) {
        return false;
    }
    return true;
}


export let IsValidPostCodeUK = (p) => {
    var postcodeRegEx = /^([A-Z]{1,2}\d{1,2}[A-Z]?)\s*(\d[A-Z]{2})$/i;
    return postcodeRegEx.test(p);
}

export let FormatPostCodeUK = (p) => {
    p = p.replace(/\r?\n|\r/g, "");
    if (IsValidPostCodeUK(p)) {
        var postcodeRegEx = /^([A-Z]{1,2}\d{1,2}[A-Z]?)\s*(\d[A-Z]{2})$/i;
        return p.replace(postcodeRegEx, "$1 $2");
    } else {
        return p;
    }
}

export let SetSessionExpired = (s) => {

    if (s.indexOf("[F000022]") !== -1) {

        this.ClearSession();
        window.location.href = "/login"
    }

}
export let GetResourceValue = (platform, coreValue, shoplyValue) => {
    return platform == 'core' ? coreValue : shoplyValue
}

export let ClearSession = (s) => {

    localStorage.removeItem(Constants.Session.AUTHENTICATION_TICKET);
    localStorage.removeItem(Constants.Session.USER_OBJECT);
    localStorage.removeItem(Constants.Session.ALL_PERMISSION);
    localStorage.removeItem(Constants.Session.ENTERPRISE_ID);
    localStorage.removeItem(Constants.Session.ENTERPRISE_NAME);
    localStorage.removeItem(Constants.Session.IMPERSONATORID);
    localStorage.removeItem(Constants.Session.PARENTIMPERSONATORID);
    localStorage.removeItem(Constants.Session.ADMIN_OBJECT);
    localStorage.removeItem(Constants.MEMBERSHIP_ID);
    localStorage.removeItem(Constants.Session.IS_MENU_MODIFIED);
    localStorage.removeItem(Constants.Session.SESSION_START_AT);
    localStorage.removeItem(Constants.Session.COUNTRY_CONFIGURATION);
    localStorage.removeItem(Constants.Session.CONFIGURATION_OBJ)
    localStorage.removeItem(Constants.Session.SELECTED_ORDER_QUERY)
    localStorage.removeItem("Registered");
    // window.location.href = "/login"

}

export let urlValidation = (url) =>{
    var regex = /^(ftp|http|https):\/\/[^ "]+$/
    var valid = regex.test(url);
    return valid
}

export let numberValidation = (number) =>{
    var regex = /^\s*[+-]?(\d+|\.\d+|\d+\.\d+|\d+\.)(e[+-]?\d+)?\s*$/
    var valid = regex.test(number);
    return valid
}

export let GetOrderStatusDateDifferenceInSec = (date, date2) => {

    date = new Date(moment(date).tz(Config.Setting.timeZone).format("YYYY-MM-DDTHH:mm:ss")) ;
    date2 = new Date(moment(date2).tz(Config.Setting.timeZone).format("YYYY-MM-DDTHH:mm:ss"));
    
    var sec = date2.getTime() - date.getTime();
    
    if (isNaN(sec)) {
        return '';
    }

    return sec;
    
}   

export let getDateByZone = (dateTimeValue, format, timeZone) => {
    
    moment.tz.setDefault(timeZone);

    var isOnlyDate = false;

    try {
        // Check if it's only a date with slashes (DD/MM/YYYY)
     isOnlyDate = /^\d{2}\/\d{2}\/\d{4}$/.test(dateTimeValue.trim());
    } catch (error) {
        console.log("error: Invalid date" )
    }
    
    let localTime;
    if (isOnlyDate) {
        // Parse with format hint
        localTime = moment.tz(dateTimeValue.trim(), "DD/MM/YYYY", timeZone).toDate();
    } else {
        // Assume it's a datetime string that moment can handle
        localTime = moment.utc(dateTimeValue.trim()).toDate();
    }

    return moment(localTime).format(format == undefined ? "YYYY MMM DD hh:mm a" : format);
}

export let ConvertLocalTimeToUTCWithZone = (dateTimeValue, format, timeZone) => {
    
    
    var date = moment(dateTimeValue).format("YYYY-MM-DD HH:mm:ss");
    var momentDate = moment.tz(date, Config.Setting.timeZone);
    if (!stringIsEmpty(dateTimeValue) && moment.isMoment(dateTimeValue)) {
        momentDate = moment(dateTimeValue.format(Constants.DATE_FORMATE_DD_MM_YYYY), Config.Setting.timeZone);
    }

    // construct a moment object
    var m = moment.tz(momentDate, 'llll', timeZone);
    // convert it to utc
    m.utc();

    // format it for output
    var formatedValue = m.format(format)  // result: "05/30/2014 3:21:37 PM"
    return formatedValue;
}

export let PhoneFormat = (e) => {

     let numbers = e.target.value; 
     let initVal = "";

     for (var i = 0; i < numbers.length; i++) {

        initVal += IsNumber(numbers[i]) || (numbers[i] == "+" && i == 0) ?  numbers[i] : "";
    }

    e.target.value = initVal.trim();
}

export let removeExtraSpaces = (text) => {
    if ((stringIsEmpty(text) || text == null || typeof(text) == "number" || typeof(text) == "boolean" || typeof(text) == "undefined")) {
        return text
    }

    text = text.trim()
    
    return text;
}

export let convertNewLinetoHTMLTag = (text) =>{
    text = text.replace('\n','<br>').trim()
    return text;
}


export let calculateGCD = (a, b) => {
    while (b !== 0) {
      let temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }


export let ratioCalculation = (value) => {
    var a = value[0]
    var b = value[1]
    const ratio = a / b;
    const gcd = calculateGCD(a, b);
    const ratioX = a / gcd;
    const ratioY = b / gcd;
    return {descriptionKey:`${ratioX} : ${ratioY}`, ratio: ratioX + '/' + ratioY};
  }
 
  export let maskString = (str) => {
    const visibleCount = 3
    var isMasked = JSON.parse(localStorage.getItem(Constants.Session.PRIVACY_SWITCH));

    if (str.length <= visibleCount || !isMasked) return str;

    if (/^\+?\d+$/.test(str)) {
        const visiblePart = str.slice(0, visibleCount); // First 3 digits
        const maskedPart = '*'.repeat(Math.max(str.length - 5, 0)); // Mask everything except first 3 and last 2 digits
        const lastTwo = str.slice(-2); // Last 2 digits
        return visiblePart + maskedPart + lastTwo; // Return formatted phone number
    }

    if (str.includes('@')) {
        const [localPart, domainPart] = str.split('@');
        const visiblePart = localPart.slice(0, visibleCount); // First 3 characters of the local part
        const maskedPart = '*'.repeat(Math.max(localPart.length - visibleCount, 0)); // Mask the middle part
        return visiblePart + maskedPart + '@' + domainPart; // Combine parts
    }

    return str;
};



export let GetEnterpriseIcon = (type) => {

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
    return icon
  }

  export let GetEnterpriseType = (type) => {

    var enterpriseType = "";
  
    if (type == 1)
      enterpriseType = "Food Portal";
  
    if (type == 2)
      enterpriseType = "Agent";
  
    if (type == 3)
      enterpriseType = "Room Service";
  
    if (type == 4)
      enterpriseType = "Mini Bar";
  
    if (type == 5)
      enterpriseType = "Hotel";
  
    if (type == 6)
      enterpriseType = "Restaurant";
  
    if (type == 7)
      enterpriseType = "Shop";
  
    if (type == 10)
      enterpriseType = "Laundry";
  
    if (type == 11)
      enterpriseType = "SPA & Fitness";
  
    if (type == 12)
      enterpriseType = "Car Rental";
  
    if (type == 13)
      enterpriseType = "Travel & Tour";
  
    if (type == 14)
      enterpriseType = "Meeting & Events";
  
    if (type == 15)
      enterpriseType = "Housekeeping";
  
    if (type == 16)
      enterpriseType = "Chat Support";

    if (type == 17)
      enterpriseType = "Room Booking";

    if (type == 18)
      enterpriseType = "Luggage Storage";
    
    if (type == 19)
        enterpriseType = "Concierge Chat";

    if (type == 20)
        enterpriseType = "Restaurant & Cafe"
    
    return enterpriseType;
  
  }

  export let hasPaid = (paymentModes, status, payableAmount) => {

    let paid = true;
    paymentModes.forEach(mode => {
      if ((Number(mode.PaymentMode) === 1 || Number(mode.PaymentMode) === 5 || Number(mode.PaymentMode) === 6 || Number(mode.PaymentMode) === 7) && Number(status) !== 4 && Number(payableAmount > 0)) {
        paid = false;
      }
    });
    return paid;
  }

  export let isCardOrder = (paymentModes, payableAmount) => {

    let paid = true;
    paymentModes.forEach(mode => {
      if ((Number(mode.PaymentMode) === 1 || Number(mode.PaymentMode) === 5 || Number(mode.PaymentMode) === 6 || Number(mode.PaymentMode) === 7) && Number(payableAmount > 0)) {
        paid = false;
      }
    });
    return paid;
  }

  export let SetPaymentMode = (paymentModes, status, payableAmount) => {

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


export const convertCurrency = (amount, fromCurrency, toCurrency, rates) => {
  if (!rates[fromCurrency] || !rates[toCurrency]) return 0;

  const baseAmount = amount / rates[fromCurrency]; // convert to base (e.g., USD)
  const convertedAmount = baseAmount * rates[toCurrency];

  return convertedAmount.toFixed(2);
};
