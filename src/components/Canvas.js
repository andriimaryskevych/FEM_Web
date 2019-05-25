import React, { Component } from 'react';
import SocketService from '../services/socket';
import CanvasDrawer from '../services/canvas-drawer';

export default class Canvas extends Component {
    constructor (props) {
        super(props);

        this.state = {
            socket: SocketService.getConnection()
        };
    }

    componentDidMount() {
        new CanvasDrawer(this.threeRootElement, this.state.socket);
    }

    render () {
        return (
            <div>
                <canvas ref={element => this.threeRootElement = element}></canvas>
            </div>
        );
    }
}
