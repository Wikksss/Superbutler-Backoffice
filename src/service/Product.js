import UrlConstant from '../helpers/URLConstants';
//import Constants from '../helpers/Constants';
import Config from '../helpers/Config';
import * as Utilities from  '../helpers/Utilities';



export const CategoryProduct = {
    "ProductId": 0,
    "CategoryId": 0,
    "Name": "",
    "Description": "",
    "PhotoName": "",
    "HoursCsv": "",
    "VarietyCsv": "",
    "MenuAddonGroupId": 0,
    "EnterpriseId": 0,
    "TagsIdsCsv": "",
    "Ingredients": "",
    "PreparationTime": "",
    "DietaryTypeIdsCsv": ""
  }

export let GetWithDetails = async (enterpriseId, categoryId) => {
    
    try{
        
        const response = await 
        fetch(UrlConstant.EnterpriseCategoryProduct +  enterpriseId + '/'+ categoryId ,
        {
            method: 'GET',
            headers: Config.headers,
        }
        )
        const result = await response.json();
      
        if (!result.HasError && result !== undefined) {

            if (result.Dictionary.MenuItems !== undefined) {
                return JSON.parse(result.Dictionary.MenuItems);
            }
        
        }
        return [];
    }
    catch(e){
        console.log('error: ', e);  
    }

}

export let GetProductMediaJson = async (productId) => {
    
    try{
        
        const response = await 
        fetch(`${UrlConstant.EnterpriseCategoryProduct}GetMediaJson/${Utilities.GetEnterpriseIDFromSession()}/${productId}` ,
        {
            method: 'GET',
            headers: Config.headers,
        }
        )
        const result = await response.json();
      
        if (!result.HasError && result !== undefined) {

            if (result.Dictionary.MediaJson !== undefined) {
                return JSON.parse(result.Dictionary.MediaJson);
            }
        
        }
        return {};
    }
    catch(e){
        console.log('error: ', e);  
    }

}

export let GetWithDetailsBy = async (enterpriseId,categoryId) => {
    
    try{
        
        const response = await 
        fetch(UrlConstant.EnterpriseCategoryProduct +  enterpriseId + '/'+ categoryId ,
        {
            method: 'GET',
            headers: Config.headers,
        }
        )
        const result = await response.json();
      
        if (!result.HasError && result !== undefined) {

            if (result.Dictionary.MenuItems !== undefined) {
                return JSON.parse(result.Dictionary.MenuItems);
            }
        
        }
        return [];
    }
    catch(e){
        console.log('error: ', e);  
    }

}

export let UpdateSort = async(csv) => {

    try{

    const response = await 
    
    fetch(UrlConstant.EnterpriseCategoryProduct + 'UpdateSort/' + Utilities.GetEnterpriseIDFromSession(),
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

export let UpdateMedia = async(media) => {

    try{

    const response = await 
    
    fetch(`${UrlConstant.EnterpriseCategoryProduct}ItemMetaMedia`,
    {
            method: 'PUT',
            headers: Config.headers,
            body: JSON.stringify(media),
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

export let  Delete =  async(productId) => {

    try{

            const response = await 
            
            fetch(UrlConstant.EnterpriseCategoryProduct  + Utilities.GetEnterpriseIDFromSession() + '/' + productId,
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

export let  PublishUnpublish =  async(productId, isActive) => {

    try{

            const response = await 
            
            fetch(UrlConstant.EnterpriseCategoryProduct  + Utilities.GetEnterpriseIDFromSession() + '/' + productId + '/' + isActive,
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

export let Save = async(product) => {

    try{


        product.EnterpriseId = Utilities.GetEnterpriseIDFromSession();

        const response = await 
    
        fetch(UrlConstant.EnterpriseCategoryProduct,
        {
                method: 'POST',
                headers: Config.headers,
                body: JSON.stringify(product),
            }
        )
        
        const result = await response.json();
        
        if (!result.HasError && result !== undefined) {

                if (result.Dictionary.ItemMetaCreated === true) {
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


export let Update = async(product) => {

    try{


        product.EnterpriseId = Utilities.GetEnterpriseIDFromSession();

        const response = await 
    
        fetch(UrlConstant.EnterpriseCategoryProduct,
        {
                method: 'PUT',
                headers: Config.headers,
                body: JSON.stringify(product),
            }
        )
        
        const result = await response.json();
        
        if (!result.HasError && result !== undefined) {

                if (result.Dictionary.ItemMetaUpdated === true) {
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


export let UpdateItemMetaPhoto = async(ItemMeta) => {

    try{

        
        const response = await 
    
        fetch(UrlConstant.EnterpriseCategoryProduct + "ItemMetaPhoto",
        {
                method: 'PUT',
                headers: Config.headers,
                body: JSON.stringify(ItemMeta),
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

export let DeletePhoto = async(metaId,photoName) => {

    try{


        const response = await 
    
        fetch(UrlConstant.EnterpriseCategoryProduct + "DeletePhoto",
        {
                method: 'PUT',
                headers: Config.headers,
                body: '["' + metaId + '","' + Utilities.GetEnterpriseIDFromSessionObject() + '","' + photoName + '" ]' ,
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


