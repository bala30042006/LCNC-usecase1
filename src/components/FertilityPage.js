import React, { useState } from 'react';

// Fertility Page Component - Main fertility module with card navigation
const FertilityPage = () => {
  const [selectedAction, setSelectedAction] = useState('');

  const handleActionClick = (action) => {
    setSelectedAction(action);
    // Store selected action in localStorage for navigation
    localStorage.setItem('fertilityAction', action);
    // Navigate using hash-based routing (consistent with your app)
    window.location.hash = `#fertility-${action}`;
  };

  return (
    <div className="fertility-container">
      <h1>Fertility Module</h1>

      <div className="card-container">
        <div
          className="card"
          onClick={() => window.location.hash = '#fertility-create'}
        >
          <h3>Create Fertility Form</h3>
          <p>Build fertility form using drag and drop</p>
        </div>

        <div
          className="card"
          onClick={() => window.location.hash = '#fertility-fill'}
        >
          <h3>Fill Fertility Form</h3>
          <p>Fill fertility details for patient</p>
        </div>

        <div
          className="card"
          onClick={() => window.location.hash = '#fertility-template'}
        >
          <h3>Edit Template</h3>
          <p>Customize fertility form template</p>
        </div>
      </div>
    </div>
  );
};

export default FertilityPage;
