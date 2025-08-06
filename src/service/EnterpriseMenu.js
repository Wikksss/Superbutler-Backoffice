import UrlConstant from '../helpers/URLConstants';
import Constants from '../helpers/Constants';
import Config from '../helpers/Config';
import * as Utilities from  '../helpers/Utilities';

export let GetEnterpriseJson = async () => {
    
    try{
        
        const response = await 
        fetch(UrlConstant.EnterpriseMenu +  Utilities.GetEnterpriseIDFromSession(),
        {
            method: 'GET',
            headers: Config.headers,
        }
        )
        const result = await response.json();
        if (!result.HasError && result !== undefined) {

            if (result.Dictionary.RestaurantJson !== undefined) {
                return JSON.parse(result.Dictionary.RestaurantJson);
            }
        
        }
        // Utilities.SetSessionExpired(result.ErrorCodeCsv);
        return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : '';
    }
    catch(e){
        console.log('error: ', e);  
        return {};
    }

} 

export let POSMENU = async () => {
    
    try{

        const response = await 
        
        fetch(UrlConstant.EnterpriseMenu + 'import-pos/' +  Utilities.GetEnterpriseIDFromSession(),
        {
            method: 'POST',
            headers: Config.headers,
        }
        )

        const result = await response.json();
      
        if (Object.keys(result).length > 0) {
            return result
        }
    
        return {};
    }
    catch(e){
        console.log('error: ', e); 
        return {}; 
    }

} 
export let PublishedUnPublishedMenu = async (isPublished) => {
    
    try{
    
        let userObject = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT));
        let AdminObject = JSON.parse(localStorage.getItem(Constants.Session.ADMIN_OBJECT))
        let parentObject = JSON.parse(localStorage.getItem(Constants.Session.PARENT_OBJECT))
        let userId = parentObject !== null ? `${parentObject.Id}` : (AdminObject !== null ? `${AdminObject.Id}` : `${userObject.Id}`);

        const response = await 
        
        fetch(UrlConstant.EnterpriseMenu +  Utilities.GetEnterpriseIDFromSession() + '/' + isPublished + '/' + userId,
        {
            method: 'POST',
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

export let GetMenuStatus = async () => {
    
    try{
        
        const response = await 
        
        fetch(UrlConstant.EnterpriseMenu +  Utilities.GetEnterpriseIDFromSession() + '/0',
        {
            method: 'GET',
            headers: Config.headers,
        }
        )

        const result = await response.json();
      
        if (!result.HasError && result !== undefined) {
        
           
            return result.Dictionary.MenuStatus;
           
        }
    
        return '0';
    }
    catch(e){
        console.log('error: ', e); 
        return '0'; 
    }

} 


export let UpdateChildMenu = async(parentId, childIdCSV) => {

    try{

    const response = await 
    
    fetch(UrlConstant.EnterpriseMenu + 'UpdateChild/',
    {
            method: 'PUT',
            headers: Config.headers,
            body:  '["' + parentId + '","' + childIdCSV + '"]' ,
        }
    )
     
    const result = await response.json();
    
    if (!result.HasError && result !== undefined) {

            if (result.Dictionary.IsUpdated) {
                return '1';
            }
    }
    
    return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : '0';

    }
    catch(e){
        console.log('error: ', e);  
    }

}

