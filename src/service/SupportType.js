import UrlConstant from '../helpers/URLConstants';
import Config from '../helpers/Config';
import * as Utilities from '../helpers/Utilities';

export let  GetSupportType =  async(departmentId) => {

    try{
            
            const response = await 
            fetch(`${UrlConstant.SupportType}/${Utilities.GetEnterpriseIDFromSession()}/${departmentId}`,
            {
                    method: 'GET',
                    headers: Config.headers,
            })
            
            const result = await response.json();
            if (!result.HasError && result !== undefined) {
                return JSON.parse(result.Dictionary.SupportTypes);
            }
        
            return [];
    
        }
        catch(e){
            console.log('error: ', e);  
            return [];
        }
}

export let Save = async(supportType) => {

    try{


        const response = await 
    
        fetch(UrlConstant.SupportType + "/" + Utilities.GetEnterpriseIDFromSession(),
        {
                method: 'POST',
                headers: Config.headers,
                body: JSON.stringify(supportType),
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
        return '0';
    }

}

export let Update = async(supportType) => {

    try{

        const response = await 
    
        fetch(UrlConstant.SupportType + Utilities.GetEnterpriseIDFromSession() + '/' + supportType.Id,
        {
                method: 'PUT',
                headers: Config.headers,
                body: JSON.stringify(supportType),
            }
        )
        
        const result = await response.json();
        
        if (!result.HasError && result !== undefined) {

                if (result.Dictionary.IsUpdated === true) {
                    return '1';
                }
        }
        return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : 'Update Failed';
        
    }
    catch(e){
        console.log('error: ', e);  
        return '0';
    }

}

export let  Delete =  async(supportId) => {

    try{

            const response = await 
            
            fetch(UrlConstant.SupportType + Utilities.GetEnterpriseIDFromSession() + '/' + supportId,
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