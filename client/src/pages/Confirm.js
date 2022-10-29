import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactCodeInput from 'react-verification-code-input';
import Axios from 'axios';
import Alert from 'react-bootstrap/Alert';
import AlertUser from './AlertUser';

function Confirm() {

    const navigate = useNavigate();

    const location = useLocation();
    console.log(location.state);
    console.log("Authorization code: " + location.state.auth_code)

    const handleSubmit = (event) => {

        console.log(event);

        if (location.state.auth_code.toString() !== event.toString()) {
            console.log("Wrong!");
        }else {
            Axios.post("http://localhost:3001/createUser", {
                athlete_name: location.state.athleteNameReg,
                athlete_lastname: location.state.athleteLastnameReg,
                email_address: location.state.emailAddressReg,
                password: location.state.passwordReg,
            }).then((response) => {
                console.log(response);
            });
        }

    }

    const resendEmail = () => {
        navigate('/Register');
    }


    return (
        <div>
            <h2>We sent an email with a verification code to you</h2>
            <h6>Please verify your identity</h6>
            {< AlertUser />}
            <ReactCodeInput onComplete={handleSubmit} />

            <h6 onClick={resendEmail} color={'#3590E4'} >I didn't receive an email. Send again</h6>
        </div>
    );
}

export default Confirm;