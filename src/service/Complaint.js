import UrlConstant from '../helpers/URLConstants';
import Config from '../helpers/Config';
import * as Utilities from  '../helpers/Utilities';


export let Get = async (statusCsv, startDate, endDate, pageNumber, pageSize) => {
    
    try{
        
        const response = await 
        fetch(`${UrlConstant.Complaint}GetAllByEnterpriseId/${Utilities.GetEnterpriseIDFromSessionObject()}/${statusCsv}/${startDate}/${endDate}/${pageNumber}/${pageSize}`,
        {
            method: 'GET',
            headers: Config.headers,
        }
        )
        const result = await response.json();
        // console.log('result', result)
        return result;
    
    }
    catch(e){
        console.log('error: ', e); 
        return {}; 
    }
}
export let GetComplainDetail = async (id) => {
    
    try{
        
        const response = await 
        fetch(`${UrlConstant.Complaint}Detail/${Utilities.GetEnterpriseIDFromSessionObject()}/${id}`,
        {
            method: 'GET',
            headers: Config.headers,
        }
        )
        const result = await response.json();
            
        if (!result.HasError && result !== undefined) {
            return JSON.parse(result.Dictionary.ComplaintWithDetail);
        }
    
        return {};

    }
    catch(e){
        console.log('error: ', e); 
        return {}; 
    }
}

export let Update = async (id,statusId,assignedTo, comment) => {
    
    try {
        const response = await
        fetch(`${UrlConstant.Complaint}${id}/${Utilities.GetEnterpriseIDFromSessionObject()}/${statusId}/${assignedTo}`,
                {
                    method: 'PUT',
                    headers: Config.headers,
                    body: JSON.stringify(comment),
                }
            )
        
            const result = await response.json();
            if (!result.HasError && result != undefined) {

            if (result.Dictionary.IsUpdated) {
                return '1';
            }
        }
        return result.HasError === true && result.ErrorCodeCsv !== '' ? result.ErrorCodeCsv : '0';
    }
    catch (e) {
        console.log('error: ', e);
        return '0';
    }
}


export let NotificationStatus = async () => {
    
    try {
        const response = await
        fetch(`${UrlConstant.Complaint}NotificationStatus`,
                {
                    method: 'PUT',
                    headers: Config.headers,
                    // body: JSON.stringify(comment),
                }
            )
        
            const result = await response.json();
            if (!result.HasError && result != undefined) {

            if (result.Dictionary.IsUpdated) {
                return '1';
            }
        }
        return result.HasError === true && result.ErrorCodeCsv !== '' ? result.ErrorCodeCsv : '0';
    }
    catch (e) {
        console.log('error: ', e);
        return '0';
    }
}

export let GetHistory = async (startDate, endDate, pageNumber, pageSize) => {
    
    try{
        
        const response = await 
        fetch(`${UrlConstant.Complaint}History/${Utilities.GetEnterpriseIDFromSessionObject()}/${startDate}/${endDate}/${pageNumber}/${pageSize}`,
        {
            method: 'GET',
            headers: Config.headers,
        }
        )
        const result = await response.json();
        return result;
    
    }
    catch(e){
        console.log('error: ', e); 
        return []; 
    }
}
