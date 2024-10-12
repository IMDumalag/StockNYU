import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import StaffSidebar from '../components/StaffSidebar';
import StaffToolbar from '../components/StaffToolbar';
import globalVariable from '/src/backend/data/GlobalVariable';  // Import global variable

const StaffAnnouncement = () => {
   const [announcementText, setAnnouncementText] = useState('');
   const [announcementImf, setAnnouncementImf] = useState('');
   const [message, setMessage] = useState('');

   const handleSubmit = async (e) => {
      e.preventDefault();

      const announcementData = {
         announcement_text: announcementText,
         announcement_imf: announcementImf,
         created_by: globalVariable.getUserData().user_id,  // Fetching user_id from GlobalVariable
      };

      try {
         const response = await fetch('http://localhost/stock-nyu/src/backend/api/CreateAnnouncement.php', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(announcementData),
         });

         const result = await response.json();

         if (response.ok) {
            setMessage('Announcement added successfully');
            setAnnouncementText('');
            setAnnouncementImf('');
         } else {
            setMessage(result.message || 'Failed to add announcement');
         }
      } catch (error) {
         setMessage('Failed to add announcement');
      }
   };

   return (
      <>
         <StaffToolbar />
         <div className="container-fluid">
            <div className="row">
               <div className="col-md-3">
                  <StaffSidebar />
               </div>
               <div className="col-md-9">
                  <div className="container mt-4">
                     <h1>Add Announcement</h1>
                     {message && <div className="alert alert-info">{message}</div>}
                     <form onSubmit={handleSubmit}>
                        <div className="form-group">
                           <label htmlFor="announcementText">Announcement Text</label>
                           <input
                              type="text"
                              className="form-control"
                              id="announcementText"
                              value={announcementText}
                              onChange={(e) => setAnnouncementText(e.target.value)}
                              required
                           />
                        </div>
                        <div className="form-group">
                           <label htmlFor="announcementImf">Announcement IMF</label>
                           <textarea
                              className="form-control"
                              id="announcementImf"
                              value={announcementImf}
                              onChange={(e) => setAnnouncementImf(e.target.value)}
                              required
                           ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">
                           Add Announcement
                        </button>
                     </form>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default StaffAnnouncement;