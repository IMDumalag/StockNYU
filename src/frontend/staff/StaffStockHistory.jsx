import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Grid, Pagination } from '@mui/material';
import StaffSidebar from '../components/StaffSidebar';
import StaffToolbar from '../components/StaffToolbar';

const StaffStockHistory = () => {
   const [stockChanges, setStockChanges] = useState([]);
   const [searchTerm, setSearchTerm] = useState('');
   const [currentPage, setCurrentPage] = useState(1);
   const rowsPerPage = 5;

   useEffect(() => {
      fetchStockChanges();
   }, []);

   const fetchStockChanges = async () => {
      try {
         const response = await axios.get('http://localhost/stock-nyu/src/backend/api/readStockChange.php');
         const sortedStockChanges = response.data.sort((a, b) => {
            const idA = parseInt(a.change_id.replace('SC-', ''), 10);
            const idB = parseInt(b.change_id.replace('SC-', ''), 10);
            return idB - idA;
         });
         setStockChanges(sortedStockChanges);
      } catch (error) {
         console.error('Error fetching stock changes:', error);
      }
   };

   const handleSearch = (event) => {
      setSearchTerm(event.target.value);
   };

   const paginateStockChanges = (pageNumber) => {
      setCurrentPage(pageNumber);
   };

   const filteredStockChanges = stockChanges.filter(stockChange =>
      stockChange.item_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stockChange.item_name.toLowerCase().includes(searchTerm.toLowerCase())
   );

   const currentStockChanges = filteredStockChanges.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

   return (
      <>
         <StaffToolbar />
         <Container maxWidth="x2" sx={{ pt: 4 }} style={{paddingTop:'140px', marginLeft:'-100px'}}>
            <Grid container spacing={3}>
               <Grid item xs={12} sm={3}>
                  <StaffSidebar />
               </Grid>
               <Grid item xs={12} sm={9}>
                  <Paper elevation={3} sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
                     <Typography variant="h4" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
                        Stock Change History
                     </Typography>

                     <Box sx={{ mb: 3 }}>
                        <TextField
                           variant="outlined"
                           label="Search by Item ID or Name"
                           fullWidth
                           value={searchTerm}
                           onChange={handleSearch}
                           InputProps={{
                              style: { backgroundColor: '#fff', borderRadius: '8px' }
                           }}
                        />
                     </Box>

                     {/* Table with Wider Layout */}
                     <Box sx={{ overflowX: 'auto' }}>
                        <TableContainer component={Paper}>
                           <Table stickyHeader sx={{ minWidth: 1500 }}>
                              <TableHead>
                                 <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}>Item Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}>User Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}>Quantity Before</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}>Quantity Added</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}>Quantity Subtracted</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}>Quantity Current</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}>Note</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}>Created At</TableCell>
                                 </TableRow>
                              </TableHead>
                              <TableBody>
                                 {currentStockChanges.map((stockChange) => (
                                    <TableRow key={stockChange.change_id}>
                                       <TableCell>{stockChange.item_name}</TableCell>
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
                     </Box>

                     {/* Pagination */}
                     <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Pagination
                           count={Math.ceil(filteredStockChanges.length / rowsPerPage)}
                           page={currentPage}
                           onChange={(_, page) => paginateStockChanges(page)}
                           variant="outlined"
                           color="primary"
                           shape="rounded"
                        />
                     </Box>
                  </Paper>
               </Grid>
            </Grid>
         </Container>
      </>
   );
};

export default StaffStockHistory;
