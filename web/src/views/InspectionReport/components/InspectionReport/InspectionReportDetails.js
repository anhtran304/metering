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
  // FormControlLabel,
  // Checkbox,
  // FormControl,
  // FormGroup,
  // FormHelperText,
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


const InspectionReportDetails = props => {
  const { className, ...rest } = props;

  let errorMessage = '';

  const classes = useStyles();

  const isActive = [
    {
      value: 1,
      label: 'GHDS'
    }, 
    {
      value: 2,
      label: 'TKLO updated'
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
      // isActive: 0,
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
        url: '/roles',
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
      const response = axios({
        method: 'post',
        url: '/users',
        // headers: {'Authorization': 'Bearer' + token}, 
        data: {
          values: formState.values,
          roles: formState.rolesData,
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
          subheader="The detail information of Inspection Report"
          title="Submit Inspection Report"
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
                fullWidth
                label="Station"
                margin="dense"
                name="station"
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
                error={hasError('firstName')}
                fullWidth
                helperText = {
                  hasError('firstName') ? formState.errors.firstName[0] : null
                }
                label = "Report Number"
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
              md={12}
              xs={12}
            >
              <TextField
                error={hasError('password')}
                fullWidth
                helperText={
                  hasError('password') ? formState.errors.password[0] : null
                }
                label="Inspection Date"
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
              md={12}
              xs={12}
            >
              <Typography>Upload Report</Typography>
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

InspectionReportDetails.propTypes = {
  className: PropTypes.string
};

export default InspectionReportDetails;
