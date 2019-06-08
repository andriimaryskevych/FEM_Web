import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './components/App';
import store from './store';

import './style/reset.css';
import './style/style.css';
import './style/mesh-form.css';
import './style/pressure-list.css';
import './style/pressure-item.css';
import './style/scrollbar.css';
import './style/material.css';
import 'font-awesome/css/font-awesome.min.css';

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
