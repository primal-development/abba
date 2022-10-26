// rcc-> == class component skeleton
// rsc-> == stateless component skeleton
// rsf-> == stateless named function skeleton

import React from 'react';

// import "./Login.css";
import Axios from "axios";
import { useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Login() {

    const [emailAddressReg, setEmailAddressReg] = useState("");
    const [passwordReg, setPasswordReg] = useState("");

    const [validated, setValidated] = useState(false);
    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        event.preventDefault();
        setValidated(true);


        Axios.post("http://localhost:3001/login", {
            email_address: emailAddressReg,
            password: passwordReg,
        }).then((response) => {
            console.log(response);
        });
    }

    return (
        <>
            <Form
                className="form"
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
            >
                <Row>
                    <FloatingLabel
                        controlId="emailInput"
                        label="Email Address"
                        className="mb-3"
                    >
                        <Form.Control
                            type="email"
                            placeholder="name@example.com"
                            aria-describedby="inputGroupPrepend"
                            required
                            onChange={(e) => {
                                setEmailAddressReg(e.target.value);
                            }}
                        />
                        <Form.Control.Feedback type="invalid">
                            Please choose a correct email address.
                        </Form.Control.Feedback>
                    </FloatingLabel>
                </Row>
                <Row>
                    <FloatingLabel
                        controlId="passwordInput"
                        label="Password"
                        className="mb-3"
                    >
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            onChange={(e) => {
                                setPasswordReg(e.target.value);
                            }}
                        />
                    </FloatingLabel>
                </Row>
                <Button variant="primary" type="submit">
                    Login
                </Button>
            </Form>
        </>
    );
}

export default Login;