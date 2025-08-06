import UrlConstant from '../helpers/URLConstants';
import Constants from '../helpers/Constants';
import Config from '../helpers/Config';
import * as Utilities from  '../helpers/Utilities';

export let GetOrderRouting = async()=>{

    try{
        const response = await 
        fetch(UrlConstant.OrderRouting + Utilities.GetEnterpriseIDFromSession(),
        {
            method: 'GET',
            headers: Config.headers,
        }
        )
        const result = await response.json();

        if (!result.HasError && result !== undefined) {
            if (result.Dictionary.OrderRouting !== undefined) {
                return JSON.parse(result.Dictionary.OrderRouting);
            }
        }
        return [];
    }
    catch(e){
        console.log('error: ', e);  
    }
}