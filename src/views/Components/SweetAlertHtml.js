import React, { Component } from 'react';

class SweetAlertHtml extends Component {
    constructor(props) {
        super(props)
}
    render() {
        return(
         <div>
        <p><h6>{this.props.confirmationText}</h6></p>
        <p>{this.props.confirmationMessage}</p>
        </div>
        )
    }
}

export default SweetAlertHtml