import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Modal, Box, Pagination } from '@mui/material';
import StaffSidebar from '../components/StaffSidebar';
import StaffToolbar from '../components/StaffToolbar';

const StaffAnalytics = () => {
   const [mostReservedItems, setMostReservedItems] = useState([]);
   const [mostCancelledItems, setMostCancelledItems] = useState([]);
   const [usersWithMostReservations, setUsersWithMostReservations] = useState([]);
   const [usersWithMostCancelledReservations, setUsersWithMostCancelledReservations] = useState([]);
   const [showReservedModal, setShowReservedModal] = useState(false);
   const [showCancelledModal, setShowCancelledModal] = useState(false);
   const [showUserReservationsModal, setShowUserReservationsModal] = useState(false);
   const [showUserCancelledReservationsModal, setShowUserCancelledReservationsModal] = useState(false);
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 5;

   useEffect(() => {
      fetchMostReservedItems();
      fetchMostCancelledItems();
      fetchUsersWithMostReservations();
      fetchUsersWithMostCancelledReservations();
   }, []);

   const fetchMostReservedItems = async () => {
      try {
         const response = await fetch('http://localhost/stock-nyu/src/backend/api/AnalyticsMostReservedItem.php');
         const data = await response.json();
         if (data.status === 200) {
            setMostReservedItems(data.most_reserved_items);
         }
      } catch (error) {
         console.error('Error fetching most reserved items:', error);
      }
   };

   const fetchMostCancelledItems = async () => {
      try {
         const response = await fetch('http://localhost/stock-nyu/src/backend/api/AnalyticsMostItemReservationCancelled.php');
         const data = await response.json();
         if (data.status === 200) {
            setMostCancelledItems(data.most_cancelled_items);
         }
      } catch (error) {
         console.error('Error fetching most cancelled items:', error);
      }
   };

   const fetchUsersWithMostReservations = async () => {
      try {
         const response = await fetch('http://localhost/stock-nyu/src/backend/api/AnalyticsUserItemReservation.php');
         const data = await response.json();
         if (data.status === 200) {
            setUsersWithMostReservations(data.users_with_most_reservations);
         }
      } catch (error) {
         console.error('Error fetching users with most reservations:', error);
      }
   };

   const fetchUsersWithMostCancelledReservations = async () => {
      try {
         const response = await fetch('http://localhost/stock-nyu/src/backend/api/AnalyticsMostUserItemCancellation.php');
         const data = await response.json();
         if (data.status === 200) {
            setUsersWithMostCancelledReservations(data.users_with_most_cancelled_reservations);
         }
      } catch (error) {
         console.error('Error fetching users with most cancelled reservations:', error);
      }
   };

   const handleReservedCardClick = () => {
      setShowReservedModal(true);
   };

   const handleCancelledCardClick = () => {
      setShowCancelledModal(true);
   };

   const handleUserReservationsCardClick = () => {
      setShowUserReservationsModal(true);
   };

   const handleUserCancelledReservationsCardClick = () => {
      setShowUserCancelledReservationsModal(true);
   };

   const handleCloseReservedModal = () => {
      setShowReservedModal(false);
   };

   const handleCloseCancelledModal = () => {
      setShowCancelledModal(false);
   };

   const handleCloseUserReservationsModal = () => {
      setShowUserReservationsModal(false);
   };

   const handleCloseUserCancelledReservationsModal = () => {
      setShowUserCancelledReservationsModal(false);
   };

   const paginate = (event, pageNumber) => {
      setCurrentPage(pageNumber);
   };

   const currentReservedItems = mostReservedItems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
   );

   const currentCancelledItems = mostCancelledItems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
   );

   const currentUserReservations = usersWithMostReservations.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
   );

   const currentUserCancelledReservations = usersWithMostCancelledReservations.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
   );

   return (
      <>
         <StaffToolbar />
         <StaffSidebar />
         <div className="scroll-container" style={{ overflowY: 'scroll', maxHeight: '100%' }}>
         <Box sx={{ flexGrow: 1, p: 3 }} style={{ paddingTop: '100px', marginLeft: '300px', marginRight: '100px' }}>
            <Grid container spacing={3}>
               {mostReservedItems.length > 0 && (
                  <Grid item xs={12}>
                     <Card onClick={handleReservedCardClick} sx={{ transition: '0.3s', '&:hover': { transform: 'scale(1.02)' }, boxShadow: 3 }}>
                        <CardContent>
                           <Typography variant="h5" fontWeight="bold">
                              Top Reserved Item
                           </Typography>
                           <Typography variant="h6" color="textSecondary">
                              {mostReservedItems[0].item_name}
                           </Typography>
                           <Typography variant="body2">
                              Reservations: {mostReservedItems[0].reservation_count}
                           </Typography>
                        </CardContent>
                     </Card>
                  </Grid>
               )}

               {mostCancelledItems.length > 0 && (
                  <Grid item xs={12}>
                     <Card onClick={handleCancelledCardClick} sx={{ transition: '0.3s', '&:hover': { transform: 'scale(1.02)' }, boxShadow: 3 }}>
                        <CardContent>
                           <Typography variant="h5" fontWeight="bold">
                              Top Cancelled Item
                           </Typography>
                           <Typography variant="h6" color="textSecondary">
                              {mostCancelledItems[0].item_name}
                           </Typography>
                           <Typography variant="body2">
                              Cancellations: {mostCancelledItems[0].cancellation_count}
                           </Typography>
                        </CardContent>
                     </Card>
                  </Grid>
               )}

               {usersWithMostReservations.length > 0 && (
                  <Grid item xs={12}>
                     <Card onClick={handleUserReservationsCardClick} sx={{ transition: '0.3s', '&:hover': { transform: 'scale(1.02)' }, boxShadow: 3 }}>
                        <CardContent>
                           <Typography variant="h5" fontWeight="bold">
                              Top User Reservations
                           </Typography>
                           <Typography variant="h6" color="textSecondary">
                              {usersWithMostReservations[0].f_name} {usersWithMostReservations[0].l_name}
                           </Typography>
                           <Typography variant="body2">
                              Reservations: {usersWithMostReservations[0].reservation_count}
                           </Typography>
                        </CardContent>
                     </Card>
                  </Grid>
               )}

               {usersWithMostCancelledReservations.length > 0 && (
                  <Grid item xs={12}>
                     <Card onClick={handleUserCancelledReservationsCardClick} sx={{ transition: '0.3s', '&:hover': { transform: 'scale(1.02)' }, boxShadow: 3 }}>
                        <CardContent>
                           <Typography variant="h5" fontWeight="bold">
                              Top User Cancellations
                           </Typography>
                           <Typography variant="h6" color="textSecondary">
                              {usersWithMostCancelledReservations[0].f_name} {usersWithMostCancelledReservations[0].l_name}
                           </Typography>
                           <Typography variant="body2">
                              Cancellations: {usersWithMostCancelledReservations[0].reservation_count}
                           </Typography>
                        </CardContent>
                     </Card>
                  </Grid>
               )}
            </Grid>

            {/* Modal for Most Reserved Items */}
            <Modal open={showReservedModal} onClose={handleCloseReservedModal}>
               <Box sx={{ p: 4, backgroundColor: 'white', margin: 'auto', marginTop: '10%', width: { xs: '90%', md: '50%' }, borderRadius: 2, boxShadow: 24, overflowY: 'auto', maxHeight: '80vh' }}>
                  <Typography variant="h6" gutterBottom>
                     Most Reserved Items
                  </Typography>
                  {currentReservedItems.map((item, index) => (
                     <Card key={index} sx={{ mb: 2, boxShadow: 2 }}>
                        <CardContent>
                           <Typography variant="h6">{item.item_name}</Typography>
                           <Typography variant="body2">Reservations: {item.reservation_count}</Typography>
                        </CardContent>
                     </Card>
                  ))}

                  <Pagination
                     count={Math.ceil(mostReservedItems.length / itemsPerPage)}
                     page={currentPage}
                     onChange={paginate}
                     sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}
                  />
               </Box>
            </Modal>

            {/* Modal for Most Cancelled Items */}
            <Modal open={showCancelledModal} onClose={handleCloseCancelledModal}>
               <Box sx={{ p: 4, backgroundColor: 'white', margin: 'auto', marginTop: '10%', width: { xs: '90%', md: '50%' }, borderRadius: 2, boxShadow: 24, overflowY: 'auto', maxHeight: '80vh' }}>
                  <Typography variant="h6" gutterBottom>
                     Most Cancelled Items
                  </Typography>
                  {currentCancelledItems.map((item, index) => (
                     <Card key={index} sx={{ mb: 2, boxShadow: 2 }}>
                        <CardContent>
                           <Typography variant="h6">{item.item_name}</Typography>
                           <Typography variant="body2">Cancellations: {item.cancellation_count}</Typography>
                        </CardContent>
                     </Card>
                  ))}

                  <Pagination
                     count={Math.ceil(mostCancelledItems.length / itemsPerPage)}
                     page={currentPage}
                     onChange={paginate}
                     sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}
                  />
               </Box>
            </Modal>

            {/* Modal for Users with Most Reservations */}
            <Modal open={showUserReservationsModal} onClose={handleCloseUserReservationsModal}>
               <Box sx={{ p: 4, backgroundColor: 'white', margin: 'auto', marginTop: '10%', width: { xs: '90%', md: '50%' }, borderRadius: 2, boxShadow: 24, overflowY: 'auto', maxHeight: '80vh' }}>
                  <Typography variant="h6" gutterBottom>
                     Users with Most Reservations
                  </Typography>
                  {currentUserReservations.map((user, index) => (
                     <Card key={index} sx={{ mb: 2, boxShadow: 2 }}>
                        <CardContent>
                           <Typography variant="h6">{user.f_name} {user.l_name}</Typography>
                           <Typography variant="body2">Reservations: {user.reservation_count}</Typography>
                        </CardContent>
                     </Card>
                  ))}

                  <Pagination
                     count={Math.ceil(usersWithMostReservations.length / itemsPerPage)}
                     page={currentPage}
                     onChange={paginate}
                     sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}
                  />
               </Box>
            </Modal>

            {/* Modal for Users with Most Cancelled Reservations */}
            <Modal open={showUserCancelledReservationsModal} onClose={handleCloseUserCancelledReservationsModal}>
               <Box sx={{ p: 4, backgroundColor: 'white', margin: 'auto', marginTop: '10%', width: { xs: '90%', md: '50%' }, borderRadius: 2, boxShadow: 24, overflowY: 'auto', maxHeight: '80vh' }}>
                  <Typography variant="h6" gutterBottom>
                     Users with Most Cancelled Reservations
                  </Typography>
                  {currentUserCancelledReservations.map((user, index) => (
                     <Card key={index} sx={{ mb: 2, boxShadow: 2 }}>
                        <CardContent>
                           <Typography variant="h6">{user.f_name} {user.l_name}</Typography>
                           <Typography variant="body2">Cancellations: {user.reservation_count}</Typography>
                        </CardContent>
                     </Card>
                  ))}

                  <Pagination
                     count={Math.ceil(usersWithMostCancelledReservations.length / itemsPerPage)}
                     page={currentPage}
                     onChange={paginate}
                     sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}
                  />
               </Box>
            </Modal>
         </Box>
         </div>
      </>
   );
};

export default StaffAnalytics;