import React from 'react';
import { Provider } from 'react-redux';
import store from './src/store';
import AuthScreen from './src/screens/AuthScreen';

const App = () => {
  return (
    <Provider store={store}>
      <AuthScreen />
    </Provider>
  );
};

export default App;
