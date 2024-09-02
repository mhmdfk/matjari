"use client";

import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import { useRouter } from 'next/navigation';
import Alert from 'react-bootstrap/Alert'
import logo from "../../public/Resources/logo.jpg"



function RegisterPage() {


    const router = useRouter();
    const [validated, setValidated] = useState(false);
    const [info, setInfo] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        password: '',
        passwordConfirm: ''
    });




    const handleSubmit = (event) => {

        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }


        HandleRegisterPage();
    };

    async function HandleRegisterPage() {

        console.log(info.email, info.firstName, info.lastName);


        try {

            console.log("here");
            const res = await axios.post("http://localhost:8080/auth/register", { info })

            const data = res.data;
            if (data.success) {
                router.push('/home'); // Redirect to home if registration is successful
                setValidated(true);
                console.log("SUCCESS");

            } else {
                setValidated(false);
                console.log("Failed");
            }
            // setInfo({
            //     firstName: '',
            //     lastName: '',
            //     userName: '',
            //     email: '',
            //     password: '',
            //     passwordConfirm: ''

            // })
        } catch (err) {
            console.log("ERROR with /auth/register ", err);
        }
    }

    return (

        <>

            <div className="d-flex justify-content-center align-items-center my-6">
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    {/* First Name */}
                    <Row className="mb-3">
                        <Form.Group as={Col} md="12" controlId="validationCustom01">
                            <Form.Label>First name</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="First name"
                                value={info.firstName}
                                onChange={(event) => {
                                    const data = event.target.value;
                                    setInfo((prev) => ({
                                        ...prev,
                                        firstName: data,
                                    }));
                                }}
                            />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>
                    </Row>


                    {/* Last Name */}
                    <Row className="mb-3">
                        <Form.Group as={Col} md="12" controlId="validationCustom02">
                            <Form.Label>Last name</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Last name"
                                value={info.lastName}
                                onChange={(event) => {
                                    const data = event.target.value;
                                    setInfo((prev) => ({
                                        ...prev,
                                        lastName: data,
                                    }));
                                }}
                            />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    {/* Username */}
                    <Row className="mb-3">
                        <Form.Group as={Col} md="12" controlId="validationCustomUsername">
                            <Form.Label>Username</Form.Label>
                            <InputGroup hasValidation>
                                <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Username"
                                    aria-describedby="inputGroupPrepend"
                                    required
                                    value={info.userName}
                                    onChange={(event) => {
                                        const data = event.target.value;
                                        setInfo((prev) => ({
                                            ...prev,
                                            userName: data,
                                        }));
                                    }}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please choose a username.
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                    </Row>

                    {/* Email */}
                    <Row className="mb-3">
                        <Form.Group as={Col} md="12" controlId="validationCustom03">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Email"
                                required
                                value={info.email}
                                onChange={(event) => {
                                    const data = event.target.value;
                                    setInfo((prev) => ({
                                        ...prev,
                                        email: data,
                                    }));
                                }}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid Email.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    {/* Password */}
                    <Row className="mb-3">
                        <Form.Group as={Col} md="12" controlId="validationCustom04">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                required
                                value={info.password}
                                onChange={(event) => {
                                    const data = event.target.value;
                                    setInfo((prev) => ({
                                        ...prev,
                                        password: data,
                                    }));
                                }}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid password.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    {/* Confirm Password */}
                    <Row className="mb-3">
                        <Form.Group as={Col} md="12" controlId="validationCustom05">
                            <Form.Label>Password Confirm</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirm Password"
                                required
                                value={info.passwordConfirm}
                                onChange={(event) => {
                                    const data = event.target.value;
                                    setInfo((prev) => ({
                                        ...prev,
                                        passwordConfirm: data,
                                    }));
                                }}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please confirm your password.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    {/* Agree to terms */}
                    <Row className="mb-3">
                        <Form.Group as={Col} md="12">
                            <Form.Check
                                required
                                label="Agree to terms and conditions"
                                feedback="You must agree before submitting."
                                feedbackType="invalid"
                            />
                        </Form.Group>
                    </Row>

                    {/* Submit Button */}

                    <Button type="submit">Submit</Button>

                </Form>
            </div>
        </>
    );
}

export default RegisterPage;
