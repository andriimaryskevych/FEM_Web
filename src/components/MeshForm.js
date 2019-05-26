import React, { Component } from 'react';

export default class MeshForm extends Component {
    constructor (props) {
        super(props);

        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);

        this.state = { saved: false };
    }

    inputChangeHandler () {
        this.setState({ saved: false });
    }

    handleButtonClick (event) {
        event.preventDefault();

        const meshSize = {
            x: this.sizeX.value,
            y: this.sizeY.value,
            z: this.sizeZ.value
        };

        this.setState({ saved: true });
    }

    render () {
        return (
            <div className="form-style-2">
                <div className='message-container'>
                    { !this.state.saved && <p className="not-saved-message">Not saved</p> }
                </div>

                <form>
                    <label>
                        <input type="text" className="tel-number-field" name="tel_no_1" maxLength="4" ref={element => this.sizeX = element} onChange={this.inputChangeHandler}/>
                        <span> x </span>
                        <input type="text" className="tel-number-field" name="tel_no_1" maxLength="4" ref={element => this.sizeY = element} onChange={this.inputChangeHandler}/>
                        <span> x </span>
                        <input type="text" className="tel-number-field" name="tel_no_1" maxLength="4" ref={element => this.sizeZ = element} onChange={this.inputChangeHandler}/>

                        <input type="submit" value="Submit" onClick={this.handleButtonClick}/>
                    </label>
                </form>
            </div>
        );
    }
}
