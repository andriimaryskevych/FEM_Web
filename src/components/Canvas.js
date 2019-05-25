import React, { Component } from 'react';
import SocketService from '../services/socket';

import threeEntryPoint from '../helpers/threeEntryPoint.js';

export default class Canvas extends Component {
    constructor (props) {
        super(props);

        const socket = SocketService.getConnection();

        this.state = {
            socket: socket
        };
    }

    componentDidMount() {
        threeEntryPoint(this.threeRootElement, this.state.socket);
    }

    componentWillUnmount() {
        this.state.socket.disconnect();
    }

    handleButtonClick() {
        const value = this.InputField.value;
        this.InputField.value = '';
        this.state.socket.emit('start', value);
    }

    render () {
        return (
            <div>
                <form>
                    <input type="text" name="Input" ref={element => this.InputField = element}/>
                    <input type="button" value="Submit" onClick={this.handleButtonClick.bind(this)}/>
                </form>
                <div>
                    <canvas ref={element => this.threeRootElement = element}></canvas>
                </div>
            </div>
        );
    }
}
