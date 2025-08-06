import UrlConstant from '../helpers/URLConstants';
import Constants from '../helpers/Constants';
import Config from '../helpers/Config';
import * as Utilities from '../helpers/Utilities';

// Region POST

export let getJWTToken = async () => {
    try{

        const response = await 
        fetch(UrlConstant.Auth, {
                  method: 'POST',
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
          
                  },
                  body:  JSON.stringify(Config.Setting.clientApi),
              });
      const result = await response.json();
      localStorage.setItem(Constants.Session.JWT_TOKEN,result);
     }
    catch(e){
        console.error(e);
    }
    
}

//endregion POST

// Region GET 

export let heartbeat = async () => {
    try{
        
        const response = await 
        fetch(UrlConstant.Heartbeat, {
                  method: 'GET',
                  crossDomain: true,
                  headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                      'Authorization':  "Bearer "+ localStorage.getItem(Constants.Session.JWT_TOKEN)                   
                 }
              });
      const result = await response.json();
      if(!result){
          getJWTToken();
      }
    }
    catch(e){
        console.error(e);
    }
    
}

export let  GetSetting =  async() => {

    try{
            const response = await 
            fetch(UrlConstant.Auth + `/settings`, 
            {
                    method: 'GET',
                    headers: Config.headers,
            })
            
            const result = await response.json();
            
            if (!result.HasError && result !== undefined) {
                return result.Dictionary.AccessKeys;
            }
        
            return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : '';
    
        }
        catch(e){
            console.log('error: ', e);  
            return '';
        }
}



// endregion GET

        
 