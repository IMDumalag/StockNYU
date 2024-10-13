import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
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
         setStockChanges(response.data);
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
         <div className="container-fluid" style={{ paddingTop: '100px'}}>
            <div className="row">
               <div className="col-md-3">
                  <StaffSidebar />
               </div>
               <div className="col-md-9" style={{ marginLeft: '-150px'}}>
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
                              {currentStockChanges.map((stockChange) => (
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

                     {/* Pagination */}
                     <nav className="d-flex justify-content-center mt-4">
                        <ul className="pagination">
                           <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                              <button
                                 onClick={() => paginateStockChanges(1)}
                                 className="page-link"
                                 disabled={currentPage === 1}
                              >
                                 First
                              </button>
                           </li>
                           <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                              <button
                                 onClick={() => paginateStockChanges(currentPage - 1)}
                                 className="page-link"
                                 disabled={currentPage === 1}
                              >
                                 Previous
                              </button>
                           </li>

                           {Array.from({ length: Math.ceil(filteredStockChanges.length / rowsPerPage) }, (_, index) => (
                              <li key={index + 1} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                                 <button
                                    onClick={() => paginateStockChanges(index + 1)}
                                    className="page-link"
                                    disabled={currentPage === index + 1}
                                 >
                                    {index + 1}
                                 </button>
                              </li>
                           ))}

                           <li
                              className={`page-item ${currentPage === Math.ceil(filteredStockChanges.length / rowsPerPage) ? "disabled" : ""}`}
                           >
                              <button
                                 onClick={() => paginateStockChanges(currentPage + 1)}
                                 className="page-link"
                                 disabled={currentPage === Math.ceil(filteredStockChanges.length / rowsPerPage)}
                              >
                                 Next
                              </button>
                           </li>
                           <li
                              className={`page-item ${currentPage === Math.ceil(filteredStockChanges.length / rowsPerPage) ? "disabled" : ""}`}
                           >
                              <button
                                 onClick={() => paginateStockChanges(Math.ceil(filteredStockChanges.length / rowsPerPage))}
                                 className="page-link"
                                 disabled={currentPage === Math.ceil(filteredStockChanges.length / rowsPerPage)}
                              >
                                 Last
                              </button>
                           </li>
                        </ul>
                     </nav>
                  </Container>
               </div>
            </div>
         </div>
      </>
   );
};

export default StaffStockHistory;
