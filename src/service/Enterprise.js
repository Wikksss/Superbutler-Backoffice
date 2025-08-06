import UrlConstant from '../helpers/URLConstants';
//import Constants from '../helpers/Constants';
import Config from '../helpers/Config';
import * as Utilities from  '../helpers/Utilities';

const enterpriseTypeIds = "3,4";
const descending = false;
// const pageSize = 10;



export const   Enterprise =  {
    "EnterpriseDetail" : {
    "EnterpriseId": 0,
    "Name" : "",
    "TakeOnlineOrder": "",
    "MetaTitle": "",
    "MetaKeywords": "",
    "MetaDescription": "",
    "OtherTagCsv": "",
    "ShortDescription": "",
    "LongDescription": "",
    "Email": "",
    "Url": "",
    "Mobile1": "",
    "Mobile2": "",
    "Landline1": "",
    "Landline2": "",
    "SmsMaskingName": "",
    "OwnerName": "",
    "CommissionAmountTableBookingSourcePortal": "",
    "CommissionAmountTableBookingSourceEnterprise": "",
    "StandardCharges": "",
    "CashBackMinOrder": "",
    "CommissionPercentage": "",
    "StandardChargesExternal": "",
    "CashBackMinOrderEnterprise": "",
    "AppCommissionPercentage": "",
    "CashBack": "",
    "CashBackEnterprise": "",
    "CityIdsCsv": "",
    "Category": 0,
    "IsOwnRestaurant": "",
    "IsSmsAlertsOffered": "", //new order sms
    "ApplyGST" : "",
    "ParentId": 0,
    "Id":0,
    "RestaurantPage": {
        "PageName": "",
        "SubdomainName": ""
    },

    "CommissionHistory": {
        "CardFeesPortalInternal": "",
        "CashbackPortalInternal": "",
        "CashbackEnterpriseInternal": "",
        "CardFeesPortalExternal": "",
        "CashbackPortalExternal": "",
        "CashbackEnterpriseExternal": "",
    },

    "AgentRestaurant" : {
        "EnterpriseAgentId": 0,
        "CommissionPercentage": "",
        "CommissionAmountTableBookingSourcePortal": "",
        "CommissionPercentageSourceEnterprise": "",
        "CommissionAmountTableBookingSourceEnterprise": "",
    },

    "RestaurantSettings" : {
        "AllowActivitySMS": "",
        "IsSupermealProfileAllowed": "",
        "IsSponsored": "",
        "IsDineOffered": false
    },

    "AddressEnterprise" : {

        "Label":"",
        "Address1":"",
        "AreaId":"",
        "Latitude":"",
        "Longitude":"",
    } 

},

"EnterpriseUser" : {
  
    "EUser" : {
        "Id" : 0,
        "Title": "Mr",
        "FirstName": "",
        "SurName": "",
        "PrimaryEmail": "",
        "Gender": "M",
        "CreatedBy": "",
        "RoleLevel": 0,

},
"Password" : "",
"ConfirmPassword": "",
"LoginUserName" : ""
},

"EnterpriseTypeId" : "3,4",
"IsChurned" : false,
"ChurnedNotes" : ""

}



export let  GetAll =  async(pageNo,pageSize,searchKeyword,chkChurned,chkAll) => {

    try{

            const response = await 
            fetch(UrlConstant.Enterprise + `${enterpriseTypeIds}/${pageNo}/${pageSize}/${descending}/${searchKeyword}/${chkChurned}/${chkAll}`, 
            {
                    method: 'GET',
                    headers: Config.headers,
            })
            
            const result = await response.json();
            
            if (!result.HasError && result !== undefined) {
                return JSON.parse(result.Dictionary.Enterprises);
            }
        
            return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : '';
    
        }
        catch(e){
            console.log('error: ', e);  
            return '';
        }
}

export let  GetAIKnowledge =  async() => {

    try{

            const response = await 
            fetch(UrlConstant.EnterpriseAI + `/ai/generateknowledgebase/${Utilities.GetEnterpriseIDFromSessionObject()}`, 
            {
                    method: 'GET',
                    headers: Config.headers,
            })
            
            const result = await response.json();
            
            if (result.length > 0) {
                return result;
            }
        
            return [];
    
        }
        catch(e){
            console.log('error: ', e);  
            return [];
        }
}
export let  GetAllParentEnterprise =  async(pageNo,pageSize,searchKeyword,chkChurned,chkAll) => {

    try{
            const response = await 
            fetch(UrlConstant.Enterprise + `/${enterpriseTypeIds}/${pageNo}/${pageSize}/${searchKeyword}/${chkChurned}/${chkAll}`, 
            {
                    method: 'GET',
                    headers: Config.headers,
            })
            
            const result = await response.json();
            
            if (!result.HasError && result !== undefined) {
                return JSON.parse(result.Dictionary.Enterprises);
            }
        
            return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : '';
    
        }
        catch(e){
            console.log('error: ', e);  
            return '';
        }
}
export let  GetAllDemoEnterprise =  async() => {

    try{

            var pin = localStorage.getItem("PinCode")
            const response = await 
            fetch(UrlConstant.Enterprise + `/Demo/${pin}`, 
            {
                    method: 'GET',
                    headers: { 'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
            })
            
            const result = await response.json();
            
            if (!result.HasError && result !== undefined) {
                return JSON.parse(result.Dictionary.Enterprises);
            }
        
            return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : '';
    
        }
        catch(e){
            console.log('error: ', e);  
            return '';
        }
}


export let  IsDemoValidation =  async() => {

    try{
            const response = await 
            fetch(UrlConstant.Enterprise + `/DemoValidation`, 
            {
                    method: 'GET',
                    headers: { 'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
            })
            
            const result = await response.json();
            return result;
    
        }
        catch(e){
            console.log('error: ', e);  
            return '';
        }
}

export let ValidatePin =  async(pin) => {

    try{
            const response = await 
            fetch(UrlConstant.Enterprise + `/ValidatePin/${pin}`, 
            {
                    method: 'GET',
                    headers: { 'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
            })
            
            const result = await response.json();
            return result;
    
        }
        catch(e){
            console.log('error: ', e);  
            return '';
        }
}



export let  GetAllServices =  async(enterpriseId, userId) => {

    try{
           if(userId === undefined || userId === null || userId === ''){
                userId = 0;
            }
            const response = await 
            fetch(UrlConstant.Enterprise + `Services/${enterpriseId}/${userId}`, 
            {
                    method: 'GET',
                    headers: Config.headers,
            })
            
            const result = await response.json();
            
            if (!result.HasError && result !== undefined) {
                return JSON.parse(result.Dictionary.Enterprises);
            }
        
            return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : '';
    
        }
        catch(e){
            console.log('error: ', e);  
            return '';
        }
}


export let  GetAllOnline =  async() => {

    try{

            const response = await 
            fetch(UrlConstant.Enterprise + `AllOnline`, 
            {
                    method: 'GET',
                    headers: Config.headers,
            })
            
            const result = await response.json();
            
            if (!result.HasError && result !== undefined) {
                return JSON.parse(result.Dictionary.Enterprises);
            }
        
            return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : '';
    
        }
        catch(e){
            console.log('error: ', e);  
            return '';
        }
}

export let  Get =  async() => {

    try{

            const response = await 
            fetch(UrlConstant.Enterprise + Utilities.GetEnterpriseIDFromSessionObject(),
            {
                    method: 'GET',
                    headers: Config.headers,
            })
            
            const result = await response.json();
            
            if (!result.HasError && result !== undefined) {
                return JSON.parse(result.Dictionary.EnterpriseWithDetail);
            }
        
            return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : '';
    
        }
        catch(e){
            console.log('error: ', e);  
            return '';
        }
}

export let  GetEnterpriseType =  async() => {

    try{

            const response = await 
            fetch(UrlConstant.Enterprise + "GetEnterpriseType",
            {
                    method: 'GET',
                    headers: Config.headers,
            })
            const result = await response.json();
            return result;
            
            // if (!result.HasError && result !== undefined) {
            //     return JSON.parse(result.Dictionary.EnterpriseWithDetail);
            // }
        
            // return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : '';
    
        }
        catch(e){
            console.log('error: ', e);  
            return [];
        }
}

export let  GetAllPrinters =  async() => {

    try{

            const response = await 
            fetch(UrlConstant.Enterprise + `printers`, 
            {
                    method: 'GET',
                    headers: Config.headers,
            })
            
            const result = await response.json();
            return result
        }
        catch(e){
            console.log('error: ', e);  
            return '';
        }
}


export let IsPageNameAvailable = async (pageName) => {
    
    try{
        
        const response = await 
        
        fetch(UrlConstant.Enterprise + 'CheckPageName',
        {
            method: 'Post',
            headers: Config.headers,
            body:  '["' + Utilities.GetEnterpriseIDFromSessionObject() + '","' +pageName + '"]' ,
            
        }
        )


        const result = await response.json();
        
        if (!result.HasError && result !== undefined) {
    
            if (result.Dictionary.IsAvailable === true) {
                return '1';
            }
        }
    
        return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : '0';

    }
    catch(e){
        console.log('error: ', e); 
        return []; 
    }
}


export let  ActiveSuspend =  async(enterpriseId, enterpriseTypeId,isActive) => {

    try{

            const response = await 
            
            fetch(UrlConstant.Enterprise  + 'ActiveSuspend/' + enterpriseId + '/' + enterpriseTypeId + '/' + isActive,
            {
                    method: 'PUT',
                    headers: Config.headers,
                }
            )
            
            const result = await response.json();
            
            if (!result.HasError && result !== undefined) {
        
                if (result.Dictionary.IsUpdated === true) {
                        return '1';
                }
            }
        
            return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : '0';
    
        }
        catch(e){
            console.log('error: ', e);  
            return '0';
        }
}


export let  Churned =  async(enterprise) => {

    try{

            const response = await 
            
            fetch(UrlConstant.Enterprise  + 'Churned',
            {
                    method: 'PUT',
                    headers: Config.headers,
                    body: JSON.stringify(enterprise),
                }
            )
            
            const result = await response.json();
            
            if (!result.HasError && result !== undefined) {
        
                if (result.Dictionary.IsUpdated === true) {
                        return '1';
                }
            }
        
            return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : '0';
    
        }
        catch(e){
            console.log('error: ', e);  
            return '0';
        }
}


export let  Delete =  async(enterpriseId, enterpriseTypeId) => {

    try{

            const response = await 
            
            fetch(UrlConstant.Enterprise + enterpriseId + '/' + enterpriseTypeId,
            {
                    method: 'DELETE',
                    headers: Config.headers,
                }
            )
            
            const result = await response.json();
            
            if (!result.HasError && result !== undefined) {
        
                if (result.Dictionary.IsDeleted === true) {
                        return '1';
                }
            }
        
            return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : '0';
    
        }
        catch(e){
            console.log('error: ', e);  
            return '0';
        }
}

export let  GetAgents =  async() => {

    try{

            const response = await 
            fetch(UrlConstant.EnterpriseAgent,
            {
                    method: 'GET',
                    headers: Config.headers,
            })
            
            const result = await response.json();
            
            if (!result.HasError && result !== undefined) {
                return JSON.parse(result.Dictionary.EnterpriseAgent);
            }
        
            return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : '';
    
        }
        catch(e){
            console.log('error: ', e);  
            return '';
        }
}

export let  Save =  async(enterprise) => {

    try{

            const response = await 
            
            fetch(UrlConstant.Enterprise + "New",
            {
                    method: 'POST',
                    headers: Config.headers,
                    body: JSON.stringify(enterprise),
                }
            )
            
            const result = await response.json();
            
             if (!result.HasError && result !== undefined) {
                return JSON.parse(result.Dictionary.NewEnterpriseId);
            }
        
            return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : '0';
    
        }
        catch(e){
            console.log('error: ', e);  
            return '0';
        }
}

export let  Update =  async(enterprise) => {

    try{

            const response = await 
            
            fetch(UrlConstant.Enterprise,
            {
                    method: 'Put',
                    headers: Config.headers,
                     body: JSON.stringify(enterprise),
                }
            )
            
            const result = await response.json();
            
            if (!result.HasError && result !== undefined) {
        
                if (result.Dictionary.IsUpdated === true) {
                        return '1';
                }
            }
        
            return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : '0';
    
        }
        catch(e){
            console.log('error: ', e);  
            return '0';
        }
}

export let  GetActive =  async() => {

    try{

            const response = await 
            fetch(UrlConstant.Enterprise + 'ActiveEnterprises',
            {
                    method: 'GET',
                    headers: Config.headers,
            })
            
            const result = await response.json();
            
            if (!result.HasError && result !== undefined) {
                return JSON.parse(result.Dictionary.ActiveRestaurants);
            }
        
            return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : '';
    
        }
        catch(e){
            console.log('error: ', e);  
            return '';
        }
}

export let  GetAllEnterprises =  async() => {

    try{

            const response = await 
            fetch(UrlConstant.Enterprise + "Restaurants",
            {
                    method: 'GET',
                    headers: Config.headers,
            })
            
            const result = await response.json();
            return result; 
        }
        catch(e){
            console.log('error: ', e);  
            return [];
        }
}


export let  GetServices =  async() => {

    try{

            const response = await 
            fetch(`${UrlConstant.Enterprise}Services/${Utilities.GetEnterpriseIDFromSessionObject()}`,
            {
                    method: 'GET',
                    headers: Config.headers,
            })
            
            const result = await response.json();
            
            if (!result.HasError && result !== undefined) {
                return JSON.parse(result.Dictionary.Services);
            }
        
            return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : '';
    
        }
        catch(e){
            console.log('error: ', e);  
            return [];
        }
}


export let UpdateSort = async(csv) => {

    try{

    const response = await 
    
    fetch(UrlConstant.Enterprise + 'UpdateSort/' + Utilities.GetEnterpriseIDFromSession(),
    {
            method: 'PUT',
            headers: Config.headers,
            body: "'" + csv + "'",
        }
    )
     
    const result = await response.json();
    
    if (!result.HasError && result !== undefined) {

            if (result.Dictionary.IsUpdated === true) {
                return true;
            }
    }
    
    return false;

    }
    catch(e){
        console.log('error: ', e);  
    }

}

export let createHotelDemo = async (demo, theme) => {
    
    try{
        var pin = localStorage.getItem("PinCode")
        demo.Theme =JSON.stringify(theme);
        const response = await 
        
        fetch(UrlConstant.Enterprise + 'CreateDemo/' + pin ,
        {
            method: 'Post',
            headers: { 'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(demo),
            
        }
        )


        const result = await response.json();
        return result;
        

    }
    catch(e){
        console.log('error: ', e); 
        return []; 
    }
}


export let GetAvailableSubdmain = async (name) => {
   
    try{
                const response = await 
                
                fetch(`${UrlConstant.Enterprise}SubDomain/Available`,
                {
                    method: 'Post',
                    headers: Config.headers,
                    body: JSON.stringify(name),
                }
                
            )
                const result = await response.json();
                return result;
           
    }
    catch(e){
        console.log('error: ', e);  
    }

}

export let GetHeaderCount = async (enterpiseId) => {
   
    try{
                const response = await 
                
                fetch(`${UrlConstant.Enterprise}headercounts/${enterpiseId}`,
                {
                    method: 'Get',
                    headers: Config.headers,
                    
                }
                
            )
                const result = await response.json();
                return result;
           
    }
    catch(e){
        console.log('error: ', e);  
    }

}


export let GetGoogleAnalytics = async (startDate, endDate, propertyId) => {
   
    try{
                const response = await 
                
                fetch(`${UrlConstant.Enterprise}google-analytics/${propertyId}`,
                {
                    method: 'Post',
                    headers: Config.headers,
                    body: '["' + startDate + '","' + endDate + '"]',
                }
                
            )
                const result = await response.json();
                return result;
           
    }
    catch(e){
        console.log('error: ', e);  
    }

}

  export let sendPrintWithCssRequest = async (orderId, orderHtml) => {
    try {
      console.log("Sending print request for order:", orderId);

      // Send the HTML content to the .NET service for printing
      const response = await fetch("http://localhost:5000/api/print-css", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, orderHtml }),
      });

      const result = await response.json();
      console.log("Print request sent successfully:", result);
    } catch (error) {
      console.error("Error sending print request:", error);
    }
  }

  export let sendPrintRequest = async (orderToken, printerNameCsv) => {
    const payload = JSON.stringify({ OrderToken: orderToken, PrinterNameCsv: printerNameCsv });
  
    try {
      
      const response = await fetch("http://localhost:5000/api/print", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      });
  
      if (!response.ok) throw new Error("Port 5000 failed");
  
    } catch (error) {
     
      try {
        const fallbackResponse = await fetch("http://localhost:5055/api/print", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
        });
  
        if (!fallbackResponse.ok) throw new Error("Port 5055 also failed");
  
      } catch (fallbackError) {
        console.log(" Both print endpoints failed:", fallbackError);
      }
    }
  };
  