import React from 'react';
import './FAQ.css';  // Separate FAQ styles

const FAQ = () => {
  return (
    <div className="faq-container container">
      <h2 className="text-center mb-4">
        Frequently Asked <strong>Questions</strong>
      </h2>
      <div className="row">
        <div className="col-md-6">
          <div className="accordion" id="faqAccordion1">
            <div className="accordion-item">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq1"
                aria-expanded="false"
                aria-controls="faq1"
              >
                How do you handle security and privacy?
              </button>
              <div id="faq1" className="accordion-collapse collapse" aria-labelledby="faq1" data-bs-parent="#faqAccordion1">
                <div className="accordion-body">
                  We ensure that all user data is securely stored and managed with encryption.
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq2"
                aria-expanded="false"
                aria-controls="faq2"
              >
                Is there a limit to the number of messages I can send?
              </button>
              <div id="faq2" className="accordion-collapse collapse" aria-labelledby="faq2" data-bs-parent="#faqAccordion1">
                <div className="accordion-body">
                  No, you can send unlimited messages with our service.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="accordion" id="faqAccordion2">
            <div className="accordion-item">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq3"
                aria-expanded="false"
                aria-controls="faq3"
              >
                Can I send attachments?
              </button>
              <div id="faq3" className="accordion-collapse collapse" aria-labelledby="faq3" data-bs-parent="#faqAccordion2">
                <div className="accordion-body">
                  Yes, you can send attachments using our platform.
                </div>
              </div>
            </div>
            {/* Add other FAQ items here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
