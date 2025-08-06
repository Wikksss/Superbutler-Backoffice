import UrlConstant from '../helpers/URLConstants';
import Config from '../helpers/Config';
import * as Utilities from  '../helpers/Utilities';

export let GetAll = async()=>{

    // console.log("UrlConstant.EnterpriseGroup", UrlConstant.EnterpriseGroup);
    try{
        const response = await 
        fetch(UrlConstant.EnterpriseGroup,
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
        return []
    }
}