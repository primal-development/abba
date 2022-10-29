import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Alert from 'react-bootstrap/Alert';

export default class AlertUser extends React.Component{
    constructor() {
        super();
        this.state = {
          show: false
        }
      }
    
      componentDidUpdate() {
        //Only update the state when the current value is different than the incoming value
        if(this.state.show != this.props.show) {
          this.setState({ show: this.props.show })
        }
      }

    handleClose=()=>{
        this.setState({
            show:false
        })
    }
    render(){

        return(
            <div>
                <Alert variant='danger' show={this.state.show} onClose={this.handleClose} dismissible>
                    <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                    <p>
                        {this.props.msg}
                    </p>
                </Alert>
            </div>
        )
    }
}