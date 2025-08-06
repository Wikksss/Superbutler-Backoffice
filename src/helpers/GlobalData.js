//==========================================================
// Web Service BaseURL

import Constants from "./Constants";

//==========================================================

var accessKeys = JSON.parse(localStorage.getItem(Constants.Session.CONFIGURATION_OBJ)) != undefined ? JSON.parse(localStorage.getItem(Constants.Session.CONFIGURATION_OBJ)) : {}
const TimeZone = {
    ukTimeZone: "Europe/London",
    pkTimeZone: "Asia/Karachi",
    aeTimeZone: "Asia/Dubai"
};


const BaseURLs = {
    // coreApiURL : "https://testapi.superbutler.ai/api",
    coreApiURL : "http://localhost:51477/api",
    baseImageURL: "https://cdn-superme-test.s3.eu-west-1.amazonaws.com/s/butler",
    baseURL: "https://testapi.superbutler.ai",
    clientId: "postman",
    clientSecret : "test123",
    distanceUnit: "mile(s)",
   countryCode: "+44",
   timeZone : TimeZone.ukTimeZone,
   DateFormat:"DD/MM/YYYY", 
   currencySymbol: "£",
   SupportEmail:'support@superbutler.ai',
   GoogleAPIkEY: 'AIzaSyB7FZe7D20kpyiNs55Ab1WU6J1Bl6Y7Nds',
   Platform:'core' //superShoply //core
};
 export const parentCountryCode = "+44"
 
 export const firebaseConfig = {
     apiKey: "AIzaSyDHRnN_B-KGuHsUBUIKxjN7oSEX4S4g8rM",
     authDomain: "superbutler-7c566.firebaseapp.com",
     projectId: "superbutler-7c566",
     storageBucket: "superbutler-7c566.appspot.com",
     messagingSenderId: "477573516701",
     appId: "1:477573516701:web:3e30c1f157f1c96822b374",
     measurementId: "G-BBZ3XCDR9K"
    };


 export const env_Development = {
    CDN_URL : "https://cdn.superme.al",
    ContentPath: "s/butler/"
  };



export const firebaseVapidKey = "BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4"



const GlobalData = {

    restaurants_data: {

        Supermeal_dev: {
            env_Configuration: env_Development,
            isUk: true,
            coreApiURL : BaseURLs.coreApiURL,
            clientApi : { ClientId: BaseURLs.clientId, ClientSecret: BaseURLs.clientSecret},
            baseUrl: BaseURLs.baseURL, 
            baseImageUrl: BaseURLs.baseImageURL,
            currency: BaseURLs.currencySymbol,
            decimalPlaces: 2,
            csvSeperator: '^^^',
            distanceUnit: BaseURLs.distanceUnit,
            timezone: BaseURLs.timeZone,
            countryCode: BaseURLs.countryCode,
            dateFormat:BaseURLs.DateFormat,
            DeliveryCharges: "0",
            DeliveryTime: "45",
            MinimumDeliveryOrder: "10",
            zoneLimit: 5,
            Google_Api_Key: BaseURLs.GoogleAPIkEY,
            SupportEmail: BaseURLs.SupportEmail,
            Google_Lat_Long: [51.507351,-0.127758],
            Delivery_Zone_Color_Palette : ["#27ae60","#3498db","#f1c40f","#e74c3c","#8e44ad"],
            Campaign_Logo_Image_Width_Height : ["175","55"],
            Campaign_Main_Banner_Width_Height : ["600","318"],
            Campaign_Sub_Banner_Width_Height : ["1920","150"],
            Campaign_App_Sub_Banner_Width_Height : ["600","100"],
            Campaign_Food_Image_Width_Height : ["750","750"],
            Campaign_Background_Image_Width_Height : ["1920","1080"],
            Campaign_App_Background_Image_Width_Height : ["1000","1000"], 
            Category_Image_Width_Height : ["900","200"], 
            Product_Image_Width_Height : ["500","500"],
            Slider_Web_Image_Width_Height : ["2800","550"],
            Slider_Responsive_Image_Width_Height : ["400","300"],
            Enterprise_Bank_Details : "Account Name:;Account Number:;Bank Name:;Branch Name:;Branch Address:;Swift Code:;",
            Item_Filters : "Brand::;Tags::;Dietry::;VideoURL::;",
            Session_Expire_In_Hours: 24,
            Platform: BaseURLs.Platform,
            PreOrderAcceptDuration: 90,
            PageSize: 100,
        }

    }

}

export default GlobalData
