import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import StaffSidebar from '../components/StaffSidebar';
import StaffToolbar from '../components/StaffToolbar';
import globalVariable from '/src/backend/data/GlobalVariable';  // Import global variable

const StaffAnnouncement = () => {
   const [announcementText, setAnnouncementText] = useState('');
   const [announcementImg, setAnnouncementImg] = useState('');
   const [message, setMessage] = useState('');

   const handleSubmit = async (e) => {
      e.preventDefault();

      const announcementData = {
         announcement_text: announcementText,
         announcement_img: announcementImg,
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
            setAnnouncementImg('');
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
         <div className="container-fluid" style={{ paddingTop: '100px', backgroundColor: '#f8f9fa' }}>
            <div className="row">
               <div className="col-md-3">
                  <StaffSidebar />
               </div>
               <div className="col-md-9">
                  <div className="container mt-4">
                     <h1 className="text-primary">Add Announcement</h1>
                     {message && <div className="alert alert-info">{message}</div>}
                     <div className="row">
                        <div className="col-md-6">
                           <form onSubmit={handleSubmit} className="p-3 border rounded" style={{ backgroundColor: '#ffffff' }}>
                              <div className="form-group">
                                 <label htmlFor="announcementText">Announcement Text</label>
                                 <input
                                    type="text"
                                    className="form-control"
                                    id="announcementText"
                                    value={announcementText}
                                    onChange={(e) => {
                                       setAnnouncementText(e.target.value);
                                    }}
                                    required
                                 />
                              </div>
                              <div className="form-group">
                                 <label htmlFor="announcementImg">Announcement Image URL</label>
                                 <input
                                    type="text"
                                    className="form-control"
                                    id="announcementImg"
                                    value={announcementImg}
                                    onChange={(e) => {
                                       setAnnouncementImg(e.target.value);
                                    }}
                                    required
                                 />
                              </div>
                              <button type="submit" className="btn btn-primary mt-3">
                                 Add Announcement
                              </button>
                           </form>
                        </div>
                        <div className="col-md-6">
                           <h2 className="text-secondary">Preview</h2>
                           <div
                              className="card"
                              style={{
                                 width: '575px',
                                 height: '400px',
                                 background: 'rgba(255, 255, 255, 0.15)',
                                 backdropFilter: 'blur(10px)',
                                 borderRadius: '10px',
                                 textAlign: 'center',
                                 padding: '20px',
                                 cursor: 'pointer',
                                 transition: 'transform 0.3s ease-in-out',
                                 boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                              }}
                           >
                              {announcementImg && (
                                 <div
                                    className="img-container"
                                    style={{
                                       display: 'flex',
                                       justifyContent: 'center',
                                       width: '575px',
                                       height: '200px',
                                       backgroundColor: 'red',
                                       borderTopLeftRadius: '10px',
                                       borderTopRightRadius: '10px',
                                    }}
                                 >
                                    <img
                                       src={announcementImg}
                                       className="card-img-top"
                                       alt="Announcement"
                                       style={{
                                          width: '100%',
                                          height: '100%',
                                          borderTopLeftRadius: '10px',
                                          borderTopRightRadius: '10px',
                                       }}
                                    />
                                 </div>
                              )}
                              <div className="card-body">
                                 <p style={{ color: 'black', fontWeight: 'bold' }}>{announcementText}</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default StaffAnnouncement;