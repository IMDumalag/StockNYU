import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import UserSidebar from '../components/UserSidebar';
import UserToolbar from '../components/UserToolbar';

const UserFAQs = () => {
   const [faqs, setFaqs] = useState([]);
   const [searchTerm, setSearchTerm] = useState('');
   const [currentPage, setCurrentPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(5);

   useEffect(() => {
      fetchFaqs();
   }, []);

   const fetchFaqs = async () => {
      try {
         const response = await axios.get('http://localhost/stock-nyu/src/backend/api/readFaqsList.php');
         setFaqs(response.data.faqs || []); // Make sure the data is always an array
      } catch (error) {
         console.error('Error fetching FAQs:', error);
         setFaqs([]); // Default to empty array on error
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

   // Filter FAQs based on both the question and answer
   const filteredFaqs = faqs.filter(faq => {
      const regex = new RegExp(searchTerm, 'i'); // 'i' makes it case-insensitive
      return regex.test(faq.question) || regex.test(faq.answer);
   });

   return (
      <>
         <UserToolbar />
         <div className="container-fluid">
            <div className="row">
               <div className="col-md-3">
                  <UserSidebar />
               </div>
               <div className="col-md-9">
                  <Container>
                     <Typography variant="h4" className="my-4">Frequently Asked Questions</Typography>

                     <TextField
                        variant="outlined"
                        label="Search by Question or Answer"
                        fullWidth
                        value={searchTerm}
                        onChange={handleSearch}
                        className="mb-4"
                     />

                     <TableContainer component={Paper}>
                        <Table>
                           <TableHead>
                              <TableRow>
                                 <TableCell>Question</TableCell>
                                 <TableCell>Answer</TableCell>
                                 <TableCell>Created By</TableCell>
                                 <TableCell>Created Date</TableCell>
                              </TableRow>
                           </TableHead>
                           <TableBody>
                              {filteredFaqs.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage).map((faq) => (
                                 <TableRow key={faq.faq_id}>
                                    <TableCell>{faq.question}</TableCell>
                                    <TableCell>{faq.answer}</TableCell>
                                    <TableCell>{`${faq.f_name} ${faq.l_name}`}</TableCell>
                                    <TableCell>{new Date(faq.created_date).toLocaleString()}</TableCell>
                                 </TableRow>
                              ))}
                           </TableBody>
                        </Table>
                     </TableContainer>

                     <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredFaqs.length}
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

export default UserFAQs;
