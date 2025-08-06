import UrlConstant from '../helpers/URLConstants';
//import Constants from '../helpers/Constants';
import Config from '../helpers/Config';
import * as Utilities from  '../helpers/Utilities';


export const AddonGroupExtra = {
    "AddonGroupId": 0,
    "Name": "",
    "GroupType": "EXT",
    "AddedGroupItemCsv": "",
    "DeletedGroupItemCsv": "",
    "UpdatedGroupItemCsv": "",
    "MaxSelection": 0
}

export let GetAll = async (typeId) => {
    
    try {
        
        const response = await 
        fetch(UrlConstant.EnterpriseAddonGroup + Utilities.GetEnterpriseIDFromSession() +'/' + typeId,
        {
            method: 'GET',
            headers: Config.headers,
        }
        )

        const result = await response.json();
        
        if (!result.HasError && result !== undefined) {

            if (result.Dictionary.AddonGroups !== undefined) {
            return JSON.parse(result.Dictionary.AddonGroups);
            }
        
        }
        
        return [];

    }
    catch(e){
        console.log('error: ', e); 
        return []; 
    }
}

export let GetExtrasDetail = async (addonGroupId) => {
    
    try {
        
        const response = await 
        fetch(UrlConstant.EnterpriseAddonGroup+'/details/' + Utilities.GetEnterpriseIDFromSession() +'/' + addonGroupId,
        {
            method: 'GET',
            headers: Config.headers,
        }
        )

        const result = await response.json();
        
        if (!result.HasError && result !== undefined) {
               //console.log(result.Dictionary.ExtraGroupDetails) 
            if (result.Dictionary.ExtraGroupDetails !== undefined) {
                return JSON.parse(result.Dictionary.ExtraGroupDetails);
            }
        
        }
        
        return [];

    }
    catch(e){
        console.log('error: ', e); 
        return []; 
    }
}

export let Delete = async(menuAddonGroupId, addonType) => {

    try{
        const response = await 
        fetch(UrlConstant.EnterpriseAddonGroup + '' + Utilities.GetEnterpriseIDFromSession() + "/" + menuAddonGroupId + "/" + addonType,
        {
                method: 'DELETE',
                headers: Config.headers,
            }
        )

        const result = await response.json();

        if (!result.HasError && result !== undefined) {
                if (result.Dictionary.IsGroupDeleted === true) {
                    return true;
                }
        }
        
        return false;

    }
    catch(e){
        console.log('error: ', e);  
    }
}

export let UpdateSort = async(csv) => {

    try{

    const response = await 
    
    fetch(UrlConstant.EnterpriseAddonGroup + 'UpdateSort/' + Utilities.GetEnterpriseIDFromSession(),
    {
            method: 'PUT',
            headers: Config.headers,
            body: "'" + csv + "'",
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

export let SaveWithDetail = async(addonGroupExtra) => {

    try{

    const response = await 
    
    fetch(UrlConstant.EnterpriseAddonGroup + 'SaveWithDetails/' + Utilities.GetEnterpriseIDFromSession(),
    {
            method: 'POST',
            headers: Config.headers,
            body: JSON.stringify(addonGroupExtra),
        }
    )
     
    const result = await response.json();
    
    if (!result.HasError && result !== undefined) {

            if (result.Dictionary.IsGroupItemSaved === true) {
                return result.Dictionary.id;
            }
    }
    
    return 0;

    }
    catch(e){
        console.log('error: ', e);
        return 0;
    }

}


