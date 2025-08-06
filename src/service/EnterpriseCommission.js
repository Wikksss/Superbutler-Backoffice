import UrlConstant from '../helpers/URLConstants';
//import Constants from '../helpers/Constants';
import Config from '../helpers/Config';
import * as Utilities from  '../helpers/Utilities';


export const EnterpriseCommission = {

    "EnterpriseId": "",
    "StandardCharges": "",
    "CashBackMinOrder": "",
    "CommissionPercentage": "",
    "StandardChargesExternal": "",
    "CashBackMinOrderEnterprise": "",
    "AppCommissionPercentage": "",

    "CommissionHistory": {
        "CardFeesPortalInternal": "",
        "CashbackPortalInternal": "",
        "CashbackEnterpriseInternal": "",
        "CardFeesPortalExternal": "",
        "CashbackPortalExternal": "",
        "CashbackEnterpriseExternal": "",
    },

    "AgentRestaurant" : {
        "CommissionPercentage": "",
        "CommissionAmountTableBookingSourcePortal": "",
        "CommissionPercentageSourceEnterprise": "",
        "CommissionAmountTableBookingSourceEnterprise": "",
    }
} 


export let  Update =  async(enterpriseCommission) => {

    try{

            enterpriseCommission.EnterpriseId = Utilities.GetEnterpriseIDFromSessionObject();
            const response = await 
            
            fetch(UrlConstant.Commission,
            {
                    method: 'Put',
                    headers: Config.headers,
                    
                     body: JSON.stringify(enterpriseCommission),
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
