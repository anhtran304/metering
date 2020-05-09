import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';

// import { SearchInput } from 'components';

const useStyles = makeStyles(theme => ({
  root: {},
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  spacer: {
    flexGrow: 1
  },
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  searchInput: {
    marginRight: theme.spacing(1)
  }
}));

const UsersToolbar = props => {
  const { className, ...rest } = props;

  const operationNames = JSON.parse(sessionStorage.getItem('operationNames'));
  
  const classes = useStyles();
  if (operationNames && operationNames.includes('ADD_NEW_USER')) {
    return (
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        <div className={classes.row}>
          <span className={classes.spacer} />
          <Button
            color="primary"
            variant="contained"
            href = "/add-user"
          >
            Add user
          </Button>
        </div>
        {/* <div className={classes.row}>
          <SearchInput
            className={classes.searchInput}
            placeholder="Search user"
          />
        </div> */}
      </div>
    );
  } else {
    return (<div></div>)
  }
};

UsersToolbar.propTypes = {
  className: PropTypes.string
};

export default UsersToolbar;
