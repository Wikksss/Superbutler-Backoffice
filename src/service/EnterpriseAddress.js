import UrlConstant from '../helpers/URLConstants';
//import Constants from '../helpers/Constants';
import Config from '../helpers/Config';
import * as Utilities from  '../helpers/Utilities';


export const EnterpriseAddress = {

    "ID":"",
    "EnterpriseId":"",
    "Label":"",
    "Address":"",
    "Addres2":"",
    "AreaId":"",
    "Latitude":"",
    "Longitude":"",
    "FormattedAddress":"",
    "GoogleLocation":"",
    "CityName": ""
} 


export let  Get =  async() => {

    try{

            const response = await 
            
            fetch(UrlConstant.EnterpriseAddress + Utilities.GetEnterpriseIDFromSessionObject(),
            {
                    method: 'GET',
                    headers: Config.headers,
            })
            
            const result = await response.json();
            
            if (!result.HasError && result !== undefined) {
                return JSON.parse(result.Dictionary.TakeAwayAddress);
            }
        
            return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : '';
    
        }
        catch(e){
            console.log('error: ', e);  
            return '';
        }
}

export let GetBy = async (addressId) => {
    
    try{
        
        const response = await 
        fetch(UrlConstant.EnterpriseAddress + Utilities.GetEnterpriseIDFromSessionObject() + "/" + addressId,
        {
            method: 'GET',
            headers: Config.headers,
        }
        )
        const result = await response.json();

       if (!result.HasError && result !== undefined) {

            if (result.Dictionary.Address !== undefined) {
            return JSON.parse(result.Dictionary.Address);
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

export let  Save =  async(enterpriseAddress) => {

    try{

            enterpriseAddress.EnterpriseId = Utilities.GetEnterpriseIDFromSessionObject();
            const response = await 
            
            fetch(UrlConstant.EnterpriseAddress,
            {
                    method: 'Post',
                    headers: Config.headers,
                    
                     body: JSON.stringify(enterpriseAddress),
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

export let  Update =  async(enterpriseAddress) => {

    try{

       
            enterpriseAddress.EnterpriseId = Utilities.GetEnterpriseIDFromSessionObject();
            const response = await 
            
            fetch(UrlConstant.EnterpriseAddress,
            {
                    method: 'Put',
                    headers: Config.headers,
                    
                     body: JSON.stringify(enterpriseAddress),
                }
            )
            
            const result = await response.json();
            
            if (!result.HasError && result !== undefined) {
        
                if (result.Dictionary.IsUpdate === true) {
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
            
            fetch(UrlConstant.EnterpriseAddress  + Utilities.GetEnterpriseIDFromSessionObject() + '/' + id,
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

