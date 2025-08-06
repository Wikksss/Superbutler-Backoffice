import UrlConstant from '../helpers/URLConstants';
//import Constants from '../helpers/Constants';
import Config from '../helpers/Config';
//import * as Utilities from  '../helpers/Utilities';


export let Get = async () => {
    
    try{
        
        const response = await 
        fetch(UrlConstant.Tag,
        {
            method: 'GET',
            headers: Config.headers,
        }
        )
        const result = await response.json();

       if (!result.HasError && result !== undefined) {

            if (result.Dictionary.FoodTypes !== undefined) {
            return JSON.parse(result.Dictionary.FoodTypes);
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

export let GetBy = async (enterpriseId) => {
    
    try{
        
        const response = await 
        fetch(UrlConstant.Tag + '/' + enterpriseId,
        {
            method: 'GET',
            headers: Config.headers,
        }
        )
        const result = await response.json();

       if (!result.HasError && result !== undefined) {

            if (result.Dictionary.Tags !== undefined) {
            return JSON.parse(result.Dictionary.Tags);
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
