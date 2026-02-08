import React, { useState, useEffect } from 'react';
import '../styles/FormBuilder.css';

// Fertility Create Page - Professional form builder with clean UI
const FertilityCreatePage = () => {
  const [formFields, setFormFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [formName, setFormName] = useState('Fertility Form Template');
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [activeTab, setActiveTab] = useState('components');
  const [formSections, setFormSections] = useState([
    { id: 'section-' + Date.now(), title: 'Untitled Section', fields: [] }
  ]);

  // Available components specific to fertility
  const AVAILABLE_COMPONENTS = [
    { type: "text", label: "Patient Name" },
    { type: "text", label: "Partner Name" },
    { type: "date", label: "Date of Birth" },
    { type: "text", label: "Medical History" },
    { type: "textarea", label: "Symptoms" },
    { type: "textarea", label: "Previous Treatments" },
    { type: "dropdown", label: "Treatment Type" },
    { type: "date", label: "Last Consultation" },
    { type: "text", label: "Doctor Name" },
    { type: "textarea", label: "Notes" },
    { type: "number", label: "Age" },
    { type: "text", label: "Phone Number" },
    { type: "email", label: "Email" },
    { type: "toggle", label: "Emergency Contact" },
    { type: "submit", label: "Submit Button" }
  ];

  useEffect(() => {
    // Load saved templates from fertilityTemplates storage
    const templates = JSON.parse(localStorage.getItem('fertilityTemplates') || '[]');
    setSavedTemplates(templates);
  }, []);

  // When admin starts dragging a component
  const onDragStart = (e, component) => {
    e.dataTransfer.setData("component", JSON.stringify(component));
  };

  // Allow drop
  const onDragOver = (e) => {
    e.preventDefault();
  };

  // When admin drops component into form area
  const onDrop = (e) => {
    const component = JSON.parse(e.dataTransfer.getData("component"));

    const newField = {
      id: Date.now(),
      type: component.type,
      label: component.label,
      title: component.label,
      backgroundColor: '#ffffff',
      textColor: '#000000',
      fontSize: '14px',
      fontWeight: 'normal',
      borderRadius: '6px',
      padding: '10px',
      marginBottom: '12px',
      ...(component.type === 'submit' && {
        buttonText: 'Submit',
        backgroundColor: '#007bff',
        textColor: '#ffffff'
      }),
      ...(component.type === 'dropdown' && {
        options: ['IVF', 'IUI', 'ICSI', 'Medication', 'Monitoring', 'Other']
      })
    };

    setFormFields([...formFields, newField]);
    // Add to the first section for now
    setFormSections(prevSections => {
      const updatedSections = [...prevSections];
      if (updatedSections.length > 0) {
        updatedSections[0].fields.push(newField);
      }
      return updatedSections;
    });
  };

  const addSection = () => {
    setFormSections(prevSections => [
      ...prevSections,
      { id: 'section-' + Date.now(), title: 'New Section', fields: [] }
    ]);
  };

  const removeSection = (sectionId) => {
    setFormSections(prevSections => prevSections.filter(section => section.id !== sectionId));
  };

  const updateSectionTitle = (sectionId, title) => {
    setFormSections(prevSections => 
      prevSections.map(section => 
        section.id === sectionId ? { ...section, title } : section
      )
    );
  };

  const updateField = (fieldId, updates) => {
    // Update both formFields and formSections
    setFormFields(formFields.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    ));
    
    setFormSections(prevSections => 
      prevSections.map(section => ({
        ...section,
        fields: section.fields.map(field => 
          field.id === fieldId ? { ...field, ...updates } : field
        )
      }))
    );
  };

  const loadTemplate = (template) => {
    // Load template sections and fields into form builder
    if (template.sections && template.sections.length > 0) {
      setFormSections(template.sections);
      setFormName(template.name);
      
      // Also update formFields for compatibility
      const allFields = template.sections.flatMap(section => section.fields || []);
      setFormFields(allFields);
      
      alert(`Template "${template.name}" loaded successfully!`);
    }
  };

  const saveForm = () => {
    if (formSections.length === 0 || formSections.every(section => section.fields.length === 0)) {
      alert('Please add at least one field to the form');
      return;
    }

    // Create template structure
    const template = {
      id: Date.now().toString(),
      name: formName,
      sections: formSections.map(section => ({
        id: section.id,
        title: section.title,
        fields: section.fields.map((field, index) => ({
          id: field.id || `field_${index}`,
          label: field.label,
          type: field.type,
          required: field.required || false,
          placeholder: field.placeholder || '',
          options: field.options || [],
          backgroundColor: field.backgroundColor || '#ffffff',
          textColor: field.textColor || '#000000',
          fontSize: field.fontSize || '14px',
          fontWeight: field.fontWeight || 'normal',
          borderRadius: field.borderRadius || '6px',
          padding: field.padding || '10px',
          marginBottom: field.marginBottom || '12px',
          buttonText: field.buttonText
        }))
      })),
      createdAt: new Date().toISOString()
    };
    
    // Get existing templates from fertilityTemplates storage
    const existingTemplates = JSON.parse(localStorage.getItem('fertilityTemplates') || '[]');
    existingTemplates.push(template);
    
    // Save to fertilityTemplates storage (used by Edit Template page)
    localStorage.setItem('fertilityTemplates', JSON.stringify(existingTemplates));
    
    // Update local state
    setSavedTemplates(existingTemplates);
    
    alert(`Template "${formName}" saved successfully and is now available in Edit Template page!`);
  };

  const saveField = () => {
    if (selectedField) {
      updateField(selectedField.id, selectedField);
      alert('Field saved successfully!');
    }
  };

  const deleteField = (fieldId) => {
    setFormFields(formFields.filter(field => field.id !== fieldId));
    setSelectedField(null);
  };

  // Render field based on type
  const renderField = (field) => {
    const fieldStyle = {
      backgroundColor: field.backgroundColor,
      color: field.textColor,
      fontSize: field.fontSize,
      fontWeight: field.fontWeight,
      borderRadius: field.borderRadius,
      padding: field.padding,
      marginBottom: field.marginBottom,
      border: '1px solid #ddd',
      width: '100%'
    };

    switch (field.type) {
      case "text":
      case "email":
        return <input className="form-input" type={field.type} placeholder={field.label} style={fieldStyle} />;

      case "number":
        return <input className="form-input" type="number" placeholder={field.label} style={fieldStyle} />;

      case "date":
        return <input className="form-input" type="date" style={fieldStyle} />;

      case "textarea":
        return <textarea className="form-input" placeholder={field.label} style={{...fieldStyle, minHeight: '80px'}} />;

      case "dropdown":
        return (
          <select className="form-input" style={fieldStyle}>
            <option value="">Select {field.label}</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );

      case "toggle":
        return (
          <label className="toggle-label" style={fieldStyle}>
            <input type="checkbox" />
            <span>{field.label}</span>
          </label>
        );

      case "submit":
        return (
          <button 
            className="form-submit-btn" 
            style={{
              backgroundColor: field.backgroundColor,
              color: field.textColor,
              fontSize: field.fontSize,
              fontWeight: field.fontWeight,
              borderRadius: field.borderRadius,
              padding: field.padding,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {field.buttonText}
          </button>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="lcnc-container">
        {/* HEADER */}
        <div className="page-header">
          <h1>Fertility Form Template Editor</h1>
          <div className="header-actions">
            <button className="back-btn" onClick={() => window.location.hash = '#fertility'}>
              ← Fertility
            </button>
          </div>
        </div>

        {/* MAIN CONTENT - THREE COLUMN LAYOUT */}
        <div className="template-editor-layout">
          {/* LEFT SIDEBAR - FIELDS/TEMPLATES */}
          <div className="template-sidebar">
            {/* Tab Navigation */}
            <div className="sidebar-tabs">
              <button 
                className={`tab-btn ${activeTab === 'fields' ? 'active' : ''}`}
                onClick={() => setActiveTab('fields')}
              >
                🧩 Fields
              </button>
              <button 
                className={`tab-btn ${activeTab === 'templates' ? 'active' : ''}`}
                onClick={() => setActiveTab('templates')}
              >
                📋 Templates ({savedTemplates.length})
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === 'fields' && (
                <div className="fields-list">
                  <h4>Available Fields</h4>
                  <p>Drag these fields to build your form:</p>
                  {AVAILABLE_COMPONENTS.map((component, index) => (
                    <div
                      key={index}
                      className="field-item"
                      draggable
                      onDragStart={(e) => onDragStart(e, component)}
                    >
                      <div className="field-icon">
                        {component.type === 'text' && '📝'}
                        {component.type === 'date' && '📅'}
                        {component.type === 'textarea' && '📄'}
                        {component.type === 'dropdown' && '📋'}
                        {component.type === 'number' && '🔢'}
                        {component.type === 'email' && '📧'}
                        {component.type === 'submit' && '✅'}
                      </div>
                      <span>{component.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'templates' && (
                <div className="templates-list">
                  <h4>Saved Templates</h4>
                  <p>Click on a template to load it:</p>
                  {savedTemplates.length === 0 ? (
                    <div className="empty-state">
                      <p>No templates saved yet</p>
                      <p>Create your first template!</p>
                    </div>
                  ) : (
                    savedTemplates.map(template => (
                      <div key={template.id} className="template-item">
                        <div className="template-info">
                          <div className="template-icon">📁</div>
                          <div className="template-details">
                            <h5>{template.name}</h5>
                            <small>{template.sections?.length || 0} sections</small>
                            <small>Created: {new Date(template.createdAt).toLocaleDateString()}</small>
                          </div>
                        </div>
                        <div className="template-actions">
                          <button 
                            className="load-template-btn" 
                            onClick={() => loadTemplate(template)}
                          >
                            🔄 Load
                          </button>
                          <button 
                            className="delete-template-btn"
                            onClick={() => {
                              if (confirm(`Delete template "${template.name}"?`)) {
                                const updated = savedTemplates.filter(t => t.id !== template.id);
                                setSavedTemplates(updated);
                                localStorage.setItem('fertilityTemplates', JSON.stringify(updated));
                              }
                            }}
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
          </div>

          {/* MIDDLE COLUMN - FORM BUILDER */}
          <div className="form-builder-main">
            <div className="form-builder-header">
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Template Name"
                className="template-name-input"
              />
              <div className="form-actions">
                <button className="save-template-btn" onClick={saveForm}>
                  💾 Save Template
                </button>
                <button className="apply-template-btn">
                  ✅ Apply to Form
                </button>
              </div>
            </div>

            {/* Form Sections */}
            <div className="form-sections-container">
              {formSections.length === 0 ? (
                <div className="empty-form-area">
                  <div className="empty-icon">📝</div>
                  <h3>Start Building Your Form</h3>
                  <p>Drag fields from the left panel to begin creating your template</p>
                </div>
              ) : (
                formSections.map((section, sectionIndex) => (
                  <div key={section.id} className="form-section">
                    <div className="section-header">
                      <h4>{section.title.toUpperCase()}</h4>
                      <button 
                        className="remove-section-btn"
                        onClick={() => removeSection(section.id)}
                      >
                        Remove Section
                      </button>
                    </div>
                    <div 
                      className="section-fields"
                      onDragOver={onDragOver}
                      onDrop={(e) => {
                        e.preventDefault();
                        const component = JSON.parse(e.dataTransfer.getData("component"));
                        const newField = {
                          id: Date.now(),
                          type: component.type,
                          label: component.label,
                          title: component.label,
                          backgroundColor: '#ffffff',
                          textColor: '#000000',
                          fontSize: '14px',
                          fontWeight: 'normal',
                          borderRadius: '6px',
                          padding: '10px',
                          marginBottom: '12px',
                          ...(component.type === 'submit' && {
                            buttonText: 'Submit',
                            backgroundColor: '#007bff',
                            textColor: '#ffffff'
                          }),
                          ...(component.type === 'dropdown' && {
                            options: ['IVF', 'IUI', 'ICSI', 'Medication', 'Monitoring', 'Other']
                          })
                        };
                        
                        setFormSections(prevSections => {
                          const updated = [...prevSections];
                          updated[sectionIndex].fields.push(newField);
                          return updated;
                        });
                        
                        setFormFields(prev => [...prev, newField]);
                      }}
                    >
                      {section.fields.length === 0 ? (
                        <p className="empty-section">Drag fields here</p>
                      ) : (
                        section.fields.map((field, fieldIndex) => (
                          <div
                            key={field.id}
                            className={`form-field-item ${selectedField?.id === field.id ? 'selected' : ''}`}
                            onClick={() => setSelectedField(field)}
                          >
                            <div className="field-item-header">
                              <span className="field-type-badge">{field.type.toUpperCase()}</span>
                              <span className="field-label-text">{field.label.toUpperCase()}</span>
                              {field.required && <span className="required-asterisk">*</span>}
                            </div>
                            <div className="field-preview">
                              {renderField(field)}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))
              )}
              
              {/* Add Section Button */}
              <button className="add-section-btn" onClick={addSection}>
                + Add Section
              </button>
            </div>
          </div>

          {/* RIGHT SIDEBAR - FIELD PROPERTIES */}
          <div className="field-properties-sidebar">
            <div className="properties-header">
              <h3>FIELD PROPERTIES</h3>
            </div>
            <div className="properties-content">
              {selectedField ? (
                <div className="properties-form">
                  <div className="property-group">
                    <label>Field Label</label>
                    <input
                      type="text"
                      value={selectedField.label}
                      onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                      className="property-input"
                    />
                  </div>
                  <div className="property-group">
                    <label>Placeholder</label>
                    <input
                      type="text"
                      value={selectedField.placeholder || ''}
                      onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
                      className="property-input"
                    />
                  </div>
                  <div className="property-group">
                    <label>Field Type</label>
                    <select
                      value={selectedField.type}
                      onChange={(e) => updateField(selectedField.id, { type: e.target.value })}
                      className="property-select"
                    >
                      <option value="text">Text</option>
                      <option value="date">Date</option>
                      <option value="textarea">Textarea</option>
                      <option value="dropdown">Dropdown</option>
                      <option value="number">Number</option>
                      <option value="email">Email</option>
                      <option value="submit">Submit Button</option>
                    </select>
                  </div>
                  <div className="property-group">
                    <label>Required</label>
                    <input
                      type="checkbox"
                      checked={selectedField.required || false}
                      onChange={(e) => updateField(selectedField.id, { required: e.target.checked })}
                      className="property-checkbox"
                    />
                  </div>
                  {selectedField.type === 'submit' && (
                    <div className="property-group">
                      <label>Button Text</label>
                      <input
                        type="text"
                        value={selectedField.buttonText}
                        onChange={(e) => updateField(selectedField.id, { buttonText: e.target.value })}
                        className="property-input"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="no-field-selected">
                  <p>Select a field to edit properties</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FertilityCreatePage;
