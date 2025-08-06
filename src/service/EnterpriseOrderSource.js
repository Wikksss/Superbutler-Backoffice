import UrlConstant from '../helpers/URLConstants';
import Config from '../helpers/Config';
import * as Utilities from  '../helpers/Utilities';

export let  Get =  async() => {

    try{
            
            const response = await 
            fetch(`${UrlConstant.EnterpriseOrderSource}/${Utilities.GetEnterpriseIDFromSession()}`,
            {
                    method: 'GET',
                    headers: Config.headers,
            })
            
            const result = await response.json();
            if (!result.HasError && result !== undefined) {
                return JSON.parse(result.Dictionary.EnterpriseOrderSource);
            }
        
            return [];
    
        }
        catch(e){
            console.log('error: ', e);  
            return [];
        }
}


export let Post = async (source) => {

    try {

        const response = await

            fetch(UrlConstant.EnterpriseOrderSource,
                {
                    method: 'Post',
                    headers: Config.headers,

                    body: JSON.stringify(source),
                }
            )

        const result = await response.json();

        if (!result.HasError && result !== undefined) {

            if (result.Dictionary.IsSaved === true) {
                return '1';
            }
        }

        return result.HasError === true && result.ErrorCodeCsv !== '' ? result.ErrorCodeCsv : 'Saving Failed';

    }
    catch (e) {
        console.log('error: ', e);
        return 'Saving Failed';
    }
}

export let Update = async(source) => {

    try{

        const response = await 
    
        fetch(UrlConstant.EnterpriseOrderSource + '/' + source.Id,
        {
                method: 'PUT',
                headers: Config.headers,
                body: JSON.stringify(source),
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
        return 'Update Failed';
    }

}

export let  Delete =  async(Id) => {

    try{

            const response = await 
            
            fetch(UrlConstant.EnterpriseOrderSource + '/' + Id,
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