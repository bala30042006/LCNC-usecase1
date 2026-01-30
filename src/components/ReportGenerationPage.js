import React, { useState, useEffect } from 'react';

// Report Generation Page - Generate reports using selected templates
const ReportGenerationPage = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [patient, setPatient] = useState(null);
  const [reportData, setReportData] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);

  // Load template and patient data
  useEffect(() => {
    const template = localStorage.getItem('selectedTemplate');
    const patientData = localStorage.getItem('reportPatientData');
    
    if (template && patientData) {
      setSelectedTemplate(JSON.parse(template));
      setPatient(JSON.parse(patientData));
      
      // Initialize report data with empty values
      const templateObj = JSON.parse(template);
      const initialData = {};
      templateObj.fields.forEach(field => {
        initialData[field] = '';
      });
      setReportData(initialData);
    }
  }, []);

  // Handle input changes for report fields
  const handleInputChange = (field, value) => {
    setReportData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Generate and save report
  const generateReport = () => {
    if (!selectedTemplate || !patient) {
      alert('Missing template or patient information');
      return;
    }

    // Validate required fields
    const emptyFields = selectedTemplate.fields.filter(field => !reportData[field]);
    if (emptyFields.length > 0) {
      alert(`Please fill in all fields: ${emptyFields.join(', ')}`);
      return;
    }

    setIsGenerating(true);

    // Create report object
    const report = {
      id: 'RPT' + Date.now().toString().slice(-6),
      patientId: patient.id,
      patientName: patient.name,
      templateId: selectedTemplate.id,
      templateName: selectedTemplate.name,
      data: reportData,
      generatedAt: new Date().toISOString(),
      date: new Date().toLocaleDateString()
    };

    // Save report to patient history
    const patientHistoryKey = `patient_history_${patient.id}`;
    const existingHistory = JSON.parse(localStorage.getItem(patientHistoryKey) || '[]');
    existingHistory.push({
      ...report,
      reportType: selectedTemplate.name,
      description: `${selectedTemplate.name} generated on ${new Date().toLocaleDateString()}`
    });
    localStorage.setItem(patientHistoryKey, JSON.stringify(existingHistory));

    // Save to all reports
    const allReports = JSON.parse(localStorage.getItem('allReports') || '[]');
    allReports.push(report);
    localStorage.setItem('allReports', JSON.stringify(allReports));

    // Store generated report for preview
    localStorage.setItem('generatedReport', JSON.stringify(report));

    setTimeout(() => {
      setIsGenerating(false);
      alert('Report generated successfully!');
      window.location.hash = '#report-preview';
    }, 1000);
  };

  // Get field label from field name
  const getFieldLabel = (fieldName) => {
    const labels = {
      symptoms: 'Symptoms',
      diagnosis: 'Diagnosis',
      treatment: 'Treatment',
      medications: 'Medications',
      followUp: 'Follow Up',
      testName: 'Test Name',
      result: 'Result',
      normalRange: 'Normal Range',
      unit: 'Unit',
      status: 'Status',
      admissionDate: 'Admission Date',
      dischargeDate: 'Discharge Date',
      procedures: 'Procedures',
      instructions: 'Instructions',
      date: 'Date',
      vitals: 'Vitals',
      response: 'Response',
      nextSteps: 'Next Steps'
    };
    return labels[fieldName] || fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
  };

  // Get input type for field
  const getInputType = (fieldName) => {
    if (fieldName.includes('date') || fieldName === 'admissionDate' || fieldName === 'dischargeDate') {
      return 'date';
    }
    if (fieldName === 'status') {
      return 'select';
    }
    if (fieldName === 'symptoms' || fieldName === 'diagnosis' || fieldName === 'treatment' || 
        fieldName === 'medications' || fieldName === 'followUp' || fieldName === 'procedures' || 
        fieldName === 'instructions' || fieldName === 'response' || fieldName === 'nextSteps') {
      return 'textarea';
    }
    return 'text';
  };

  if (!selectedTemplate || !patient) {
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h3>No Template or Patient Selected</h3>
          <p>Please go back and select a template and patient.</p>
          <button 
            className="btn"
            onClick={() => window.location.hash = '#patient-details'}
          >
            Go to Patient Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
        Dashboard / Patient / {patient.id} / Generate Report
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#2c3e50' }}>
          Generate {selectedTemplate.name}
        </h2>
        <button 
          className="btn btn-secondary"
          onClick={() => window.location.hash = '#patient-profile'}
        >
          ← Back to Profile
        </button>
      </div>

      {/* Patient Info */}
      <div style={{ background: '#e8f4f8', borderRadius: '8px', padding: '15px', marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Patient Information</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
          <div><strong>ID:</strong> {patient.id}</div>
          <div><strong>Name:</strong> {patient.name}</div>
          <div><strong>Phone:</strong> {patient.phoneNumber}</div>
        </div>
      </div>

      {/* Template Info */}
      <div style={{ background: '#f8f9fa', borderRadius: '8px', padding: '15px', marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Template: {selectedTemplate.name}</h4>
        <p style={{ margin: 0, color: '#666' }}>{selectedTemplate.description}</p>
      </div>

      {/* Report Form */}
      <div style={{ background: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#2c3e50' }}>Report Details</h3>
        
        <div style={{ display: 'grid', gap: '15px' }}>
          {selectedTemplate.fields.map((field) => {
            const inputType = getInputType(field);
            const label = getFieldLabel(field);
            
            return (
              <div key={field}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                  {label} *
                </label>
                
                {inputType === 'textarea' ? (
                  <textarea
                    value={reportData[field] || ''}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      minHeight: '80px',
                      resize: 'vertical'
                    }}
                  />
                ) : inputType === 'select' ? (
                  <select
                    value={reportData[field] || ''}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  >
                    <option value="">Select status</option>
                    <option value="Normal">Normal</option>
                    <option value="Abnormal">Abnormal</option>
                    <option value="Critical">Critical</option>
                    <option value="Pending">Pending</option>
                  </select>
                ) : (
                  <input
                    type={inputType}
                    value={reportData[field] || ''}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: '30px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => window.location.hash = '#patient-profile'}
          >
            Cancel
          </button>
          <button 
            className="btn btn-success"
            onClick={generateReport}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : '📋 Generate Report'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerationPage;
