import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import axios, { post } from 'axios';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
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

  const [formState, setFormState] = useState({
    isValid: false,
    values: {
      reportNumber: '',
      selectedFile: null,
      inspectionDate: moment().format('YYYY-MM-DD')
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

  const handleFile = event => {
    event.preventDefault();
    if (event.target) {
      if (event.target.files) {
        setFormState(formState => ({
          ...formState,
          values: {
            ...formState.values,
            selectedFile: event.target.files[0]
          }
        }));
      }
    }
  }

  const handleDate = event => {
     event.preventDefault();
     moment(event.target.value).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD') ?
      setFormState(formState => ({
        ...formState,
        isValid: false,
        errorText: 'Inspection date can not be in the past!',
        values : {
          ...formState.values,
        [event.target.name]: event.target.value
        }
      })) :
      setFormState(formState => ({
        ...formState,
        isValid: true,
        errorText: '',
        values : {
          ...formState.values,
        [event.target.name]: event.target.value
        }
      }))
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
    if (!formState.values.selectedFile) {
      setFormState(formState => ({
        ...formState,
        isValid: false,
        errorText: 'Please upload file!'
      }))
    } else if (formState.errorText.length === 0) {
        console.log(formState.values);


        const FormData = require('form-data');

        const config = {
          headers: {
              'content-type': 'multipart/form-data'
          }
        }

        const url = '/stations/1/inspectionreport';

        const form = new FormData();
        form.append('reportNumber', formState.values.reportNumber);
        form.append('inspectionDate', formState.values.inspectionDate);
        form.append('selectedFile', formState.values.selectedFile);
        // form.append('my_buffer', new Buffer(10));
        // form.append('my_file', fs.createReadStream('/foo/bar.jpg'));

        post(url, form, config);


        // const response = axios({
        //   method: 'post',
        //   url: `/stations/1/inspectionreport`,
        //   // headers: {'Authorization': 'Bearer' + token},
        //   data: {
        //     values: formState.values
        //   }
        // })
        // .catch(function () {
        //   setFormState(formState => ({
        //     ...formState,
        //     errorText: "Sorry, could not make request to server. Please try again later."
        //   }));
        // });
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
                error={hasError('inspectionDate')}
                type="date"
                name="inspectionDate"
                onChange={handleDate}
                value={formState.values.inspectionDate}
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
              <input type="file" name="file" onChange={handleFile}/>
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
