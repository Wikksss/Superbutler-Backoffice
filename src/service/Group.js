import UrlConstant from '../helpers/URLConstants';
import Config from '../helpers/Config';
import * as Utilities from  '../helpers/Utilities';

export let GetAll = async()=>{

    try{
        const response = await 
        fetch(UrlConstant.Group + Utilities.GetEnterpriseIDFromSession() ,
        {
            method: 'GET',
            headers: Config.headers,
        }
        )
        const result = await response.json();

        if (!result.HasError && result !== undefined) {
            if (result.Dictionary.Groups !== undefined) {
                return JSON.parse(result.Dictionary.Groups);
            }
        
        }
        return [];
    }
    catch(e){
        console.log('error: ', e);  
    }
}