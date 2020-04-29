import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import axios from 'axios';

import {
  StationListComponent
} from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const StationList = () => {
  const classes = useStyles();

  // const [data, setData] = useState({ hits: [] });
 
  // // useEffect(async () => {
  // //   const result = await axios(
  // //     'https://hn.algolia.com/api/v1/search?query=redux',
  // //   );
 
  // //   setData(result.data);
  // // });

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          lg={12}
          md={12}
          xl={12}
          xs={12}
        >
          <StationListComponent />
        </Grid>
      </Grid>
    </div>
  );
};

export default StationList;
