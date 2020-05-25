import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import moment from 'moment';
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

const StationListComponent = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const [data, setData] = useState({ stations: [] });

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios({
        method: 'get',
        url: '/stations',
      });
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
                  <TableCell>Station Name</TableCell>
                  <TableCell>Address</TableCell>
                  {/* Link to open PDF */}
                  <TableCell>SLD</TableCell>
                  {/* Link to other page to list all inspection */}
                  <TableCell>Inspection Report</TableCell> 
                  <TableCell>Inspection Report Number</TableCell> 
                  <TableCell>Inspection Date</TableCell>
                  {/* Button -> link */}
                  <TableCell>Station Detail</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.stations && data.stations.map(station => (
                  <TableRow
                    hover
                    key={station.StationId}
                  >
                    <TableCell>{station.StationName}</TableCell>
                    <TableCell>{station.StationAddress}</TableCell>
                    <TableCell>{station.StationDiagram}</TableCell>
                    <TableCell>{station.InspectionReport}</TableCell>
                    <TableCell>{station.InspectionReportNumber}</TableCell>
                    <TableCell>
                      {
                        station.InspectionDate ? moment(station.InspectionDate).format('YYYY-MM-DD') : ''
                      }
                    </TableCell>
                    <TableCell>
                      <Link to = {
                        location => `${location.pathname}/${station.StationId}`
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

StationListComponent.propTypes = {
  className: PropTypes.string
};

export default StationListComponent;
