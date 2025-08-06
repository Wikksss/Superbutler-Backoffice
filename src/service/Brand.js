import UrlConstant from '../helpers/URLConstants';
import Config from '../helpers/Config';
import * as Utilities from  '../helpers/Utilities';


export let GetAll = async () => {
    
    try{
        
        const response = await 
        fetch(UrlConstant.Brand + "AllBrands",
        {
            method: 'GET',
            headers: Config.headers,
        }
        )
        const result = await response.json();
      
        if (!result.HasError && result !== undefined) {

            if (result.Dictionary.Brands !== undefined) {
                return JSON.parse(result.Dictionary.Brands);
            }
        
        }
        return [];
    }
    catch(e){
        console.log('error: ', e);  
    }

}