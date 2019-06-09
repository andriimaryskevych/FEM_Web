import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import { solve } from '../actions/thunk';
import {
    updatePressure,
    deletePressure,
    hoverFE
} from '../actions';
import PressureItem from './PressureItem';

class PressureList extends Component {
    constructor (props) {
        super(props);

        this.handleSubmitButtonClick = this.handleSubmitButtonClick.bind(this);
        this.updatePressureItem = this.updatePressureItem.bind(this);
        this.deletePressureItem = this.deletePressureItem.bind(this);
        this.hoverOverFe = this.hoverOverFe.bind(this);

        this.state = {
            scrollID: null
        };

        this.scrollToItem = React.createRef();
        this.listRef = React.createRef();
    }

    handleSubmitButtonClick (event) {
        event.preventDefault();

        this.props.solve();
    }

    updatePressureItem (id, value) {
        this.props.updatePressure({ id, value });
    }

    deletePressureItem (id) {
        this.props.deletePressure({ id });
    }

    hoverOverFe (payload) {
        this.props.hoverFE(payload);
    }

    componentDidUpdate () {
        if (this.props.scroll) {
            const id = this.props.scroll;

            // Scroll changes not that much often
            // Other props do update much more oftener
            // To avoid an error when on each update list scrolls to previosly clicked object,
            // (because scroll is not changed and point to previously slected for scroll value)
            // After each scroll it's value is saved in state, to compare later
            if (id !== this.state.scrollID) {
                this.setState({
                    scrollID: id
                });

                const listDOMNode = ReactDOM.findDOMNode(this.listRef.current);

                const scrollToItemOffset = ReactDOM.findDOMNode(this.scrollToItem.current).offsetTop;
                const scrollFromItemOffset = listDOMNode.offsetTop;

                const offset = scrollToItemOffset - scrollFromItemOffset;

                listDOMNode.scrollTo(0, offset);
            }
        }
    }

    render () {
        // Ref is added only to item, to which scroll should be performed
        const listItems = Object.entries(this.props.pressure).map(([key, item]) => {
            return <PressureItem
                key={key}
                id={key}
                fe={item.fe}
                part={item.part}
                pressure={item.pressure}
                update={this.updatePressureItem}
                delete={this.deletePressureItem}
                hover={this.hoverOverFe}
                hovered={key === this.props.hover}
                ref={key === this.props.scroll && this.scrollToItem}
            />
        });

        return (
            <div className='pressure-container'>
                <div className='heading'>
                    Pressure list:
                </div>

                <div className='separator'></div>

                <div className='pressure-list' id='style-2' ref={this.listRef}>
                    { listItems }
                </div>

                <input
                    type='submit'
                    value='Submit'
                    className='button submit'
                    onClick={this.handleSubmitButtonClick}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    pressure: state.pressure,
    hover: state.hover,
    scroll: state.scroll
});

const mapDispatchToProps = {
    updatePressure,
    deletePressure,
    hoverFE,
    solve
};

export default connect(mapStateToProps, mapDispatchToProps)(PressureList);