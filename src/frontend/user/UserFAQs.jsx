import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import UserSidebar from '../components/UserSidebar';
import UserToolbar from '../components/UserToolbar';

const UserFAQs = () => {
   const [faqs, setFaqs] = useState([]);
   const [searchTerm, setSearchTerm] = useState('');
   const [currentPage, setCurrentPage] = useState(1);
   const rowsPerPage = 5;

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
      setCurrentPage(1); // Reset to first page on search
   };

   const paginateFaqs = (pageNumber) => {
      setCurrentPage(pageNumber);
   };

   // Filter FAQs based on both the question and answer
   const filteredFaqs = faqs.filter(faq => {
      const regex = new RegExp(searchTerm, 'i'); // 'i' makes it case-insensitive
      return regex.test(faq.question) || regex.test(faq.answer);
   });

   // Paginate FAQs
   const paginatedFaqs = filteredFaqs.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

   return (
      <>
         <UserToolbar />
         <div className="container-fluid" style={{ paddingTop: '100px'}}>
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
                              {paginatedFaqs.map((faq) => (
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

                     {/* Pagination */}
                     <nav className="d-flex justify-content-center mt-4">
                        <ul className="pagination">
                           <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                              <button
                                 onClick={() => paginateFaqs(1)}
                                 className="page-link"
                                 disabled={currentPage === 1}
                              >
                                 First
                              </button>
                           </li>
                           <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                              <button
                                 onClick={() => paginateFaqs(currentPage - 1)}
                                 className="page-link"
                                 disabled={currentPage === 1}
                              >
                                 Previous
                              </button>
                           </li>

                           {Array.from({ length: Math.ceil(filteredFaqs.length / rowsPerPage) }, (_, index) => (
                              <li key={index + 1} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                                 <button
                                    onClick={() => paginateFaqs(index + 1)}
                                    className="page-link"
                                    disabled={currentPage === index + 1}
                                 >
                                    {index + 1}
                                 </button>
                              </li>
                           ))}

                           <li
                              className={`page-item ${currentPage === Math.ceil(filteredFaqs.length / rowsPerPage) ? "disabled" : ""}`}
                           >
                              <button
                                 onClick={() => paginateFaqs(currentPage + 1)}
                                 className="page-link"
                                 disabled={currentPage === Math.ceil(filteredFaqs.length / rowsPerPage)}
                              >
                                 Next
                              </button>
                           </li>
                           <li
                              className={`page-item ${currentPage === Math.ceil(filteredFaqs.length / rowsPerPage) ? "disabled" : ""}`}
                           >
                              <button
                                 onClick={() => paginateFaqs(Math.ceil(filteredFaqs.length / rowsPerPage))}
                                 className="page-link"
                                 disabled={currentPage === Math.ceil(filteredFaqs.length / rowsPerPage)}
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

export default UserFAQs;
