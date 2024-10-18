import React from 'react';
import { useNavigate } from 'react-router-dom';
import StaffSidebar from '../components/StaffSidebar';
import StaffToolbar from '../components/StaffToolbar';
import { Button } from 'react-bootstrap';

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
         <div className="container-fluid" style={{ paddingTop: '100px' }}>
            <div className="row">
               <div className="col-md-3">
                  <StaffSidebar />
               </div>
               <div className="col-md-9">
                  <div className="container mt-5">
                     
                     <div className="d-flex justify-content-center" style={{marginLeft:'-200px'}}>
                        <Button variant="primary" onClick={navigateToFaqs} className="mr-3" size="lg" style={{marginRight:'10px'}}>
                           Go to FAQs
                        </Button>
                        <Button variant="secondary" onClick={navigateToAnnouncements} size="lg">
                           Go to Announcements
                        </Button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default StaffFaqsAndAnnouncement;
