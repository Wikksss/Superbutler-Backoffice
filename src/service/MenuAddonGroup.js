import UrlConstant from '../helpers/URLConstants';
//import Constants from '../helpers/Constants';
import Config from '../helpers/Config';
import * as Utilities from  '../helpers/Utilities';

export let GetAll = async(addonType)=>{

    try{
        const response = await 
        fetch(UrlConstant.EnterpriseAddonGroup + Utilities.GetEnterpriseIDFromSession() + '/' + addonType,
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
            
            if (result.Dictionary.AddonGroups !== undefined) {
                return JSON.parse(result.Dictionary.AddonGroups);
            }
        
        }
        return [];

        //});
    }
    catch(e){
        console.log('error: ', e);  
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


export let Save = async(addonGroupId, groupName, groupItemsCsv, addonType) => {

    try{
        var addonGroup = { AddonGroupId: addonGroupId, GroupName: groupName, GroupItemsCsv: groupItemsCsv, AddonType:addonType};

        const response = await 
        fetch(UrlConstant.EnterpriseAddonGroup + '' + Utilities.GetEnterpriseIDFromSession(),
        {
                method: 'POST',
                headers: Config.headers,
                body:  JSON.stringify(addonGroup),
            }
        )

        const result = await response.json();

        return result;

    }
    catch(e){
        console.log('error: ', e);  
    }

}