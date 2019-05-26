import React, { Component } from 'react';
import MeshForm from './MeshForm';
import SocketService from '../services/socket';


export default class Menu extends Component {
    constructor (props) {
        super(props);

        this.state = {
            socket: SocketService.getConnection()
        };
    }

    handleButtonClick() {
        const value = this.InputField.value;
        this.InputField.value = '';
        this.state.socket.emit('start', value);
    }

    render() {
        return (
            <div className='menu-container'>
                <MeshForm />
            </div>
        );
    }
}
