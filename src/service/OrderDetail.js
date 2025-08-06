import UrlConstant from '../helpers/URLConstants';
// import * as APIUtilities from '../helpers/APIUtilities';
import Config from '../helpers/Config';
import * as Utilities from  '../helpers/Utilities';


export let Get = async (orderId, enterpriseId) => {
    
    try{
        const response = await
        fetch(`${UrlConstant.OrderDetail}${orderId}/${enterpriseId}`, {
          method: 'GET',
          headers: Config.headers,
        });
  
        const result = await response.json();
        return result;

    }
    catch(e){
        console.log('error: ', e); 
        return []; 
    }





}
