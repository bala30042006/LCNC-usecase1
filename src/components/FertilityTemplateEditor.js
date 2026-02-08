import React, { useState, useEffect } from 'react';
import '../styles/FormBuilder.css';

const FertilityTemplateEditor = () => {
  const [formSections, setFormSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [templateName, setTemplateName] = useState('Fertility Form Template');
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [activeTab, setActiveTab] = useState('sections');

  // Default fertility form structure
  const defaultSections = [
    {
      id: 'demographics',
      title: 'Patient Demographics',
      fields: [
        { id: 'patientName', type: 'text', label: 'Patient Name', required: true },
        { id: 'patientId', type: 'text', label: 'Patient ID', required: true },
        { id: 'gender', type: 'select', label: 'Gender', options: ['Male', 'Female', 'Other'], required: true },
        { id: 'age', type: 'number', label: 'Age', required: true },
        { id: 'occupation', type: 'text', label: 'Occupation', required: false },
        { id: 'referredBy', type: 'text', label: 'Referred By', required: false }
      ]
    },
    {
      id: 'femaleGeneral',
      title: 'Female Information - General Measurements',
      fields: [
        { id: 'height', type: 'text', label: 'Height', placeholder: 'cm', required: false },
        { id: 'weight', type: 'text', label: 'Weight', placeholder: 'kg', required: false },
        { id: 'bmi', type: 'text', label: 'BMI', required: false },
        { id: 'bloodPressure', type: 'text', label: 'Blood Pressure', placeholder: '120/80', required: false },
        { id: 'pulseRate', type: 'text', label: 'Pulse Rate', placeholder: 'bpm', required: false },
        { id: 'marriedYears', type: 'number', label: 'Married Years', required: false },
        { id: 'subfertilityYears', type: 'number', label: 'Subfertility Years', required: false }
      ]
    },
    {
      id: 'menstrualHistory',
      title: 'Menstrual History (H/O)',
      fields: [
        { id: 'lmp', type: 'date', label: 'Last Menstrual Period (LMP)', required: false },
        { id: 'cycleLength', type: 'text', label: 'Cycle Length', placeholder: 'days', required: false },
        { id: 'cyclesPattern', type: 'text', label: 'Cycles Pattern', required: false },
        { id: 'painInPeriods', type: 'select', label: 'Pain in Periods', options: ['No', 'Mild', 'Moderate', 'Severe'], required: false },
        { id: 'needWithdrawal', type: 'select', label: 'Need Withdrawal', options: ['No', 'Yes'], required: false }
      ]
    },
    {
      id: 'obstetricHistory',
      title: 'Obstetric History',
      fields: [
        { id: 'gravida', type: 'number', label: 'Gravida (G)', required: false },
        { id: 'para', type: 'number', label: 'Para', required: false },
        { id: 'abortions', type: 'number', label: 'Abortions (A)', required: false },
        { id: 'livingChild', type: 'number', label: 'Living Child', required: false },
        { id: 'ectopic', type: 'number', label: 'Ectopic', required: false }
      ]
    },
    {
      id: 'fertilityHistory',
      title: 'Fertility History',
      fields: [
        { id: 'typeOfInfertility', type: 'select', label: 'Type of Infertility', options: ['Primary', 'Secondary'], required: false },
        { id: 'durationYears', type: 'number', label: 'Duration (Years)', required: false },
        { id: 'durationMonths', type: 'number', label: 'Duration (Months)', required: false },
        { id: 'chiefComplaints', type: 'textarea', label: 'Chief Complaints', required: false }
      ]
    },
    {
      id: 'maleInfo',
      title: 'Male Information',
      fields: [
        { id: 'maleHeight', type: 'text', label: 'Height', placeholder: 'cm', required: false },
        { id: 'maleWeight', type: 'text', label: 'Weight', placeholder: 'kg', required: false },
        { id: 'maleBmi', type: 'text', label: 'BMI', required: false },
        { id: 'maleBloodPressure', type: 'text', label: 'Blood Pressure', placeholder: '120/80', required: false },
        { id: 'malePulseRate', type: 'text', label: 'Pulse Rate', placeholder: 'bpm', required: false },
        { id: 'sexualDysfunction', type: 'select', label: 'Sexual Dysfunction', options: ['No', 'Yes'], required: false },
        { id: 'erectileProblem', type: 'select', label: 'Erectile Problem', options: ['No', 'Yes'], required: false },
        { id: 'ejaculateProblem', type: 'select', label: 'Ejaculate Problem', options: ['No', 'Yes'], required: false },
        { id: 'others', type: 'textarea', label: 'Others', required: false }
      ]
    }
  ];

  // Available field types
  const availableFieldTypes = [
    { type: 'text', label: 'Text Input' },
    { type: 'number', label: 'Number Input' },
    { type: 'email', label: 'Email Input' },
    { type: 'date', label: 'Date Picker' },
    { type: 'select', label: 'Dropdown' },
    { type: 'textarea', label: 'Text Area' },
    { type: 'checkbox', label: 'Checkbox' },
    { type: 'radio', label: 'Radio Button' }
  ];

  useEffect(() => {
    // Load saved templates
    const templates = JSON.parse(localStorage.getItem('fertilityTemplates') || '[]');
    setSavedTemplates(templates);

    // Load current template
    const currentTemplate = localStorage.getItem('currentFertilityTemplate');
    if (currentTemplate) {
      try {
        setFormSections(JSON.parse(currentTemplate));
      } catch (error) {
        setFormSections(defaultSections);
      }
    } else {
      setFormSections(defaultSections);
    }
  }, []);

  // Drag and drop handlers
  const handleDragStart = (e, fieldType) => {
    e.dataTransfer.setData('fieldType', JSON.stringify(fieldType));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e, sectionId) => {
    e.preventDefault();
    e.stopPropagation();
    
    const fieldType = e.dataTransfer.getData('fieldType');
    if (!fieldType) return;
    
    try {
      const parsedFieldType = JSON.parse(fieldType);
      
      const newField = {
        id: 'field_' + Date.now(),
        type: parsedFieldType.type,
        label: parsedFieldType.label,
        required: false,
        placeholder: '',
        ...(parsedFieldType.type === 'select' && { options: ['Option 1', 'Option 2', 'Option 3'] })
      };

      setFormSections(sections =>
        sections.map(section =>
          section.id === sectionId
            ? { ...section, fields: [...section.fields, newField] }
            : section
        )
      );
    } catch (error) {
      console.error('Error parsing field type:', error);
    }
  };

  const handleSectionDragStart = (e, sectionId) => {
    e.dataTransfer.setData('sectionId', sectionId);
  };

  const handleSectionDrop = (e, targetSectionId) => {
    e.preventDefault();
    e.stopPropagation();
    
    const fieldType = e.dataTransfer.getData('fieldType');
    if (fieldType) {
      // This is a field drop, not a section drop
      handleDrop(e, targetSectionId);
      return;
    }
    
    const draggedSectionId = e.dataTransfer.getData('sectionId');
    if (!draggedSectionId || draggedSectionId === targetSectionId) return;
    
    const draggedIndex = formSections.findIndex(s => s.id === draggedSectionId);
    const targetIndex = formSections.findIndex(s => s.id === targetSectionId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    const newSections = [...formSections];
    const [draggedSection] = newSections.splice(draggedIndex, 1);
    newSections.splice(targetIndex, 0, draggedSection);
    
    setFormSections(newSections);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
  };

  const updateField = (sectionId, fieldId, updates) => {
    setFormSections(sections =>
      sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields.map(field =>
                field.id === fieldId ? { ...field, ...updates } : field
              )
            }
          : section
      )
    );
  };

  const removeField = (sectionId, fieldId) => {
    setFormSections(sections =>
      sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields.filter(field => field.id !== fieldId)
            }
          : section
      )
    );
    setSelectedField(null);
  };

  const addSection = () => {
    const newSection = {
      id: 'section_' + Date.now(),
      title: 'New Section',
      fields: []
    };
    setFormSections([...formSections, newSection]);
  };

  const updateSection = (sectionId, updates) => {
    setFormSections(sections =>
      sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    );
  };

  const removeSection = (sectionId) => {
    setFormSections(sections => sections.filter(section => section.id !== sectionId));
    setSelectedSection(null);
  };

  const saveTemplate = () => {
    const template = {
      id: Date.now().toString(),
      name: templateName,
      sections: formSections,
      createdAt: new Date().toISOString()
    };

    const updatedTemplates = [...savedTemplates, template];
    localStorage.setItem('fertilityTemplates', JSON.stringify(updatedTemplates));
    localStorage.setItem('currentFertilityTemplate', JSON.stringify(formSections));
    setSavedTemplates(updatedTemplates);

    alert('Template saved successfully!');
  };

  const loadTemplate = (template) => {
    setFormSections(template.sections);
    setTemplateName(template.name);
    localStorage.setItem('currentFertilityTemplate', JSON.stringify(template.sections));
  };

  const deleteTemplate = (templateId) => {
    if (confirm('Are you sure you want to delete this template?')) {
      const updatedTemplates = savedTemplates.filter(t => t.id !== templateId);
      localStorage.setItem('fertilityTemplates', JSON.stringify(updatedTemplates));
      setSavedTemplates(updatedTemplates);
    }
  };

  const applyTemplate = () => {
    localStorage.setItem('fertilityFormStructure', JSON.stringify(formSections));
    alert('Template applied to fertility form!');
    window.location.hash = '#fertility-fill';
  };

  return (
    <div className="lcnc-container">
      {/* LEFT PANEL - FIELD TYPES / TEMPLATES */}
      <div className="components-panel">
        <div className="panel-header">
          <h3>{activeTab === 'fields' ? 'Field Types' : 'Templates'}</h3>
          <button className="back-to-dashboard-btn" onClick={() => window.location.hash = '#fertility'}>
            ← Fertility
          </button>
        </div>
        
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'fields' ? 'active' : ''}`}
            onClick={() => setActiveTab('fields')}
          >
            Fields
          </button>
          <button 
            className={`tab-btn ${activeTab === 'templates' ? 'active' : ''}`}
            onClick={() => setActiveTab('templates')}
          >
            Templates ({savedTemplates.length})
          </button>
        </div>

        {activeTab === 'fields' ? (
          <div>
            <h4 style={{ padding: '10px', margin: 0, fontSize: '14px', color: '#6c757d' }}>
              Drag fields to sections
            </h4>
            {availableFieldTypes.map((fieldType, index) => (
              <div
                key={index}
                className="component-item"
                draggable
                onDragStart={(e) => handleDragStart(e, fieldType)}
              >
                {fieldType.label}
              </div>
            ))}
          </div>
        ) : (
          <div className="forms-list">
            {savedTemplates.length === 0 ? (
              <p className="no-forms-message">No saved templates yet</p>
            ) : (
              savedTemplates.map(template => (
                <div key={template.id} className="form-card-item">
                  <div className="form-card-content">
                    <h4>{template.name}</h4>
                    <p>{template.sections.length} sections</p>
                    <p>Created: {new Date(template.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button 
                      className="edit-field-btn" 
                      onClick={() => loadTemplate(template)}
                      title="Load template"
                    >
                      📂
                    </button>
                    <button 
                      className="delete-form-btn" 
                      onClick={() => deleteTemplate(template.id)}
                      title="Delete template"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* CENTER - FORM BUILDER */}
      <div className="form-area">
        <div className="form-builder-header">
          <div className="form-title-section">
            <h1>Fertility Form Template Editor</h1>
          </div>
          <div className="form-actions-top">
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Template Name"
              className="form-name-input"
            />
            <button className="save-form-button" onClick={saveTemplate}>
              Save Template
            </button>
            <button className="btn btn-success" onClick={applyTemplate}>
              Apply to Form
            </button>
          </div>
        </div>

        <div className="template-sections">
          {formSections.length === 0 ? (
            <p className="placeholder-text">
              Add sections to build your fertility form template
            </p>
          ) : (
            formSections.map((section, index) => (
              <div
                key={section.id}
                className={`template-section ${selectedSection?.id === section.id ? 'selected' : ''}`}
                draggable
                onDragStart={(e) => handleSectionDragStart(e, section.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleSectionDrop(e, section.id)}
                onClick={() => setSelectedSection(section)}
              >
                <div className="section-header">
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => updateSection(section.id, { title: e.target.value })}
                    className="section-title-input"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="section-actions">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSection(section.id);
                      }}
                    >
                      Remove Section
                    </button>
                  </div>
                </div>
                
                <div
                  className="section-fields"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => {
                    handleDrop(e, section.id);
                    e.currentTarget.classList.remove('drag-over');
                  }}
                >
                  {section.fields.length === 0 ? (
                    <p className="placeholder-text">Drag fields here</p>
                  ) : (
                    section.fields.map((field) => (
                      <div
                        key={field.id}
                        className={`template-field ${selectedField?.id === field.id ? 'selected' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedField(field);
                        }}
                      >
                        <div className="field-info">
                          <span className="field-type">{field.type}</span>
                          <span className="field-label">{field.label}</span>
                          {field.required && <span className="required-indicator">*</span>}
                        </div>
                        <div className="field-actions">
                          <button
                            className="edit-field-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedField(field);
                            }}
                          >
                            ✏️
                          </button>
                          <button
                            className="delete-field-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeField(section.id, field.id);
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <button className="btn btn-secondary" onClick={addSection} style={{ marginTop: '20px' }}>
          + Add Section
        </button>
      </div>

      {/* RIGHT PANEL - FIELD PROPERTIES */}
      <div className="properties-panel">
        <div className="panel-header">
          <h3>FIELD PROPERTIES</h3>
          <button className="back-to-dashboard-btn" onClick={() => window.location.hash = '#fertility'}>
            ← Fertility
          </button>
        </div>
        
        {selectedField ? (
          <div className="properties-content">
            <div className="property-group">
              <label>Field Type</label>
              <select
                value={selectedField.type}
                onChange={(e) => {
                  const updated = { ...selectedField, type: e.target.value };
                  setSelectedField(updated);
                  // Update in the section
                  const section = formSections.find(s => s.fields.some(f => f.id === selectedField.id));
                  if (section) {
                    updateField(section.id, selectedField.id, { type: e.target.value });
                  }
                }}
              >
                {availableFieldTypes.map(type => (
                  <option key={type.type} value={type.type}>{type.label}</option>
                ))}
              </select>
            </div>

            <div className="property-group">
              <label>Field Label</label>
              <input
                type="text"
                value={selectedField.label}
                onChange={(e) => {
                  const updated = { ...selectedField, label: e.target.value };
                  setSelectedField(updated);
                  const section = formSections.find(s => s.fields.some(f => f.id === selectedField.id));
                  if (section) {
                    updateField(section.id, selectedField.id, { label: e.target.value });
                  }
                }}
              />
            </div>

            <div className="property-group">
              <label>Placeholder</label>
              <input
                type="text"
                value={selectedField.placeholder || ''}
                onChange={(e) => {
                  const updated = { ...selectedField, placeholder: e.target.value };
                  setSelectedField(updated);
                  const section = formSections.find(s => s.fields.some(f => f.id === selectedField.id));
                  if (section) {
                    updateField(section.id, selectedField.id, { placeholder: e.target.value });
                  }
                }}
              />
            </div>

            <div className="property-group">
              <label>
                <input
                  type="checkbox"
                  checked={selectedField.required || false}
                  onChange={(e) => {
                    const updated = { ...selectedField, required: e.target.checked };
                    setSelectedField(updated);
                    const section = formSections.find(s => s.fields.some(f => f.id === selectedField.id));
                    if (section) {
                      updateField(section.id, selectedField.id, { required: e.target.checked });
                    }
                  }}
                />
                Required Field
              </label>
            </div>

            {selectedField.type === 'select' && (
              <div className="property-group">
                <label>Options (comma separated)</label>
                <textarea
                  value={(selectedField.options || []).join(', ')}
                  onChange={(e) => {
                    const options = e.target.value.split(',').map(opt => opt.trim()).filter(opt => opt);
                    const updated = { ...selectedField, options };
                    setSelectedField(updated);
                    const section = formSections.find(s => s.fields.some(f => f.id === selectedField.id));
                    if (section) {
                      updateField(section.id, selectedField.id, { options });
                    }
                  }}
                  rows={3}
                />
              </div>
            )}
          </div>
        ) : (
          <p className="placeholder-text">Select a field to edit properties</p>
        )}
      </div>
    </div>
  );
};

export default FertilityTemplateEditor;
