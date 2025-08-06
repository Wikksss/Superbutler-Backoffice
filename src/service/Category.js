import UrlConstant from '../helpers/URLConstants';
//import Constants from '../helpers/Constants';
import Config from '../helpers/Config';
import * as Utilities from  '../helpers/Utilities';

export const categoryObject = {
    "MenuCategoryId": 0,
    "Name": "",
    "Description": "",
    "PhotoName": "",
    "DaysCsv": "",
    "HoursCsv": "",
    "VarietyCsv": "",
    "MenuAddonToppingGroupId": 0,
    "MenuAddonExtrasGroupId": 0,
    "OldVarietyCsv": "",
    "IsDeal": false,
    "IsBuffet": false,
    "EnterpriseId": 0,
    "HideFromPlatform": false,
    "HideFromWhiteLabel" : false,
    "TagsIdsCsv": ""

  }
  

export let GetAll = async (enterpriseId) => {
    
    try{
        
        const response = await 
        fetch(UrlConstant.EnterpriseCategories + enterpriseId +'/0',
        {
            method: 'GET',
            headers: Config.headers,
        }
        )
        const result = await response.json();
      

        /*.then(result=>{ return result.json();
        }).then(data => {
        */
        if (!result.HasError && result !== undefined) {

            if (result.Dictionary.MenuCategories !== undefined) {
            return JSON.parse(result.Dictionary.MenuCategories);
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


export let GetAllBy = async (enterpriseId) => {
    
    try{
        
        const response = await 
        fetch(UrlConstant.EnterpriseCategories + enterpriseId +'/0',
        {
            method: 'GET',
            headers: Config.headers,
        }
        )
        const result = await response.json();
      

        /*.then(result=>{ return result.json();
        }).then(data => {
        */
        if (!result.HasError && result !== undefined) {

            if (result.Dictionary.MenuCategories !== undefined) {
            return JSON.parse(result.Dictionary.MenuCategories);
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

export let UpdateSort = async(csv) => {

    try{

    const response = await 
    
    fetch(UrlConstant.EnterpriseCategories + 'UpdateSort/' + Utilities.GetEnterpriseIDFromSession(),
    {
            method: 'PUT',
            headers: Config.headers,
            body: "'" + csv + "'",
        }
    )
     
    const result = await response.json();
    
    if (!result.HasError && result !== undefined) {

            if (result.Dictionary.IsUpdated === true) {
                return true;
            }
    }
    
    return false;

    }
    catch(e){
        console.log('error: ', e);  
    }

}

export let  Delete =  async(categoryId) => {

    try{

            const response = await 
            
            fetch(UrlConstant.EnterpriseCategories  + Utilities.GetEnterpriseIDFromSession() + '/' + categoryId,
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

export let  PublishUnpublish =  async(categoryId, isActive) => {

    try{

            const response = await 
            
            fetch(UrlConstant.EnterpriseCategories  + Utilities.GetEnterpriseIDFromSession() + '/' + categoryId + '/' + isActive,
            {
                    method: 'PUT',
                    headers: Config.headers,
                }
            )
            
            const result = await response.json();
            
            if (!result.HasError && result !== undefined) {
        
                if (result.Dictionary.IsUpdated === true) {
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

export let Save = async(category) => {

    try{


        category.EnterpriseId = Utilities.GetEnterpriseIDFromSession();

        const response = await 
    
        fetch(UrlConstant.EnterpriseCategories,
        {
                method: 'POST',
                headers: Config.headers,
                body: JSON.stringify(category),
            }
        )
        
        const result = await response.json();
        
        if (!result.HasError && result !== undefined) {

                if (result.Dictionary.IsCategoryCreated === true) {
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

export let Update = async(category) => {

    try{


        category.EnterpriseId = Utilities.GetEnterpriseIDFromSession();

        const response = await 
    
        fetch(UrlConstant.EnterpriseCategories,
        {
                method: 'PUT',
                headers: Config.headers,
                body: JSON.stringify(category),
            }
        )
        
        const result = await response.json();
        
        if (!result.HasError && result !== undefined) {

                if (result.Dictionary.IsCategoryUpdated === true) {
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


export let UpdateCategoryPhoto = async(category) => {

    try{

        
        const response = await 
    
        fetch(UrlConstant.EnterpriseCategories + "Photo",
        {
                method: 'PUT',
                headers: Config.headers,
                body: JSON.stringify(category),
            }
        )
        
        const result = await response.json();
        
        if (!result.HasError && result !== undefined) {
                    
            if (result.Dictionary.PhotoName !== undefined) {
                return result.Dictionary.PhotoName;
            }
        }
        return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : '';

    }
    catch(e){
        console.log('error: ', e);  
        return '0';
    }

}

export let DeletePhoto = async(catId,photoName) => {

    try{

        // console.log("EId: ",Utilities.GetEnterpriseIDFromSessionObject());
        // console.log("metaId: ",catId);
        // console.log("photoName: ",photoName);


        const response = await 
    
        fetch(UrlConstant.EnterpriseCategories + "DeletePhoto",
        {
                method: 'PUT',
                headers: Config.headers,
                body: '["' + catId + '","' + Utilities.GetEnterpriseIDFromSessionObject() + '","' + photoName + '" ]' ,
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