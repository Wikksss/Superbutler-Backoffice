import UrlConstant from '../helpers/URLConstants';
import Constants from '../helpers/Constants';
import Config from '../helpers/Config';
import * as Utilities from  '../helpers/Utilities';


export let Get = async () => {
    
    try{
        
        const response = await 
        fetch(UrlConstant.City + 0,
        {
            method: 'GET',
            headers: Config.headers,
        }
        )
        const result = await response.json();

       if (!result.HasError && result !== undefined) {

            if (result.Dictionary.ActiveCities !== undefined) {
            return JSON.parse(result.Dictionary.ActiveCities);
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

export let GetAll = async () => {
    
    try{
        
        const response = await 
        fetch(UrlConstant.City + "all",
        {
            method: 'GET',
            headers: Config.headers,
        }
        )
        const result = await response.json();

       if (!result.HasError && result !== undefined) {

            if (result.Dictionary.Cities !== undefined) {
            return JSON.parse(result.Dictionary.Cities);
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


export let GetBy = async (stateProvince) => {
    
    try{
        
        const response = await 
        fetch(UrlConstant.City + "GetBy/" + stateProvince,
        {
            method: 'GET',
            headers: Config.headers,
        }
        )
        const result = await response.json();

       if (!result.HasError && result !== undefined) {

            if (result.Dictionary.Cities !== undefined) {
            return JSON.parse(result.Dictionary.Cities);
            }
        
        }

        return [];

    }
    catch(e){
        console.log('error: ', e); 
        return []; 
    }
}
