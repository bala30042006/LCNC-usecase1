import React, { useState, useEffect } from 'react';

// Fertility Fill Page - Fill fertility forms for patients
const FertilityFillPage = () => {
  const [formStructure, setFormStructure] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [formData, setFormData] = useState({});
  const [savedFertilityRecords, setSavedFertilityRecords] = useState([]);

  // Load fertility form structure from localStorage
  useEffect(() => {
    const savedStructure = localStorage.getItem('fertilityFormStructure');
    if (savedStructure) {
      try {
        setFormStructure(JSON.parse(savedStructure));
      } catch (error) {
        console.error('Error loading form structure:', error);
      }
    }
  }, []);

  // Load patients from localStorage
  useEffect(() => {
    const savedPatients = localStorage.getItem('patients');
    if (savedPatients) {
      try {
        setPatients(JSON.parse(savedPatients));
      } catch (error) {
        console.error('Error loading patients:', error);
      }
    }
  }, []);

  // Load saved fertility records
  useEffect(() => {
    const savedRecords = localStorage.getItem('fertilityRecords');
    if (savedRecords) {
      try {
        setSavedFertilityRecords(JSON.parse(savedRecords));
      } catch (error) {
        console.error('Error loading fertility records:', error);
      }
    }
  }, []);

  // Initialize form data when structure loads
  useEffect(() => {
    if (formStructure.length > 0) {
      const initialData = {};
      formStructure.forEach(component => {
        initialData[component.id] = '';
      });
      setFormData(initialData);
    }
  }, [formStructure]);

  // Handle input changes for form fields
  const handleInputChange = (componentId, value) => {
    setFormData(prev => ({
      ...prev,
      [componentId]: value
    }));
  };

  // Handle patient selection
  const handlePatientSelect = (patientId) => {
    setSelectedPatient(patientId);
    // Clear form when changing patient
    const clearedData = {};
    formStructure.forEach(component => {
      clearedData[component.id] = '';
    });
    setFormData(clearedData);
  };

  // Save fertility record
  const saveFertilityRecord = () => {
    if (!selectedPatient) {
      alert('Please select a patient');
      return;
    }

    // Validate required fields
    const emptyFields = formStructure.filter(comp => 
      comp.label.includes('Name') && !formData[comp.id]
    );
    
    if (emptyFields.length > 0) {
      alert('Please fill in required fields (Patient Name)');
      return;
    }

    const patient = patients.find(p => p.id === selectedPatient);
    const record = {
      id: 'FERT' + Date.now().toString().slice(-6),
      patientId: selectedPatient,
      patientName: patient?.name || 'Unknown',
      formStructure: formStructure,
      formData: formData,
      createdAt: new Date().toISOString(),
      date: new Date().toLocaleDateString()
    };

    // Save to localStorage
    const updatedRecords = [...savedFertilityRecords, record];
    localStorage.setItem('fertilityRecords', JSON.stringify(updatedRecords));
    setSavedFertilityRecords(updatedRecords);

    alert('Fertility form saved successfully!');
    
    // Clear form
    setSelectedPatient('');
    const clearedData = {};
    formStructure.forEach(component => {
      clearedData[component.id] = '';
    });
    setFormData(clearedData);
  };

  // Load existing record for editing
  const loadRecord = (record) => {
    setSelectedPatient(record.patientId);
    setFormData(record.formData);
  };

  // Delete record
  const deleteRecord = (recordId) => {
    if (confirm('Are you sure you want to delete this fertility record?')) {
      const updatedRecords = savedFertilityRecords.filter(r => r.id !== recordId);
      localStorage.setItem('fertilityRecords', JSON.stringify(updatedRecords));
      setSavedFertilityRecords(updatedRecords);
    }
  };

  // If no form structure exists, show message
  if (formStructure.length === 0) {
    return (
      <div className="fertility-fill-container">
        <div className="empty-state">
          <h3>No Fertility Form Structure Found</h3>
          <p>Please go to the Fertility Create page first to build a form structure.</p>
          <button 
            className="btn"
            onClick={() => window.location.hash = '#fertility-create'}
          >
            Go to Create Form →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fertility-fill-container">
      <h2>Fill Fertility Form</h2>
      
      {/* Patient Selection */}
      <div className="card">
        <h3>Select Patient</h3>
        <select
          value={selectedPatient}
          onChange={(e) => handlePatientSelect(e.target.value)}
          className="form-select"
          style={{ width: '100%', marginBottom: '1rem' }}
        >
          <option value="">Select a patient...</option>
          {patients.map(patient => (
            <option key={patient.id} value={patient.id}>
              {patient.name} ({patient.id})
            </option>
          ))}
        </select>
      </div>

      {/* Dynamic Form Fields */}
      {selectedPatient && (
        <div className="card">
          <h3>Fertility Details</h3>
          {formStructure.map((component) => (
            <div key={component.id} className="form-group">
              <label htmlFor={component.id}>
                {component.editableLabel}
              </label>
              
              {component.type === 'text' && (
                <input
                  type="text"
                  id={component.id}
                  className="form-input"
                  value={formData[component.id] || ''}
                  onChange={(e) => handleInputChange(component.id, e.target.value)}
                  placeholder={`Enter ${component.editableLabel.toLowerCase()}`}
                />
              )}
              
              {component.type === 'textarea' && (
                <textarea
                  id={component.id}
                  className="form-textarea"
                  value={formData[component.id] || ''}
                  onChange={(e) => handleInputChange(component.id, e.target.value)}
                  placeholder={`Enter ${component.editableLabel.toLowerCase()}`}
                />
              )}
              
              {component.type === 'date' && (
                <input
                  type="date"
                  id={component.id}
                  className="form-date"
                  value={formData[component.id] || ''}
                  onChange={(e) => handleInputChange(component.id, e.target.value)}
                />
              )}
              
              {component.type === 'dropdown' && (
                <select
                  id={component.id}
                  className="form-select"
                  value={formData[component.id] || ''}
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

          <button className="btn btn-success" onClick={saveFertilityRecord}>
            Save Fertility Record
          </button>
        </div>
      )}

      {/* Saved Records */}
      {savedFertilityRecords.length > 0 && (
        <div className="card">
          <h3>Saved Fertility Records ({savedFertilityRecords.length})</h3>
          <div style={{ marginTop: '1rem' }}>
            {savedFertilityRecords.map((record) => (
              <div
                key={record.id}
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
                  <strong>{record.patientName}</strong>
                  <br />
                  <small style={{ color: '#6c757d' }}>
                    Record ID: {record.id} | Date: {record.date}
                  </small>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                    onClick={() => loadRecord(record)}
                  >
                    Load
                  </button>
                  <button
                    className="remove-btn"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                    onClick={() => deleteRecord(record.id)}
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

export default FertilityFillPage;
