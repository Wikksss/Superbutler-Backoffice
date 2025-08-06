import UrlConstant from '../helpers/URLConstants';
import Config from '../helpers/Config';
import Constants from '../helpers/Constants';

export let registerDevice = async (params) => {
    try{
     const response = await 
        fetch(UrlConstant.Device, {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'App': "SuperCenter",
                    'Authorization': "Bearer " + localStorage.getItem(Constants.Session.JWT_TOKEN),
                    'AuthenticationTicket': localStorage.getItem(Constants.Session.AUTHENTICATION_TICKET),
                    'ImpersonatorID': localStorage.getItem(Constants.Session.IMPERSONATORID)
                },
                  body:  JSON.stringify(params),
              });
              
      const result = await response;
      return result
    }
    catch(e){
        console.log('error: ', e);  
    }
    
}


// export let GetTotalDevicesCount = async (areaIdCsv,emailCsv) => {
    
//   try{
      
//       const response = await 
//       fetch(UrlConstant.Device + `/TotalCountBy/${areaIdCsv}/${emailCsv}`,
//       {
//           method: 'GET',
//           headers: Config.headers,
//       }
//       )
//       const result = await response.json();

//      if (!result.HasError && result !== undefined) {

//           if (result.Dictionary.DeviceCsv !== undefined) {
//           console.log("devices",result.Dictionary.DeviceCsv);
//             // return result.Dictionary.DeviceCsv;
//           }
      
//       }

//       return '';

//       //});
//   }
//   catch(e){
//       console.log('error: ', e); 
//       return []; 
//   }
// }


export let GetTotalDevicesCount = async (areaIdCsv,emailCsv) => {
    
  try{
    
    const response = await 
      fetch(UrlConstant.Device + '/TotalCountBy',
      {
          method: 'Post',
          headers: Config.headers,
          body:  '["' + areaIdCsv + '","' + emailCsv + '"]' ,
      }
      )
      const result = await response.json();

     if (!result.HasError && result !== undefined) {

          if (result.Dictionary.DeviceCsv !== undefined) {
          // console.log("devices",result.Dictionary.DeviceCsv);
             return result.Dictionary.DeviceCsv;
          }
      
      }

      return '';

      // });
  }
  catch(e){
      console.log('error: ', e); 
      return []; 
  }
}

export let GetDevicesStatus = async (enterpriseId) => {
    
  try{
    
    const response = await 
      fetch(`https://devicestatus.supermeal.co.uk/devicestatus.php?restaurant-id=${enterpriseId}`,
      {
          method: 'Get',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
      }
      )
      
      const result = await response.json();
      // console.log("result:", result)
    
      return result;

      // });
  }
  catch(e){
      console.log('error: ', e); 
      return []; 
  }
}