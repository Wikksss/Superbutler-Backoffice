import UrlConstant from '../helpers/URLConstants';
import Constants from '../helpers/Constants';
import Config from '../helpers/Config';
import * as Utilities from  '../helpers/Utilities';



export let Get = async () => {
    try{
        
        var userObject = localStorage.getItem(Constants.Session.USER_OBJECT)
        var userId = 0;
        var roleLevel = 0;
        if (!Utilities.stringIsEmpty(userObject)) {

            let userObj = JSON.parse(userObject)
            userId = userObj.Id;
            roleLevel = userObj.RoleLevel
        }      


        const response = await
        fetch(UrlConstant.OrderSupport + `Conversation/${Utilities.GetEnterpriseIDFromSession()}/${userId}/${roleLevel}`, {
          method: 'GET',
          headers: Config.headers,
        });
  
        const result = await response.json();

       if (!result.HasError && result !== undefined) {

            if (result.Dictionary.Conversations !== undefined) {
            return JSON.parse(result.Dictionary.Conversations);
            }
        
        }

        return [];
    }
    catch(e){
        console.log('error: ', e); 
        return []; 
    }
}

export let GetSingleConversation = async (supportId) => {
    try{
        

        var userObject = localStorage.getItem(Constants.Session.USER_OBJECT)
        var userId = 0;
        var roleLevel = 0;
        if (!Utilities.stringIsEmpty(userObject)) {

            let userObj = JSON.parse(userObject)
            userId = userObj.Id;
            roleLevel = userObj.RoleLevel
        }      




        const response = await
        fetch(UrlConstant.OrderSupport + `Conversation/${Utilities.GetEnterpriseIDFromSession()}/${userId}/${roleLevel}?orderSupportId=${supportId}`, {
          method: 'GET',
          headers: Config.headers,
        });
  
        const result = await response.json();

       if (!result.HasError && result !== undefined) {

            if (result.Dictionary.Conversations !== undefined) {
            return JSON.parse(result.Dictionary.Conversations);
            }
        
        }

        return [];
    }
    catch(e){
        console.log('error: ', e); 
        return []; 
    }
}


export let GetDetail = async (supportId) => {
   
    try{
        
        const response = await
        fetch(UrlConstant.OrderSupport + `Conversation/Detail/${supportId}`, {
          method: 'GET',
          headers: Config.headers,
        });
  
        const result = await response.json();

       if (!result.HasError && result !== undefined) {

            if (result.Dictionary.ConversationDetail !== undefined) {
            return JSON.parse(result.Dictionary.ConversationDetail);
            }
        
        }

        return [];
    }
    catch(e){
        console.log('error: ', e); 
        return []; 
    }
}
export let GetSingleMessageDetail = async (conversationId) => {
    try{
        const response = await
        fetch(UrlConstant.Concierge + `Conversation/Message/${conversationId}`, {
          method: 'GET',
          headers: Config.headers,
        });
  
        const result = await response.json();

       if (!result.HasError && result !== undefined) {

            if (result.Dictionary.Conversation !== undefined) {
            return JSON.parse(result.Dictionary.Conversation);
            }
        
        }

        return [];
    }
    catch(e){
        console.log('error: ', e); 
        return []; 
    }
}

export let Save = async(message) => {

    try{


        const response = await 
    
        fetch(UrlConstant.OrderSupport + `Conversation`,
        {
                method: 'POST',
                headers: Config.headers,
                body: JSON.stringify(message),
            }
        )
        
        const result = await response.json();
        return result;
        // if (!result.HasError && result !== undefined) {

        //         if (result.Dictionary.IsSaved === true) {
        //             return '1';
        //         }
        // }
        // return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : 'Saving Failed';

    }
    catch(e){
        console.log('error: ', e);  
        return '0';
    }

}


export let IsReadMessages = async(conversationId) => {

    try{


        const response = await 
    
        fetch(UrlConstant.OrderSupport + `Conversation/Read/${conversationId}/${true}`,
        {
                method: 'PUT',
                headers: Config.headers,
                // body: JSON.stringify(message),
            }
        )
        
        const result = await response.json();
        return result;
        // if (!result.HasError && result !== undefined) {

        //         if (result.Dictionary.IsSaved === true) {
        //             return '1';
        //         }
        // }
        // return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : 'Saving Failed';

    }
    catch(e){
        console.log('error: ', e);  
        return '0';
    }

}


export let UpdateStatus = async(selectedConversation) => {

    try{


        const response = await 
    
        fetch(UrlConstant.OrderSupport + `/StatusUpdate`,
        {
                method: 'PUT',
                headers: Config.headers,
                body: JSON.stringify(selectedConversation),
            }
        )
        
        const result = await response.json();
        return result;
        // if (!result.HasError && result !== undefined) {

        //         if (result.Dictionary.IsSaved === true) {
        //             return '1';
        //         }
        // }
        // return result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : 'Saving Failed';

    }
    catch(e){
        console.log('error: ', e);  
        return '0';
    }

}
export let AssignUser = async(selectedConversation) => {

    try{


        const response = await 
    
        fetch(UrlConstant.OrderSupport + `Conversation/Assign`,
        {
                method: 'PUT',
                headers: Config.headers,
                body: JSON.stringify(selectedConversation),
            }
        )
        
        const result = await response.json();
        return result;

    }
    catch(e){
        console.log('error: ', e);  
        return '0';
    }

}

export let GetConceirgeOrderDetail = async (conversationId) => {
    try{
        const response = await
        fetch(UrlConstant.Concierge + `orderDetail/${conversationId}`, {
          method: 'GET',
          headers: Config.headers,
        });
  
        const result = await response.json();

       if (!result.HasError && result !== undefined) {

            if (result.Dictionary.ConciergeOrderDetail !== undefined) {
            return JSON.parse(result.Dictionary.ConciergeOrderDetail);
            }
        
        }

        return [];
    }
    catch(e){
        console.log('error: ', e); 
        return []; 
    }
}


export let ConciergeStatusUpdate = async(id, status) => {

    try{

        const response = await 
    
        fetch(UrlConstant.Concierge + `item/StatusUpdate/${id}/${status}`,
        {
                method: 'POST',
                headers: Config.headers,
                body: "",
            }
        )
        
        const result = await response.json();
        return result;

    }
    catch(e){
        console.log('error: ', e);  
        return '0';
    }

}

export let ItineraryPaidByUpdate = async(id, status) => {

    try{

        const response = await 
    
        fetch(UrlConstant.Itinerary + `item/paidby/${id}/${status}`,
        {
                method: 'POST',
                headers: Config.headers,
                body: "",
            }
        )
        
        const result = await response.json();
        return result;

    }
    catch(e){
        console.log('error: ', e);  
        return '0';
    }

}


export let AddItemsToItinerary = async (supportId, itemIdCsv) => {
   
    try{
        
        const response = await
        fetch(UrlConstant.Itinerary + `additem/${supportId}`, {
            method: 'POST',
            headers: Config.headers,
            body: JSON.stringify(itemIdCsv),
        });
  
        const result = await response.json();
        return result;

    }
    catch(e){
        console.log('error: ', e); 
        return []; 
    }
}

export let UpdateitineraryItemPrice = async (id, price) => {
   
    try{
        
        const response = await
        fetch(UrlConstant.Itinerary + `UpdatePrice/${id}`, {
            method: 'PUT',
            headers: Config.headers,
            body: JSON.stringify(price),
        });
  
        const result = await response.json();
        return result;

    }
    catch(e){
        console.log('error: ', e); 
        return []; 
    }
}


export let UpdateitineraryItemDate = async (id, date) => {
   
    try{
        
        const response = await
        fetch(UrlConstant.Itinerary + `UpdateDatetime/${id}`, {
            method: 'PUT',
            headers: Config.headers,
            body: JSON.stringify(date),
        });
  
        const result = await response.json();
        return result;

    }
    catch(e){
        console.log('error: ', e); 
        return []; 
    }
}




export let AdditineraryPhoto = async (media, id) => {
   
    try{
        
        const response = await
        fetch(UrlConstant.Concierge + `item/AddPhoto/${id}`, {
            method: 'POST',
            headers: Config.headers,
            body: JSON.stringify(media),
        });
  
        const result = await response.json();
        return result;

    }
    catch(e){
        console.log('error: ', e); 
        return []; 
    }
}

export let DeletePhoto = async (id, photoUrl) => {
   
    try{
        
        const response = await
        fetch(UrlConstant.Itinerary + `deletePhoto/${id}`, {
            method: 'POST',
            headers: Config.headers,
            body: JSON.stringify(photoUrl),
        });
  
        const result = await response.json();
        return result;

    }
    catch(e){
        console.log('error: ', e); 
        return []; 
    }
}


