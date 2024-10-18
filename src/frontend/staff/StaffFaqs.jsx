import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import StaffSidebar from '../components/StaffSidebar';
import StaffToolbar from '../components/StaffToolbar';
import globalVariable from '/src/backend/data/GlobalVariable';

const StaffFaqs = () => {
   const [question, setQuestion] = useState('');
   const [answer, setAnswer] = useState('');
   const [message, setMessage] = useState('');

   const handleSubmit = async (e) => {
      e.preventDefault();

      const faqData = {
         question,
         answer,
         created_by: globalVariable.getUserData().user_id,
      };

      try {
         const response = await fetch('http://localhost/stock-nyu/src/backend/api/CreateFaqs.php', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(faqData),
         });

         const result = await response.json();

         if (response.ok) {
            setMessage('FAQ added successfully');
            setQuestion('');
            setAnswer('');
         } else {
            setMessage(result.message || 'Failed to add FAQ');
         }
      } catch (error) {
         setMessage('Failed to add FAQ');
      }
   };

   return (
      <>
         <StaffToolbar />
         <div className="container-fluid" style={{ paddingTop: '100px' , marginLeft:'-100px'}}>
            <div className="row">
               <div className="col-md-3">
                  <StaffSidebar />
               </div>
               <div className="col-md-9">
                  <div className="container mt-4">
                     <h1 className="text-center">Add FAQ</h1>
                     {message && <div className="alert alert-info">{message}</div>}
                     <form onSubmit={handleSubmit}>
                        <div className="form-group">
                           <label htmlFor="question">Question</label>
                           <input
                              type="text"
                              className="form-control"
                              id="question"
                              value={question}
                              onChange={(e) => setQuestion(e.target.value)}
                              required
                           />
                        </div>
                        <div className="form-group">
                           <label htmlFor="answer">Answer</label>
                           <textarea
                              className="form-control"
                              id="answer"
                              value={answer}
                              onChange={(e) => setAnswer(e.target.value)}
                              required
                           ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary btn-block">
                           Add FAQ
                        </button>
                     </form>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default StaffFaqs;
