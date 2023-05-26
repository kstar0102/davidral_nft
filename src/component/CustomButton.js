import React from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function CustomButton(props) {

    return ( 
        <button className='bb-button' onClick={props.onClick} style={{...styles.buttonStyle, ...props.style}}>
            <div style={{...styles.spanStyle, ...styles.gap}}>
                {props.icon && <FontAwesomeIcon icon={props.icon} />}
            </div>
            <span style={styles.spanStyle}>{props.label}</span>
        </button>
    );
}

const styles = {
    buttonStyle: {
        width: '13rem',
        height: '3rem',
        border: 'none',
        transform: 'skew(150deg)',
        backgroundImage: 'linear-gradient(to right, #904db8 0%, #7a31a1 51%, #7a31a1 100%)',
        color: 'white',
        
        display: 'inline-block',
        fontSize: '1.5rem',
        padding: '.1em .1em',
        textDecoration: 'none',
        marginRight: 5
    },
    spanStyle: {
        display: 'inline-block',
        transform: 'skew(-150deg)',
    },
    gap: {
        marginRight: '30px'
    }
}

export default CustomButton;