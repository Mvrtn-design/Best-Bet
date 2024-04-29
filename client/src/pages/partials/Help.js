import React from 'react';
import "../../Appp.css";

function Help(props) {
    return props.trigger ? (<div className="help-background">
        <div className="help-container">
            <button className="button-close" onClick={() => props.setTrigger(false)}>X</button>
            <div className='help-content'>{props.children}</div>
        </div>
    </div>
    ) : ("");
}

export default Help