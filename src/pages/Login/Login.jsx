import React, { useLayoutEffect, useState } from 'react';
import {
  Typography,
  FormControl,
  FilledInput,
  InputLabel,
  InputAdornment,
  IconButton,
  Box,
  FormHelperText,
} from '@material-ui/core';

import useStyles from './Login.styles';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { Link, Redirect, useLocation } from 'react-router-dom';
import ButtonLoading from '../../components/UI/ButtonLoading/ButtonLoading';
import { useInput } from '../../hooks/use-input';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../slices/auth.slice';
import { emailSchema } from '../../schemas/common.schema';
import { uiActions } from '../../slices/ui.slice';

function Login() {
  const classes = useStyles();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  const {
    enteredInput: email,
    inputBlurHandler: emailBlurHandler,
    inputChangeHandler: emailChangeHandler,
    inputReset: emailReset,
    inputIsValid: emailIsvalid,
    hasError: emailHasError,
    errorMsg: emailErrorMessage,
  } = useInput(emailSchema);

  const {
    enteredInput: password,
    inputBlurHandler: passwordBlurHandler,
    inputChangeHandler: passwordChangeHandler,
    inputReset: passwordReset,
    inputIsValid: passwordIsvalid,
    hasError: passwordHasError,
    errorMsg: passwordErrorMessage,
  } = useInput();

  const formIsValid = emailIsvalid && passwordIsvalid;

  const toggleShowPasswordHandler = () => {
    setShowPassword((prevState) => !prevState);
  };
  const mouseDownPasswordHandler = (event) => {
    event.preventDefault();
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    if (!formIsValid) {
      return;
    }
    setError(null);
    try {
      await dispatch(
        login({
          email,
          password,
        })
      ).unwrap();
      emailReset();
      passwordReset();
    } catch (error) {
      setError(error);
    }
  };

  useLayoutEffect(() => {
    dispatch(uiActions.closeModal());
  }, [dispatch]);

  if (isAuthenticated) {
    if (user?.banned) {
      return <div>Banned</div>;
    }

    if (!user?.active) {
      return <Redirect to="/confirm-email" />;
    }
    return <Redirect to={location.state?.from || '/'} />;
  }

  return (
    <div className={classes.root}>
      <div>
        <form className={classes.form} onSubmit={formSubmitHandler}>
          <Typography variant="h6" className={classes.title}>
            ????ng nh???p
          </Typography>
          <div className={classes.formControl}>
            <FormControl
              error={emailHasError}
              variant="filled"
              fullWidth
              className={classes.textField}>
              <InputLabel htmlFor="email" className={classes.inputLabel}>
                Email
              </InputLabel>
              <FilledInput
                value={email}
                onBlur={emailBlurHandler}
                onChange={emailChangeHandler}
                id="email"
                type="text"
              />
            </FormControl>
            {emailHasError && (
              <FormHelperText className={classes.errorMessage}>{emailErrorMessage}</FormHelperText>
            )}
          </div>

          <div className={classes.formControl}>
            <FormControl
              error={passwordHasError}
              className={classes.textField}
              variant="filled"
              fullWidth>
              <InputLabel htmlFor="password" className={classes.inputLabel}>
                M???t kh???u
              </InputLabel>
              <FilledInput
                value={password}
                onBlur={passwordBlurHandler}
                onChange={passwordChangeHandler}
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={classes.inputField}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      edge="end"
                      onClick={toggleShowPasswordHandler}
                      onMouseDown={mouseDownPasswordHandler}>
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>

            {passwordHasError && (
              <FormHelperText className={classes.errorMessage}>
                {passwordErrorMessage}
              </FormHelperText>
            )}
          </div>

          {error && <FormHelperText className={classes.resError}>{error}</FormHelperText>}
          <ButtonLoading size="large" type="submit" isLoading={loading} disabled={!formIsValid}>
            ????ng nh???p
          </ButtonLoading>

          <Box>
            <Typography variant="body2" className={classes.textHelper}>
              B???n ch??a c?? t??i kho???n? <Link to="/register">????ng k??</Link>
            </Typography>
            <Typography variant="body2" className={classes.textHelper}>
              <Link to="/forgot-password">Qu??n m???t kh???u?</Link>
            </Typography>
          </Box>
        </form>
      </div>
    </div>
  );
}

export default Login;
