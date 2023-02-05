import React, {useState, useEffect, useReducer, useContext} from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from "../../store/auth-context";

// useReducer hooks to manage when the states for input fields update
const emailReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return {value: action.val, isValid: action.val.includes('@')};
  }
  if (action.type === 'INPUT_BLUR') {
    return {value: state.value, isValid: state.value.includes('@')};
  }
  return {value: '', isValid: false};
};

const passwordReducer = (state, action) => {
  if (action.type === 'PASSWORD_INPUT') {
    return {value: action.val, isValid: action.val.trim().length > 6}
  }
  if (action.type === 'INPUT_BLUR') {
    return {value: state.value, isValid: state.value.trim().length > 6}
  }
  return {value: '', isValid: false};
};

// login logic start
const Login = (props) => {
  // useState to manage validity of form
  const [formIsValid, setFormIsValid] = useState(false);

  // useReducer example for state management of email and password field
  const [emailState, dispatchEmail] = useReducer(emailReducer,
      {
        value: '',
        isValid: null
      },);

  const [passwordState, dispatchPassword] = useReducer(passwordReducer,
      {
        value: '',
        isValid: null
      },);

  // useContext hook to create authCtx
  const authCtx = useContext(AuthContext);

  // alias assignment with object destructuring syntax
  const {isValid: emailIsValid} = emailState;
  const {isValid: passwordIsValid} = passwordState;

  // useEffect hook that checks every 500ms for form validity instead of onChange
  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log('Checking form validity!');
      setFormIsValid(
          emailIsValid && passwordIsValid
      );
    }, 500);

    // cleanup function to reset timeout
    return () => {
      console.log('Cleanup');
      clearTimeout(identifier)
    };
  }, [emailIsValid, passwordIsValid]);

  // handlers for input fields for useReducer states
  const emailChangeHandler = (event) => {
    dispatchEmail({type: 'USER_INPUT', val: event.target.value});

    setFormIsValid(
        emailState.isValid && passwordState.isValid
    );
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({type: 'PASSWORD_INPUT', val: event.target.value});

    setFormIsValid(
        emailState.isValid && passwordState.isValid
    );
  };

  // handler to validate input fields on blur
  const validateEmailHandler = () => {
    dispatchEmail({type: 'INPUT_BLUR'});
  };


  const validatePasswordHandler = () => {
    dispatchPassword({type: 'INPUT_BLUR'});
  };

  // handler to submit login data to useContext authentication
  const submitHandler = (event) => {
    event.preventDefault();
    authCtx.onLogin(emailState.value, passwordState.value);
  };

  return (
      // form with conditional content depending on login status
      <Card className={classes.login}>
        <form onSubmit={submitHandler}>
          <div
              className={`${classes.control} ${
                  emailState.isValid === false ? classes.invalid : ''
              }`}
          >
            <label htmlFor="email">E-Mail</label>
            <input
                type="email"
                id="email"
                value={emailState.value}
                onChange={emailChangeHandler}
                onBlur={validateEmailHandler}
            />
          </div>
          <div
              className={`${classes.control} ${
                  passwordState.isValid === false ? classes.invalid : ''
              }`}
          >
            <label htmlFor="password">Password</label>
            <input
                type="password"
                id="password"
                value={passwordState.value}
                onChange={passwordChangeHandler}
                onBlur={validatePasswordHandler}
            />
          </div>
          <div className={classes.actions}>
            <Button type="submit" className={classes.btn} disabled={!formIsValid}>
              Login
            </Button>
          </div>
        </form>
      </Card>
  );
};

export default Login;
