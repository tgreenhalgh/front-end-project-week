import React from 'react';
import { connect } from 'react-redux';
import { loggedIn } from '../actions';
import axios from 'axios';
import styled from 'styled-components';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const RegisterForm = styled.form`
  background-color: #f3f3f3;
  padding-left: 18px;
  margin-left: 233px;
  margin-right: 20px;
  margin-top: 16px;
  word-break: break-all;
  border: 1px solid rgb(151, 151, 151);
  width: 646px;
  > p {
    margin-top: 55px;
    font-size: 22px;
    font-family: roboto;
    margin-left: 22px;
  }
`;

const Input = styled.input`
  margin-left: 6px;
`;

const registerAPI = 'https://floating-sea-10752.herokuapp.com/api/register/';
// const registerAPI = 'http://localhost:3007/api/register/';

class SignUp extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      error: '',
      modal: false,
    };
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    // the signup endpoint wants a user object {username, password}
    const { username, password } = this.state;
    const USER = { username, password };
    axios.defaults.withCredentials = true;
    axios
      .post(registerAPI, USER)
      .then(res => {
        // we're sent a JWT token
        const token = res.data.jwt;
        const username = res.data.username;
        const userId = res.data.id;
        // stash it for later use
        localStorage.setItem('jwt', token);
        localStorage.setItem('username', username);
        localStorage.setItem('userId', userId);
        this.props.loggedIn(username, userId);
        this.props.history.push('/notes');
      })
      .catch(err => {
        if (typeof err.response.data === 'string') {
          // if (err.response.data.includes('UNIQUE')) {
          this.setState({
            error: 'That user already exists. Please choose another.',
            username: '',
            password: '',
          });
          // }
        } else {
          this.setState({ error: err.response.data.error });
        }
        this.toggle();
        console.error('axios err:', err);
        console.log('ERR?', err.response.data);
      });
  };

  handleInput = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    return (
      <RegisterForm onSubmit={this.handleSubmit}>
        <div>
          Username:{' '}
          <input
            type="text"
            name="username"
            onChange={this.handleInput}
            placeholder="username"
            value={this.state.username}
          />
        </div>
        <div>
          Password:{' '}
          <Input
            type="password"
            name="password"
            onChange={this.handleInput}
            placeholder="password"
            value={this.state.password}
          />
        </div>
        <div>
          <button type="submit">Register</button>
        </div>
        <div>
          <Modal isOpen={this.state.modal} toggle={this.toggle}>
            <ModalHeader toggle={this.toggle}>ERROR</ModalHeader>
            <ModalBody>{this.state.error}</ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.toggle}>
                Close
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </RegisterForm>
    );
  }
}

const mapStateToProps = state => {
  return {
    notes: state.notes,
    edit: state.editingNote,
  };
};

export default connect(
  mapStateToProps,
  { loggedIn },
)(SignUp);
