import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import App from './components/layout/App';
import fb from './utils/fb';
import tableau from './utils/tableau';
import { setFbStatus } from './actions';
import env from './env';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
// eslint-disable-next-line no-underscore-dangle
const store = createStoreWithMiddleware(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

tableau.setup();
fb.setup(env.FB_APP_ID, () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  );
  fb.subscribeStatusChange((response) => {
    store.dispatch(setFbStatus(response.status));
  });
});
