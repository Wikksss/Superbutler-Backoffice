import GlobalData from './GlobalData';
import Constants from './Constants';

var restaurant = GlobalData.restaurants_data.Supermeal_dev;

const Config = {
    Setting : {
        envConfiguration: restaurant.env_Configuration,
        baseUrl : restaurant.baseUrl,
        apiURL: restaurant.coreApiURL,
        clientApi: restaurant.clientApi,
        baseImageURL: restaurant.baseImageUrl,
        currencySymbol: restaurant.currency,
        timeZone: restaurant.timezone,
        termsAndConditionLink: restaurant.termsAndConditionLink,
        isUk: restaurant.isUk,
        currency: restaurant.currency,
        csvSeperator: restaurant.csvSeperator,
        decimalPlaces : restaurant.decimalPlaces,
        distanceUnit: restaurant.distanceUnit,
        dateFormat: restaurant.dateFormat,
        heartbeatInterval : 10000, //1000 is one sec,
        app : "SuperCenter",
        countryCode : restaurant.countryCode,
        zoneLimit : restaurant.zoneLimit,
        goOfflineHours : "2,4,6",
        goOfflineDays : "0,1,2,3,4,5,6,7",
        googleApi: restaurant.Google_Api_Key,
        DefaultLocation: restaurant.Google_Lat_Long,
        SupportEmail: restaurant.SupportEmail,
        CategoryImage_W_H: restaurant.Category_Image_Width_Height,
        ProductImage_W_H: restaurant.Product_Image_Width_Height,
        bankkDetails: restaurant.Enterprise_Bank_Details,
        itemFilters: restaurant.Item_Filters,
        SessionExpiry: restaurant.Session_Expire_In_Hours,
        preOrderAcceptDuration: restaurant.PreOrderAcceptDuration

      },


      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'App': "SuperCenter",
        'Authorization': "Bearer " + localStorage.getItem(Constants.Session.JWT_TOKEN),
        'AuthenticationTicket': localStorage.getItem(Constants.Session.AUTHENTICATION_TICKET) === "null" ? "" : localStorage.getItem(Constants.Session.AUTHENTICATION_TICKET),
        'ImpersonatorID': localStorage.getItem(Constants.Session.IMPERSONATORID) === "null" ? "" : localStorage.getItem(Constants.Session.IMPERSONATORID)
    }
} 
  
  export default Config