import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';

const app = React.createElement(App);
// criou o App.tsx

ReactDOM.render(app, document.getElementById('root'));
