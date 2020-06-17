import React from 'react';
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch } from "react-router-dom";

//import './components/NewTO'
//import './components/Fulfill'
import Home from './pages/Home'
import List from './pages/List'
import Create from './pages/Create'

import '../css/app.css';

// import $ from 'jquery';
let axentix = new Axentix('all');

const App = () => {
    return (
        <HashRouter>
            <Switch>
                <Route path="/creation" component={ Create } />
                <Route path="/liste" component={ List } />
                <Route path="/" component={ Home } />
            </Switch>  
        </ HashRouter>
    )
}

const rootElement = document.querySelector('#root')
if(rootElement) {
    ReactDOM.render(<App />, rootElement)
}




