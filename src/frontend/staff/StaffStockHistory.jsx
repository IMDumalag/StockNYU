import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import StaffSidebar from '../components/StaffSidebar';
import StaffToolbar from '../components/StaffToolbar';
import './StaffStockHistory.css';

const StaffStockHistory = () => {
   const [stockChanges, setStockChanges] = useState([]);
   const [searchTerm, setSearchTerm] = useState('');
   const [currentPage, setCurrentPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(5);

   useEffect(() => {
      fetchStockChanges();
   }, []);

   const fetchStockChanges = async () => {
      try {
         const response = await axios.get('http://localhost/stock-nyu/src/backend/api/readStockChange.php');
         setStockChanges(response.data);
      } catch (error) {
         console.error('Error fetching stock changes:', error);
      }
   };

   const handleSearch = (event) => {
      setSearchTerm(event.target.value);
   };

   const handleChangePage = (event, newPage) => {
      setCurrentPage(newPage);
   };

   const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setCurrentPage(0);
   };

   const filteredStockChanges = stockChanges.filter(stockChange =>
      stockChange.item_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stockChange.item_name.toLowerCase().includes(searchTerm.toLowerCase())
   );

   return (
      <>
         <StaffToolbar />
         <div className="container-fluid custom-margin-top">
            <div className="row">
               <div className="col-md-3">
                  <StaffSidebar />
               </div>
               <div className="col-md-9">
                  <Container>
                     <Typography variant="h4" className="my-4">Stock Change History</Typography>

                     <TextField
                        variant="outlined"
                        label="Search by Item ID or Name"
                        fullWidth
                        value={searchTerm}
                        onChange={handleSearch}
                        className="mb-4"
                     />

                     <TableContainer component={Paper}>
                        <Table>
                           <TableHead>
                              <TableRow>
                                 <TableCell>Change ID</TableCell>
                                 <TableCell>Item ID</TableCell>
                                 <TableCell>Item Name</TableCell>
                                 <TableCell>User ID</TableCell>
                                 <TableCell>User Name</TableCell>
                                 <TableCell>Quantity Before</TableCell>
                                 <TableCell>Quantity Added</TableCell>
                                 <TableCell>Quantity Subtracted</TableCell>
                                 <TableCell>Quantity Current</TableCell>
                                 <TableCell>Note</TableCell>
                                 <TableCell>Created At</TableCell>
                              </TableRow>
                           </TableHead>
                           <TableBody>
                              {filteredStockChanges.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage).map((stockChange) => (
                                 <TableRow key={stockChange.change_id}>
                                    <TableCell>{stockChange.change_id}</TableCell>
                                    <TableCell>{stockChange.item_id}</TableCell>
                                    <TableCell>{stockChange.item_name}</TableCell>
                                    <TableCell>{stockChange.user_id}</TableCell>
                                    <TableCell>{`${stockChange.f_name} ${stockChange.l_name}`}</TableCell>
                                    <TableCell>{stockChange.quantity_before}</TableCell>
                                    <TableCell>{stockChange.quantity_added}</TableCell>
                                    <TableCell>{stockChange.quantity_subtracted}</TableCell>
                                    <TableCell>{stockChange.quantity_current}</TableCell>
                                    <TableCell>{stockChange.note}</TableCell>
                                    <TableCell>{new Date(stockChange.created_at).toLocaleString()}</TableCell>
                                 </TableRow>
                              ))}
                           </TableBody>
                        </Table>
                     </TableContainer>

                     <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredStockChanges.length}
                        rowsPerPage={rowsPerPage}
                        page={currentPage}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                     />
                  </Container>
               </div>
            </div>
         </div>
      </>
   );
};

export default StaffStockHistory;
