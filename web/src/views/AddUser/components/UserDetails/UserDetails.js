import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import axios from 'axios';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField,
  Typography
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%'
  },
  errorColor: {
    marginTop: theme.spacing(2),
    color: theme.palette.error.main
  }
}));


const UserDetails = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const isActive = [
    {
      value: 1,
      label: 'Yes'
    },
    {
      value: 0,
      label: 'No'
    }
  ];

  const schema = {
    firstName: {
      presence: {
        allowEmpty: false,
        message: 'is required'
      },
      length: {
        maximum: 64
      }
    },
    lastName: {
      presence: {
        allowEmpty: false,
        message: 'is required'
      },
      length: {
        maximum: 64
      }
    },
    email: {
      presence: {
        allowEmpty: false,
        message: 'is required'
      },
      email: true,
      length: {
        maximum: 64
      }
    },
    password: {
      presence: {
        allowEmpty: false,
        message: 'is required'
      },
      length: {
        maximum: 128
      }
    },
    confirmPassword: {
      presence: {
        allowEmpty: false,
        message: 'is required'
      },
      length: {
        maximum: 128
      }
    }
  };

  const [formState, setFormState] = useState({
    isValid: false,
    values: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      isActive: 1,
      confirmPassword: ''
    },
    touched: {},
    errors: {},
    errorText: ''
  });

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.values]);

  const handleChange = event => {
    event.persist();

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };

  const handleSignIn = event => {
    event.preventDefault();
    if (formState.values.password !== formState.values.confirmPassword) {
      setFormState(formState => ({
        ...formState,
        errorText: "Password and Confirm Password are not the same",
        isValid: false
      }));
    } else {
      const response = axios({
        method: 'post',
        url: '/users',
        // headers: {'Authorization': 'Bearer' + token}, 
        data: {
          values: formState.values,
        }
      })
      .catch(function () {
        setFormState(formState => ({
          ...formState,
          errorText: "Sorry, could not make request to server. Please try again later."
        }));
      });

      response.then(res => {
        console.log(res);
        let errorDisplayText = '';
        if (errorDisplayText && errorDisplayText.length > 0) {
          setFormState(formState => ({
            ...formState,
            errorText: errorDisplayText
          }));
        };
        setFormState(formState => ({
          ...formState,
          errorText: "Save user success"
        }));
      });
    } 
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <form
        autoComplete="off"
        noValidate
      >
        <CardHeader
          subheader="The detail information of user"
          title="Add User"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={hasError('firstName')}
                fullWidth
                helperText = {
                  hasError('firstName') ? formState.errors.firstName[0] : null
                }
                label = "First name"
                margin="dense"
                name="firstName"
                onChange={handleChange}
                required
                value={formState.values.firstName}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={hasError('lastName')}
                fullWidth
                helperText = {
                  hasError('lastName') ? formState.errors.lastName[0] : null
                }
                label="Last name"
                margin="dense"
                name="lastName"
                onChange={handleChange}
                required
                value={formState.values.lastName}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={hasError('email')}
                fullWidth
                helperText={
                  hasError('email') ? formState.errors.email[0] : null
                }
                label="Email Address"
                margin="dense"
                name="email"
                onChange={handleChange}
                required
                value={formState.values.email}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="is Active?"
                margin="dense"
                name="isActive"
                onChange={handleChange}
                required
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}
                value={formState.values.isActive}
                variant="outlined"
              >
                {isActive.map(option => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={hasError('password')}
                fullWidth
                helperText={
                  hasError('password') ? formState.errors.password[0] : null
                }
                label="Password"
                margin="dense"
                name="password"
                onChange={handleChange}
                required
                type="password"
                value={formState.values.password}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={hasError('confirmPassword')}
                fullWidth
                helperText={
                  hasError('confirmPassword') ? formState.errors.confirmPassword[0] : null
                }
                label="Confirm Password"
                margin="dense"
                name="confirmPassword"
                onChange={handleChange}
                required
                type="password"
                value={formState.values.confirmPassword}
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Typography
            className = { classes.errorColor}
          >
            { formState.errorText }
          </Typography>
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            onClick={handleSignIn}
            color="primary"
            variant="contained"
            disabled={!formState.isValid}
          >
            Save User
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

UserDetails.propTypes = {
  className: PropTypes.string
};

export default UserDetails;
