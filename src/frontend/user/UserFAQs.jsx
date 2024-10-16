import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Typography, Box, Grid, List, ListItem, ListItemText } from '@mui/material';
import UserSidebar from '../components/UserSidebar';
import UserToolbar from '../components/UserToolbar';
import './UserFAQs.css';

const UserFAQs = () => {
    const [faqs, setFaqs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

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

    const filteredFaqs = faqs.filter(faq => {
        const regex = new RegExp(searchTerm, 'i'); // 'i' makes it case-insensitive
        return regex.test(faq.question) || regex.test(faq.answer);
    });

    return (
        <>
            <UserToolbar />
            <div className="container-fluid faq-container">
                <div className="row">
                    <div className="col-md-3 sidebar-column">
                        <UserSidebar />
                    </div>
                    <div className="col-md-9 content-column">
                        <Container>
                            <Box className="faq-header">
                                <Typography variant="h3">FAQ</Typography>
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
                            <Grid container spacing={3} className="faq-category-container">
                                <Grid item xs={12} md={6}>
                                    <Box className="faq-category">
                                        <Typography variant="h5">Getting Started</Typography>
                                        <List>
                                            <ListItem className="faq-list-item">
                                                <ListItemText primary="How to use?" />
                                            </ListItem>
                                            <ListItem className="faq-list-item">
                                                <ListItemText primary="How do I make reservation?" />
                                            </ListItem>
                                            <ListItem className="faq-list-item">
                                                <ListItemText primary="What is StockNYU?" />
                                            </ListItem>
                                        </List>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Box className="faq-category">
                                        <Typography variant="h5">Accept pending reservation</Typography>
                                        <List>
                                            <ListItem className="faq-list-item">
                                                <ListItemText primary="How do I know if my order is confirmed?" />
                                            </ListItem>
                                            <ListItem className="faq-list-item">
                                                <ListItemText primary="Can I cancel or modify my reservation?" />
                                            </ListItem>
                                            <ListItem className="faq-list-item">
                                                <ListItemText primary="What happens if I don't receive a confirmation email?" />
                                            </ListItem>
                                        </List>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Box className="faq-category">
                                        <Typography variant="h5">Accounts</Typography>
                                        <List>
                                            <ListItem className="faq-list-item">
                                                <ListItemText primary="Can I make a reservation without creating an account?" />
                                            </ListItem>
                                            <ListItem className="faq-list-item">
                                                <ListItemText primary="How to create an account in StockNYU?" />
                                            </ListItem>
                                        </List>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Box className="faq-category">
                                        <Typography variant="h5">Others</Typography>
                                        <List>
                                            <ListItem className="faq-list-item">
                                                <ListItemText primary="Where can I reserve my items?" />
                                            </ListItem>
                                            <ListItem className="faq-list-item">
                                                <ListItemText primary="Adding item not working?" />
                                            </ListItem>
                                            <ListItem className="faq-list-item">
                                                <ListItemText primary="Where can I discuss tips and techniques with others?" />
                                            </ListItem>
                                        </List>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Container>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserFAQs;