import React, { Component } from 'react';
import { connect } from 'react-redux';

import { setMaterial } from '../actions';
import {
    MATERIAL_INPUT_TYPE,
    MATERIALS,
    CUSTOM_MATERIAL,
} from '../constants';

const optionsMap = {
    [MATERIAL_INPUT_TYPE.MANUAL]: 'Manual',
    [MATERIAL_INPUT_TYPE.SELECTION]: 'Select from list',
};

class MaterialForm extends Component {
    constructor (props) {
        super(props);

        this.inputTypeChange = this.inputTypeChange.bind(this);
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.puassonValueChange = this.puassonValueChange.bind(this);
        this.yungValueChange = this.yungValueChange.bind(this);
        this.materialTypeChange = this.materialTypeChange.bind(this);

        this.state = {
            saved: false
        };

        console.log(this.props);

        if (this.props.material.material === CUSTOM_MATERIAL) {
            this.state.inputType = MATERIAL_INPUT_TYPE.MANUAL;

            this.state.puasson = this.props.material.value.puasson;
            this.state.yung = this.props.material.value.yung;
        } else {
            this.state.inputType = MATERIAL_INPUT_TYPE.SELECTION;

            this.state.material = this.props.material.material;
        }
    }

    inputTypeChange () {
        this.setState({
            inputType: this.inputType.value
        });
    }

    inputChangeHandler () {
        if (this.state.saved) {
            this.setState({ saved: false });
        }
    }

    puassonValueChange () {
        this.inputChangeHandler();

        this.setState({
            puasson: this.puassoInput.value
        });
    }

    yungValueChange () {
        this.inputChangeHandler();

        this.setState({
            yung: this.yungInput.value
        });
    }

    materialTypeChange() {
        this.inputChangeHandler();

        this.setState({
            material: this.materialInput.value
        });
    }

    handleButtonClick (event) {
        event.preventDefault();

        let material;

        switch (this.state.inputType) {
            case MATERIAL_INPUT_TYPE.MANUAL: {
                material = {
                    material: CUSTOM_MATERIAL,
                    value: {
                        puasson: this.puassoInput.value,
                        yung: this.yungInput.value
                    }
                };

                break;
            }
            case MATERIAL_INPUT_TYPE.SELECTION: {
                const selectedMaterialName = this.materialInput.value;
                const materialData = MATERIALS[selectedMaterialName];

                material = {
                    material: selectedMaterialName,
                    value: materialData
                };

                break;
            }

            default: return;
        }

        this.setState({
            saved: true,
            material: material.material,
            yung: material.value.yung,
            puasson: material.value.puasson,
        });

        this.props.dispatch(setMaterial(material));
    }

    render () {
        const selecedInputType = this.state.inputType;
        const inputTypeOptions = Object.entries(optionsMap).map(([value, viewValue]) => (
            <option key={value} value={value}>{viewValue}</option>
        ));

        const materialOptions = Object.keys(MATERIALS).map(name => (
            <option key={name} value={name}>{name}</option>
        ));

        return (
            <div className='form-style-2 material-form'>
                <form>
                    <select className='input-type-selection' value={selecedInputType} onChange={this.inputTypeChange} ref={element => this.inputType = element}>
                        {inputTypeOptions}
                    </select>

                    {
                        selecedInputType === MATERIAL_INPUT_TYPE.MANUAL &&

                        <div>
                            <span>Pusson - Yung</span>
                            <label>
                                <input type='text' className='tel-number-field' name='tel_no_1' maxLength='4' defaultValue={this.state.puasson} ref={element => this.puassoInput = element} onChange={this.puassonValueChange}/>
                                <span> - </span>
                                <input type='text' className='tel-number-field' name='tel_no_1' maxLength='4' defaultValue={this.state.yung} ref={element => this.yungInput = element} onChange={this.yungValueChange}/>
                            </label>
                        </div>
                    }

                    {
                        selecedInputType === MATERIAL_INPUT_TYPE.SELECTION &&
                        <div>
                            <span>Select material:</span>
                            <br />
                            <select onChange={this.materialTypeChange} ref={element => this.materialInput = element} defaultValue={this.state.material}>
                                {materialOptions}
                            </select>
                        </div>
                    }

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