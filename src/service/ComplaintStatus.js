import UrlConstant from '../helpers/URLConstants';
import Config from '../helpers/Config';
import * as Utilities from  '../helpers/Utilities';


export let Get = async () => {
    
    try{
        
        const response = await 
        fetch(`${UrlConstant.ComplaintStatus} ${Utilities.GetEnterpriseIDFromSessionObject()}`,
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
        return []; 
    }
}


export let Save = async(status) => {

    try{
        const response = await 
    
        fetch(UrlConstant.ComplaintStatus + Utilities.GetEnterpriseIDFromSessionObject(),
        {
                method: 'POST',
                headers: Config.headers,
                body: JSON.stringify(status),
            }
        )
        
        const result = await response.json();
        
        if (!result.HasError && result !== undefined) {

                if (result.Dictionary.IsSaved === true) {
                    return '1';
                }
        }
        return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : 'Saving Failed';

    }
    catch(e){
        console.log('error: ', e);  
        return 'Saving Failed';
    }

}
export let Update = async (status ,Id) => {
    
    try {
        const response = await
        fetch(UrlConstant.ComplaintStatus + Utilities.GetEnterpriseIDFromSessionObject() + '/' + Id ,
                {
                    method: 'PUT',
                    headers: Config.headers,
                    body: JSON.stringify(status),
                }
            )
        
            const result = await response.json();
            if (!result.HasError && result != undefined) {

            if (result.Dictionary.IsUdpdated) {
                return '1';
            }
        }
        return result.HasError === true && result.ErrorCodeCsv !== '' ? result.ErrorCodeCsv : 'Update Failed.';
    }
    catch (e) {
        console.log('error: ', e);
        return 'Update Failed.';
    }
}


export let  Delete =  async(statusId) => {

    try{

            const response = await 
            
            fetch(UrlConstant.ComplaintStatus + Utilities.GetEnterpriseIDFromSession() + '/' + statusId,
            {
                    method: 'DELETE',
                    headers: Config.headers,
                }
            )
            
            const result = await response.json();
            
            if (!result.HasError && result !== undefined) {
        
                if (result.Dictionary.IsDeleted === true) {
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