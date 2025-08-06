import UrlConstant from '../helpers/URLConstants';
//import Constants from '../helpers/Constants';
import Config from '../helpers/Config';

const requestOrderType = 'REQUEST_ORDERS';
const receiveOrderType = 'RECEIVE_ORDERS';
const initialState = {
  enterpriseOrders: [],
  isLoading: false
};

export const actionCreators = {
  requestEnterpriseOrders: (status) => async (dispatch, getState) => {
    /// reset enterpriseOrders state  
    getState().enterpriseOrders.enterpriseOrders = []
    
    try {
      dispatch({
        type: requestOrderType,
        status
      });

      const response = await
      fetch(UrlConstant.EnterpriseOrders + `${status}`, {
        method: 'GET',
        headers: Config.headers
      });

      const result = await response.json();
      let orders = [];
      if (!result.HasError) {
        if (result.Dictionary.Orders !== undefined) {
          orders = JSON.parse(result.Dictionary.Orders);
        }
      }
      dispatch({
        type: receiveOrderType,
        status,
        orders
      });
    } catch (e) {
      let orders = [];
      dispatch({
        type: receiveOrderType,
        status,
        orders
      });
    }

  }
};

export const reducer = (state, action) => {
  state = state || initialState;

  if (action.type === requestOrderType) {
    return {
      ...state,
      status: action.status,
      isLoading: true
    };
  }

  if (action.type === receiveOrderType) {
    return {
      ...state,
      status: action.status,
      enterpriseOrders: action.orders,
      isLoading: false
    };
  }

  return state;
};
