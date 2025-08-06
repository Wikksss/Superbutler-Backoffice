import UrlConstant from '../helpers/URLConstants';
import Config from '../helpers/Config';
import * as Utilities from '../helpers/Utilities';
import Constants from '../helpers/Constants';
import moment from 'moment';



const   MewsBody =  {
    "ClientToken": "E0D439EE522F44368DC78E1BFB03710C-D24FB11DBE31D4621C4817E028D9E1D",
    "AccessToken": "C66EF7B239D24632943D115EDE9CB810-EA00F8FD8294692C940F6B5A8F9453D",
    "Client": "SuperButlerV1.0",
    "AccountId ": "316801ef-4895-4d2f-8ff0-b1b200c35c8a",
    "EnterpriseId": "851df8c8-90f2-4c4a-8e01-a4fc46b25178",
    
    "ServiceIds": ["7cf76fec-86f7-4152-adb3-b1b800942b48"],
    "Emails": [
        "sbguest@domain.com"
    ],
    "FirstNames": [
        "SB"
    ],
    "ResourceId": null,
    "Extent": {
        "Customers": true,
        "Documents": false,
        "Addresses": false
    },
  "Limitation": {
    "Count": 100
  }
}


export let MewsGet = async (url) => {

    try {

        const response = await fetch(url, { method: 'GET', headers: Config.headers } )
        const result = await response.json();
        console.log("integration", response);
        console.log("integration", result);
        return result;

        //});
    }
    catch (e) {
        console.log('error: ', e);
        return [];
    }
}

export let MewsPost = async (url, params) => {

    try {

        const response = await fetch(url, { method: 'POST', headers: Config.headers, body: JSON.stringify(params), } )
        const result = await response.json();
        return result;

    }
    catch (e) {
        console.log('error: ', e);
        return [];
    }
}
