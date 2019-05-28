import React, { PureComponent } from 'react';

export default class PressureItem extends PureComponent {
    constructor (props) {
        super(props);

        this.handleDeleteButtonCLick = this.handleDeleteButtonCLick.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.mouseEnter = this.mouseEnter.bind(this);
        this.mouseLeave = this.mouseLeave.bind(this);

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

    mouseEnter () {
        this.props.hover(this.props.id);
    }

    mouseLeave () {
        this.props.hover(null);
    }

    render() {
        let classString = 'pressure-list-item';

        if (this.props.hovered) {
            classString += ' active';
        }

        return (
            <div
                className={classString}
                onMouseEnter={this.mouseEnter}
                onMouseLeave={this.mouseLeave}
            >
                <div className='heading'>
                    <span>{this.props.fe}</span>
                    <span>:</span>
                    <span>{this.props.part}</span>

                    <i className='fa fa-trash' aria-hidden='true' onClick={this.handleDeleteButtonCLick}></i>
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
