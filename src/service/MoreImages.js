import UrlConstant from '../helpers/URLConstants';
import Config from '../helpers/Config';

export let addMoreImages = async(enterpriseId, productOptionId, imageStream) => {
    try{  
        const response = await fetch(UrlConstant.MoreImagesUrl + '/' +enterpriseId+ '/'+ productOptionId,
        {
                method: 'POST',
                headers: Config.headers,
                body: JSON.stringify(imageStream),
                // body:  '["' +token + '","' +newPwd + '","' +membershipId + '"]' ,
            }
        )
        // const result = await response.json();
        //return response;
        const result = await response.json();
        return result
    }
    catch(e){
        console.log('error: ', e);  
        return '0';
    }

}