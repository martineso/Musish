import '@babel/polyfill';
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import App from './components/App';
import 'normalize.css/normalize.css';
import './assets/styles/common.scss';

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
  });
}

ReactDOM.render(<App />, document.getElementById('app-root'));

if (module.hot) {
  module.hot.accept();
}
