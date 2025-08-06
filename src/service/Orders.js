import UrlConstant from '../helpers/URLConstants';
import Constants from '../helpers/Constants';
import Config from '../helpers/Config';
import * as Utilities from  '../helpers/Utilities';
const moment = require('moment-timezone');

        export let Get = async (enterpriseId, status,duration, startDate, endDate, enterpiseIdCsv,) => {
            var timezone = Config.Setting.timeZone;
        if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
            let userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
            
            if(userObj.EnterpriseRestaurant.Country != null) {
            timezone = userObj.EnterpriseRestaurant.Country.TimeZone;
            }
        }

    try{
        
        startDate = Utilities.ConvertLocalTimeToUTCWithZone(startDate, "YYYY-MM-DD HH:mm:ss", timezone);
        endDate = Utilities.ConvertLocalTimeToUTCWithZone(endDate, "YYYY-MM-DD HH:mm:ss", timezone);

        const response = await
        
        fetch(UrlConstant.EnterpriseOrders + `${status}/${startDate}/${endDate}/${enterpiseIdCsv}/${enterpriseId}`, {
          method: 'GET',
          headers: Config.headers,
        });
  
        const result = await response.json();

       if (!result.HasError && result !== undefined) {

            if (result.Dictionary.Orders !== undefined) {
            return JSON.parse(result.Dictionary.Orders);
            }
        
        }

        return [];

        //});
    }
    catch(e){
        console.log('error: ', e); 
        return []; 
    }
}



export let GetBy = async (startDate, endDate,userId, serviceIdCsv) => {
 
    var timezone = Config.Setting.timeZone;
        if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
            let userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
            
            if(userObj.EnterpriseRestaurant.Country != null) {
            timezone = userObj.EnterpriseRestaurant.Country.TimeZone;
            }
        }

    try{

        startDate = Utilities.ConvertLocalTimeToUTCWithZone(startDate, "YYYY-MM-DD HH:mm:ss", timezone);
        endDate = Utilities.ConvertLocalTimeToUTCWithZone(endDate, "YYYY-MM-DD HH:mm:ss", timezone);

        var enterpriseId = Utilities.GetEnterpriseIDFromSession();
        const response = await
        fetch(`${UrlConstant.EnterpriseOrders}DateRange/${enterpriseId}`, {
          method: 'POST',
          headers: Config.headers,
          body: '["' + startDate + '","' + endDate  + '","' + userId +  '","' + serviceIdCsv + '"]',
        });
  
        // console.log('["' + startDate + '","' + endDate + '","' + userId + '"]');
        const result = await response.json();

       if (!result.HasError && result !== undefined) {

            if (result.Dictionary.Orders !== undefined) {
            return JSON.parse(result.Dictionary.Orders);
            }
        
        }

        return [];

        //});
    }
    catch(e){
        console.log('error: ', e); 
        return []; 
    }
}

export let GetReportBy = async (startDate, endDate, serviceIdCsv) => {
    
     var timezone = Config.Setting.timeZone;
        if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
            let userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
            
            if(userObj.EnterpriseRestaurant.Country != null) {
            timezone = userObj.EnterpriseRestaurant.Country.TimeZone;
            }
        }
    startDate = Utilities.ConvertLocalTimeToUTCWithZone(startDate, "YYYY-MM-DD HH:mm:ss", timezone);
    endDate = Utilities.ConvertLocalTimeToUTCWithZone(endDate, "YYYY-MM-DD HH:mm:ss", timezone);

    try{
        var enterpriseId = Utilities.GetEnterpriseIDFromSession();
        const response = await
        fetch(`${UrlConstant.EnterpriseOrders}DashboardReport`, {
          method: 'POST',
          headers: Config.headers,
          body: '["' + startDate + '","' + endDate + '","' + serviceIdCsv + '"]',
        });
  
        // console.log('["' + startDate + '","' + endDate + '","' + userId + '"]');
        const result = await response.json();
        return result;

        //});
    }
    catch(e){
        console.log('error: ', e); 
        return []; 
    }
}

export let GetOrderDetail = async (token) => {
    
    try{
        
        const response = await
        fetch(UrlConstant.EnterpriseOrders + `Detail/${Utilities.GetEnterpriseIDFromSession()}/${token}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'App': "SuperCenter",
            'Authorization': "Bearer " + localStorage.getItem(Constants.Session.JWT_TOKEN),
            'AuthenticationTicket': localStorage.getItem(Constants.Session.AUTHENTICATION_TICKET),
            'ImpersonatorID': localStorage.getItem(Constants.Session.IMPERSONATORID)
        }
        });
  
        const result = await response.json();

       if (!result.HasError && result !== undefined) {

            if (result.Dictionary.OrderDetail !== undefined) {

               let order= JSON.parse(result.Dictionary.OrderDetail) 
               
               order.OrderDate = result.Dictionary.OrderDate;

            return order;
           
        }
        
        }

        return [];

        //});
    }
    catch(e){
        console.log('error: ', e); 
        return []; 
    }
}

export let GetRiderInfo = async (orderId) => {
    
    try{
        
        const response = await
        fetch(UrlConstant.EnterpriseOrders + `RiderInfo/${Utilities.GetEnterpriseIDFromSession()}/${orderId}`, {
          method: 'GET',
          headers: Config.headers,
        });
  
        const result = await response.json();

       if (!result.HasError && result !== undefined) {

            if (result.Dictionary.RiderInfo !== undefined) {
            return JSON.parse(result.Dictionary.RiderInfo);
            }
        }

        return {};

        //});
    }
    catch(e){
        console.log('error: ', e); 
        return []; 
    }
}


export let AddExtraTime = async(order) => {

    try{

        
        const response = await 
    
        fetch(UrlConstant.EnterpriseOrders + "CompletionTime",
        {
                method: 'PUT',
                headers: Config.headers,
                body: JSON.stringify(order),
            }
        )
        
        // const result = await response.json();
        return response;
    }
    catch(e){
        console.log('error: ', e);  
        return '0';
    }

}


export let UpdateOrderStatus = async(order) => {

    try{

        
        const response = await 
    
        fetch(UrlConstant.EnterpriseOrders + "Status",
        {
                method: 'PUT',
                headers: Config.headers,
                body: JSON.stringify(order),
            }
        )
        
        // const result = await response.json();
        return response;

    }
    catch(e){
        console.log('error: ', e);  
        return '0';
    }

}
export let SendReports = async(report) => {

    try{

        report.EnterpriseId = Utilities.GetEnterpriseIDFromSession()
        const response = await 
        fetch(UrlConstant.sendReports,
        {
                method: 'POST',
                headers: Config.headers,
                body: JSON.stringify(report),
        })
        const result = await response.json();
        if (!result.HasError && result !== undefined) {

            if (result.Dictionary.Sent) {
            return '1'
            }
        }
        return result.HasError && result.ErrorCodeCsv !='' ? result.ErrorCodeCsv : '0';
    }
    catch(e){
        console.log('error: ', e);  
        return '0';
    }

}



export let SendPushyNotification = async(pushy) => {

    try{

        
        const response = await 
    
        fetch(UrlConstant.EnterpriseOrders + "notification",
        {
                method: 'POST',
                headers: Config.headers,
                body: JSON.stringify(pushy),
            }
        )
        
        const result = await response.json();
        if (!result.HasError && result !== undefined) {
        
            if (result.Dictionary.Sent === true) {
                    return '1';
            }
        }
        return '0';

    }
    catch(e){
        console.log('error: ', e);  
        return '0';
    }

}


export let GetByToken = async (enterpriseId, token, orderId) => {
    
    try{
     const response = await
     fetch(`${UrlConstant.EnterpriseOrders}ByToken/${enterpriseId}/${token}/${orderId}`, {
       method: 'GET',
       headers: Config.headers,
     });

     const result = await response.json();
     return result;
    }
    catch(e){
        console.log('error: ', e);  
    }

}


export let UpdateAssignee = async(orderId, assigneeId) => {

    try{

        const response = await 
    
        fetch(`${UrlConstant.EnterpriseOrders}assign/${Utilities.GetEnterpriseIDFromSession()}/${orderId}`,
        {
                method: 'PUT',
                headers: Config.headers,
                body: '"' + assigneeId + '"',
            }
        )

        return response;
    }
    catch(e){
        console.log('error: ', e);  
        return '0';
    }

}



