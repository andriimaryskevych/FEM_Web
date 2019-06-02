import React, { Component } from 'react';

import MeshForm from './MeshForm';
import MaterialForm from './MaterialForm';
import PressureList from './PressureList';

export default class Menu extends Component {
    constructor (props) {
        super(props);

        this.handleToggleClick = this.handleToggleClick.bind(this);

        this.state = {
            menuOpen: true
        };
    }

    handleToggleClick () {
        this.setState(state => ({
            menuOpen: !state.menuOpen
        }));
    }

    render() {
        let classString = 'absolute-positioned';

        if (!this.state.menuOpen) {
            classString += ' closed'
        }

        return (
            <div className={classString}>
                <div className='menu-container'>
                    <div className='show-toggle' onClick={this.handleToggleClick}>
                        <i className='fa fa-bars' aria-hidden='true'></i>
                    </div>

                    <MeshForm />
                    <MaterialForm />
                    <PressureList />
                </div>
            </div>
        );
    }
}
