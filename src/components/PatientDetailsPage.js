import React, { useState, useEffect } from 'react';

// Patient Details Page - Patient list dashboard
const PatientDetailsPage = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEntries, setShowEntries] = useState(10);

  // Load patients from localStorage
  useEffect(() => {
    const savedPatients = localStorage.getItem('patients');
    if (savedPatients) {
      try {
        setPatients(JSON.parse(savedPatients));
      } catch (error) {
        console.error('Error loading patients:', error);
      }
    } else {
      // Initialize with sample data
      const samplePatients = [
        {
          id: 'ASCAS75260',
          name: 'Mr TEST TAMIL',
          email: 'test.tamil@example.com',
          phoneNumber: '+91 9876543210',
          date: '2024-12-15',
          createdAt: new Date().toISOString()
        },
        {
          id: 'ASCAS03579',
          name: 'Mrs NANDHINI E',
          email: 'nandhini@example.com',
          phoneNumber: '+91 9876543211',
          date: '2024-12-20',
          createdAt: new Date().toISOString()
        },
        {
          id: 'ASCAS12345',
          name: 'Dr JOHN SMITH',
          email: '',
          phoneNumber: '+91 9876543212',
          date: '2024-12-25',
          createdAt: new Date().toISOString()
        }
      ];
      setPatients(samplePatients);
      localStorage.setItem('patients', JSON.stringify(samplePatients));
    }
  }, []);

  // Filter patients based on search term
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate patients
  const displayedPatients = filteredPatients.slice(0, showEntries);

  // Handle edit action - navigate to patient profile
  const handleEdit = (patientId) => {
    // Store selected patient in localStorage for profile page
    localStorage.setItem('selectedPatientId', patientId);
    // Navigate to patient profile (this would be handled by routing in a real app)
    window.location.hash = '#patient-profile';
  };

  // Handle delete patient
  const handleDelete = (patientId) => {
    if (confirm('Are you sure you want to delete this patient record?')) {
      const updatedPatients = patients.filter(p => p.id !== patientId);
      setPatients(updatedPatients);
      localStorage.setItem('patients', JSON.stringify(updatedPatients));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
        Dashboard / Patient
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#2c3e50' }}>Patient</h2>
        <button 
          className="btn"
          onClick={() => {
            localStorage.setItem('selectedPatientId', 'new');
            window.location.hash = '#patient-profile';
          }}
        >
          + Add New Patient
        </button>
      </div>

      {/* Search and Entries Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label>Show</label>
          <select 
            value={showEntries} 
            onChange={(e) => setShowEntries(Number(e.target.value))}
            style={{ padding: '5px', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <label>entries</label>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label>Search:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search patients..."
            style={{ padding: '5px', border: '1px solid #ddd', borderRadius: '4px', width: '200px' }}
          />
        </div>
      </div>

      {/* Patient Table */}
      <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8f9fa' }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Patient ID</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Name</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Email</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>PhoneNumber</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Date</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>Act</th>
            </tr>
          </thead>
          <tbody>
            {displayedPatients.map((patient) => (
              <tr key={patient.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '12px' }}>{patient.id}</td>
                <td style={{ padding: '12px' }}>{patient.name}</td>
                <td style={{ padding: '12px' }}>{patient.email || '-'}</td>
                <td style={{ padding: '12px' }}>{patient.phoneNumber}</td>
                <td style={{ padding: '12px' }}>{patient.date}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button
                    onClick={() => handleEdit(patient.id)}
                    style={{
                      background: '#27ae60',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginRight: '5px'
                    }}
                    title="Edit Patient"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(patient.id)}
                    style={{
                      background: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                    title="Delete Patient"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Info */}
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        Showing {displayedPatients.length} of {filteredPatients.length} entries
      </div>
    </div>
  );
};

export default PatientDetailsPage;
