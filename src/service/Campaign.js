import UrlConstant from '../helpers/URLConstants';
import Config from '../helpers/Config';
import * as Utilities from  '../helpers/Utilities';

export const Campaign = {

    
    "Id" : 0,
    "Name" : "",
    "PreLaunchText": "",
    "PostLaunchText" : "",
    "BackgroundColor" : "",
    "TextColor" : "",
    "StartDate" : "",
    "EndDate" : "",
    "ShowTeaserBefore" : "",
    "ContentJson" : "",
    "IsActive" : "",
    "PhotoGroupName": "",
    "PhotoNameBitStream": "",
    "PhotoName": "",
    "OldPhotoName": "",
    "ContentBanner": []
} 


export const CampaignBanners = {
   
    "ContentType" : "",
    "BackgroundCsv" : "",
    "FoodImagesCsv" : "",
    "MainBannerType" : "", 
    "MainBannersCsv" : "",
    "Logo" : "",
    "SubBanner" : "",
    "SearchInputBgColor" : "",
    "SearchInputTextColor" : "",
    "SearchBtnBgColor" : "",
    "SearchBtnTextColor" : "",
    "WalletStripBgColor" : "",
    "WalletStripTextColor" : "",
    
}

export const AppBanners = {
   
    "ContentType" : "",
    "BackgroundCsv" : "",
    "FoodImagesCsv" : "",
    "MainBannerType" : "", 
    "MainBannersCsv" : "",
    "Logo" : "",
    "SubBanner" : "",
    "SearchInputBgColor" : "",
    "SearchInputTextColor" : "",
    "SearchBtnBgColor" : "",
    "SearchBtnTextColor" : "",
    "WalletStripBgColor" : "",
    "WalletStripTextColor" : "",
    
}


export const WebBanners = {
   
    "ContentType" : "",
    "BackgroundCsv" : "",
    "FoodImagesCsv" : "",
    "MainBannerType" : "", 
    "MainBannersCsv" : "",
    "Logo" : "",
    "SubBanner" : "",
    "SearchInputBgColor" : "",
    "SearchInputTextColor" : "",
    "SearchBtnBgColor" : "",
    "SearchBtnTextColor" : "",
    "WalletStripBgColor" : "",
    "WalletStripTextColor" : "",
    
}


export let GetAll = async () => {
    
    try{
        
        const response = await 
        fetch(UrlConstant.Campaign,
        {
            method: 'GET',
            headers: Config.headers,
        }
        )
        const result = await response.json();

       if (!result.HasError && result !== undefined) {

            if (result.Dictionary.CampaignList !== undefined) {
            return JSON.parse(result.Dictionary.CampaignList);
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

export let Get = async (id) => {
    
    try{
        
        const response = await 
        fetch(UrlConstant.Campaign + id,
        {
            method: 'GET',
            headers: Config.headers,
        }
        )
        const result = await response.json();

       if (!result.HasError && result !== undefined) {

            if (result.Dictionary.Campaign !== undefined) {
            return JSON.parse(result.Dictionary.Campaign);
            }
        
        }

        return [];
        
    }
    catch(e){
        console.log('error: ', e); 
        return []; 
    }
}


// export let IsCompaignAlreadyCreated = async (campaign) => {
    
//     try{
        
//         const response = await 
        
//         fetch(UrlConstant.Campaign + 'IsAlreadyRegistered',
//         {
//             method: 'Post',
//             headers: Config.headers,
//             body:  '"'+campaign+'"',
//         }
//         )


//         const result = await response.json();
        
//         if (!result.HasError && result !== undefined) {
    
//             if (!result.Dictionary.CampaignRegistered === true) {
//                 return '1';
//             }
//         }
    
//         return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : '0';

//     }
//     catch(e){
//         console.log('error: ', e); 
//         return []; 
//     }
// }


export let  ActiveSuspend =  async(id,isActive) => {

    try{

            const response = await 
            
            fetch(UrlConstant.Campaign  + 'ActiveSuspend/' + id + '/' + isActive,
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


export let  Save =  async(name) => {

    try{

            let campaign = Campaign;     campaign.Name = name;
            const response = await 
            
            fetch(UrlConstant.Campaign,
            {
                    method: 'Post',
                    headers: Config.headers,
                    body: JSON.stringify(campaign),
                }
            )
            
            const result = await response.json();
            
            if (!result.HasError && result !== undefined) {
        

                if (result.Dictionary.CampaignID > 0) {
                        return result.Dictionary.CampaignID;
                } else {
                    return '0';
                }
            }
        
            return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : '0';
    
        }
        catch(e){
            console.log('error: ', e);  
            return '0';
        }
}

export let  Update =  async(campaign) => {

    try{

            const response = await 
            
            fetch(UrlConstant.Campaign,
            {
                    method: 'Put',
                    headers: Config.headers,
                     body: JSON.stringify(campaign),
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


export let  SavePhoto =  async(campaign) => {

    try{

            const response = await 
            
            fetch(UrlConstant.Campaign + "Content",
            {
                    method: 'Post',
                    headers: Config.headers,
                    
                     body: JSON.stringify(campaign),
                }
            )
            
            const result = await response.json();
            
            if (!result.HasError && result !== undefined) {
                
                 return result
        }
            return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : '0';
    
        }
        catch(e){
            console.log('error: ', e);  
            return '0';
        }
}
