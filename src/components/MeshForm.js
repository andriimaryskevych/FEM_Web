import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createMesh } from '../actions/thunk';

class MeshForm extends Component {
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

        const mesh = {
            sizeX: this.sizeX.value,
            sizeY: this.sizeY.value,
            sizeZ: this.sizeZ.value,
            xAxisFEMCount: this.xAxisFEMCount.value,
            yAxisFEMCount: this.yAxisFEMCount.value,
            zAxisFEMCount: this.zAxisFEMCount.value,
        };

        this.setState({ saved: true });

        this.props.createMesh(mesh);
    }

    render () {
        return (
            <div className='form-style-2'>
                <form>
                    <span>Size</span>
                    <label>
                        <input type='text' className='tel-number-field' name='tel_no_1' maxLength='4' defaultValue={this.props.mesh.sizeX} ref={element => this.sizeX = element} onChange={this.inputChangeHandler}/>
                        <span> x </span>
                        <input type='text' className='tel-number-field' name='tel_no_1' maxLength='4' defaultValue={this.props.mesh.sizeY} ref={element => this.sizeY = element} onChange={this.inputChangeHandler}/>
                        <span> x </span>
                        <input type='text' className='tel-number-field' name='tel_no_1' maxLength='4' defaultValue={this.props.mesh.sizeZ} ref={element => this.sizeZ = element} onChange={this.inputChangeHandler}/>
                    </label>

                    <span>Division</span>
                    <label>
                        <input type='text' className='tel-number-field' name='tel_no_1' maxLength='4' defaultValue={this.props.mesh.xAxisFEMCount} ref={element => this.xAxisFEMCount = element} onChange={this.inputChangeHandler}/>
                        <span> x </span>
                        <input type='text' className='tel-number-field' name='tel_no_1' maxLength='4' defaultValue={this.props.mesh.yAxisFEMCount} ref={element => this.yAxisFEMCount = element} onChange={this.inputChangeHandler}/>
                        <span> x </span>
                        <input type='text' className='tel-number-field' name='tel_no_1' maxLength='4' defaultValue={this.props.mesh.zAxisFEMCount} ref={element => this.zAxisFEMCount = element} onChange={this.inputChangeHandler}/>
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
    mesh: state.mesh
});

export default connect(mapStateToProps, { createMesh })(MeshForm);