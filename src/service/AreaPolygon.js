import UrlConstant from '../helpers/URLConstants';
import Config from '../helpers/Config';


export let Get = async () => {
    
    try{
        
        const response = await 
        fetch(UrlConstant.AreaPolygon,
        {
            method: 'GET',
            headers: Config.headers,
        }
        
    )
        const result = await response.json();

       if (!result.HasError && result !== undefined) {

            if (result.Dictionary.AreaPolygon !== undefined) {
            return JSON.parse(result.Dictionary.AreaPolygon);
            }
        
        }

        return [];

    }
    catch(e){
        console.log('error: ', e); 
        return []; 
    }
}

