import UrlConstant from '../helpers/URLConstants';
import Constants from '../helpers/Constants';
import Config from '../helpers/Config';
//import * as Utilities from '../helpers/Utilities';


export let GetAll = async () => {
    
    try{
        //let check = Config.headers;
        const response = await
        fetch(UrlConstant.Permission, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'App': Config.Setting.app,
            'Authorization':  "Bearer "+ localStorage.getItem(Constants.Session.JWT_TOKEN)  
        }
        });
  
        const result = await response.json();

       if (!result.HasError && result !== undefined) {

            if (result.Dictionary.Permission !== undefined) {
            return JSON.parse(result.Dictionary.Permission);
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
