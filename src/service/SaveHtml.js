import UrlConstant from '../helpers/URLConstants';
import Config from '../helpers/Config';

export let saveHtmlValue = async(enterpriseId, productOptionId, htmlContent) => {
    try{  
        const response = await fetch(UrlConstant.HTMLeditorUrl + enterpriseId+ '/'+ productOptionId,
        {
                method: 'POST',
                headers: Config.headers,
                // body: JSON.stringify(htmlContent),
                body: htmlContent,
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