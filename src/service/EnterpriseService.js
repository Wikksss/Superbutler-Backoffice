import UrlConstant from '../helpers/URLConstants';
import Config from '../helpers/Config';
import * as Utilities from '../helpers/Utilities';
// import * as APIUtilities from '../helpers/APIUtilities';

export let Get = async (Id) => {

    try {

        const response = await
            fetch(UrlConstant.EnterpriseService + Utilities.GetEnterpriseIDFromSessionObject() + '/' + Id ,
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
        return '0';
    }
}

// export let Put = async (body) => {
//     try{
//         const url = UrlConstant.EnterpriseService + `UpdateConfiguration/` +  Utilities.GetEnterpriseIDFromSession()
//         const response = await APIUtilities.Put(url, body)
//         const result = await response.json();
//         return result;
//     }
//     catch(e){
//         console.log('error: ', e);  
//         return '0';
//     }

// }


// export let Delete = async (Id, serviceId) => {

//     try {
//         const response = await APIUtilities.Delete(UrlConstant.EnterpriseService + Utilities.GetEnterpriseIDFromSessionObject() + '/' + Id + '/' + serviceId)
//         const result = await response.json()
//         return result;
//     }
//     catch (e) {
//         console.log('error: ', e);
//         return '0';
//     }
// }