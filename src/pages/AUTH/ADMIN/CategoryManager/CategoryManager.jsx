import React, { useCallback, useEffect, useState } from 'react';
import useStyles from './CategoryManager.styles';

import {
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
	Button,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Delete, Edit, Add } from '@material-ui/icons';


function CategoryManager() {
	const classes = useStyles();

	return (
    <div className={classes.root}>
      <Container>
        <Box margin="20px 30px">
          <Typography variant="h3" align="center">
            Quản lý danh mục
          </Typography>
					<div className={classes.topWrapOptions}>
						<Button variant="outlined" startIcon={<Add />} className={classes.buttonAdd}>
							Thêm mới
						</Button>
					</div>
        </Box>
        <Box boxShadow={6}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow className={classes.tableHead}>
                  <TableCell style={{ fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell> Name </TableCell>
                  <TableCell className={classes.actionHeader}> Options </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow className={classes.tableRow}>
                  <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>
                    1
                  </TableCell>
                  <TableCell>Đồ điện tử và thiết bị thông minh</TableCell>
                  <TableCell>
                    <Box display="flex" justifyContent="center">
											<Edit className={classes.actionIcon} />
                      <Delete className={classes.actionIcon} />
                    </Box>
                  </TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 15]}
                    count={25}
                    rowsPerPage={5}
                    page={1}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </div>
  );
}

export default CategoryManager;
