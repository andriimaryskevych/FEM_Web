import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setMaterial } from '../actions';

class MaterialForm extends Component {
    constructor (props) {
        super(props);

        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);

        this.state = { saved: false };
    }

    inputChangeHandler () {
        if (this.state.saved) {
            this.setState({ saved: false });
        }
    }

    handleButtonClick (event) {
        event.preventDefault();

        const material = {
            puasson: this.puassoInput.value,
            yung: this.yungInput.value,
        };

        this.setState({ saved: true });

        this.props.dispatch(setMaterial(material));
    }

    render () {
        return (
            <div className='form-style-2'>
                <form>
                    <span>Pusson - Yung</span>
                    <label>
                        <input type='text' className='tel-number-field' name='tel_no_1' maxLength='4' defaultValue={this.props.material.puasson} ref={element => this.puassoInput = element} onChange={this.inputChangeHandler}/>
                        <span> - </span>
                        <input type='text' className='tel-number-field' name='tel_no_1' maxLength='4' defaultValue={this.props.material.yung} ref={element => this.yungInput = element} onChange={this.inputChangeHandler}/>
                    </label>

                    <label>
                        <input type='submit' value='Submit' onClick={this.handleButtonClick}/>

                        <div className='message-container'>
                            { !this.state.saved && <p className='not-saved-message'>Not saved</p> }
                        </div>
                    </label>
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    material: state.material
});

export default connect(mapStateToProps)(MaterialForm);