import React from 'react';
import PropTypes from 'prop-types';

const InputTextElement = (props) => {
    let variantClass = '';
    switch (props.variant) {
    case 'large':
        variantClass = 'input-text-element_large';
        break;
    case '':
    default:
        break;
    }

    return (
        <div className="slds-form-element slds-m-top_medium">
            <label className="slds-form-element__label" htmlFor={props.name}>{props.label}</label>
            <div className="slds-form-control__control">
                <input className={`slds-input ${variantClass}`} type={props.type} id={props.name} name={props.name}
                    value={props.value} onChange={props.handleChange} />
            </div>
        </div>
    );
};

/* slds-input loginform-text-input */

InputTextElement.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    variant: PropTypes.string,
    handleChange: PropTypes.func.isRequired
};

export default InputTextElement;
