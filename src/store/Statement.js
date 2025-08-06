import UrlConstant from '../helpers/URLConstants';
//import Constants from '../helpers/Constants';
import Config from '../helpers/Config';

const requestAccountStatementType = 'REQUEST_ACCOUNT_STATEMENT';
const receiveAccountStatementType = 'RECEIVE_ACCOUNT_STATEMENT';
const initialState = {
  statement: [],
  isLoading: false
};

export const actionCreators = {
  requestAccountStatement: (enterpriseId, fromDate, toDate) => async (dispatch, getState) => {
    /// reset enterpriseOrders state  
    getState().statement.statement = []
    try {
      dispatch({
        type: requestAccountStatementType,
        enterpriseId,
        fromDate,
        toDate
      });

      const response = await
      fetch(UrlConstant.AccountStatement + `${enterpriseId}/${fromDate}/${toDate}`, {
        method: 'GET',
        headers: Config.headers
      });

      const result = await response.json();
      let statement = [];
      if (!result.HasError) {
        if (result.Dictionary.AccountHistory !== undefined) {
          statement = JSON.parse(result.Dictionary.AccountHistory);
        }
      }
      dispatch({
        type: receiveAccountStatementType,
        enterpriseId,
        fromDate,
        toDate,
        statement
      });
    } catch (e) {
      let statement = [];
      dispatch({
        type: receiveAccountStatementType,
        enterpriseId,
        fromDate,
        toDate,
        statement
      });
    }

  }
};

export const reducer = (state, action) => {
  state = state || initialState;

  if (action.type === requestAccountStatementType) {
    return {
      ...state,
      enterpriseId: action.enterpriseId,
      fromDate: action.fromDate,
      toDate: action.toDate,
      isLoading: true
    };
  }

  if (action.type === receiveAccountStatementType) {
    return {
      ...state,
      enterpriseId: action.enterpriseId,
      fromDate: action.fromDate,
      toDate: action.toDate,
      statement: action.statement,
      isLoading: false
    };
  }

  return state;
};
