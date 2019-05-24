import React, { Component, Fragment } from 'react';
import { Route, Switch, Redirect, Link } from "react-router-dom";

import FEM from './FEM';
import Home from './Home';

export default class App extends Component {
    render() {
        return (
            <div className='container-fluid'>
                <div className='navbar navbar-left'>
                    <Link to="/">Home</Link>
                    <Link to="/fem">FEM</Link>
                </div>

                <Switch>
                    <Route exact path="/fem" component={FEM}/>
                    <Route exact path="/" component={Home}/>
                    <Redirect from="*" to="" />
                </Switch>
            </div>
        );
    }
}
