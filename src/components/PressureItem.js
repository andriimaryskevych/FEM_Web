import React, { Component } from 'react';

export default class PressureItem extends Component {
    constructor (props) {
        super(props);

        this.handleDeleteButtonCLick = this.handleDeleteButtonCLick.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.saveChanges = this.saveChanges.bind(this);

        this.state = {
            touched: false
        }
    }

    handleDeleteButtonCLick () {
        this.props.delete(this.props.id);
    }

    handleInputChange () {
        if (!this.state.touched) {
            this.setState({
                touched: true
            });
        }
    }

    saveChanges () {
        if (this.state.touched) {
            this.setState({
                touched: false
            });

            this.props.update(this.props.id, this.pressureInput.value);
        }
    }

    render() {
        return (
            <div className='pressure-list-item'>
                <div className='heading'>
                    <span>{this.props.fe}</span>
                    <span>:</span>
                    <span>{this.props.part}</span>

                    <i className="fa fa-trash" aria-hidden="true" onClick={this.handleDeleteButtonCLick}></i>
                </div>
                <div className='separator'></div>
                <div className='pressure-section'>
                    <span>Pressure: </span>
                    <input
                        type='text'
                        defaultValue={this.props.pressure}
                        onChange={this.handleInputChange}
                        onBlur={this.saveChanges}
                        ref={element => this.pressureInput = element}
                    />
                </div>
            </div>
        );
    }
}