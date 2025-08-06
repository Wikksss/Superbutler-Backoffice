import UrlConstant from '../helpers/URLConstants';
//import Constants from '../helpers/Constants';
import Config from '../helpers/Config';

export let  Get =  async(enterpriseId, pageNumber, pageSize, reviewId) => {

    try{

            const response = await 
            fetch(UrlConstant.EnterpriseRating + enterpriseId + '/' + pageNumber + '/' + pageSize + '/'+ reviewId, 
            {
                    method: 'GET',
                    headers: Config.headers,
            })
            
            const result = await response.json();
            return result;
            // if (!result.HasError && result !== undefined) {
            //     return result;
            // }
        
            // return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : '';
    
        }
        catch(e){
            console.log('error: ', e);  
            return '';
        }
}

export let  GetAllReplies =  async(restaurantRatingId, pageSize) => {

    try{

            const response = await 
            fetch(UrlConstant.EnterpriseRating + restaurantRatingId + '/' + pageSize, 
            {
                    method: 'GET',
                    headers: Config.headers,
            })
            
            const result = await response.json();
            
            if (!result.HasError && result !== undefined) {
                
                if (result.Dictionary.EnterpriseRatingReplies !== undefined) {
                    return JSON.parse(result.Dictionary.EnterpriseRatingReplies);
                    }
                
            }
        
            return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : '';
    
        }
        catch(e){
            console.log('error: ', e);  
            return '';
        }
}



export let  SaveReply =  async(restaurantRatingId, comments,) => {

    try{


            // console.log("Url:", UrlConstant.EnterpriseRating + restaurantRatingId);

            const response = await 
            fetch(UrlConstant.EnterpriseRating + restaurantRatingId,
            {
                    method: 'Post',
                    headers: Config.headers,
                    
                     body: "'" + comments + "'",
                }
            )
            
            const result = await response.json();
            
            if (!result.HasError && result !== undefined) {
        
                if (result.Dictionary.ID !== undefined) {
                    return result.Dictionary.ID ; 
                }
            }
        
            return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : '0';
    
        }
        catch(e){
            console.log('error: ', e);  
            return '0';
        }
}
export let  approveComments =  async(restaurantRatingId, isApproved) => {

    try{

            const response = await 
            fetch(`${UrlConstant.EnterpriseRating}Approval/${restaurantRatingId}/${isApproved}`,
            {
                    method: 'PUT',
                    headers: Config.headers,
                }
            )
            
            const result = await response.json();
            return result;
    
        }
        catch(e){
            console.log('error: ', e);  
            return '0';
        }
}

