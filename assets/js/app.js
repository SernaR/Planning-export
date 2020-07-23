import React from 'react';
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, withRouter } from "react-router-dom";

//import './components/NewTO'
//import './components/Fulfill'
//import Home from './pages/Home'
import Orders from './pages/Orders'
import Create from './pages/Create'
//import Announced from './pages/announced'
import Fulfill from './pages/Fulfill'
import Labo from './pages/Labo'
import Labo_PDF from './pages/Labo_PDF'
import PdfViewer from './components/PdfViewer'
import Bill from './pages/Bill'
import Planning from './pages/Planning'
import Login from './pages/Login'

import '../css/app.css';
import Navbar from './components/ui/Navbar';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import moment from "moment";
import { ThemeProvider } from '@material-ui/core';
import { theme } from './services/theme'
moment.locale("fr")

// import $ from 'jquery';
//"/ordres/annonce/realise
let axentix = new Axentix('all');////////////////////////////////

const App = () => {

    const NavbarWithRouter = withRouter(Navbar);

    return (
        <ThemeProvider theme={theme}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
                <HashRouter>
                    <NavbarWithRouter />
                    <Switch>
                        <Route path="/creation/:id" component={ Create } />
                        <Route path="/annonce/ordre/:id" component={ Fulfill } />
                        <Route path="/facturation/ordre/:id" component={ Bill } />
                        <Route path="/liste" component={ Orders } />
                        <Route path="/planning" component={ Planning } />
                        <Route path="/labo" component={ Labo } />
                        <Route path="/pdf" component={ Labo_PDF } />
                        <Route path="/pdf-viewer" component={ PdfViewer } />
                        <Route path="/" component={ Login } />
                    </Switch>  
                </ HashRouter>
            </MuiPickersUtilsProvider>
        </ThemeProvider>
    )
}

const rootElement = document.querySelector('#root')
if(rootElement) {
    ReactDOM.render(<App />, rootElement)
}



