import React, { useState, useEffect } from 'react';
import '../styles/FertilityFillForm.css';

const FertilityFillFormPage = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [formData, setFormData] = useState({
    // Patient Demographics
    patientName: '',
    patientId: '',
    gender: '',
    age: '',
    occupation: '',
    referredBy: '',
    
    // Female Information - General Measurements
    height: '',
    weight: '',
    bmi: '',
    bloodPressure: '',
    pulseRate: '',
    marriedYears: '',
    subfertilityYears: '',
    
    // Menstrual History
    lmp: '',
    cycleLength: '',
    cyclesPattern: '',
    painInPeriods: '',
    needWithdrawal: '',
    
    // Obstetric History
    gravida: '',
    para: '',
    abortions: '',
    livingChild: '',
    ectopic: '',
    
    // Detailed Obstetric History (Table)
    obstetricHistory: [
      { gravida: '', modeOfConception: '', weeks: '', modeOfDelivery: '', babyOutcome: '', complications: '', comments: '' }
    ],
    
    // Fertility History
    typeOfInfertility: '',
    durationYears: '',
    durationMonths: '',
    chiefComplaints: '',
    
    // Previous Fertility Treatments
    ovulationInduction: [
      { year: '', drugUsed: '', etTrigger: '', outcome: '' }
    ],
    iui: [
      { year: '', drugUsed: '', etTrigger: '', outcome: '' }
    ],
    ivf: [
      { year: '', center: '', protocol: '', noOfEggsEmbryos: '', outcomeComments: '' }
    ],
    
    // Female Medical History
    femaleMedicalHistory: [
      { condition: '', duration: '', treatment: '' }
    ],
    
    // Female Surgical History
    femaleSurgicalHistory: [
      { year: '', surgery: '', notesFindings: '' }
    ],
    
    // Male Information
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
  const [showReport, setShowReport] = useState(false);
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
        patientName: patient.name,
        patientId: patient.id
      }));
    }
  };

  const handleTableChange = (tableName, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [tableName]: prev[tableName].map((row, i) => 
        i === index ? { ...row, [field]: value } : row
      )
    }));
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
        
        <div id="report-content" className="report-content">
          <div className="report-header-info">
            <h1>ASCAS Fertility and Women's Centre</h1>
            <p>Date: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' })}</p>
            <hr />
          </div>

          <div className="report-section">
            <h3>Patient Demographics</h3>
            <div className="report-field-row">
              <span className="report-field-label">Patient Name:</span>
              <span className="report-field-value">{currentRecord.formData.patientName}</span>
            </div>
            <div className="report-field-row">
              <span className="report-field-label">Patient ID:</span>
              <span className="report-field-value">{currentRecord.formData.patientId}</span>
            </div>
            <div className="report-field-row">
              <span className="report-field-label">Gender:</span>
              <span className="report-field-value">{currentRecord.formData.gender}</span>
            </div>
            <div className="report-field-row">
              <span className="report-field-label">Age:</span>
              <span className="report-field-value">{currentRecord.formData.age}</span>
            </div>
            <div className="report-field-row">
              <span className="report-field-label">Occupation:</span>
              <span className="report-field-value">{currentRecord.formData.occupation}</span>
            </div>
            <div className="report-field-row">
              <span className="report-field-label">Referred By:</span>
              <span className="report-field-value">{currentRecord.formData.referredBy}</span>
            </div>
          </div>

          <div className="report-section">
            <h3>Female Information - General Measurements</h3>
            <div className="report-field-row">
              <span className="report-field-label">Height:</span>
              <span className="report-field-value">{currentRecord.formData.height}</span>
            </div>
            <div className="report-field-row">
              <span className="report-field-label">Weight:</span>
              <span className="report-field-value">{currentRecord.formData.weight}</span>
            </div>
            <div className="report-field-row">
              <span className="report-field-label">BMI:</span>
              <span className="report-field-value">{currentRecord.formData.bmi}</span>
            </div>
            <div className="report-field-row">
              <span className="report-field-label">Blood Pressure:</span>
              <span className="report-field-value">{currentRecord.formData.bloodPressure}</span>
            </div>
            <div className="report-field-row">
              <span className="report-field-label">Pulse Rate:</span>
              <span className="report-field-value">{currentRecord.formData.pulseRate}</span>
            </div>
            <div className="report-field-row">
              <span className="report-field-label">Married Years:</span>
              <span className="report-field-value">{currentRecord.formData.marriedYears}</span>
            </div>
            <div className="report-field-row">
              <span className="report-field-label">Subfertility Years:</span>
              <span className="report-field-value">{currentRecord.formData.subfertilityYears}</span>
            </div>
          </div>

          <div className="report-section">
            <h3>Menstrual History (H/O)</h3>
            <div className="report-field-row">
              <span className="report-field-label">Last Menstrual Period (LMP):</span>
              <span className="report-field-value">{currentRecord.formData.lmp || 'N/A'}</span>
            </div>
            <div className="report-field-row">
              <span className="report-field-label">Cycle Length:</span>
              <span className="report-field-value">{currentRecord.formData.cycleLength || 'N/A'}</span>
            </div>
            <div className="report-field-row">
              <span className="report-field-label">Cycles Pattern:</span>
              <span className="report-field-value">{currentRecord.formData.cyclesPattern || 'N/A'}</span>
            </div>
            <div className="report-field-row">
              <span className="report-field-label">Pain in Periods:</span>
              <span className="report-field-value">{currentRecord.formData.painInPeriods || 'N/A'}</span>
            </div>
            <div className="report-field-row">
              <span className="report-field-label">Need Withdrawal:</span>
              <span className="report-field-value">{currentRecord.formData.needWithdrawal || 'N/A'}</span>
            </div>
          </div>

          <div className="report-section">
            <h3>Obstetric History</h3>
            <div className="report-field-row">
              <span className="report-field-label">Gravida (G):</span>
              <span className="report-field-value">{currentRecord.formData.gravida || 'N/A'}</span>
            </div>
            <div className="report-field-row">
              <span className="report-field-label">Para:</span>
              <span className="report-field-value">{currentRecord.formData.para || 'N/A'}</span>
            </div>
            <div className="report-field-row">
              <span className="report-field-label">Abortions (A):</span>
              <span className="report-field-value">{currentRecord.formData.abortions || 'N/A'}</span>
            </div>
            <div className="report-field-row">
              <span className="report-field-label">Living Child:</span>
              <span className="report-field-value">{currentRecord.formData.livingChild || 'N/A'}</span>
            </div>
            <div className="report-field-row">
              <span className="report-field-label">Ectopic:</span>
              <span className="report-field-value">{currentRecord.formData.ectopic || 'N/A'}</span>
            </div>
          </div>

          <div className="report-section">
            <h3>Fertility History</h3>
            <div className="report-field-row">
              <span className="report-field-label">Type of Infertility:</span>
              <span className="report-field-value">{currentRecord.formData.typeOfInfertility || 'N/A'}</span>
            </div>
            <div className="report-field-row">
              <span className="report-field-label">Duration (Years):</span>
              <span className="report-field-value">{currentRecord.formData.durationYears || 'N/A'}</span>
            </div>
            <div className="report-field-row">
              <span className="report-field-label">Duration (Months):</span>
              <span className="report-field-value">{currentRecord.formData.durationMonths || 'N/A'}</span>
            </div>
            <div className="report-field-row">
              <span className="report-field-label">Chief Complaints:</span>
              <span className="report-field-value">{currentRecord.formData.chiefComplaints || 'N/A'}</span>
            </div>
          </div>

          <div className="report-section">
            <h3>Previous Fertility Treatments - Ovulation Induction</h3>
            {currentRecord.formData.ovulationInduction && currentRecord.formData.ovulationInduction.length > 0 ? (
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Drug Used</th>
                    <th>ET & Trigger</th>
                    <th>Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecord.formData.ovulationInduction.map((row, index) => (
                    <tr key={index}>
                      <td>{row.year || 'N/A'}</td>
                      <td>{row.drugUsed || 'N/A'}</td>
                      <td>{row.etTrigger || 'N/A'}</td>
                      <td>{row.outcome || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No ovulation induction records</p>
            )}
          </div>

          <div className="report-section">
            <h3>Male Information</h3>
            <div className="report-field-row">
              <span className="report-field-label">Height:</span>
              <span className="report-field-value">{currentRecord.formData.maleHeight || 'N/A'}</span>
            </div>
            <div className="report-field-row">
              <span className="report-field-label">Weight:</span>
              <span className="report-field-value">{currentRecord.formData.maleWeight || 'N/A'}</span>
            </div>
            <div className="report-field-row">
              <span className="report-field-label">BMI:</span>
              <span className="report-field-value">{currentRecord.formData.maleBmi || 'N/A'}</span>
            </div>
            <div className="report-field-row">
              <span className="report-field-label">Blood Pressure:</span>
              <span className="report-field-value">{currentRecord.formData.maleBloodPressure || 'N/A'}</span>
            </div>
            <div className="report-field-row">
              <span className="report-field-label">Pulse Rate:</span>
              <span className="report-field-value">{currentRecord.formData.malePulseRate || 'N/A'}</span>
            </div>
            <div className="report-field-row">
              <span className="report-field-label">Sexual Dysfunction:</span>
              <span className="report-field-value">{currentRecord.formData.sexualDysfunction || 'N/A'}</span>
            </div>
            <div className="report-field-row">
              <span className="report-field-label">Erectile Problem:</span>
              <span className="report-field-value">{currentRecord.formData.erectileProblem || 'N/A'}</span>
            </div>
            <div className="report-field-row">
              <span className="report-field-label">Ejaculate Problem:</span>
              <span className="report-field-value">{currentRecord.formData.ejaculateProblem || 'N/A'}</span>
            </div>
            <div className="report-field-row">
              <span className="report-field-label">Others:</span>
              <span className="report-field-value">{currentRecord.formData.others || 'N/A'}</span>
            </div>
          </div>
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

      {selectedPatient && (
        <form className="fertility-form">
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

          {/* Female Information - General Measurements */}
          <div className="form-section">
            <h3>Female Information - General Measurements</h3>
            <div className="form-row">
              <div className="form-field">
                <label>Height</label>
                <input
                  type="text"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  className="form-input"
                  placeholder="cm"
                />
              </div>
              <div className="form-field">
                <label>Weight</label>
                <input
                  type="text"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  className="form-input"
                  placeholder="kg"
                />
              </div>
              <div className="form-field">
                <label>BMI</label>
                <input
                  type="text"
                  value={formData.bmi}
                  onChange={(e) => handleInputChange('bmi', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Blood Pressure</label>
                <input
                  type="text"
                  value={formData.bloodPressure}
                  onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
                  className="form-input"
                  placeholder="120/80"
                />
              </div>
              <div className="form-field">
                <label>Pulse Rate</label>
                <input
                  type="text"
                  value={formData.pulseRate}
                  onChange={(e) => handleInputChange('pulseRate', e.target.value)}
                  className="form-input"
                  placeholder="bpm"
                />
              </div>
              <div className="form-field">
                <label>Married Years</label>
                <input
                  type="number"
                  value={formData.marriedYears}
                  onChange={(e) => handleInputChange('marriedYears', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Subfertility Years</label>
                <input
                  type="number"
                  value={formData.subfertilityYears}
                  onChange={(e) => handleInputChange('subfertilityYears', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Menstrual History */}
          <div className="form-section">
            <h3>Menstrual History (H/O)</h3>
            <div className="form-row">
              <div className="form-field">
                <label>Last Menstrual Period (LMP)</label>
                <input
                  type="date"
                  value={formData.lmp}
                  onChange={(e) => handleInputChange('lmp', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-field">
                <label>Cycle Length</label>
                <input
                  type="text"
                  value={formData.cycleLength}
                  onChange={(e) => handleInputChange('cycleLength', e.target.value)}
                  className="form-input"
                  placeholder="days"
                />
              </div>
              <div className="form-field">
                <label>Cycles Pattern</label>
                <input
                  type="text"
                  value={formData.cyclesPattern}
                  onChange={(e) => handleInputChange('cyclesPattern', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Pain in Periods</label>
                <select
                  value={formData.painInPeriods}
                  onChange={(e) => handleInputChange('painInPeriods', e.target.value)}
                  className="form-select"
                >
                  <option value="">Select...</option>
                  <option value="No">No</option>
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                </select>
              </div>
              <div className="form-field">
                <label>Need Withdrawal</label>
                <select
                  value={formData.needWithdrawal}
                  onChange={(e) => handleInputChange('needWithdrawal', e.target.value)}
                  className="form-select"
                >
                  <option value="">Select...</option>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Obstetric History */}
          <div className="form-section">
            <h3>Obstetric History</h3>
            <div className="form-row">
              <div className="form-field">
                <label>Gravida (G)</label>
                <input
                  type="number"
                  value={formData.gravida}
                  onChange={(e) => handleInputChange('gravida', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-field">
                <label>Para</label>
                <input
                  type="number"
                  value={formData.para}
                  onChange={(e) => handleInputChange('para', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-field">
                <label>Abortions (A)</label>
                <input
                  type="number"
                  value={formData.abortions}
                  onChange={(e) => handleInputChange('abortions', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Living Child</label>
                <input
                  type="number"
                  value={formData.livingChild}
                  onChange={(e) => handleInputChange('livingChild', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-field">
                <label>Ectopic</label>
                <input
                  type="number"
                  value={formData.ectopic}
                  onChange={(e) => handleInputChange('ectopic', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Fertility History */}
          <div className="form-section">
            <h3>Fertility History</h3>
            <div className="form-row">
              <div className="form-field">
                <label>Type of Infertility</label>
                <select
                  value={formData.typeOfInfertility}
                  onChange={(e) => handleInputChange('typeOfInfertility', e.target.value)}
                  className="form-select"
                >
                  <option value="">Select...</option>
                  <option value="Primary">Primary</option>
                  <option value="Secondary">Secondary</option>
                </select>
              </div>
              <div className="form-field">
                <label>Duration (Years)</label>
                <input
                  type="number"
                  value={formData.durationYears}
                  onChange={(e) => handleInputChange('durationYears', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-field">
                <label>Duration (Months)</label>
                <input
                  type="number"
                  value={formData.durationMonths}
                  onChange={(e) => handleInputChange('durationMonths', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field full-width">
                <label>Chief Complaints</label>
                <textarea
                  value={formData.chiefComplaints}
                  onChange={(e) => handleInputChange('chiefComplaints', e.target.value)}
                  className="form-textarea"
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* Previous Fertility Treatments - Ovulation Induction */}
          <div className="form-section">
            <h3>Previous Fertility Treatments - Ovulation Induction</h3>
            {formData.ovulationInduction.map((row, index) => (
              <div key={index} className="table-row">
                <div className="form-field">
                  <input
                    type="text"
                    value={row.year}
                    onChange={(e) => handleTableChange('ovulationInduction', index, 'year', e.target.value)}
                    className="form-input"
                    placeholder="Year"
                  />
                </div>
                <div className="form-field">
                  <input
                    type="text"
                    value={row.drugUsed}
                    onChange={(e) => handleTableChange('ovulationInduction', index, 'drugUsed', e.target.value)}
                    className="form-input"
                    placeholder="Drug Used"
                  />
                </div>
                <div className="form-field">
                  <input
                    type="text"
                    value={row.etTrigger}
                    onChange={(e) => handleTableChange('ovulationInduction', index, 'etTrigger', e.target.value)}
                    className="form-input"
                    placeholder="ET & Trigger"
                  />
                </div>
                <div className="form-field">
                  <input
                    type="text"
                    value={row.outcome}
                    onChange={(e) => handleTableChange('ovulationInduction', index, 'outcome', e.target.value)}
                    className="form-input"
                    placeholder="Outcome"
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => removeTableRow('ovulationInduction', index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => addTableRow('ovulationInduction')}
            >
              + Add Row
            </button>
          </div>

          {/* Male Information */}
          <div className="form-section">
            <h3>Male Information</h3>
            <div className="form-row">
              <div className="form-field">
                <label>Height</label>
                <input
                  type="text"
                  value={formData.maleHeight}
                  onChange={(e) => handleInputChange('maleHeight', e.target.value)}
                  className="form-input"
                  placeholder="cm"
                />
              </div>
              <div className="form-field">
                <label>Weight</label>
                <input
                  type="text"
                  value={formData.maleWeight}
                  onChange={(e) => handleInputChange('maleWeight', e.target.value)}
                  className="form-input"
                  placeholder="kg"
                />
              </div>
              <div className="form-field">
                <label>BMI</label>
                <input
                  type="text"
                  value={formData.maleBmi}
                  onChange={(e) => handleInputChange('maleBmi', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Blood Pressure</label>
                <input
                  type="text"
                  value={formData.maleBloodPressure}
                  onChange={(e) => handleInputChange('maleBloodPressure', e.target.value)}
                  className="form-input"
                  placeholder="120/80"
                />
              </div>
              <div className="form-field">
                <label>Pulse Rate</label>
                <input
                  type="text"
                  value={formData.malePulseRate}
                  onChange={(e) => handleInputChange('malePulseRate', e.target.value)}
                  className="form-input"
                  placeholder="bpm"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Sexual Dysfunction</label>
                <select
                  value={formData.sexualDysfunction}
                  onChange={(e) => handleInputChange('sexualDysfunction', e.target.value)}
                  className="form-select"
                >
                  <option value="">Select...</option>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              <div className="form-field">
                <label>Erectile Problem</label>
                <select
                  value={formData.erectileProblem}
                  onChange={(e) => handleInputChange('erectileProblem', e.target.value)}
                  className="form-select"
                >
                  <option value="">Select...</option>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              <div className="form-field">
                <label>Ejaculate Problem</label>
                <select
                  value={formData.ejaculateProblem}
                  onChange={(e) => handleInputChange('ejaculateProblem', e.target.value)}
                  className="form-select"
                >
                  <option value="">Select...</option>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-field full-width">
                <label>Others</label>
                <textarea
                  value={formData.others}
                  onChange={(e) => handleInputChange('others', e.target.value)}
                  className="form-textarea"
                  rows="2"
                />
              </div>
            </div>
          </div>
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
