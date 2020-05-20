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

  const [data, setData] = useState({ logicalMeterNMIDetails: [] });

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios({
        method: 'get',
        url: window.location.pathname,
      });
      console.log(result.data);
      setData(result.data);
    };
    fetchData();
  }, []);

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
        title="Logical Meter Details"
      />
      <Divider />
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
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
                {data.logicalMeterNMIDetails && data.logicalMeterNMIDetails.map(logicalMeterNMIDetail => (
                  <TableRow
                    hover
                    key={logicalMeterNMIDetail.NMI_MSATS}
                  >
                    <TableCell>{logicalMeterNMIDetail.NMI_MSATS}</TableCell>
                    <TableCell>{logicalMeterNMIDetail.LogicalMeterCalculation}</TableCell>
                    <TableCell>{logicalMeterNMIDetail.GroupName}</TableCell>                    
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
