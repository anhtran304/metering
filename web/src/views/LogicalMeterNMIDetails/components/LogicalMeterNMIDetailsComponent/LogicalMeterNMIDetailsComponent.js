import React, { useState, useEffect } from 'react';
//import { Link } from 'react-router-dom';
import clsx from 'clsx';
import axios from 'axios';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 800
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  status: {
    marginRight: theme.spacing(1)
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

const LogicalMeterNMIDetailsComponent = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const [data, setData] = useState({ meterNMDetails: [] });

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios({
        method: 'get',
        url: window.location.pathname,
      });
      // console.log(result.data);
      setData(result.data);
    };
    fetchData();
  }, []);

  let TableData = null;
  let CardTitle = ' ';

  if (data.meterNMIDetails) {
    if (data.meterNMIDetails.type === 'logical') {
      CardTitle = 'Logical';
      TableData = 
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>NMI_MSATS</TableCell>
                    {/* Link to open PDF */}
                    <TableCell>LogicalMeterCalculation</TableCell>
                    <TableCell>GroupName</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.meterNMIDetails.meterNMIDetails && data.meterNMIDetails.meterNMIDetails.map(meterNMIDetail => (
                    <TableRow
                      hover
                      key={meterNMIDetail.NMI_MSATS}
                    >
                      <TableCell>{meterNMIDetail.NMI_MSATS}</TableCell>
                      <TableCell>{meterNMIDetail.LogicalMeterCalculation}</TableCell>
                      <TableCell>{meterNMIDetail.GroupName}</TableCell>                    
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
    } else if (data.meterNMIDetails.type === 'physical') {
      CardTitle = 'Physical';
      TableData = 
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>NMI_MSATS</TableCell>
                    {/* Link to open PDF */}
                    <TableCell>MeterName</TableCell>
                    <TableCell>MeterSerialNumber</TableCell>
                    <TableCell>GroupName</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.meterNMIDetails.meterNMIDetails && data.meterNMIDetails.meterNMIDetails.map(meterNMIDetail => (
                    <TableRow
                      hover
                      key={meterNMIDetail.NMI_MSATS}
                    >
                      <TableCell>{meterNMIDetail.NMI_MSATS}</TableCell>
                      <TableCell>{meterNMIDetail.MeterName}</TableCell>
                      <TableCell>{meterNMIDetail.MeterSerialNumber}</TableCell>                    
                      <TableCell>{meterNMIDetail.GroupName}</TableCell>                    
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
    }
  }

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        // action={
        //   <Button
        //     color="primary"
        //     size="small"
        //     variant="outlined"
        //   >
        //     New entry
        //   </Button>
        // }
        title={ `Meter Details: ${CardTitle}` }
      />
      <Divider />
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            { TableData }
          </div>
        </PerfectScrollbar>
      </CardContent>
      <Divider />
      <CardActions className={classes.actions}>
        <Button
          color="primary"
          size="small"
          variant="text"
        >
          View all <ArrowRightIcon />
        </Button>
      </CardActions>
    </Card>
  );
};

LogicalMeterNMIDetailsComponent.propTypes = {
  className: PropTypes.string
};

export default LogicalMeterNMIDetailsComponent;
