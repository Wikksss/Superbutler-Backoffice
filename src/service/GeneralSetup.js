import UrlConstant from '../helpers/URLConstants';
//import Constants from '../helpers/Constants';
import Config from '../helpers/Config';
import * as Utilities from  '../helpers/Utilities';

export let Get = async () => {
    
    try{
        
        const response = await 
        fetch(UrlConstant.EnterpriseSetting,
        {
            method: 'GET',
            headers: Config.headers,
        }
        )
        const result = await response.json();

       if (!result.HasError && result !== undefined) {

            if (result.Dictionary.EnterpriseDetail !== undefined) {
            return JSON.parse(result.Dictionary.EnterpriseDetail);
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

export let  Update =  async(enterpriseSetting) => {

    try{

        enterpriseSetting.EnterpriseId = Utilities.GetEnterpriseIDFromSession();
            const response = await 
            
            fetch(UrlConstant.EnterpriseSetting,
            {
                    method: 'Put',
                    headers: Config.headers,
                     body: JSON.stringify(enterpriseSetting),
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