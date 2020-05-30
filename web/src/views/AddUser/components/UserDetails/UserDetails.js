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
  Typography,
  FormControlLabel,
  Checkbox,
  FormControl,
  FormGroup,
  FormHelperText,
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

  let errorMessage = '';

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
      confirmPassword: '',
    },
    touched: {},
    errors: {},
    errorText: '',
    rolesData: {}
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

  useEffect(() => {
    const fetchRoleData = async () => {
      const result = await axios({
        method: 'get',
        url: '/api/roles',
      });
      setFormState(formState => ({
        ...formState,
        rolesData: result.data.roles
      }));
    };
    fetchRoleData();
  }, []);

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

  const handleChangeRoles = (event) => {
    setFormState({
      ...formState,
      rolesData: {
        ...formState.rolesData,
        [event.target.name]: event.target.checked
      }
    });
  };

  const handleSignIn = event => {
    event.preventDefault();

    const arrayOfTrueRoleValue = Object.values(formState.rolesData).filter(role => role === true);

    if (!arrayOfTrueRoleValue || arrayOfTrueRoleValue.length === 0) {
      errorMessage = "Please select at least one role. "
    }
    if (formState.values.password !== formState.values.confirmPassword) {
      errorMessage += "Password and Confirm Password are not the same. "
    }
    if (errorMessage !== '') {
      setFormState(formState => ({
        ...formState,
        errorText: errorMessage
      }));
    } else {
      axios({
        method: 'post',
        url: '/api/users',
        // headers: {'Authorization': 'Bearer' + token},
        data: {
          values: formState.values,
          roles: formState.rolesData,
        }
      })
      .then(res => {
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
      })
      .catch(function () {
        setFormState(formState => ({
          ...formState,
          errorText: "Sorry, could not make request to server. Please try again later."
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
            <Divider />
            <Grid
              item
              md={12}
              xs={12}
            >
              <FormControl component="fieldset">
                <Typography variant='h5'>Assign Role</Typography>
                <FormGroup>
                  <Grid
                    container
                    spacing={3}
                  >
                    {
                      formState.rolesData && Object.keys(formState.rolesData).map(function (key, index) {
                        return (
                          <Grid 
                            key={index}
                            item
                            md = {2}
                            xs = {6}>
                            <FormControlLabel
                              control={<Checkbox checked={formState.rolesData[key]} onChange={handleChangeRoles} name={key} />}
                              label={key}
                            />
                          </Grid>
                        )}
                      )}
                  </Grid>
                </FormGroup>
                <FormHelperText>Please select at least one role</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
          <Typography
            className = { classes.errorColor}
          >
            { formState.errorText }
          </Typography>
        </CardContent>
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
