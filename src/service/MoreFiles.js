import UrlConstant from '../helpers/URLConstants';
import Config from '../helpers/Config';

export let addMoreFiles = async(enterpriseId, productOptionId, fileStream) => {
    try{  
        const response = await fetch(UrlConstant.MoreImagesUrl + '/' +enterpriseId+ '/'+ productOptionId,
        {
                method: 'POST',
                headers: Config.headers,
                body: JSON.stringify(fileStream),
               
            }
        )
        const result = await response.json();
        return result
    }
    catch(e){
        console.log('error: ', e);  
        return '0';
    }

}