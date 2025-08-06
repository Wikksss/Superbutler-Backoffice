import UrlConstant from '../helpers/URLConstants';
//import Constants from '../helpers/Constants';
import Config from '../helpers/Config';
//import { async } from 'q';

const requestInvoice = 'REQUEST_INVOICE';
const receiveInvoice = 'RECEIVE_INVOICE';
const initialState = {
    enterpriseInvoices: [],
  isLoading: false
};


export const actionCreators = {

  requestEnterpriseInvoice:() => async (dispatch,getState) => {
    getState().enterpriseInvoices.enterpriseInvoices = []

    try{

      dispatch({
        type : requestInvoice
      });
    
      const response = await
    
      fetch(UrlConstant.EnterpriseInvoices , {
        method: 'GET',
        headers: Config.headers
    
      });
    
      const result = await response.json();
      let invoices = [];

      if (!result.HasError) {

        if (result.Dictionary.Invoices !== undefined) {
          invoices = JSON.parse(result.Dictionary.Invoices);
        }
    
      }
    
      dispatch({
        type: receiveInvoice,
        invoices
      });

    } catch (ex) {
      let invoices = [];
      dispatch({
        type: receiveInvoice,
        invoices

      });

    }

  }

};

export const reducer = (state, action) => {
  state = state || initialState;

  if (action.type === requestInvoice) {
    return {
      ...state,
      isLoading: true
    };
  }

  if (action.type === receiveInvoice) {
    return {
      ...state,
      enterpriseInvoices: action.invoices,
      isLoading: false
    };
  }

  return state;
};