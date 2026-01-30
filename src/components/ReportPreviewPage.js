import React, { useState, useEffect } from 'react';

// Report Preview Page - Display generated patient reports
const ReportPreviewPage = () => {
  const [generatedReport, setGeneratedReport] = useState(null);
  const [allReports, setAllReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  // Load report data
  useEffect(() => {
    // Check if there's a newly generated report
    const newReport = localStorage.getItem('generatedReport');
    if (newReport) {
      setGeneratedReport(JSON.parse(newReport));
      setSelectedReport(JSON.parse(newReport));
      localStorage.removeItem('generatedReport'); // Clear after loading
    }

    // Load all reports
    const reports = JSON.parse(localStorage.getItem('allReports') || '[]');
    setAllReports(reports);
  }, []);

  // Print/Download the report
  const printReport = () => {
    if (!selectedReport) return;
    
    const printWindow = window.open('', '_blank');
    const reportContent = generatePrintableReport();
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${selectedReport.templateName} - ${selectedReport.patientName}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              line-height: 1.6;
            }
            .report-header {
              border-bottom: 2px solid #2c3e50;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            .patient-info {
              background: #f8f9fa;
              padding: 15px;
              border-radius: 4px;
              margin-bottom: 20px;
            }
            .report-field {
              margin-bottom: 15px;
              padding: 10px;
              border-bottom: 1px solid #ecf0f1;
            }
            .report-field-label {
              font-weight: bold;
              color: #2c3e50;
              margin-bottom: 5px;
            }
            .report-field-value {
              color: #34495e;
              white-space: pre-wrap;
            }
            .report-footer {
              margin-top: 30px;
              padding-top: 10px;
              border-top: 1px solid #ddd;
              font-size: 12px;
              color: #7f8c8d;
            }
            @media print {
              body { margin: 10px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${reportContent}
          <div class="report-footer">
            Report generated on ${new Date(selectedReport.generatedAt).toLocaleString()}<br>
            Report ID: ${selectedReport.id}<br>
            Patient ID: ${selectedReport.patientId}
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  // Generate printable report HTML
  const generatePrintableReport = () => {
    if (!selectedReport) return '';

    let html = `
      <div class="report-header">
        <h1>${selectedReport.templateName}</h1>
        <h2>Patient: ${selectedReport.patientName} (${selectedReport.patientId})</h2>
      </div>
      
      <div class="patient-info">
        <strong>Patient Information:</strong><br>
        ID: ${selectedReport.patientId}<br>
        Name: ${selectedReport.patientName}<br>
        Report Date: ${selectedReport.date}
      </div>
      
      <div class="report-content">
    `;

    // Get field labels
    const fieldLabels = {
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

    Object.entries(selectedReport.data).forEach(([key, value]) => {
      const label = fieldLabels[key] || key.charAt(0).toUpperCase() + key.slice(1);
      html += `
        <div class="report-field">
          <div class="report-field-label">${label}</div>
          <div class="report-field-value">${value || 'Not provided'}</div>
        </div>
      `;
    });

    html += `</div>`;
    return html;
  };

  // Select a report to view
  const selectReport = (report) => {
    setSelectedReport(report);
  };

  // Delete report
  const deleteReport = (reportId) => {
    if (confirm('Are you sure you want to delete this report?')) {
      // Remove from all reports
      const updatedReports = allReports.filter(r => r.id !== reportId);
      localStorage.setItem('allReports', JSON.stringify(updatedReports));
      setAllReports(updatedReports);
      
      // Remove from patient history
      if (selectedReport) {
        const patientHistoryKey = `patient_history_${selectedReport.patientId}`;
        const patientHistory = JSON.parse(localStorage.getItem(patientHistoryKey) || '[]');
        const updatedHistory = patientHistory.filter(r => r.id !== reportId);
        localStorage.setItem(patientHistoryKey, JSON.stringify(updatedHistory));
      }
      
      if (selectedReport?.id === reportId) {
        setSelectedReport(null);
      }
    }
  };

  return (
    <div className="report-preview">
      <h2>Patient Report Preview</h2>
      
      {/* Report Selection */}
      <div style={{ marginBottom: '2rem' }}>
        <h3>Generated Reports ({allReports.length})</h3>
        <div style={{ marginTop: '1rem' }}>
          {allReports.length === 0 ? (
            <div className="empty-state">
              <h3>No Reports Generated</h3>
              <p>Please go to Patient Details → Patient Profile → Generate Report to create reports.</p>
            </div>
          ) : (
            allReports.map((report) => (
              <div
                key={report.id}
                style={{
                  background: '#f8f9fa',
                  border: selectedReport?.id === report.id ? '2px solid #3498db' : '1px solid #dee2e6',
                  borderRadius: '4px',
                  padding: '1rem',
                  marginBottom: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onClick={() => selectReport(report)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{report.templateName}</strong>
                    <br />
                    <span style={{ color: '#666', fontSize: '14px' }}>
                      Patient: {report.patientName} ({report.patientId})
                    </span>
                    <br />
                    <small style={{ color: '#6c757d' }}>
                      Generated: {new Date(report.generatedAt).toLocaleString()}
                    </small>
                  </div>
                  <button
                    className="remove-btn"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteReport(report.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Report Display */}
      {selectedReport && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3>{selectedReport.templateName}</h3>
            <button className="btn" onClick={printReport}>
              🖨️ Print / Download
            </button>
          </div>

          <div className="report-content">
            {/* Report Header */}
            <div className="report-header">
              <h2>{selectedReport.templateName}</h2>
              <div className="patient-info">
                <p><strong>Patient ID:</strong> {selectedReport.patientId}</p>
                <p><strong>Patient Name:</strong> {selectedReport.patientName}</p>
                <p><strong>Report ID:</strong> {selectedReport.id}</p>
                <p><strong>Generated:</strong> {new Date(selectedReport.generatedAt).toLocaleString()}</p>
              </div>
            </div>

            {/* Report Fields */}
            <div className="report-section">
              {Object.entries(selectedReport.data).map(([key, value]) => {
                const fieldLabels = {
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
                
                const label = fieldLabels[key] || key.charAt(0).toUpperCase() + key.slice(1);
                
                return (
                  <div key={key} className="report-field">
                    <div className="report-field-label">
                      {label}
                    </div>
                    <div className="report-field-value" style={{ whiteSpace: 'pre-wrap' }}>
                      {value || 'Not provided'}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Report Footer */}
            <div className="report-footer" style={{ 
              marginTop: '2rem', 
              padding: '1rem', 
              borderTop: '1px solid #ddd',
              fontSize: '0.9rem',
              color: '#6c757d'
            }}>
              <p>This report was generated using the Patient Report Builder application.</p>
              <p>Report ID: {selectedReport.id}</p>
              <p>Total fields: {Object.keys(selectedReport.data).length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportPreviewPage;
