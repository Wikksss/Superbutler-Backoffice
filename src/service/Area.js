import UrlConstant from '../helpers/URLConstants';
//import Constants from '../helpers/Constants';
import Config from '../helpers/Config';
//import * as Utilities from  '../helpers/Utilities';


export let GetTownArea = async (townName,cityId) => {
    
    try{
        
        const response = await 
        fetch(UrlConstant.Area + 'TownAreas/' + townName + '/' + cityId,
        {
            method: 'GET',
            headers: Config.headers,
        }
        
    )
        const result = await response.json();

       if (!result.HasError && result !== undefined) {

            if (result.Dictionary.TownAreas !== undefined) {
            return JSON.parse(result.Dictionary.TownAreas);
            }
        
        }

        return [];

    }
    catch(e){
        console.log('error: ', e); 
        return []; 
    }
}

export let GetBy = async (searchtext) => {
    
    try{
        
        const response = await 
        fetch(UrlConstant.Area +'SearchArea/' +  searchtext,
        {
            method: 'GET',
            headers: Config.headers,
        }
        
    )
        const result = await response.json();

       if (!result.HasError && result !== undefined) {

            if (result.Dictionary.Area !== undefined) {
            return JSON.parse(result.Dictionary.Area);
            }
        
        }

        return [];

    }
    catch(e){
        console.log('error: ', e); 
        return []; 
    }
}

export let GetConsumerArea = async (searchtext) => {
    
    try{
        
        const response = await 
        fetch(UrlConstant.Area +'AllConsumerArea/',
        {
            method: 'GET',
            headers: Config.headers,
        }
        
    )
        const result = await response.json();

       if (!result.HasError && result !== undefined) {

            if (result.Dictionary.ConsumerArea !== undefined) {
            return JSON.parse(result.Dictionary.ConsumerArea
       );
            }
        
        }

        return [];

    }
    catch(e){
        console.log('error: ', e); 
        return []; 
    }
}