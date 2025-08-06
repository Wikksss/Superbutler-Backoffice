import UrlConstant from '../helpers/URLConstants';
//import Constants from '../helpers/Constants';
import Config from '../helpers/Config';
import * as Utilities from '../helpers/Utilities';
import GlobalData from '../helpers/GlobalData'

export let GetAll = async () => {
    try {
        const response = await
            fetch(UrlConstant.Notification + 'GetAll',
                {
                    method: 'GET',
                    headers: Config.headers,
                }
            )
        const result = await response.json();
        if (result !== undefined && result.length > 0) {
            return result
        }
        return [];
    }
    catch (e) {
        console.log('error: ', e);
        return [];
    }
}


export let GetDetailBy = async (id) => {
    
    try{
        
        const response = await 
        fetch(UrlConstant.Notification + `Detail/${id}`,
        {
            method: 'GET',
            headers: Config.headers,
        }
        )
        const result = await response.json();

       if (!result.HasError && result !== undefined) {

            if (result.Dictionary.NotificationDetail !== undefined) {
            return JSON.parse(result.Dictionary.NotificationDetail);
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

export let DeleteNotification = async (id) => {
    try {
        const response = await
            fetch(UrlConstant.Notification+ 'Delete/' + id,
                {
                    method: 'DELETE',
                    headers: Config.headers,
                }
            )
            const result = await response.json();
            
            if (!result.HasError && result !== undefined) {
        
                if (result.Dictionary.IsDeleted === true) {
                    return true;
                }
            }
        
            return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : '0';
    
        }
        catch(e){
            console.log('error: ', e);  
            return '0';
        }
}


export let SaveNotification = async (notificationObj) => {
    try {
        const response = await
            fetch(UrlConstant.Notification + '/Save',
                {
                    method: 'POST',
                    headers: Config.headers,
                    body: JSON.stringify(notificationObj),
                }
            )
            const result = await response.json();
            
            if (!result.HasError && result !== undefined) {
        
                if (result.Dictionary.IsInQueued === true) {
                    return true;
                }
            }
        
            return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : '0';
    
        }
        catch(e){
            console.log('error: ', e);  
            return '0';
        }
}
export let UpdateNotification = async (notificationObj) => {
    try {
        const response = await
            fetch(UrlConstant.Notification + '/Update',
                {
                    method: 'Put',
                    headers: Config.headers,
                    body: JSON.stringify(notificationObj),
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


