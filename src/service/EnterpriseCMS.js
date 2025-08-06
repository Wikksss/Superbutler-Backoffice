import UrlConstant from '../helpers/URLConstants';
//import Constants from '../helpers/Constants';
import Config from '../helpers/Config';
import * as Utilities from '../helpers/Utilities';


export let getCustomPages = async (enterpriseId) => {
    try {
        const response = await fetch(UrlConstant.EnterpriseCMS + 'CustomPages/' + enterpriseId,
            {
                method: 'GET',
                headers: Config.headers,
            })
        const result = await response.json();
        if (!result.HasError && result !== undefined) {
            return JSON.parse(result.Dictionary.Pages);
        }
        return result.HasError === true && result.ErrorCodeCsv !== '' ? result.ErrorCodeCsv : '';
    }
    catch (e) {
        console.log('error: ', e);
        return '';
    }
}

export let getCustomPageById = async (enterpriseId, id) => {
    try {
        const response = await fetch(UrlConstant.EnterpriseCMS + 'CustomPages/' + enterpriseId + '/' + id,
            {
                method: 'GET',
                headers: Config.headers,
            })
        const result = await response.json();
        if (!result.HasError && result !== undefined) {
            return JSON.parse(result.Dictionary.Enterprises);
        }
        return result.HasError === true && result.ErrorCodeCsv !== '' ? result.ErrorCodeCsv : '';
    }
    catch (e) {
        console.log('error: ', e);
        return '';
    }
}
