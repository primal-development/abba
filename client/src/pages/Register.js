import "./Register.css";
import Axios from "axios";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';


import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Register() {
  const navigate = useNavigate();

  const [athleteNameReg, setAthleteNameReg] = useState("");
  const [athleteLastnameReg, setAthleteLastnameReg] = useState("");
  const [emailAddressReg, setEmailAddressReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");

  const [validated, setValidated] = useState(false);
  
  function handleSubmit(event) {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    event.preventDefault();
    setValidated(true);

    sendRegistrationMail(emailAddressReg);

  }

  async function sendRegistrationMail(email_address){

    Axios.post("http://localhost:3001/sendRegistrationMail", {
      recipient: email_address
    }).then((response) => {
      console.log("This is the response:")
      console.log(response);
      let auth_code = response.data;
      navigate('/Confirm', { state: { auth_code, athleteNameReg, athleteLastnameReg, emailAddressReg, passwordReg } });
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
            <FloatingLabel controlId="nameInput" label="Name" className="mb-3" onChange={(e) => {
              setAthleteNameReg(e.target.value);
            }}>
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
                setAthleteLastnameReg(e.target.value);
              }}
            >
              <Form.Control type="lastname" placeholder="Name" />
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
        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>
    </>
  );
}

export default Register;
