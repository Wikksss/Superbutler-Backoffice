import UrlConstant from '../helpers/URLConstants';
import Config from '../helpers/Config';


export let GetTypes = async () => {

    try {
        const response = await
            fetch(UrlConstant.BusinessType ,
                {
                    method: 'GET',
                    headers: Config.headers,
                }
            )
        const result = await response.json();
        return result;

    }
    catch (e) {
        console.log('error: ', e);
        return [];
    }
}

