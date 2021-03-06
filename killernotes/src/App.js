import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { fetchData, clearError } from './actions';
import SideBar from './components/SideBar';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Notes from './components/Notes';
import NoteView from './components/NoteView';
import NoteForm from './components/NoteForm';
import './App.css';

const Error = styled.div`
  margin-left: 300px;
  color: red;
  font-size: 30px;
  padding: 20px;
  > button {
    background-color: #2bc1c4;
    color: #fff;
    margin-top: -13px;
    margin-left: 13px;
    width: 193px;
    height: 44px;
    font-size: 16px;
  }
`;

const Fetching = styled.h1`
  margin-left: 300px;
  font-size: 30px;
`;

class App extends Component {
  componentDidMount() {}

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.userId !== prevProps.userId) {
      this.props.fetchData(this.props.userId);
    }
  }

  ClearError = () => {
    this.props.clearError();
    this.props.history.push('/notes');
  };

  render() {
    return (
      <div>
        <Route path="/" component={SideBar} />
        <Route
          path="/"
          render={props =>
            this.props.loggedIn ? (
              <Fetching>Welcome {this.props.username}!</Fetching>
            ) : null
          }
        />
        <Route
          path="/login"
          render={props =>
            this.props.loggedIn ? (
              <Fetching>Already logged in!</Fetching>
            ) : (
              <Login {...props} />
            )
          }
        />
        <Route
          path="/signup"
          render={props =>
            this.props.loggedIn ? (
              <Fetching>You're already logged in!</Fetching>
            ) : (
              <SignUp {...props} />
            )
          }
        />
        <Route
          exact
          path="/notes"
          render={() =>
            this.props.fetching ? (
              <Fetching>Fetching your notes...</Fetching>
            ) : null
          }
        />
        <Route
          exact
          path="/notes"
          render={() =>
            this.props.fetched && this.props.loggedIn ? (
              <Notes notes={this.props.notes} />
            ) : (
              <Fetching>Not logged in</Fetching>
            )
          }
        />
        {/* ...props sends match, location, history, etc */}
        <Route
          path="/note/:id"
          render={props =>
            this.props.loggedIn ? (
              <NoteView {...props} />
            ) : (
              <Fetching>Not logged in</Fetching>
            )
          }
        />
        <Route
          path="/add"
          render={props =>
            this.props.loggedIn ? (
              <NoteForm {...props} />
            ) : (
              <Fetching>Not logged in</Fetching>
            )
          }
        />
        <Route path="/edit/:id" render={props => <NoteForm {...props} />} />
        {this.props.error ? (
          <Error>
            {this.props.error} <br />
            <button onClick={this.ClearError}>OK</button>
          </Error>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    notes: state.notes,
    fetching: state.fetchingNotes,
    fetched: state.fetchedNotes,
    error: state.error,
    loggedIn: state.loggedIn,
    username: state.username,
    userId: state.userId,
  };
};

// needs withRouter so redux knows when links happen
export default withRouter(
  connect(
    mapStateToProps,
    { fetchData, clearError },
  )(App),
);
