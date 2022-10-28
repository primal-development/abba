import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

function AlertUser() {
    return (
        <Alert variant="danger">
            <Alert.Heading>Ooops! Wrong authentication code</Alert.Heading>
            <p>
                Make sure you typed the right authentification code you got sent by email
            </p>
        </Alert>
    )
}