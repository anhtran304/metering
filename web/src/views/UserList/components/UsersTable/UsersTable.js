import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import axios from 'axios';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  // Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

const UsersTable = props => {

  const { className, users, ...rest } = props;

  const classes = useStyles();

  // const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUsers] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [data, setData] = useState({ users: [] });

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios({
        method: 'get',
        url: '/users',
      });
      setData(result.data);
    };
    fetchData();
  }, []);

  // const handleSelectAll = event => {
  //   const { users } = props;

  //   let selectedUsers;

  //   if (event.target.checked) {
  //     selectedUsers = users.map(user => user.id);
  //   } else {
  //     selectedUsers = [];
  //   }

  //   setSelectedUsers(selectedUsers);
  // };

  // const handleSelectOne = (event, id) => {
  //   const selectedIndex = selectedUsers.indexOf(id);
  //   let newSelectedUsers = [];

  //   if (selectedIndex === -1) {
  //     newSelectedUsers = newSelectedUsers.concat(selectedUsers, id);
  //   } else if (selectedIndex === 0) {
  //     newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(1));
  //   } else if (selectedIndex === selectedUsers.length - 1) {
  //     newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(0, -1));
  //   } else if (selectedIndex > 0) {
  //     newSelectedUsers = newSelectedUsers.concat(
  //       selectedUsers.slice(0, selectedIndex),
  //       selectedUsers.slice(selectedIndex + 1)
  //     );
  //   }

  //   setSelectedUsers(newSelectedUsers);
  // };

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  {/* <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedUsers.length === users.length}
                      color="primary"
                      indeterminate={
                        selectedUsers.length > 0 &&
                        selectedUsers.length < users.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell> */}
                  <TableCell>Full Name</TableCell>
                  <TableCell>Email</TableCell>
                  < TableCell>Registration Date</TableCell>
                  <TableCell>Active</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.users.slice(0, rowsPerPage).map(user => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={user.UserId}
                    selected={selectedUsers.indexOf(user.UserId) !== -1}
                  >
                    {/* <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedUsers.indexOf(user.id) !== -1}
                        color="primary"
                        onChange={event => handleSelectOne(event, user.id)}
                        value="true"
                      />
                    </TableCell> */}
                    <TableCell>
                      <Typography variant="body1">{user.FullName}</Typography>
                    </TableCell>
                    <TableCell>{user.Email}</TableCell>
                    <TableCell>
                      {moment(user.DateTimeCreated).format('DD/MM/YYYY')}
                    </TableCell>
                    <TableCell>{user.isActive.toString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <CardActions className={classes.actions}>
        <TablePagination
          component="div"
          count={users.length}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </CardActions>
    </Card>
  );
};

UsersTable.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired
};

export default UsersTable;
