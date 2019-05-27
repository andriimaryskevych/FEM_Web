import React, { Component } from 'react';

export default class PressureItem extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        return (
            <div className='pressure-list-item'>
                <div className='heading'>
                    <span>{this.props.fe}</span>
                    <span>:</span>
                    <span>{this.props.part}</span>

                    <i className="fa fa-trash" aria-hidden="true"></i>
                </div>
                <div className='separator'></div>
                <div className='pressure-section'>
                    <span>Pressure: </span>
                    <input type='text' defaultValue={this.props.pressure} />
                </div>
            </div>
        );
    }
}
