import UrlConstant from '../helpers/URLConstants';
//import Constants from '../helpers/Constants';
import Config from '../helpers/Config';
//import * as Utilities from  '../helpers/Utilities';

export let  Update =  async(id,limit) => {

    try{

            const response = await 
            
            fetch(UrlConstant.Account + id + '/' + limit,
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