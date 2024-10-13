import React from 'react';
import { useNavigate } from 'react-router-dom';
import StaffSidebar from '../components/StaffSidebar';
import StaffToolbar from '../components/StaffToolbar';
import { Button } from 'react-bootstrap';
import './styles.css';

const StaffFaqsAndAnnouncement = () => {
   const navigate = useNavigate();

   const navigateToFaqs = () => {
      navigate('/login/staff_faqs');
   };

   const navigateToAnnouncements = () => {
      navigate('/login/staff_announcement');
   };

   return (
      <>
         <StaffToolbar />
         <div className="container-fluid custom-margin-top-2">
            <div className="row">
               <div className="col-md-3">
                  <StaffSidebar />
               </div>
               <div className="col-md-9">
                  <div className="container mt-5">
                     <h2 className="mb-4">FAQs and Announcements</h2>
                     <Button variant="primary" onClick={navigateToFaqs} className="mr-3">
                        Go to FAQs
                     </Button>
                     <Button variant="secondary" onClick={navigateToAnnouncements}>
                        Go to Announcements
                     </Button>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default StaffFaqsAndAnnouncement;