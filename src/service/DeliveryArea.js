import UrlConstant from '../helpers/URLConstants';
//import Constants from '../helpers/Constants';
import Config from '../helpers/Config';
import * as Utilities from  '../helpers/Utilities';


export const DeliveryArea = {

    "DeliveryAreasToBeSaved":"",
    "DeliveryAreasToBeUpdated":"",
    "DeliveryAreasToBeRemoved":"",
    "SelectedCityId":0,
    "SelectedTownName":""
} 


export let Get = async (cityId,isExcludedArea) => {
    
    try{
        
        const response = await 
        fetch(UrlConstant.DeliveryArea + Utilities.GetEnterpriseIDFromSession() + '/' + cityId + '/' + isExcludedArea,
        {
            method: 'GET',
            headers: Config.headers,
        }
        )
        const result = await response.json();

       if (!result.HasError && result !== undefined) {

            if (result.Dictionary.RestaurantDeliveryAreas !== undefined) {
            return JSON.parse(result.Dictionary.RestaurantDeliveryAreas);
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

export let GetAll = async () => {
    
    try{
        
        const response = await 
        fetch(UrlConstant.DeliveryArea + Utilities.GetEnterpriseIDFromSession(),
        {
            method: 'GET',
            headers: Config.headers,
        }
        )
        const result = await response.json();

       if (!result.HasError && result !== undefined) {

            if (result.Dictionary.RestaurantDeliveryAreas !== undefined) {
            return JSON.parse(result.Dictionary.RestaurantDeliveryAreas);
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

export let  Save =  async(deliveryAreasToBeSaved) => {

    try{

       
            const response = await 
            
            fetch(UrlConstant.DeliveryArea,
            {
                    method: 'Post',
                    headers: Config.headers,
                    
                     body: JSON.stringify(deliveryAreasToBeSaved),
                }
            )
            
            const result = await response.json();
            
            if (!result.HasError && result !== undefined) {
        
                if (result.Dictionary.IsChangesSuccessful === true) {
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

export let  Update =  async(deliveryAreaParam) => {

    try{

       
            const response = await 
            
            fetch(UrlConstant.DeliveryArea,
            {
                    method: 'Put',
                    headers: Config.headers,
                    
                     body: JSON.stringify(deliveryAreaParam),
                }
            )
            
            const result = await response.json();
            
            if (!result.HasError && result !== undefined) {
        
                if (result.Dictionary.IsChangesSuccessful === true) {
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

export let  Delete =  async(deliveryAreasToBeRemovedCsv) => {

    try{

            const response = await 
            
            fetch(UrlConstant.DeliveryArea,
            {
                    method: 'DELETE',
                    headers: Config.headers,
                    body: JSON.stringify(deliveryAreasToBeRemovedCsv),
                }
            )
            
            const result = await response.json();
            
            if (!result.HasError && result !== undefined) {
        
                if (result.Dictionary.IsChangesSuccessful === true) {
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