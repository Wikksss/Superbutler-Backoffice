import UrlConstant from '../helpers/URLConstants';
import Constants from '../helpers/Constants';
import * as Utilities from '../helpers/Utilities';
import Config from '../helpers/Config';

export let create_UUID = () => {
    if (localStorage.getItem('deviceId') == null || localStorage.getItem('deviceId') === '') {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        localStorage.setItem('deviceId', uuid);
        return uuid;
    }
    else {
        let deviceId = localStorage.getItem('deviceId');
        return deviceId
    }
    
}


export let GetByMembershipId = async (membershipId) => {
    
    try{
        
        
        const response = await 
        fetch(UrlConstant.User + membershipId,
        {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'App': "SuperCenter",
                'Authorization': "Bearer " + localStorage.getItem(Constants.Session.JWT_TOKEN),
                'AuthenticationTicket': localStorage.getItem(Constants.Session.AUTHENTICATION_TICKET),
                'ImpersonatorID': localStorage.getItem(Constants.Session.IMPERSONATORID)
            },
        }
        )
        const result = await response.json();

       if (!result.HasError && result !== undefined) {

            if (result.Dictionary.LoggedInUser !== undefined) {
            return JSON.parse(result.Dictionary.LoggedInUser);
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

export let GetUser = async (roleLevel, pageNo, pageSize, sortByColumnName, ascOrDesc, searchKeyword) => {
    try {
        const response = await fetch(UrlConstant.User + `GetBy?roleLevel=${roleLevel}&pageNo=${pageNo}&pageSize=${pageSize}&sortByColumnName=${sortByColumnName}&ascOrDesc=${ascOrDesc}&searchKeyword=""`,
            {
                method: 'GET',
                headers: Config.headers,
            }
        )
        const result = await response.json();

        if (!result.HasError && result !== undefined) {

            if (result.Dictionary.LoggedInUser !== undefined) {
                return JSON.parse(result.Dictionary.LoggedInUser);
            }
        }
        return [];
        //});
    }
    catch (e) {
        console.log('error: ', e);
        return [];
    }
}


export let GetResller = async (roleLevel, pageNo, pageSize, sortByColumnName, ascOrDesc, searchKeyword) => {
    try {
        const response = await fetch(UrlConstant.User + `GetBy?roleLevel=${roleLevel}&pageNo=${pageNo}&pageSize=${pageSize}&sortByColumnName=${sortByColumnName}&ascOrDesc=${ascOrDesc}`,
            {
                method: 'GET',
                headers: Config.headers,
            }
        )
        const result = await response.json();
            // console.log('result', result)
        if (!result.HasError && result !== undefined) {

            if (result.Dictionary.Users !== undefined) {
                return JSON.parse(result.Dictionary.Users);
            }
        }
        return [];
        //});
    }
    catch (e) {
        console.log('error: ', e);
        return [];
    }
}

export let GetAll = async (searchText) => {
    
    try{
        var enterpriseId = Utilities.GetEnterpriseIDFromSession();
        const response = await 
        fetch(`${UrlConstant.User}ByText/${searchText.trim()}/${enterpriseId}`,
        {
            method: 'GET',
            headers: Config.headers,
        }
        )
        const result = await response.json();

       if (!result.HasError && result !== undefined) {

            if (result.Dictionary.Users !== undefined) {
            return JSON.parse(result.Dictionary.Users);
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



// Region POST

export let login = async (username, password) => {
    try{
        const response = await 
        fetch(UrlConstant.Login, {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'App': Config.Setting.app,
                    'Authorization':  "Bearer "+ localStorage.getItem(Constants.Session.JWT_TOKEN)  
                },
                  body:  JSON.stringify({
                      username : username,
                      password : password,
                      deviceId : localStorage.getItem('deviceId'),
                  }),
              });

        return response;

    }
    catch(e){
        console.log('error: ', e);
        
    }
    
}

export let signOut = async () => {
    try{
        let deviceId =localStorage.getItem('deviceId');
        const response = await 
        fetch(UrlConstant.SignOut+"/"+deviceId, {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'App': Config.Setting.app,
                    'Authorization':  "Bearer "+ localStorage.getItem(Constants.Session.JWT_TOKEN)  
                }, });
            // console.log("response signOut services",response)
        return response;

    }
    catch(e){
        console.log('error: logout', e);
        
    }
    
}


export let ChangePassword = async (oldPwd,newPwd) => {
    try{
        const response = await 
        fetch(UrlConstant.Login + "/ChangePassword", {
                  method: 'POST',
                  headers: Config.headers,
                  body:  '["' +oldPwd + '","' +newPwd + '"]',
              });
              const result = await response.json();
    
              if (!result.HasError && result !== undefined) {
          
                      if (result.Dictionary.IsPasswordChange) {
                          return '1';
                      }
              }
              
              return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : '0';
          
        }
    catch(e){
        console.log('error: ', e);  
    }
    
}

export let ForgotPassword = async (userName) => {
    try{
        const response = await 
        fetch(UrlConstant.Login + "/ForgotPassword", {
                  method: 'POST',
                  headers: Config.headers,
                  body:   "'" + userName + "'" ,
              });
              const result = await response.json();
              return result;

        }
    catch(e){
        console.log('error: ', e);  
    }
    
}

export let VerifyTokenForgotPassword = async (token,newPwd,membershipId) => {
    try{
        const response = await 
        fetch(UrlConstant.Login + "/VerifyToken", {
                  method: 'POST',
                  headers: Config.headers,
                  body:  '["' +token + '","' +newPwd + '","' +membershipId + '"]' ,
              });
              const result = await response.json();
    
              if (!result.HasError && result !== undefined) {
          
                      if (result.Dictionary.IsPasswordReset) {
                          return '1';
                      }
              }
              
              return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : '0';
          
        }
    catch(e){

        console.log('error: ', e);  
    }
    
}

export let GetAllUserPINs = async (enterpriseId, pageNo, pageSize, searchText ) => {
    
    // console.log("Checking", `${UrlConstant.User}AllPIN/${enterpriseId}/${pageNo}/${pageSize}`);
    // console.log("searchText", searchText);
    try{
        
        const response = await 

        fetch(`${UrlConstant.User}AllPIN/${enterpriseId}/${pageNo}/${pageSize}`,
        {
            method: 'POST',
            headers: Config.headers,
            body: JSON.stringify(searchText),
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

export let PostQrPin = async (obj) => {
    try{

        const response = await 
        fetch(UrlConstant.User + "UserPIN", {
                  method: 'POST',
                  headers: Config.headers,
                  body:  JSON.stringify(obj) ,
              });
              const result = await response.json();
              return result;
                      
        }
    catch(e){

        console.log('error: ', e);  
    }
    
}

export let BulkInsertQrPin = async (data) => {
    try{

        // console.log("json", JSON.stringify(JSON.stringify(data)));
        const response = await 
        fetch(UrlConstant.User + "UserPIN/Bulk/" + Utilities.GetEnterpriseIDFromSession(), {
                  method: 'POST',
                  headers: Config.headers,
                  body:  JSON.stringify(JSON.stringify(data)),
              });
              const result = await response.json();
              return result;
                      
        }
    catch(e){

        console.log('error: ', e);  
    }
    
}

// endregion POST



export let UpdatePINStatus = async(pinId, isActive) => {

    try{    
    const response = await 
    fetch(`${UrlConstant.User}UserPINStatus/${pinId}/${Utilities.GetEnterpriseIDFromSession()}/${isActive}`,
    {
            method: 'PUT',
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

export let UpdatePINVerification = async(pinId, isRequired) => {

    // console.log("Checcking");

    try{    
    const response = await 
    fetch(`${UrlConstant.User}/UserPIN/${Utilities.GetEnterpriseIDFromSession()}/${isRequired}`,
    {
            method: 'PUT',
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

export let DeleteUserPIN = async (pinId) => {
    try {
        const response = await 
        fetch(`${UrlConstant.User}UserPIN/${pinId}/${Utilities.GetEnterpriseIDFromSession()}`,
                {
                    method: 'DELETE',
                    headers: Config.headers,
                }
            )
        const result = await response.json();
       return result;
    }
    catch (e) {
        console.log('error: ', e);
        return '0';
    }
}

export let IsUserPINAlreadyExists = async (pin, id) => {
    
    try{
        
        const response = await 
        
        fetch(`${UrlConstant.User}UserPIN/IsAlreadyExists/${Utilities.GetEnterpriseIDFromSession()}/${id}`,
        {
            method: 'Post',
            headers: Config.headers,
            body:  '"'+pin+'"',
        }
        )


        const result = await response.json();
        return result;

    }
    catch(e){
        console.log('error: ', e); 
        return false; 
    }
}


