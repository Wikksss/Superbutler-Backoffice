import * as Utilities from './helpers/Utilities';
//import Config from './helpers/Config';
import Constants from './helpers/Constants';
import GlobalData from './helpers/GlobalData'
import Labels from './containers/language/labels';
import {parentCountryCode} from'./helpers/GlobalData'

let SetItem = (name, url, icon, childrens) => {

  let item = {};

  if (childrens !== undefined) {

    item = { name: name, url: url, icon: icon, children: childrens }
  }
  else {
    item = { name: name, url: url, icon: icon }
  }

  return item;

}

let SetChildren = (name, url) => {

  return { name: name, url: url }

}

function GetEnterpriseIcon (type) {

  var icon = "fa fa-cutlery";

  if (type == 7)
    icon = "fa fa-list-ul";
  return icon
}

function GetEnterpriseType (type) {

  var enterpriseType = "";

  if (type == 1)
    enterpriseType = "Food Portal";

  if (type == 2)
    enterpriseType = "";

  if (type == 3)
    enterpriseType = "Menu";

  if (type == 4)
    enterpriseType = "Mini Bar";

  if (type == 5)
    enterpriseType = "Hotel";

  if (type == 6)
    enterpriseType = "Menu";

  if (type == 7)
    enterpriseType = "Products";

  if (type == 10)
    enterpriseType = "Laundry & Repair Services";

  if (type == 11)
    enterpriseType = "SPA & Fitness Services";

  if (type == 12)
    enterpriseType = "Rides";

  if (type == 13)
    enterpriseType = "Tour Packages";

  if (type == 14)
    enterpriseType = "Meeting & Events";

  if (type == 15)
    enterpriseType = "Housekeeping";

  if (type == 16)
    enterpriseType = "Chat Support";

  if (type == 17)
    enterpriseType = "Room Booking";

  if (type == 18)
    enterpriseType = "Luggage";

  return enterpriseType;

}
export let SetNavigation = () => {

  let navigation = { items: [] };
  //let nav = {};
  let children = [];


  if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
    let userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
    let UserRole = userObj.RoleLevel;
    

    if((userObj.Enterprise.EnterpriseTypeId == 3 || userObj.Enterprise.EnterpriseTypeId == 6) && (UserRole != Constants.Role.STAFF_ID)) {
      navigation.items.push(SetItem('Order Modes', '/order-mode', 'fa fa-list-alt'));
    }

    if(userObj.Enterprise.EnterpriseTypeId == 15) {
  
      //#region Item Orders
  
      if ((UserRole == Constants.Role.ENTERPRISE_ADMIN_ID) || (UserRole == Constants.Role.ENTERPRISE_MANAGER_ID) || (UserRole == Constants.Role.STAFF_ID)) {
  
        //Set Children for Orders
        children = [];   
        navigation.items.push(SetItem(`Active Complaints (${userObj.Enterprise.TotalComplaints})`, '/active-complaints', 'fa fa-ticket', ));
        navigation.items.push(SetItem('Past Complaints', '/past-complaints', 'fa fa-clock-o', ));
      }
  
  
      //#endregion
  
      if(UserRole != Constants.Role.STAFF_ID) {
        children = [];
        navigation.items.push(SetItem('Support Types', '/support-types', 'fa fa-support', ));
      }
 
      //#region Item Users
  
      if (((UserRole === Constants.Role.ENTERPRISE_ADMIN_ID) || (UserRole === Constants.Role.ENTERPRISE_MANAGER_ID))) {
  
        //Set Children for Users
  
        children = [];
  
        // children.push(SetChildren('All Users', '/users/all-users'))
        navigation.items.push(SetItem('Users', '/users/all-users', 'fa fa-user'));
      }
      //#endregion
  
      return navigation;
    }


    
    if(userObj.Enterprise.EnterpriseTypeId == 5) {
              
       if (Utilities.HasPermission(UserRole, Constants.Permission.ENTERPRISE_RESTAURANT_READ) 
       && (userObj.Enterprise.IsParent || userObj.Enterprise.ParentId > 0 || UserRole == Constants.Role.SYSTEM_ADMIN_ID 
        || UserRole == Constants.Role.SYSTEM_OPERATOR_ID || UserRole == Constants.Role.RESELLER_ADMIN_ID  || UserRole ==  Constants.Role.FOORTAL_SUPPORT_ADMIN_ID
        || UserRole == Constants.Role.RESELLER_KEY_ACCOUNT_MANAGER_ID || UserRole == Constants.Role.RESELLER_MODERATOR_ID
        )) {
        navigation.items.push(SetItem('Services', '/services', 'fa fa-building'));
      }
      //#endregion  

      if (Utilities.HasPermission(UserRole, Constants.Permission.ENTERPRISE_RESTAURANT_READ) && (UserRole == Constants.Role.SYSTEM_ADMIN_ID || UserRole == Constants.Role.SYSTEM_OPERATOR_ID || UserRole == Constants.Role.RESELLER_ADMIN_ID || UserRole == Constants.Role.RESELLER_MODERATOR_ID || UserRole ==  Constants.Role.FOORTAL_SUPPORT_ADMIN_ID || UserRole ==  Constants.Role.ENTERPRISE_ADMIN_ID)) {

        //Set Children for Enterprise
  
        children = [];
  
        if (Utilities.HasPermission(UserRole, Constants.Permission.ENTERPRISE_RESTAURANT_CREATE)){
         
        if(Number(localStorage.getItem(Constants.Session.ENTERPRISE_TYPE_ID) != 15)) {
        children.push(SetChildren('General Setup', '/enterprise/general-setup'))
        }
  
        // if (Utilities.HasPermission(UserRole, Constants.Permission.RESTAURANT_COMMISSION_READ))
        //   children.push(SetChildren('Commission Setup', '/enterprise/commission-setup'))
  
        //  if(Utilities.HasPermission(UserRole, Constants.Permission.ENTERPRISE_RESTAURANT_UPDATE)) {
        children.push(SetChildren('General Settings', '/enterprise/general'))
        
        // if(Number(localStorage.getItem(Constants.Session.ENTERPRISE_TYPE_ID) != 15)) {
        //   if(userObj.Enterprise.EnterpriseTypeId != 2){
        //   children.push(SetChildren('Bank Detail', '/enterprise/bank-details'))
        //   }
        // }
        children.push(SetChildren('Addresses', '/enterprise/addresses'))
        }
        
        
        if(UserRole !=  Constants.Role.FOORTAL_SUPPORT_ADMIN_ID) children.push(SetChildren('Media', '/enterprise/media'))
        // children.push(SetChildren('Vouchers','/enterprise/Vouchers'))
        //  }
        navigation.items.push(SetItem(Utilities.SpecialCharacterDecode(localStorage.getItem(Constants.Session.ENTERPRISE_NAME)), '/enterprise', 'fa fa-building-o', children));
      }
      
      //#region Item Orders
    
        if ((UserRole === Constants.Role.ENTERPRISE_ADMIN_ID) || (UserRole === Constants.Role.ENTERPRISE_MANAGER_ID)) {
    
          //Set Children for Orders
          children = [];   
          navigation.items.push(SetItem('Orders', '/orders/allorders', 'fa fa-reorder'));
        }
    
    
        //#endregion
    
          
        if (((UserRole === Constants.Role.ENTERPRISE_ADMIN_ID) || (UserRole === Constants.Role.ENTERPRISE_MANAGER_ID))) {
    
          //Set Children for Settings
    
          children = [];

          navigation.items.push(SetItem('Theme and Appearance', '/sitesetting/colors-settings', 'fa fa-paint-brush'));

        }

        if (((UserRole === Constants.Role.ENTERPRISE_ADMIN_ID) || (UserRole === Constants.Role.ENTERPRISE_MANAGER_ID))) {
    
          //Set Children for Settings
    
          children = [];

          navigation.items.push(SetItem('QR PINs', '/qr-pin', 'fa fa-qrcode'));

        }
   
   
        //#region Item Users
    
        if (((UserRole === Constants.Role.ENTERPRISE_ADMIN_ID) || (UserRole === Constants.Role.ENTERPRISE_MANAGER_ID))) {
  
          //Set Children for Users
    
          children = [];
    
          // children.push(SetChildren('All Users', '/users/all-users'))
    
          navigation.items.push(SetItem('Users', '/users/all-users', 'fa fa-user'));
        }
        //#endregion
    
        return navigation;
      }
 
    // if((UserRole > Constants.Role.SYSTEM_ADMIN_ID)) {

    //   nav = SetItem('Dashboard',  '/dashboard', 'icon-speedometer')
    //   navigation.items.push(nav);

    // }
    //#region Item Menu 
    if (UserRole > Constants.Role.RESELLER_ADMIN_ID && UserRole != Constants.Role.RESELLER_MODERATOR_ID && UserRole != Constants.Role.RESELLER_KEY_ACCOUNT_MANAGER_ID && UserRole != Constants.Role.RESELLER_KEY_ACCOUNT_USER_ID  && (Utilities.HasPermission(UserRole, Constants.Permission.RESTAURANT_CATEGORY_READ) || Utilities.HasPermission(UserRole, Constants.Permission.RESTAURANT_ITEM_READ)) || (UserRole == Constants.Role.STAFF_ID))  {


      //Set Children for Menu

      children = [];

      if (UserRole === Constants.Role.ENTERPRISE_ADMIN_ID || (UserRole === Constants.Role.ENTERPRISE_MANAGER_ID) || (UserRole == Constants.Role.STAFF_ID)) {
        children.push(SetChildren('Status', '/menu/status'))
      }

      if (UserRole === Constants.Role.ENTERPRISE_ADMIN_ID || (UserRole === Constants.Role.ENTERPRISE_MANAGER_ID) || (UserRole == Constants.Role.STAFF_ID)) {
        children.push(SetChildren('Build Menu', '/menu/build-menu'))
      }

      if ((Utilities.HasPermission(UserRole, Constants.Permission.RESTAURANT_TOPPING_READ) || Utilities.HasPermission(UserRole, Constants.Permission.RESTAURANT_TOPPING_GROUP_READ)) && (userObj.Enterprise.EnterpriseTypeId == 3 || userObj.Enterprise.EnterpriseTypeId == 6) || (UserRole == Constants.Role.STAFF_ID)) {
        children.push(SetChildren(Labels.AddOn_List, '/menu/add-ons'))
      }
      if(userObj.Enterprise.EnterpriseTypeId == 3 || userObj.Enterprise.EnterpriseTypeId == 6){
        children.push(SetChildren(Labels.Option_List, '/menu/options'))
      }

      navigation.items.push(SetItem(GetEnterpriseType(userObj.Enterprise.EnterpriseTypeId), '/menu', GetEnterpriseIcon(userObj.Enterprise.EnterpriseTypeId), children));

    }


    //#endregion


    //#region Item Orders
  

    if ((UserRole === Constants.Role.ENTERPRISE_ADMIN_ID) || (UserRole === Constants.Role.ENTERPRISE_MANAGER_ID) || (UserRole === Constants.Role.STAFF_ID) ) {

      //Set Children for Orders

      children = [];

      navigation.items.push(SetItem('Orders', '/orders/allorders', 'fa fa-reorder'));
    }


    //#endregion

    //  //#region Item Users

    // if (((UserRole === Constants.Role.ENTERPRISE_ADMIN_ID) || (UserRole === Constants.Role.ENTERPRISE_MANAGER_ID))) {
  
    //   //Set Children for Users

    //   children = [];

    //   // children.push(SetChildren('All Users', '/users/all-users'))

    //   navigation.items.push(SetItem('Users', '/users/all-users', 'fa fa-user'));
    // }
    //   //#endregion

    //#region Item Offer & Discount

    if (UserRole === Constants.Role.SYSTEM_ADMIN_ID) {
      // navigation.items.push(SetItem('Offers & Discounts','/discount','fa fa-gift'));
    }

    //#endregion



    //#region Item Wallet

    //   if (UserRole === Constants.Role.ENTERPRISE_ADMIN_ID){
    //       navigation.items.push(SetItem('Wallet','/wallet','fa fa-money'));
    // }
    //#endregion


    //#region Item Invoices
    // if (Utilities.HasPermission(UserRole, Constants.Permission.INVOICES_READ)) {
    //   navigation.items.push(SetItem('Invoices', '/invoices', 'fa fa-file-text-o'));
    // }
    //#endregion


    //#region Item Review
    if (UserRole === Constants.Role.ENTERPRISE_ADMIN_ID || UserRole === Constants.Role.ENTERPRISE_MANAGER_ID) {
      navigation.items.push(SetItem('Reviews', '/reviews', 'fa fa-star-half-empty'));
    }
    //#endregion


    //#region Item Settings

    if (((UserRole === Constants.Role.ENTERPRISE_ADMIN_ID) || (UserRole === Constants.Role.ENTERPRISE_MANAGER_ID))) {

      //Set Children for Settings

      children = [];

      children.push(SetChildren('Overview', '/settings/overview'));
      children.push(SetChildren('General Settings', '/settings/general'));
      children.push(SetChildren('Media', '/settings/media'));
      // children.push(SetChildren('Theme Settings', '/settings/theme-settings'));
      // children.push(SetChildren('Home Page Setting', '/settings/home-page-setting'));
      children.push(SetChildren('Working Hours', '/settings/working-hours'));
      children.push(SetChildren('Delivery Hours', '/settings/delivery-hours'));
      children.push(SetChildren('Addresses', '/settings/addresses'));
      children.push(SetChildren('Delivery Zones', '/settings/deliveryzones'));
      navigation.items.push(SetItem('Settings', '/settings', 'fa fa-cog', children));
    }

    //#endregion

    if (((UserRole === Constants.Role.ENTERPRISE_ADMIN_ID) || (UserRole === Constants.Role.ENTERPRISE_MANAGER_ID))) {

      //Set Children for Settings

      children = [];
      // children.push(SetChildren('Color Settings', '/sitesetting/colors-settings'));
      // if (GlobalData.restaurants_data.Supermeal_dev.Platform == "core") {
      // children.push(SetChildren('Color Settings', '/sitesetting/colors-settings'));
      // }
      // if (GlobalData.restaurants_data.Supermeal_dev.Platform != "core") {
      //   children.push(SetChildren('Configuration ', '/sitesetting/configuration-setting'));
      //   children.push(SetChildren('Color Settings', '/sitesetting/colors-settings'));
      //   children.push(SetChildren('Home Settings', '/sitesetting/home-page-setting'));
      //   children.push(SetChildren('Navigation', '/sitesetting/navigation'));
      //   children.push(SetChildren('CustomPages', '/sitesetting/AllPages'));
      // }

      // navigation.items.push(SetItem('Site Settings', '/sitesetting', 'fa fa-cog', children));
      navigation.items.push(SetItem('Theme and Appearance', '/sitesetting/colors-settings', 'fa fa-paint-brush'));
    }



    //#region Item Voucher
    if (Utilities.HasPermission(UserRole, Constants.Permission.VOUCHERS_READ) && UserRole !== Constants.Role.SYSTEM_ADMIN_ID && UserRole !== Constants.Role.SYSTEM_OPERATOR_ID && UserRole !== Constants.Role.RESELLER_ADMIN_ID && UserRole !== Constants.Role.RESELLER_MODERATOR_ID && userObj.Enterprise.EnterpriseTypeId != 15 ) {
      navigation.items.push(SetItem('Vouchers', '/vouchers', 'fa fa-tag'));
    }
    //#endregion
    // children.push(SetChildren('Vouchers','/enterprise/Vouchers'))

    //#region Item Users

    if (((UserRole === Constants.Role.ENTERPRISE_ADMIN_ID) || (UserRole === Constants.Role.ENTERPRISE_MANAGER_ID))) {

      //Set Children for Users

      children = [];

      // if (Utilities.HasPermission(UserRole, Constants.Permission.ENTERPRISE_USER_CREATE) && Utilities.HasPermission(UserRole, Constants.Permission.ENTERPRISE_USER_UPDATE)) {
      //   children.push(SetChildren('Add New', '/users/add-new'))
      // }
      // children.push(SetChildren('All Users', '/users/all-users'))

      // navigation.items.push(SetItem('Users', '/users', 'fa fa-user', children));
      navigation.items.push(SetItem('Users', '/users/all-users', 'fa fa-user'));
    }
    //#endregion

    //#region Item Restaurant

    // console.log("permission", Utilities.HasPermission(UserRole, Constants.Permission.ENTERPRISE_RESTAURANT_READ) );

    if (Utilities.HasPermission(UserRole, Constants.Permission.ENTERPRISE_RESTAURANT_READ) && (userObj.Enterprise.IsParent || userObj.Enterprise.ParentId > 0 
      || UserRole == Constants.Role.SYSTEM_ADMIN_ID || UserRole == Constants.Role.SYSTEM_OPERATOR_ID || UserRole == Constants.Role.RESELLER_ADMIN_ID  
      || UserRole ==  Constants.Role.FOORTAL_SUPPORT_ADMIN_ID || UserRole ==  Constants.Role.RESELLER_ADMIN_ID || UserRole ==  Constants.Role.RESELLER_MODERATOR_ID || UserRole ==  Constants.Role.RESELLER_KEY_ACCOUNT_MANAGER_ID) 
      && (userObj.Enterprise.EnterpriseTypeId == 1 || userObj.Enterprise.EnterpriseTypeId == 2)) {
      navigation.items.push(SetItem('Businesses', '/Businesses', 'fa fa-building'));
    }
    //#endregion


    //#region Item Enterprise


    if (Utilities.HasPermission(UserRole, Constants.Permission.ENTERPRISE_RESTAURANT_READ) && (UserRole == Constants.Role.SYSTEM_ADMIN_ID || UserRole == Constants.Role.SYSTEM_OPERATOR_ID || UserRole == Constants.Role.RESELLER_ADMIN_ID || UserRole == Constants.Role.RESELLER_MODERATOR_ID || UserRole ==  Constants.Role.FOORTAL_SUPPORT_ADMIN_ID) && Number(localStorage.getItem(Constants.Session.ENTERPRISE_ID)) !== userObj.Enterprise.Id && UserRole != Constants.Role.ENTERPRISE_ADMIN_ID && UserRole !== Constants.Role.ENTERPRISE_MANAGER_ID) {

      //Set Children for Enterprise

      children = [];

      if (Utilities.HasPermission(UserRole, Constants.Permission.ENTERPRISE_RESTAURANT_CREATE) || UserRole ==  Constants.Role.FOORTAL_SUPPORT_ADMIN_ID){
       
      if(Number(localStorage.getItem(Constants.Session.ENTERPRISE_TYPE_ID) != 15)) {
      children.push(SetChildren('General Setup', '/enterprise/general-setup'))
      }

      if (Utilities.HasPermission(UserRole, Constants.Permission.RESTAURANT_COMMISSION_READ))
        children.push(SetChildren('Commission Setup', '/enterprise/commission-setup'))

      //  if(Utilities.HasPermission(UserRole, Constants.Permission.ENTERPRISE_RESTAURANT_UPDATE)) {
      children.push(SetChildren('General Settings', '/enterprise/general'))
      
      if(Number(localStorage.getItem(Constants.Session.ENTERPRISE_TYPE_ID) != 15)) {
        if(userObj.Enterprise.EnterpriseTypeId != 2){
        children.push(SetChildren('Bank Detail', '/enterprise/bank-details'))
        }
      }
      children.push(SetChildren('Addresses', '/enterprise/addresses'))
      }
      
      
      if(UserRole !=  Constants.Role.FOORTAL_SUPPORT_ADMIN_ID) children.push(SetChildren('Media', '/enterprise/media'))
      // children.push(SetChildren('Vouchers','/enterprise/Vouchers'))
      //  }
      navigation.items.push(SetItem(Utilities.SpecialCharacterDecode(localStorage.getItem(Constants.Session.ENTERPRISE_NAME)), '/enterprise', 'fa fa-building-o', children));
    }

    //#endregion


    // if (Utilities.HasPermission(UserRole, Constants.Permission.CAMPAIGN_READ)  && UserRole !== Constants.Role.ENTERPRISE_MANAGER_ID ) {
    //   navigation.items.push(SetItem('Campaign Themes', '/campaign/themes', 'fa fa-bullhorn'));
    // }
    // if ((UserRole == Constants.Role.SYSTEM_ADMIN_ID || UserRole == Constants.Role.SYSTEM_OPERATOR_ID)  && UserRole !== Constants.Role.ENTERPRISE_MANAGER_ID ) {
    //   navigation.items.push(SetItem(Utilities.GetResourceValue(GlobalData.restaurants_data.Supermeal_dev.Platform, 'Cuisines', 'Categories'), '/cuisines', 'fa fa-cutlery'));
    // }
    if ((UserRole == Constants.Role.SYSTEM_ADMIN_ID || UserRole == Constants.Role.SYSTEM_OPERATOR_ID)) {
      navigation.items.push(SetItem( 'Photo Gallery', '/photo-gallery', 'fa fa-picture-o'));
    }
    // if ((UserRole == Constants.Role.SYSTEM_ADMIN_ID || UserRole == Constants.Role.SYSTEM_OPERATOR_ID)  && UserRole !== Constants.Role.ENTERPRISE_MANAGER_ID  || UserRole === Constants.Role.MARKETING_ADMIN_ID) {
    //   navigation.items.push(SetItem( 'App Notification', '/app-notification', 'fa fa-bell'));
    // }

  	if ((UserRole == Constants.Role.SYSTEM_ADMIN_ID || UserRole == Constants.Role.SYSTEM_OPERATOR_ID)  && UserRole !== Constants.Role.ENTERPRISE_MANAGER_ID ) {
      navigation.items.push(SetItem('Duplicate Menu', '/duplicate-menu', 'fa fa-users'));
    }
  	if ((UserRole == Constants.Role.SYSTEM_ADMIN_ID || UserRole == Constants.Role.SYSTEM_OPERATOR_ID)  && UserRole !== Constants.Role.ENTERPRISE_MANAGER_ID && (parentCountryCode == GlobalData.restaurants_data.Supermeal_dev.countryCode) )  {
      navigation.items.push(SetItem('Country Config', '/Country-config', 'fa fa-bell'));
    }
  	// if ((UserRole == Constants.Role.SYSTEM_ADMIN_ID || UserRole == Constants.Role.SYSTEM_OPERATOR_ID)  && UserRole !== Constants.Role.ENTERPRISE_MANAGER_ID && (parentCountryCode == GlobalData.restaurants_data.Supermeal_dev.countryCode) )  {
    //   navigation.items.push(SetItem('Groups', '/Groups', 'fa fa-users'));
    // }

     if ((UserRole == Constants.Role.SYSTEM_ADMIN_ID || UserRole == Constants.Role.SYSTEM_OPERATOR_ID)  && UserRole !== Constants.Role.ENTERPRISE_MANAGER_ID) { // && (parentCountryCode == GlobalData.restaurants_data.Supermeal_dev.countryCode) )  {
       navigation.items.push(SetItem('Batch Vouchers', '/Group-voucher', 'fa fa-tag'));
     } 
    
    // if ((UserRole == Constants.Role.SYSTEM_ADMIN_ID || UserRole == Constants.Role.SYSTEM_OPERATOR_ID)  && UserRole !== Constants.Role.ENTERPRISE_MANAGER_ID){// && (parentCountryCode == GlobalData.restaurants_data.Supermeal_dev.countryCode) )  {
    //   navigation.items.push(SetItem('Users', '/manageuser', 'fa fa-users'));
    // }


//#region Item Reports
if ((UserRole == Constants.Role.SYSTEM_ADMIN_ID || UserRole == Constants.Role.SYSTEM_OPERATOR_ID || UserRole == Constants.Role.RESELLER_ADMIN_ID || UserRole == Constants.Role.RESELLER_MODERATOR_ID || UserRole == Constants.Role.RESELLER_KEY_ACCOUNT_MANAGER_ID)) {

  //Set Children for Reports

  children = [];
  if ((UserRole == Constants.Role.SYSTEM_ADMIN_ID || UserRole == Constants.Role.SYSTEM_OPERATOR_ID)){
  children.push(SetChildren('Orders', '/dashboard'))
  children.push(SetChildren('Customers', '/reports/user-orders'))
  // if ((UserRole == Constants.Role.SYSTEM_ADMIN_ID || UserRole == Constants.Role.SYSTEM_OPERATOR_ID))
   children.push(SetChildren('CustomersOnMap', '/reports/customersonmap'))
  // if ((UserRole == Constants.Role.SYSTEM_ADMIN_ID || UserRole == Constants.Role.SYSTEM_OPERATOR_ID)) 
  children.push(SetChildren('SendReports', '/reports/SendReports'))
  navigation.items.push(SetItem("Reports", '/reports', 'fa fa-bar-chart', children));
}
  
  if ((UserRole == Constants.Role.SYSTEM_ADMIN_ID || UserRole == Constants.Role.SYSTEM_OPERATOR_ID || UserRole == Constants.Role.RESELLER_ADMIN_ID || UserRole == Constants.Role.RESELLER_MODERATOR_ID)){ 
    navigation.items.push(SetItem('Users', '/users/all-users', 'fa fa-user')) 
    // if (UserRole == Constants.Role.SYSTEM_ADMIN_ID || UserRole == Constants.Role.SYSTEM_OPERATOR_ID){
    //   navigation.items.push(SetItem('Resellers', '/reseller', 'fa fa-user'));
    // }
    // if (UserRole == Constants.Role.SYSTEM_ADMIN_ID || UserRole == Constants.Role.SYSTEM_OPERATOR_ID){
    //   navigation.items.push(SetItem('Resellers', '/resellers', 'fa fa-users'));
    // }
  };

}

//#endregion



// //#region Item Reports
// if ((UserRole == Constants.Role.SYSTEM_ADMIN_ID || UserRole == Constants.Role.SYSTEM_OPERATOR_ID || UserRole == Constants.Role.ENTERPRISE_ADMIN_ID || UserRole ==  Constants.Role.ENTERPRISE_MANAGER_ID)) {

//   //Set Children for Reports

//   children = [];
//   children.push(SetChildren('Orders', '/dashboard'))
//   children.push(SetChildren('Customers', '/reports/user-orders'))
//   if(UserRole == Constants.Role.SYSTEM_ADMIN_ID || UserRole == Constants.Role.SYSTEM_OPERATOR_ID){
//   children.push(SetChildren('CustomersOnMap', '/reports/customersonmap'))
//   children.push(SetChildren('SendReports', '/reports/SendReports'))
//   }
//   navigation.items.push(SetItem("Reports", '/reports', 'fa fa-bar-chart', children));
// }

// //#endregion

    return navigation;
  }




}
