import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TextField, Container, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Sidebar from "../components/UserSidebar";
import Toolbar from "../components/UserToolbar";

const UserFAQs = () => {
   const [faqs, setFaqs] = useState([]);
   const [searchTerm, setSearchTerm] = useState('');

   useEffect(() => {
      fetchFaqs();
   }, []);

   const fetchFaqs = async () => {
      try {
         const response = await axios.get('http://localhost/stock-nyu/src/backend/api/ReadFaqsList.php');
         setFaqs(response.data);
      } catch (error) {
         console.error('Error fetching FAQs:', error);
      }
   };

   const handleSearch = (event) => {
      setSearchTerm(event.target.value);
   };

   const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
   };

   const filteredFaqs = faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase())
   );

   return (
      <>
         <Toolbar />
         <div className="container-fluid">
            <div className="row">
               <div className="col-md-3">
                  <Sidebar />
               </div>
               <div className="col-md-9">
                  <Container>
                     <h1 className="text-center my-4">Frequently Asked Questions</h1>

                     <TextField
                        variant="outlined"
                        label="Search by question"
                        fullWidth
                        value={searchTerm}
                        onChange={handleSearch}
                        className="mb-4"
                     />

                     {filteredFaqs.length > 0 ? (
                        <div className="faq-feed">
                           {filteredFaqs.map(faq => (
                              <Accordion key={faq.faq_id} className="mb-3">
                                 <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography>{faq.question}</Typography>
                                 </AccordionSummary>
                                 <AccordionDetails>
                                    <Typography>{faq.answer}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                       <strong>Created by:</strong> {faq.f_name} {faq.l_name}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                       <strong>Date:</strong> {formatDate(faq.created_date)} {new Date(faq.created_date).toLocaleTimeString()}
                                    </Typography>
                                 </AccordionDetails>
                              </Accordion>
                           ))}
                        </div>
                     ) : (
                        <Typography variant="body1" className="text-center mt-4">
                           No FAQs found.
                        </Typography>
                     )}
                  </Container>
               </div>
            </div>
         </div>
      </>
   );
};

export default UserFAQs;
