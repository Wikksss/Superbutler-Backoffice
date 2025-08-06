import UrlConstant from '../helpers/URLConstants';
//import Constants from '../helpers/Constants';
import Config from '../helpers/Config';
import * as Utilities from  '../helpers/Utilities';


export let GetExternalService = async (externalServiceId) => {
    
    try{
        
        const response = await 
        fetch(UrlConstant.ExternalService + externalServiceId ,
        {
            method: 'GET',
            headers: Config.headers,
        }
        )
        const result = await response.json();

       if (!result.HasError && result !== undefined) {

            if (result.Dictionary.ExternalService !== undefined) {
            return JSON.parse(result.Dictionary.ExternalService);
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

export let SaveUpdateExternalService = async(externalService) => {

    try{

    const response = await 
    
    fetch(UrlConstant.ExternalService,
    {
            method: 'POST',
            headers: Config.headers,
            body: JSON.stringify(externalService),
        
        }
    )
     
    const result = await response.json();
    return result;
    
    
    }
    catch(e){
        console.log('error: ', e);
        return 0;
    }

}

export let  ActiveSuspend =  async(enterpriseId, enterpriseTypeId, isActive) => {

    try{

            const response = await 
            
            fetch(UrlConstant.ExternalService  + 'status/' + enterpriseId + '/' + enterpriseTypeId + '/' + isActive,
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

export let  Delete =  async(enterpriseId, enterpriseTypeId) => {

    try{

            const response = await 
            
            fetch(UrlConstant.ExternalService + enterpriseId + '/' + enterpriseTypeId,
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


