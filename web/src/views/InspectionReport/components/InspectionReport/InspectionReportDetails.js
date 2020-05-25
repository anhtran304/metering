import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import axios from 'axios';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import Dropzone from 'react-dropzone';
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
  Paper,
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
  },
  paper: {
    display: 'flex',
    textAlign: 'center',
    '& > *': {
      margin: theme.spacing(1),
      width: '100%',
      height: theme.spacing(10),
    }
  },
  textUnderLine: {
    textDecoration: 'underline',
  }
}));


const InspectionReportDetails = props => {
  const { className, ...rest } = props;

  let errorMessage = '';

  const classes = useStyles();

  const schema = {
    reportNumber: {
      presence: {
        allowEmpty: false,
        message: 'is required'
      },
      length: {
        minimum: 10
      }
    }
  };

  const now = moment(new window.Date()).format('YYYY-MM-DD');

  const [formState, setFormState] = useState({
    isValid: false,
    values: {
      reportNumber: '',
      selectedFile: null
    },
    touched: {},
    errors: {},
    errorText: '',
    stations: []
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
    const fetchStationData = async () => {
      const result = await axios({
        method: 'get',
        url: '/public/allstationnames',
      });
      setFormState(formState => ({
        ...formState,
        stations: result.data.stations,
      }));
    };
    fetchStationData();
  }, []);

  const handleFile = function handleFile(file) {
    console.log(file);
  }

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


  const handleSubmit = event => {
    event.preventDefault();
    console.log('Submit');
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
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              >
                {formState.stations && formState.stations.map(option => (
                  <option
                    key={option.StationId}
                    value={option.StationName}
                  >
                    {option.StationName}
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
                error={hasError('reportNumber')}
                fullWidth
                helperText = {
                  hasError('reportNumber') ? formState.errors.reportNumber[0] : null
                }
                label = "Report Number"
                margin="dense"
                name = "reportNumber"
                onChange={handleChange}
                required
                value={formState.values.reportNumber}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                id="date"
                label="Inspection Date"
                type="date"
                defaultValue={now}
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
            >
              <Dropzone onDrop={acceptedFiles => handleFile(acceptedFiles)}>
                {({getRootProps, getInputProps}) => (
                  <section>
                    <Paper variant="outlined" {...getRootProps()} className={classes.paper}>
                      <input {...getInputProps()} />
                      <Typography variant="h6" className={classes.textUnderLine}>Drag 'n' drop some files here, or click to select report files</Typography>
                    </Paper>
                  </section>
                )}
              </Dropzone>
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
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={!formState.isValid}
          >
            Save Report
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
