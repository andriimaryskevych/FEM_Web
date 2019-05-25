import React, { Component } from 'react';
import Canvas from './Canvas';
import Menu from './Menu';

export default class App extends Component {
    render() {
        return (
            <div className=''>
                <Menu />
                <Canvas />
            </div>
        );
    }
}
