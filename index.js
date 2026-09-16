/* eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ClearBrowserCacheBoundary } from 'react-clear-browser-cache';

ReactDOM.render(
    <ClearBrowserCacheBoundary>
        <App />
    </ClearBrowserCacheBoundary>
    , document.getElementById('root'));
