import React, { Component } from 'react';
import CanvasDrawer from '../services/canvas-drawer';

export default class Canvas extends Component {
    componentDidMount() {
        new CanvasDrawer(this.threeRootElement);
    }

    render () {
        return (
            <div className='canvas-container'>
                <canvas ref={element => this.threeRootElement = element}></canvas>
            </div>
        );
    }
}
