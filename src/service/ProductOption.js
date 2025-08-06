import UrlConstant from '../helpers/URLConstants';
//import Constants from '../helpers/Constants';
import Config from '../helpers/Config';
import * as Utilities from  '../helpers/Utilities';



export const Option = {
    "Id": 0,
    "ProductId": 0,
    "Name": "",
    "Description": "",
    "PhotoName": "",
    "HoursCsv": "",
    "VarietyCsv": "",
    "VarietyName": "",
    "Price": 0,
    "HasReminder": true,
    "Serving": 0,
    "VarietyId": 0,
    "MenuAddonGroupId": 0,
    "MenuAddonToppingId": 0,
    "EnterpriseId": 0,
    "SKU":"",
    "UnitStock" : 0,
    "RecordAlert" : 0,
    "SaleLimit": 0,
    "ItemFilters": "",
    "CalorieCount": "",
    
  }	

export let  Delete =  async(productOptionId) => {

    try{

            const response = await 
            
            fetch(UrlConstant.EnterpriseCategoryProductOption  + Utilities.GetEnterpriseIDFromSession() + '/' + productOptionId,
            {
                    method: 'DELETE',
                    headers: Config.headers,
            })
            
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

export let  SaveUpdate =  async(option) => {

    try{
            option.EnterpriseId =  Utilities.GetEnterpriseIDFromSession();

            const response = await 
            
            fetch(UrlConstant.EnterpriseCategoryProductOption,
            {
                    method: 'post',
                    headers: Config.headers,
                    body: JSON.stringify(option),
            })
            
            const result = await response.json();
            
            if (!result.HasError && result !== undefined) {
        
                if (result.Dictionary.IsSaved === true) {
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


export let UpdateItems = async(metaId, csv) => {

    try{

        const response = await 
    
        fetch(UrlConstant.EnterpriseCategoryProductOption + 'UpdateItems',
        {
                method: 'PUT',
                headers: Config.headers,
                body:  '["' + Utilities.GetEnterpriseIDFromSessionObject() + '","' + metaId + '","' + csv  + '"]'
            }
        )
        
        const result = await response.json();
        
        if (!result.HasError && result !== undefined) {

                if (result.Dictionary.ItemsUpdated === true) {
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

export let UpdateItemPhoto = async(item) => {

    try{

        
        const response = await 
    
        fetch(UrlConstant.EnterpriseCategoryProductOption + "Photo",
        {
                method: 'PUT',
                headers: Config.headers,
                body: JSON.stringify(item),
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

export let AddMoreFiles = async (enterpriseId, productOptionId, fileStream) => {
    try {
        const response = await fetch(UrlConstant.EnterpriseCategoryProductOption + 'MoreFiles/' + enterpriseId + '/' + productOptionId,
            {
                method: 'POST',
                headers: Config.headers,
                body: JSON.stringify(fileStream),

            }
        )
        const result = await response.json();
        return result
    }
    catch (e) {
        console.log('error: ', e);
        return '0';
    }

}