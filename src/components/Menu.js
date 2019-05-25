import React, { Component } from 'react';
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
            <div>
                <form>
                    <input type="text" name="Input" ref={element => this.InputField = element}/>
                    <input type="button" value="Submit" onClick={this.handleButtonClick.bind(this)}/>
                </form>
            </div>
        );
    }
}
