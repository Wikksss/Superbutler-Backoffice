import UrlConstant from '../helpers/URLConstants';
//import Constants from '../helpers/Constants';
import Config from '../helpers/Config';
import * as Utilities from  '../helpers/Utilities';

export let GetToppingItems = async()=>{

    try{
        const response = await 
        fetch(UrlConstant.EnterpriseTopping + Utilities.GetEnterpriseIDFromSession() ,
        {
            method: 'GET',
            headers: Config.headers,
        }
        )
        const result = await response.json();

        if (!result.HasError && result !== undefined) {
            if (result.Dictionary.MenuTopping !== undefined) {
                return JSON.parse(result.Dictionary.MenuTopping);
            }
        
        }
        return [];
    }
    catch(e){
        console.log('error: ', e);  
    }
}

export let GetToppingItemsById = async(menuAddonGroupId)=>{

    try{
        const response = await 
        fetch(UrlConstant.EnterpriseTopping + Utilities.GetEnterpriseIDFromSession() + '/' + menuAddonGroupId,
        {
            method: 'GET',
            headers: Config.headers,
        }
        )
        const result = await response.json();
        
        if (!result.HasError && result !== undefined) {
            
            if (result.Dictionary.MenuAddonGroupItem !== undefined) {
                return JSON.parse(result.Dictionary.MenuAddonGroupItem);
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
    fetch(UrlConstant.EnterpriseTopping + '' + Utilities.GetEnterpriseIDFromSession() + '/' +  csv ,
    {
            method: 'PUT',
            headers: Config.headers,
        }
    )

    const result = await response.json();

    if (!result.HasError && result !== undefined) {
            if (result.Dictionary.IsMenuAddOnItemSortOrderUpdated === true) {
                return true;
            }
    }
    
    return false;

    }
    catch(e){
        console.log('error: ', e);  
    }

}



export let UpdateGroupItem = async(addonGroupId, groupName, groupItemsCsv, addonType) => {

    try{

        var toppingItem = { AddonGroupId: addonGroupId, GroupName: groupName, GroupItemsCsv: groupItemsCsv, AddonType:addonType};

    const response = await 
    fetch(UrlConstant.EnterpriseTopping + "UpdateToppingItem/" + Utilities.GetEnterpriseIDFromSession() ,
    {
            method: 'PUT',
            headers: Config.headers,
            body:  JSON.stringify(toppingItem),
        }
    )

    const result = await response.json();

    if (!result.HasError && result !== undefined) {
            if (result.Dictionary.IsGroupItemSaved === true) {
                return true;
            }
    }
    
    return false;

    }
    catch(e){
        console.log('error: ', e);  
    }

}




export let UpdateGlobelTopping = async(id, name, photoId, price) => {

    try{
        var topping = { Id: id, PhotoId: photoId, Name: name, Price: price};

        const response = await 
        fetch(UrlConstant.EnterpriseTopping + Utilities.GetEnterpriseIDFromSession(),
        {
                method: 'PUT',
                headers: Config.headers,
                body:  JSON.stringify(topping),
            }
        )

        const result = await response.json();

        if (!result.HasError && result !== undefined) {
            if (result.Dictionary.IsMenuToppingUpdated === true) {
                return true;
            }
        }
        
        return result;
    }
    catch(e){
        console.log('error: ', e);  
    }

}


export let SaveGlobelTopping = async(name, price) => {

    try{
        var topping = {  PhotoId: 1, Name: name, Price: price};

        const response = await 
        fetch(UrlConstant.EnterpriseTopping + Utilities.GetEnterpriseIDFromSession(),
        {
                method: 'POST',
                headers: Config.headers,
                body:  JSON.stringify(topping),
            }
        )

        const result = await response.json();

        if (!result.HasError && result !== undefined) {
                if (result.Dictionary.IsMenuToppingSaved === true) {
                    return true;
                }
        }
        
        return result;

    }
    catch(e){
        console.log('error: ', e);  
    }

}


export let DeleteGlobelTopping = async(id) => {

    try{
        const response = await 
        fetch(UrlConstant.EnterpriseTopping +  Utilities.GetEnterpriseIDFromSession() + "/" + id,
        {
                method: 'DELETE',
                headers: Config.headers,
            }
        )

        const result = await response.json();

        if (!result.HasError && result !== undefined) {
                if (result.Dictionary.IsMenuToppingDeleted === true) {
                    return true;
                }
        }
        
        return false;

    }
    catch(e){
        console.log('error: ', e);  
    }

}