import UrlConstant from '../helpers/URLConstants';
//import Constants from '../helpers/Constants';
import Config from '../helpers/Config';

export let GetDays = async () => {
    
    try{
        
        const response = await 
        fetch(UrlConstant.GlobalConfiguration + 'Days' ,
        {
            method: 'GET',
            headers: Config.headers,
        }
        )
        const result = await response.json();
      
        return result;
    }
    catch(e){
        console.log('error: ', e);  
    }
}
