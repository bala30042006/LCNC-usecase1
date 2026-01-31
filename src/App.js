import React, { useState, useEffect } from 'react';
import './App.css';
import './Fertility.css';

// Import components
import PatientDetailsPage from './components/PatientDetailsPage';
import PatientProfilePage from './components/PatientProfilePage';
import ReportGenerationPage from './components/ReportGenerationPage';
import ReportPreviewPage from './components/ReportPreviewPage';
import FertilityPage from './components/FertilityPage';
import FertilityCreatePage from './components/FertilityCreatePage';
import FertilityFillPage from './components/FertilityFillFormPage';
import FertilityTemplateEditor from './components/FertilityTemplateEditor';

// Main App component with navigation matching the workflow
function App() {
  const [currentPage, setCurrentPage] = useState('patient-details');

  // Handle hash-based navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'patient-details';
      setCurrentPage(hash);
    };

    // Set initial page based on hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Navigation component with sidebar matching the images
  const Navigation = () => (
    <nav className="nav">
      <div style={{ 
        background: '#2c3e50', 
        padding: '1rem',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        textAlign: 'center',
        marginBottom: '1rem'
      }}>
        I.N.H.M.S
      </div>
      <div className="nav-links">

        <a 
          href="#patient-details"
          className={`nav-link ${currentPage === 'patient-details' ? 'active' : ''}`}
        >
          👥 Patient Details
        </a>
        <a 
          href="#patient-profile"
          className={`nav-link ${currentPage === 'patient-profile' ? 'active' : ''}`}
        >
          📋 Patient Profile
        </a>
        <a 
          href="#report-generation"
          className={`nav-link ${currentPage === 'report-generation' ? 'active' : ''}`}
        >
          📝 Patient Reports
        </a>
        <a 
          href="#report-preview"
          className={`nav-link ${currentPage === 'report-preview' ? 'active' : ''}`}
        >
          📄 Report Preview
        </a>

        <a 
          href="#fertility"
          className={`nav-link ${currentPage === 'fertility' ? 'active' : ''}`}
        >
          🍼 Fertility
        </a>

      </div>
    </nav>
  );

  // Main layout with sidebar
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar Navigation */}
      <div style={{ 
        width: '250px', 
        background: '#2c3e50',
        boxShadow: '2px 0 4px rgba(0,0,0,0.1)',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto'
      }}>
        <Navigation />
      </div>

      {/* Main Content Area */}
      <div style={{ 
        marginLeft: '250px', 
        flex: 1,
        background: '#f5f5f5',
        minHeight: '100vh'
      }}>
        <div className="container">
          {currentPage === 'patient-details' && <PatientDetailsPage />}
          {currentPage === 'patient-profile' && <PatientProfilePage />}
          {currentPage === 'report-generation' && <ReportGenerationPage />}
          {currentPage === 'report-preview' && <ReportPreviewPage />}
          
          {/* Placeholder pages for other navigation items */}
          {currentPage === 'dashboard' && (
            <div style={{ padding: '20px' }}>
              <h2>Dashboard</h2>
              <p>Dashboard content would go here.</p>
            </div>
          )}
          {currentPage === 'billing' && (
            <div style={{ padding: '20px' }}>
              <h2>Patient Billing</h2>
              <p>Billing management would go here.</p>
            </div>
          )}
          {currentPage === 'appointment' && (
            <div style={{ padding: '20px' }}>
              <h2>Appointment</h2>
              <p>Appointment scheduling would go here.</p>
            </div>
          )}
          {currentPage === 'users' && (
            <div style={{ padding: '20px' }}>
              <h2>User List</h2>
              <p>User management would go here.</p>
            </div>
          )}
          {currentPage === 'inventory' && (
            <div style={{ padding: '20px' }}>
              <h2>Drug Inventory</h2>
              <p>Inventory management would go here.</p>
            </div>
          )}
          {currentPage === 'inpatient' && (
            <div style={{ padding: '20px' }}>
              <h2>In Patient</h2>
              <p>Inpatient management would go here.</p>
            </div>
          )}
          {currentPage === 'fertility' && <FertilityPage />}
          {currentPage === 'fertility-create' && <FertilityCreatePage />}
          {currentPage === 'fertility-fill' && <FertilityFillPage />}
          {currentPage === 'fertility-template' && <FertilityTemplateEditor />}
          {currentPage === 'reports' && (
            <div style={{ padding: '20px' }}>
              <h2>Reports</h2>
              <p>General reports would go here.</p>
            </div>
          )}
          {currentPage === 'charts' && (
            <div style={{ padding: '20px' }}>
              <h2>Charts</h2>
              <p>Charts and analytics would go here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
