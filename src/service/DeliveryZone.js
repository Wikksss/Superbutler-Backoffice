import UrlConstant from '../helpers/URLConstants';
//import Constants from '../helpers/Constants';
import Config from '../helpers/Config';
//import * as Utilities from  '../helpers/Utilities';


export const DeliveryZone = {

    "ID":0,
    "Name":"",
    "Radius":"",
    "DeliveryCharges":0,
    "MinimumDeliveryOrder":"",
    "DeliveryTime":"",
    "DaysCSV":"",
    "PolygonLatLong":"",
    "PolygonLatLongArray":"",
} 



export let Get = async () => {
    
    try{
        
        const response = await 
        fetch(UrlConstant.DeliveryZone,
        {
            method: 'GET',
            headers: Config.headers,
        }
        )
        const result = await response.json();

       if (!result.HasError && result !== undefined) {

            if (result.Dictionary.EnterpriseDeliveryZones !== undefined) {
            return JSON.parse(result.Dictionary.EnterpriseDeliveryZones);
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

export let  Save =  async(deliveryZone) => {

    try{

       
            const response = await 
            
            fetch(UrlConstant.DeliveryZone,
            {
                    method: 'Post',
                    headers: Config.headers,
                    
                     body: JSON.stringify(deliveryZone),
                }
            )
            
            const result = await response.json();
            
            if (!result.HasError && result !== undefined) {
        
                if (result.Dictionary.IsSaved === true) {
                    return result.Dictionary.id;
                }
            }
        
            return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : '0';
    
        }
        catch(e){
            console.log('error: ', e);  
            return '0';
        }
}

export let  Update =  async(deliveryZone) => {

    try{

       
            const response = await 
            
            fetch(UrlConstant.DeliveryZone,
            {
                    method: 'Put',
                    headers: Config.headers,
                    
                     body: JSON.stringify(deliveryZone),
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


export let  UpdateAreaPolygon =  async(id,csv) => {

    try{

            const response = await 
            fetch(UrlConstant.DeliveryZone + "Areas",
            {
                    method: 'Put',
                    headers: Config.headers,
                    body: '["' + id + '","' + csv + '"]',
                }
            )
            
            const result = await response.json();
            
            if (!result.HasError && result !== undefined) {
        
                if (result.Dictionary.IsAreaPolygonUpdated === true) {
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

export let  Delete =  async(id) => {

    try{

            const response = await 
            
            fetch(UrlConstant.DeliveryZone  + id,
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