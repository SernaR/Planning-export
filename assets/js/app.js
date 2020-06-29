import React from 'react';
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch } from "react-router-dom";

//import './components/NewTO'
//import './components/Fulfill'
import Home from './pages/Home'
import Orders from './pages/Orders'
import Create from './pages/Create'
import Announced from './pages/announced'
import Fulfill from './pages/Fulfill'
import Labo from './pages/Labo'
import Labo_PDF from './pages/Labo_PDF'
import PdfViewer from './components/PdfViewer'
import Bill from './pages/Bill'

import '../css/app.css';

// import $ from 'jquery';
//"/ordres/annonce/realise
let axentix = new Axentix('all');////////////////////////////////

const App = () => {
    return (
        <HashRouter>
            <Switch>
                <Route path="/ordres/creation" component={ Create } />
                <Route path="/ordres/liste" component={ Orders } />
                <Route path="/ordres/annonce/liste" component={ Announced } />
                <Route path="/ordres/annonce/ordre/:id" component={ Fulfill } />
                <Route path="/ordres/facturation/ordre/:id" component={ Bill } />
                <Route path="/labo" component={ Labo } />
                <Route path="/pdf" component={ Labo_PDF } />
                <Route path="/pdf-viewer" component={ PdfViewer } />
                <Route path="/" component={ Home } />
            </Switch>  
        </ HashRouter>
    )
}

const rootElement = document.querySelector('#root')
if(rootElement) {
    ReactDOM.render(<App />, rootElement)
}



