import UrlConstant from '../helpers/URLConstants';
//import Constants from '../helpers/Constants';
import Config from '../helpers/Config';
//import * as Utilities from  '../helpers/Utilities';


const GalleryPhotos_enterpriseId = 1;

export let  GetAllGalleryPhotos =  async() => {

    try{

            const response = await 
            fetch(UrlConstant.PhotoDictionary + GalleryPhotos_enterpriseId, 
            {
                    method: 'GET',
                    headers: Config.headers,
            })
            
            const result = await response.json();
            
            if (!result.HasError && result !== undefined) {
                return JSON.parse(result.Dictionary.AllGalleryPhotos);
            }
        
            return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : '';
    
        }
        catch(e){
            console.log('error: ', e);  
            return '';
        }
}

export let  SaveGalleryPhotos =  async(photoDictionary) => {

    try{

            const response = await 
            fetch(UrlConstant.PhotoDictionary + 'GalleryPhoto', 
            {
                    method: 'Post',
                    headers: Config.headers,
                    body: JSON.stringify(photoDictionary),
            })
            
            const result = await response.json();
            
            if (!result.HasError && result !== undefined) {
               
                if (result.Dictionary.IsPhotoUploaded) {
                    return '1';
                }
            }
        
            return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : '';
    
        }
        catch(e){
            console.log('error: ', e);  
            return '';
        }
}


export let  UpdatePhotoName =  async(photoDictionary) => {

    try{

            const response = await 
            fetch(UrlConstant.PhotoDictionary + 'UpdateGallery', 
            {
                    method: 'Put',
                    headers: Config.headers,
                    body: JSON.stringify(photoDictionary),
            })
            
            const result = await response.json();
            
            if (!result.HasError && result !== undefined) {
               
                if (result.Dictionary.IsUpdated) {
                    return '1';
                }
            }
        
            return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : '';
    
        }
        catch(e){
            console.log('error: ', e);  
            return '';
        }
}


export let  Delete =  async(id) => {

    try{

            const response = await 
            
            fetch(UrlConstant.PhotoDictionary  + id,
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
