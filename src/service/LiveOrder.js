import UrlConstant from '../helpers/URLConstants';
import Constants from '../helpers/Constants';
import Config from '../helpers/Config';

// export let EncryptData = () => {
    
//     var decipher = crypto.createDecipher('aes192',binkey, biniv);
// var dec = decipher.update(crypted,'base64','utf8');
// dec += decipher.final('utf8');


//     return uuid;
// }

export let LiveOrders = (membershipId) => {
    // create a new XMLHttpRequest
    var xhr = new XMLHttpRequest()
    xhr.open('Get', 'http://localhost:17046/account/login');
    // xhr.setRequestHeader('AuthenticationTicket', localStorage.getItem(Constants.Session.AUTHENTICATION_TICKET) + "///" + membershipId);
    xhr.setRequestHeader('AuthenticationTicket', localStorage.getItem(Constants.Session.AUTHENTICATION_TICKET) + "^" + membershipId);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    // xhr.withCredentials = true;
    xhr.send()

    xhr.onreadystatechange = function(){
        if (xhr.readyState != 4) return;
        if (xhr.status != 200 && xhr.status != 304){
            alert('HTTP error ' + xhr.status);
            return;
        }

        // window.sessionStorage['response'] = xhr.responseText;
        //window.open('LiveOrders');
        // document.cookie = 'liveorder_token='+xhr.responseText+';max-age=10000;domain=http://localhost:17046';
        // window.open('http://localhost:17046/live-orders');
        // return;//The data is accessible through sessionStorage.
    }


}



// export let LiveOrders = async (membershipId) => {
//     try{
//         const response = await 
//         fetch(UrlConstant.LiveUrl, {
//                   method: 'POST',
//                   headers: {
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/json',
//                     'AuthenticationTicket': localStorage.getItem(Constants.Session.AUTHENTICATION_TICKET) + "///" + membershipId,
//                 },
//                   body:  "{}",
//               });
//       const result = await response.json();
//       return result
//     }
//     catch(e){
//         console.log('error: ', e);  
//     }
    
// }

