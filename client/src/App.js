import "./App.css";
import Axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const sleep = ms => new Promise(
  resolve => setTimeout(resolve, ms)
);

function App() {
  const [athleteNameReg, setAthleteNameReg] = useState("");
  const [athleteLastnameReg, setAthleteLastnameReg] = useState("");
  const [emailAddressReg, setEmailAddressReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");

  const [validated, setValidated] = useState(false);
  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    event.preventDefault();
    setValidated(true);
    
  
    Axios.post("http://localhost:3001/createUser", {
      athlete_name: athleteNameReg,
      athlete_lastname: athleteLastnameReg,
      email_address: emailAddressReg,
      password: passwordReg,
    }).then(async (response) => {
      console.log(response);
      await sleep(3000);
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
          <Form.Group as={Col} controlId="validationCustom01">
            <FloatingLabel controlId="nameInput" label="Name" className="mb-3">
              <Form.Control type="name" placeholder="Name" />
            </FloatingLabel>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} controlId="validationCustom02">
            <FloatingLabel
              controlId="lastnameInput"
              label="Lastname"
              className="mb-3"
              onChange={(e) => {
                setAthleteNameReg(e.target.value);
              }}
            >
              <Form.Control
                type="name"
                placeholder="Lastname"
                onChange={(e) => {
                  setAthleteLastnameReg(e.target.value);
                }}
              />
            </FloatingLabel>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
        </Row>
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
        <Form.Group className="mb-3" controlId="staySignedIn">
          <Form.Check type="checkbox" label="Stay signed in" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
}

export default App;
