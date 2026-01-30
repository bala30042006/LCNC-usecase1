import React, { useState, useEffect } from 'react';

// Data Entry Page Component - For entering patient data based on saved report structure
const DataEntryPage = () => {
  const [reportStructure, setReportStructure] = useState([]);
  const [patientData, setPatientData] = useState({});
  const [patientId, setPatientId] = useState('');
  const [savedPatients, setSavedPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Load report structure from localStorage
  useEffect(() => {
    const savedStructure = localStorage.getItem('reportStructure');
    if (savedStructure) {
      try {
        setReportStructure(JSON.parse(savedStructure));
      } catch (error) {
        console.error('Error loading report structure:', error);
      }
    }
  }, []);

  // Load saved patients from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedPatients');
    if (saved) {
      try {
        setSavedPatients(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved patients:', error);
      }
    }
  }, []);

  // Initialize form data when structure loads
  useEffect(() => {
    if (reportStructure.length > 0) {
      const initialData = {};
      reportStructure.forEach(component => {
        initialData[component.id] = '';
      });
      setPatientData(initialData);
    }
  }, [reportStructure]);

  // Handle input changes for form fields
  const handleInputChange = (componentId, value) => {
    setPatientData(prev => ({
      ...prev,
      [componentId]: value
    }));
  };

  // Save patient data to localStorage
  const savePatientData = () => {
    if (!patientId.trim()) {
      alert('Please enter a patient ID');
      return;
    }

    const patientRecord = {
      id: patientId,
      data: patientData,
      timestamp: new Date().toISOString(),
      structure: reportStructure
    };

    // Update existing patient or add new one
    const updatedPatients = savedPatients.filter(p => p.id !== patientId);
    updatedPatients.push(patientRecord);
    
    localStorage.setItem('savedPatients', JSON.stringify(updatedPatients));
    setSavedPatients(updatedPatients);
    
    alert(`Patient data saved successfully for ID: ${patientId}`);
    
    // Clear form
    setPatientId('');
    const clearedData = {};
    reportStructure.forEach(component => {
      clearedData[component.id] = '';
    });
    setPatientData(clearedData);
    setSelectedPatient(null);
  };

  // Load patient data for editing
  const loadPatientData = (patient) => {
    setPatientId(patient.id);
    setPatientData(patient.data);
    setSelectedPatient(patient);
  };

  // Delete patient record
  const deletePatient = (patientId) => {
    if (confirm('Are you sure you want to delete this patient record?')) {
      const updatedPatients = savedPatients.filter(p => p.id !== patientId);
      localStorage.setItem('savedPatients', JSON.stringify(updatedPatients));
      setSavedPatients(updatedPatients);
      
      if (selectedPatient?.id === patientId) {
        setPatientId('');
        const clearedData = {};
        reportStructure.forEach(component => {
          clearedData[component.id] = '';
        });
        setPatientData(clearedData);
        setSelectedPatient(null);
      }
    }
  };

  // If no report structure exists, show message
  if (reportStructure.length === 0) {
    return (
      <div className="data-entry-container">
        <div className="empty-state">
          <h3>No Report Structure Found</h3>
          <p>Please go to the Builder page first to create a report structure.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="data-entry-container">
      <h2>Patient Data Entry</h2>
      
      {/* Patient ID Input */}
      <div className="form-group">
        <label htmlFor="patientId">Patient ID *</label>
        <input
          type="text"
          id="patientId"
          className="form-input"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          placeholder="Enter unique patient ID (e.g., P001)"
        />
      </div>

      {/* Dynamic Form Fields */}
      {reportStructure.map((component) => (
        <div key={component.id} className="form-group">
          <label htmlFor={component.id}>
            {component.editableLabel}
          </label>
          
          {component.type === 'text' && (
            <input
              type="text"
              id={component.id}
              className="form-input"
              value={patientData[component.id] || ''}
              onChange={(e) => handleInputChange(component.id, e.target.value)}
              placeholder={`Enter ${component.editableLabel.toLowerCase()}`}
            />
          )}
          
          {component.type === 'textarea' && (
            <textarea
              id={component.id}
              className="form-textarea"
              value={patientData[component.id] || ''}
              onChange={(e) => handleInputChange(component.id, e.target.value)}
              placeholder={`Enter ${component.editableLabel.toLowerCase()}`}
            />
          )}
          
          {component.type === 'date' && (
            <input
              type="date"
              id={component.id}
              className="form-date"
              value={patientData[component.id] || ''}
              onChange={(e) => handleInputChange(component.id, e.target.value)}
            />
          )}
          
          {component.type === 'dropdown' && (
            <select
              id={component.id}
              className="form-select"
              value={patientData[component.id] || ''}
              onChange={(e) => handleInputChange(component.id, e.target.value)}
            >
              <option value="">Select an option</option>
              {component.options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
        </div>
      ))}

      {/* Save Button */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <button className="btn btn-success" onClick={savePatientData}>
          Save Patient Data
        </button>
        {selectedPatient && (
          <button 
            className="btn btn-secondary" 
            onClick={() => {
              setPatientId('');
              const clearedData = {};
              reportStructure.forEach(component => {
                clearedData[component.id] = '';
              });
              setPatientData(clearedData);
              setSelectedPatient(null);
            }}
          >
            Clear Form
          </button>
        )}
      </div>

      {/* Saved Patients List */}
      {savedPatients.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          <h3>Saved Patients ({savedPatients.length})</h3>
          <div style={{ marginTop: '1rem' }}>
            {savedPatients.map((patient) => (
              <div
                key={patient.id}
                style={{
                  background: '#f8f9fa',
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                  padding: '1rem',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <strong>ID: {patient.id}</strong>
                  <br />
                  <small style={{ color: '#6c757d' }}>
                    Saved: {new Date(patient.timestamp).toLocaleString()}
                  </small>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                    onClick={() => loadPatientData(patient)}
                  >
                    Load
                  </button>
                  <button
                    className="remove-btn"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                    onClick={() => deletePatient(patient.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataEntryPage;
