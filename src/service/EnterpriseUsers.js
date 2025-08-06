import UrlConstant from '../helpers/URLConstants';
//import Constants from '../helpers/Constants';
import Config from '../helpers/Config';
import * as Utilities from  '../helpers/Utilities';
import Constants from '../helpers/Constants';

export const UserObject = {
  
    "EUser" : {
        "Id" : 0,
        "Title": "Mr",
        "FirstName": "",
        "SurName": "",
        "PrimaryEmail": "",
        "Gender": "M",
        "Mobile1": "",
        "Mobile2": "",
        "LandLine1": "",
        "LandLine2": "",
        "Url": "",
        "CreatedBy": "",
        "DateOfBirth": "",
        "RoleLevel": 0,
        "AddressUser": {
            "AreaID": "",
            "Address1": "",
            "Address2": "",
            "UserID" : 0
      },

      "EnterpiseUser" : { 
          "EnterpriseID" : 0,
          "RoleID" : 0,
          "UserID" : 0
  }
  
},
"Password" : "",
"ConfirmPassword": "",
"LoginUserName" : ""
}


export let GetAll = async (enterpriseId) => {
    
    try{
        
        const response = await 
        fetch(UrlConstant.EnterpriseUsers + 'All/' + enterpriseId,
        {
            method: 'GET',
            headers: Config.headers,
        }
        )
        const result = await response.json();

       if (!result.HasError && result !== undefined) {

            if (result.Dictionary.EnterpriseUsers !== undefined) {
            return JSON.parse(result.Dictionary.EnterpriseUsers);
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


export let GetEnterpriseUsers = async (enterpriseIdCsv) => {
    
    try{
        
        const response = await 
        fetch(UrlConstant.EnterpriseUsers + 'AllBy/' + enterpriseIdCsv,
        {
            method: 'GET',
            headers: Config.headers,
        }
        )
        const result = await response.json();

       if (!result.HasError && result !== undefined) {

            if (result.Dictionary.EnterpriseUsers !== undefined) {
            return JSON.parse(result.Dictionary.EnterpriseUsers);
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






export let GetUser = async (userId) => {
    
    try{
        
        const response = await 
        fetch(UrlConstant.EnterpriseUsers + userId ,
        {
            method: 'GET',
            headers: Config.headers,
        }
        )
        const result = await response.json();

       if (!result.HasError && result !== undefined) {

            if (result.Dictionary.EnterpriseUser !== undefined) {
            return JSON.parse(result.Dictionary.EnterpriseUser);
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

export let GetArea = async (areaId) => {
    
    try{
        
        const response = await 
        fetch(UrlConstant.Area + areaId ,
        {
            method: 'GET',
            headers: Config.headers,
        }
        )
        const result = await response.json();

       if (!result.HasError && result !== undefined) {

            if (result.Dictionary.Area !== undefined) {
            return JSON.parse(result.Dictionary.Area);
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

export let GetUsers = async () => {
    
    try{
        
        const response = await 
        fetch(UrlConstant.EnterpriseUsers + 'Role/' + Utilities.GetEnterpriseIDFromSession() + '/' + Constants.Role.STAFF_ID ,
        {
            method: 'GET',
            headers: Config.headers,
        }
        )
        const result = await response.json();

       if (!result.HasError && result !== undefined) {

            if (result.Dictionary.EnterpriseUsers !== undefined) {
                return JSON.parse(result.Dictionary.EnterpriseUsers);
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


export let IsUserAlreadyRegistered = async (uName) => {
    
    try{
        
        const response = await 
        
        fetch(UrlConstant.EnterpriseUsers + 'IsAlreadyRegistered',
        {
            method: 'Post',
            headers: Config.headers,
            body:  '"'+uName+'"',
        }
        )


        const result = await response.json();
        
        if (!result.HasError && result !== undefined) {
    
            if (!result.Dictionary.EmailRegistered === true) {
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

export let  Delete =  async(userId,roleLevel) => {

    try{

            const response = await 
            
            fetch(UrlConstant.EnterpriseUsers + userId + '/' + roleLevel,
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

export let  ActiveSuspend =  async(userId,roleLevel,isActive) => {

    try{

            const response = await 
            
            fetch(UrlConstant.EnterpriseUsers  + 'ActiveSuspend/' + userId + '/' + roleLevel + '/' + isActive,
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

export let  ResetPassword =  async(membershipId,newPassword,confrimPassword) => {

    try{

            const response = await 
            
            fetch(UrlConstant.EnterpriseUsers  + 'ResetPassword/' + membershipId + '/' + newPassword + '/' + confrimPassword,
            {
                    method: 'PUT',
                    headers: Config.headers,
                }
            )
            
            const result = await response.json();
            
            if (!result.HasError && result !== undefined) {
        
                if (result.Dictionary.IsPasswordChange === true) {
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

export let  Save =  async(userObject) => {

    try{

        userObject.EUser.EnterpiseUser.EnterpriseId = Utilities.GetEnterpriseIDFromSession();


            const response = await 
            
            fetch(UrlConstant.EnterpriseUsers,
            {
                    method: 'Post',
                    headers: Config.headers,
                    
                     body: JSON.stringify(userObject),
                }
            )
            
            const result = await response.json();
            
            if (!result.HasError && result !== undefined) {
        
                if (result.Dictionary.IsSaved === true) {
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

export let  Update =  async(userObject) => {

    try{

        userObject.EUser.EnterpiseUser.EnterpriseId = Utilities.GetEnterpriseIDFromSessionObject();
            const response = await 
            
            fetch(UrlConstant.EnterpriseUsers,
            {
                    method: 'Put',
                    headers: Config.headers,
                     body: JSON.stringify(userObject),
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

export let AddPhoto = async (userObj) => {
    try {
        const response = await
            fetch(UrlConstant.EnterpriseUsers + "Photo",
                {
                    method: 'PUT',
                    headers: Config.headers,
                    body: JSON.stringify(userObj),
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