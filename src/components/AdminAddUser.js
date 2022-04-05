import React, { useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { callApi } from "../axios-services";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import useUser from "../hooks/useUser";
import "../style/AdminAddUser.css";

const AdminAddUser = () => {

  const { setUser } = useUser();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState([]);
  const [ isAdmin, setIsAdmin ] = useState(false);

  const handleSubmit = async (event, token) => {
    try {
      event.preventDefault();
      localStorage.clear();
      const user = await callApi({
        url: `/users/register`,
        method: "POST",
        body: { username, password, email },
      });

        const users = username;
        if (user) {
          setUsername("");
          setPassword("");
          navigate('/admin-page/users');
          localStorage.setItem("user", JSON.stringify(users));
        }
        
    } catch (error) {
      setErrors(error.message);
    }
  };

  return (
    <>
      <div className="register-login-backdrop">
        <Container>
          <Row className="window1 m-auto">
          {errors && (<div style={{ marginTop: "1em", color: "red" }}>
                      {errors}
                    </div>
                  )}
            <Col className="add-user-title" lg={5} md={6} sm={12} 
            className="window p-5 m-auto shadow-lg">
              <h3
                className="text-title text-center"
                style={{ overflowY: "hidden" }}
              >Add a User
              </h3>
              <Form className="login-register-form" onSubmit={handleSubmit}>
                <Form.Group
                  className="form-Basic-Username"
                  controlId="formBasicUsername"
                >
                  <Form.Control
                    className="username-box"
                    required
                    placeholder="Username"
                    label="Username"
                    type="Username"
                    variant="outlined"
                    value={username}
                    onChange={(event) => {
                      setUsername(event.target.value);
                    }}
                  />
                </Form.Group>
                <Form.Group
                  className="form-Basic-Password"
                  controlId="formBasicPassword"
                >
                  <Form.Control
                    className="password-box"
                    required
                    placeholder="Password"
                    label="Password"
                    type="Password"
                    variant="outlined"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                    }}
                  />
                </Form.Group>
                <Form.Group
                  className="form-Basic-Email"
                  controlId="formBasicEmail"
                >
                    <Form.Control
                      className="email-box"
                      required
                      placeholder="Email"
                      label="Email"
                      type="Email"
                      variant="outlined"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                      }}
                    />
                </Form.Group>
                 <Form.Group
                  className="form-Basic-isAdmin"
                  controlId="formBasicIsAdmin"
                >
                    <Form.Control
                      className="isAdmin-box"
                      required
                      placeholder="isAdmin"
                      label="isAdmin"
                      type="isAdmin"
                      variant="outlined"
                      value={isAdmin}
                      onChange={(event) => {
                        setIsAdmin(event.target.value);
                      }}
                    />
                </Form.Group>
                <Button
                  style={{ background: "#557272", border: "none" }}
                  className="create-button"
                  type="submit"
                >
                  Create
                </Button>
              </Form>
            </Col>
          </Row>

        </Container>
      </div>
    </>
  );
};

export default AdminAddUser;
