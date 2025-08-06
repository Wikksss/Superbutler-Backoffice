import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { routerReducer} from 'react-router-redux';
import * as Order from './Order';
import * as Statement from './Statement';
import * as Invoice from './Invoice';


export default function configureStore (initialState) {
  const reducers = {
    enterpriseOrders: Order.reducer,
    statement: Statement.reducer,
    enterpriseInvoices: Invoice.reducer
  };

  const middleware = [
    thunk,
    //routerMiddleware(history)
  ];

  // In development, use the browser's Redux dev tools extension if installed
  const enhancers = [];
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (isDevelopment && typeof window !== 'undefined' && window.devToolsExtension) {
    enhancers.push(window.devToolsExtension());
  }

  const rootReducer = combineReducers({
    ...reducers,
    routing: routerReducer
  });

  return createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(...middleware), ...enhancers)
  );
}
