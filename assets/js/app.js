import React from 'react';
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, withRouter } from "react-router-dom";

import Orders from './pages/Orders'
import Create from './pages/Create'
import Fulfill from './pages/Fulfill'
import Bill from './pages/Bill'
import Planning from './pages/Planning'

import '../css/app.css';
import Navbar from './components/ui/Navbar';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import moment from "moment";
moment.locale("fr")

import { ThemeProvider } from '@material-ui/core';
import { theme } from './styles/theme'

// import $ from 'jquery';
let axentix = new Axentix('all');

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
                        <Route path="/liste/:selection" component={ Orders } />
                        <Route path="/planning/:date" component={ Planning } />
                        <Route path="/" component={ Planning } />
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



