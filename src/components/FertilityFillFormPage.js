import React, { useState, useEffect } from 'react';
import '../styles/FertilityFillForm.css';

const FertilityFillFormPage = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    gender: '',
    age: '',
    occupation: '',
    referredBy: '',
    height: '',
    weight: '',
    bmi: '',
    bloodPressure: '',
    pulseRate: '',
    marriedYears: '',
    subfertilityYears: '',
    lmp: '',
    cycleLength: '',
    cyclesPattern: '',
    painInPeriods: '',
    needWithdrawal: '',
    gravida: '',
    para: '',
    abortions: '',
    livingChild: '',
    ectopic: '',
    typeOfInfertility: '',
    durationYears: '',
    durationMonths: '',
    chiefComplaints: '',
    ovulationInduction: [],
    maleHeight: '',
    maleWeight: '',
    maleBmi: '',
    maleBloodPressure: '',
    malePulseRate: '',
    sexualDysfunction: '',
    erectileProblem: '',
    ejaculateProblem: '',
    others: ''
  });
  
  const [savedRecords, setSavedRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [currentRecord, setCurrentRecord] = useState(null);

  useEffect(() => {
    // Load patients from localStorage
    const savedPatients = localStorage.getItem('patients');
    if (savedPatients) {
      try {
        setPatients(JSON.parse(savedPatients));
      } catch (error) {
        console.error('Error loading patients:', error);
      }
    }

    // Load saved fertility records
    const savedFertilityRecords = localStorage.getItem('fertilityFillRecords');
    if (savedFertilityRecords) {
      try {
        setSavedRecords(JSON.parse(savedFertilityRecords));
      } catch (error) {
        console.error('Error loading records:', error);
      }
    }

    // Load saved templates from localStorage (from template editor)
    const templates = localStorage.getItem('fertilityTemplates');
    if (templates) {
      try {
        setSavedTemplates(JSON.parse(templates));
      } catch (error) {
        console.error('Error loading templates:', error);
      }
    }
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePatientSelect = (patientId) => {
    setSelectedPatient(patientId);
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      setFormData(prev => ({
        ...prev,
        patientName: patient.name || '',
        patientId: patient.id || '',
        gender: patient.gender || '',
        age: patient.age || '',
        occupation: patient.occupation || '',
        referredBy: patient.referredBy || ''
      }));
    }
  };

  const addTableRow = (tableName) => {
    const emptyRow = tableName === 'obstetricHistory' 
      ? { gravida: '', modeOfConception: '', weeks: '', modeOfDelivery: '', babyOutcome: '', complications: '', comments: '' }
      : tableName === 'ovulationInduction' || tableName === 'iui'
      ? { year: '', drugUsed: '', etTrigger: '', outcome: '' }
      : tableName === 'ivf'
      ? { year: '', center: '', protocol: '', noOfEggsEmbryos: '', outcomeComments: '' }
      : tableName === 'femaleMedicalHistory'
      ? { condition: '', duration: '', treatment: '' }
      : { year: '', surgery: '', notesFindings: '' };

    setFormData(prev => ({
      ...prev,
      [tableName]: [...prev[tableName], emptyRow]
    }));
  };

  const removeTableRow = (tableName, index) => {
    setFormData(prev => ({
      ...prev,
      [tableName]: prev[tableName].filter((_, i) => i !== index)
    }));
  };

  const saveForm = () => {
    if (!selectedPatient) {
      alert('Please select a patient');
      return;
    }

    const record = {
      id: 'FERT' + Date.now().toString().slice(-6),
      patientId: selectedPatient,
      patientName: formData.patientName,
      formData: formData,
      templateId: selectedTemplate ? selectedTemplate.id : null,
      templateName: selectedTemplate ? selectedTemplate.name : null,
      createdAt: new Date().toISOString(),
      date: new Date().toLocaleDateString()
    };

    const updatedRecords = [...savedRecords, record];
    localStorage.setItem('fertilityFillRecords', JSON.stringify(updatedRecords));
    setSavedRecords(updatedRecords);

    alert('Fertility form saved successfully!');
    setCurrentRecord(record);
    setShowReport(true);
  };

  const loadRecord = (record) => {
    setSelectedPatient(record.patientId);
    setFormData(record.formData);
    setCurrentRecord(record);
  };

  const deleteRecord = (recordId) => {
    if (confirm('Are you sure you want to delete this record?')) {
      const updatedRecords = savedRecords.filter(r => r.id !== recordId);
      localStorage.setItem('fertilityFillRecords', JSON.stringify(updatedRecords));
      setSavedRecords(updatedRecords);
    }
  };

  const printReport = () => {
    const printContent = document.getElementById('report-content');
    const printWindow = window.open('', '', 'width=800,height=600');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Fertility Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 25px; }
            .section-title { font-weight: bold; font-size: 16px; margin-bottom: 10px; border-bottom: 2px solid #333; padding-bottom: 5px; }
            .field-row { display: flex; margin-bottom: 8px; }
            .field-label { font-weight: bold; width: 200px; }
            .field-value { flex: 1; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  const renderFormField = (field) => {
    const value = formData[field.id] || '';
    
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder || ''}
            className="form-input"
            required={field.required}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder || ''}
            className="form-input"
            required={field.required}
          />
        );
      case 'email':
        return (
          <input
            type="email"
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder || ''}
            className="form-input"
            required={field.required}
          />
        );
      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className="form-input"
            required={field.required}
          />
        );
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className="form-select"
            required={field.required}
          >
            <option value="">Select...</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder || ''}
            className="form-textarea"
            required={field.required}
            rows={4}
          />
        );
      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => handleInputChange(field.id, e.target.checked)}
            required={field.required}
          />
        );
      case 'radio':
        return (
          <div className="radio-group">
            {field.options?.map((option, index) => (
              <label key={index} className="radio-label">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  required={field.required}
                />
                {option}
              </label>
            ))}
          </div>
        );
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder || ''}
            className="form-input"
            required={field.required}
          />
        );
    }
  };

  const renderReportField = (field, value) => {
    if (!value || value.toString().trim() === '') return null;
    
    switch (field.type) {
      case 'checkbox':
        return value ? 'Yes' : 'No';
      case 'radio':
        return value;
      default:
        return value;
    }
  };

  const renderReportSection = (section) => {
    return (
      <div key={section.id} className="report-section">
        <h3>{section.title}</h3>
        {section.fields.map((field) => {
          const value = renderReportField(field, currentRecord.formData[field.id]);
          if (!value) return null;
          
          return (
            <div key={field.id} className="report-field-row">
              <span className="report-field-label">{field.label}:</span>
              <span className="report-field-value">{value}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const getTemplateForRecord = () => {
    // Use the stored template ID to find the exact template
    if (currentRecord.templateId) {
      return savedTemplates.find(template => template.id === currentRecord.templateId);
    }
    
    // Fallback to field matching for older records
    const recordFields = Object.keys(currentRecord.formData);
    
    for (const template of savedTemplates) {
      if (template.sections) {
        const templateFields = [];
        template.sections.forEach(section => {
          section.fields.forEach(field => {
            templateFields.push(field.id);
          });
        });
        
        // Check if most fields match
        const matches = recordFields.filter(field => templateFields.includes(field)).length;
        if (matches > recordFields.length * 0.5) { // If 50%+ fields match
          return template;
        }
      }
    }
    return null;
  };

  const loadTemplate = (template) => {
    // Load template structure from template editor
    if (template.sections) {
      // This is a template from the template editor
      setSelectedTemplate(template);
      
      // Initialize form data with default values based on template structure
      const initialFormData = {};
      
      template.sections.forEach(section => {
        section.fields.forEach(field => {
          initialFormData[field.id] = field.type === 'checkbox' ? false : '';
        });
      });
      
      // Keep existing patient info but update form structure
      setFormData(prev => ({
        patientName: prev.patientName || '',
        patientId: prev.patientId || '',
        gender: prev.gender || '',
        age: prev.age || '',
        occupation: prev.occupation || '',
        referredBy: prev.referredBy || '',
        ...initialFormData
      }));
      
      alert(`Template "${template.name}" loaded! Form structure updated.`);
    } else {
      // This is old template format (if any)
      setSelectedTemplate(null);
      setFormData(template.formData);
      alert(`Template "${template.name}" loaded successfully!`);
    }
  };

  if (showReport && currentRecord) {
    return (
      <div className="fertility-report-container">
        <div className="report-header">
          <h2>Fertility Report</h2>
          <div className="report-actions">
            <button className="btn btn-secondary" onClick={() => setShowReport(false)}>
              ← Back to Form
            </button>
            <button className="btn btn-primary" onClick={printReport}>
              🖨️ Print Report
            </button>
          </div>
        </div>

        <div className="report-content" id="report-content">
          <div className="report-header-info">
            <h1>ASCAS Fertility and Women's Centre</h1>
            <p>Patient Fertility Report</p>
            <p>Date: {new Date(currentRecord.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' })}</p>
          </div>

          <div className="report-section">
            <h3>Patient Information</h3>
            <div className="report-field-row">
              <span className="report-field-label">Patient Name:</span>
              <span className="report-field-value">{currentRecord.patientName}</span>
            </div>
            <div className="report-field-row">
              <span className="report-field-label">Patient ID:</span>
              <span className="report-field-value">{currentRecord.patientId}</span>
            </div>
            <div className="report-field-row">
              <span className="report-field-label">Record ID:</span>
              <span className="report-field-value">{currentRecord.id}</span>
            </div>
          </div>

          {/* Dynamic report based on template structure */}
          {(() => {
            const matchingTemplate = getTemplateForRecord();
            if (matchingTemplate && matchingTemplate.sections) {
              // Render based on template structure
              return matchingTemplate.sections.map(renderReportSection);
            } else {
              // Render default structure for non-template forms
              return (
                <div className="report-section">
                  <h3>Clinical Data</h3>
                  {Object.entries(currentRecord.formData)
                    .filter(([key, value]) => value && value.toString().trim() !== '')
                    .map(([key, value]) => (
                      <div key={key} className="report-field-row">
                        <span className="report-field-label">{key.replace(/([A-Z])/g, ' $1').replace(/^./, '')}:</span>
                        <span className="report-field-value">{value}</span>
                      </div>
                    ))}
                </div>
              );
            }
          })()}
        </div>
      </div>
    );
  }

  return (
    <div className="fertility-fill-form-container">
      <div className="form-header">
        <h2>ASCAS Fertility and Women's Centre</h2>
        <p>Date: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' })}</p>
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={() => window.location.hash = '#fertility'}>
            ← Back to Fertility
          </button>
          <button className="btn btn-success" onClick={saveForm}>
            💾 Save Form
          </button>
        </div>
      </div>

      {/* Patient Selection */}
      <div className="card">
        <h3>Patient Selection</h3>
        <div className="form-row">
          <div className="form-field">
            <label>Select Patient</label>
            <select
              value={selectedPatient}
              onChange={(e) => handlePatientSelect(e.target.value)}
              className="form-select"
            >
              <option value="">Select a patient...</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} ({patient.id})
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Load Template</label>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  const template = savedTemplates.find(t => t.id === e.target.value);
                  if (template) {
                    loadTemplate(template);
                  }
                  e.target.value = '';
                }
              }}
              className="form-select"
            >
              <option value="">Select template...</option>
              {savedTemplates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {selectedPatient && (
        <form className="fertility-form">
          {selectedTemplate && selectedTemplate.sections ? (
            // Render dynamic form based on selected template
            selectedTemplate.sections.map((section) => (
              <div key={section.id} className="form-section">
                <h3>{section.title}</h3>
                <div className="form-row">
                  {section.fields.map((field) => (
                    <div key={field.id} className="form-field">
                      <label>
                        {field.label}
                        {field.required && <span className="required">*</span>}
                      </label>
                      {renderFormField(field)}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            // Render default ASCAS form when no template is selected
            <>
              {/* Patient Demographics */}
              <div className="form-section">
                <h3>Patient Demographics</h3>
                <div className="form-row">
                  <div className="form-field">
                    <label>Patient Name</label>
                    <input
                      type="text"
                      value={formData.patientName}
                      onChange={(e) => handleInputChange('patientName', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-field">
                    <label>Patient ID</label>
                    <input
                      type="text"
                      value={formData.patientId}
                      onChange={(e) => handleInputChange('patientId', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-field">
                    <label>Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="form-select"
                    >
                      <option value="">Select...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label>Age</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-field">
                    <label>Occupation</label>
                    <input
                      type="text"
                      value={formData.occupation}
                      onChange={(e) => handleInputChange('occupation', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-field">
                    <label>Referred By</label>
                    <input
                      type="text"
                      value={formData.referredBy}
                      onChange={(e) => handleInputChange('referredBy', e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* Add more default form sections as needed */}
              <div className="form-section">
                <h3>Basic Information</h3>
                <p>Please select a template to load a specific form structure, or use this default form.</p>
              </div>
            </>
          )}
        </form>
      )}

      {/* Saved Records */}
      {savedRecords.length > 0 && (
        <div className="saved-records-section">
          <h3>Saved Records ({savedRecords.length})</h3>
          <div className="records-list">
            {savedRecords.map((record) => (
              <div key={record.id} className="record-card">
                <div className="record-info">
                  <h4>{record.patientName}</h4>
                  <p>ID: {record.id} | Date: {record.date}</p>
                  {record.templateName && (
                    <p className="template-info">Template: {record.templateName}</p>
                  )}
                </div>
                <div className="record-actions">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => loadRecord(record)}
                  >
                    Load
                  </button>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => {
                      setCurrentRecord(record);
                      setShowReport(true);
                    }}
                  >
                    View Report
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
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

export default FertilityFillFormPage;
