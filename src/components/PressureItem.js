import React, { Component } from 'react';

export default class PressureItem extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        return (
            <div className='pressure-list-item'>
                {this.props.id}
                {this.props.fe}
                {this.props.part}
                {this.props.pressure}
            </div>
        );
    }
}
