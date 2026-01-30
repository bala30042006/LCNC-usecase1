import React, { useState, useEffect } from 'react';

// Patient Profile Page - Patient profile and history with report generation
const PatientProfilePage = () => {
  const [patient, setPatient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  const [patientHistory, setPatientHistory] = useState([]);
  const [formData, setFormData] = useState({});

  // Available report templates
  const reportTemplates = [
    {
      id: 'medical_report',
      name: 'Medical Report',
      description: 'Comprehensive medical examination report',
      fields: ['symptoms', 'diagnosis', 'treatment', 'medications', 'followUp']
    },
    {
      id: 'lab_report',
      name: 'Laboratory Report',
      description: 'Laboratory test results and analysis',
      fields: ['testName', 'result', 'normalRange', 'unit', 'status']
    },
    {
      id: 'discharge_summary',
      name: 'Discharge Summary',
      description: 'Patient discharge summary and instructions',
      fields: ['admissionDate', 'dischargeDate', 'diagnosis', 'procedures', 'medications', 'instructions']
    },
    {
      id: 'progress_report',
      name: 'Progress Report',
      description: 'Patient treatment progress report',
      fields: ['date', 'vitals', 'symptoms', 'response', 'nextSteps']
    }
  ];

  // Load patient data
  useEffect(() => {
    const selectedPatientId = localStorage.getItem('selectedPatientId');
    if (selectedPatientId) {
      if (selectedPatientId === 'new') {
        // Create new patient
        const newPatient = {
          id: '',
          name: '',
          email: '',
          phoneNumber: '',
          date: new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString()
        };
        setPatient(newPatient);
        setIsEditing(true);
      } else {
        // Load existing patient
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const foundPatient = patients.find(p => p.id === selectedPatientId);
        if (foundPatient) {
          setPatient(foundPatient);
          setFormData(foundPatient);
        }
      }
    }

    // Load patient history
    const history = JSON.parse(localStorage.getItem(`patient_history_${selectedPatientId}`) || '[]');
    setPatientHistory(history);
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save patient data
  const savePatient = () => {
    if (!formData.name || !formData.phoneNumber) {
      alert('Please fill in required fields (Name, Phone Number)');
      return;
    }

    const patients = JSON.parse(localStorage.getItem('patients') || '[]');
    
    if (patient.id === '') {
      // Create new patient
      const newPatient = {
        ...formData,
        id: 'ASCAS' + Date.now().toString().slice(-6),
        createdAt: new Date().toISOString()
      };
      patients.push(newPatient);
      localStorage.setItem('patients', JSON.stringify(patients));
      setPatient(newPatient);
    } else {
      // Update existing patient
      const updatedPatients = patients.map(p => 
        p.id === patient.id ? { ...formData, id: patient.id, createdAt: patient.createdAt } : p
      );
      localStorage.setItem('patients', JSON.stringify(updatedPatients));
      setPatient({ ...formData, id: patient.id, createdAt: patient.createdAt });
    }
    
    setIsEditing(false);
  };

  // Handle template selection for report generation
  const handleTemplateSelect = (template) => {
    // Store selected template and patient data for report generation
    localStorage.setItem('selectedTemplate', JSON.stringify(template));
    localStorage.setItem('reportPatientData', JSON.stringify(patient));
    window.location.hash = '#report-generation';
  };

  // Cancel editing
  const cancelEdit = () => {
    if (patient.id === '') {
      // Go back to patient list if creating new patient
      window.location.hash = '#patient-details';
    } else {
      setIsEditing(false);
      setFormData(patient);
    }
  };

  if (!patient) {
    return <div style={{ padding: '20px' }}>Loading patient data...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
        Dashboard / Patient / {patient.id || 'New Patient'}
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#2c3e50' }}>
          {patient.id ? `Patient Profile - ${patient.id}` : 'Create New Patient'}
        </h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          {patient.id && !isEditing && (
            <>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowTemplateSelection(true)}
              >
                📋 Generate Report
              </button>
              <button 
                className="btn"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit Profile
              </button>
            </>
          )}
        </div>
      </div>

      {/* Patient Information Form */}
      <div style={{ background: 'white', borderRadius: '8px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#2c3e50' }}>Patient Information</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Patient ID</label>
            <input
              type="text"
              name="id"
              value={patient.id || 'Auto-generated'}
              disabled
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', background: '#f8f9fa' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Phone Number *</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
        </div>

        {isEditing && (
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button className="btn btn-success" onClick={savePatient}>
              💾 Save
            </button>
            <button className="btn btn-secondary" onClick={cancelEdit}>
              ❌ Cancel
            </button>
          </div>
        )}
      </div>

      {/* Patient History */}
      {patient.id && (
        <div style={{ background: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#2c3e50' }}>Patient History</h3>
          
          {patientHistory.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
              No history records found for this patient.
            </p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Date</th>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Report Type</th>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Description</th>
                  <th style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {patientHistory.map((record, index) => (
                  <tr key={index}>
                    <td style={{ padding: '10px' }}>{record.date}</td>
                    <td style={{ padding: '10px' }}>{record.reportType}</td>
                    <td style={{ padding: '10px' }}>{record.description}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      <button 
                        className="btn" 
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                        onClick={() => {
                          localStorage.setItem('viewReport', JSON.stringify(record));
                          window.location.hash = '#report-preview';
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Template Selection Modal */}
      {showTemplateSelection && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '30px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Select Report Template</h3>
            
            {reportTemplates.map((template) => (
              <div
                key={template.id}
                style={{
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                  padding: '15px',
                  marginBottom: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onClick={() => handleTemplateSelect(template)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f8f9fa';
                  e.currentTarget.style.borderColor = '#3498db';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#dee2e6';
                }}
              >
                <h4 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>{template.name}</h4>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{template.description}</p>
              </div>
            ))}
            
            <button 
              className="btn btn-secondary"
              onClick={() => setShowTemplateSelection(false)}
              style={{ marginTop: '20px', width: '100%' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientProfilePage;
