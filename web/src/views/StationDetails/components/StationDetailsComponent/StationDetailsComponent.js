import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

const StationDetailsComponent = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const [data, setData] = useState({ stationDetails: [] });

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
        title="Stations"
      />
      <Divider />
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>MeteringSchemeName</TableCell>
                  <TableCell>CommsType</TableCell>
                  {/* Link to open PDF */}
                  <TableCell>CommsNumber</TableCell>
                  {/* Link to other page to list all inspection */}
                  <TableCell>MeterNMI</TableCell> 
                  <TableCell>Installation_Type</TableCell>
                  <TableCell>View Detail</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.stationDetails && data.stationDetails.map(stationDetail => (
                  <TableRow
                    hover
                    key={stationDetail.MeterNMI}
                  >
                    <TableCell>{stationDetail.MeteringSchemeName}</TableCell>
                    <TableCell>{stationDetail.CommsType}</TableCell>
                    <TableCell>{stationDetail.CommsNumber}</TableCell>
                    <TableCell>{stationDetail.MeterNMI}</TableCell>
                    <TableCell>{stationDetail.Installation_Type}</TableCell>
                    <TableCell>
                      <Link to = {
                        location => `${location.pathname}/${stationDetail.MeterNMI}`
                      } >
                        View Detail
                      </Link>
                    </TableCell>
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

StationDetailsComponent.propTypes = {
  className: PropTypes.string
};

export default StationDetailsComponent;
