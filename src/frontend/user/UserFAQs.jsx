import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, TextField, Typography, Accordion, AccordionSummary, AccordionDetails, Box,
  Pagination, Paper, Grid, IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import UserSidebar from '../components/UserSidebar';
import UserToolbar from '../components/UserToolbar';
import './UserFAQs.css';

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
      setFaqs(response.data.faqs || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      setFaqs([]);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const paginateFaqs = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filteredFaqs = faqs.filter(faq => {
    const regex = new RegExp(searchTerm, 'i');
    return regex.test(faq.question) || regex.test(faq.answer);
  });

  const paginatedFaqs = filteredFaqs.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <>
      <UserToolbar />
      <div className="container-fluid faq-container">
        <div className="row">
          <div className="col-md-3 sidebar-column">
            <UserSidebar />
          </div>
          <div className="col-md-9 content-column">
            <Container style={{marginTop:'100px'}}>
              <Box className="faq-header">
                <Typography variant="h3" color="primary" className="faq-title">Frequently Asked Questions</Typography>
                <Box className="faq-search-bar">
                  <TextField 
                    variant="outlined"
                    placeholder="How do we help?"
                    fullWidth
                    value={searchTerm}
                    onChange={handleSearch}
                    InputProps={{
                      className: 'faq-search-bar-input'
                    }}
                  />
                </Box>
              </Box>

              <Box className="faq-content">
                {paginatedFaqs.length > 0 ? (
                  paginatedFaqs.map((faq) => (
                    <Accordion key={faq.faq_id} className="faq-accordion">
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">{faq.question}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body1" className="faq-answer">{faq.answer}</Typography>
                        <Box className="faq-meta">
                          <Typography variant="body2">Created by: {`${faq.f_name} ${faq.l_name}`}</Typography>
                          <Typography variant="body2">{new Date(faq.created_date).toLocaleString()}</Typography>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  ))
                ) : (
                  <Typography variant="body1" color="textSecondary">No FAQs available at the moment.</Typography>
                )}
              </Box>

              {/* Pagination */}
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                  count={Math.ceil(filteredFaqs.length / rowsPerPage)}
                  page={currentPage}
                  onChange={(event, value) => paginateFaqs(value)}
                  color="primary"
                  style={{width: '1000px'}}
                />
              </Box>
            </Container>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserFAQs;
