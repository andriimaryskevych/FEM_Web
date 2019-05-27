import React, { Component } from 'react';
import SocketService from '../services/socket';

import MeshForm from './MeshForm';
import MaterialForm from './MaterialForm';
import PressureList from './PressureList';

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
                <MaterialForm />
                <PressureList />
            </div>
        );
    }
}
