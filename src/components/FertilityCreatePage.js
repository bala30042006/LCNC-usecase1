import React, { useState, useEffect } from 'react';
import '../styles/FormBuilder.css';

// Fertility Create Page - Professional form builder with clean UI
const FertilityCreatePage = () => {
  const [formFields, setFormFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [formName, setFormName] = useState('Fertility Form Template');
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [activeTab, setActiveTab] = useState('components');

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
  };

  const updateField = (fieldId, updates) => {
    setFormFields(formFields.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    ));
  };

  const loadTemplate = (template) => {
    // Load template fields into form builder
    if (template.sections && template.sections.length > 0) {
      const fields = template.sections[0].fields || [];
      setFormFields(fields);
      setFormName(template.name);
      alert(`Template "${template.name}" loaded successfully!`);
    }
  };

  const saveForm = () => {
    if (formFields.length === 0) {
      alert('Please add at least one field to the form');
      return;
    }

    // Create template structure
    const template = {
      id: Date.now().toString(),
      name: formName,
      sections: [
        {
          id: 'main-section',
          title: formName,
          fields: formFields.map((field, index) => ({
            id: field.id || `field_${index}`,
            label: field.label,
            type: field.type,
            required: field.required || false,
            placeholder: field.placeholder || '',
            options: field.options || []
          }))
        }
      ],
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
  return (
    <div className="lcnc-container">
      {/* HEADER */}
      <div className="page-header">
        <h1>Create Fertility Form Template</h1>
        <p>Build custom fertility form templates by dragging and dropping fields</p>
        <button className="back-btn" onClick={() => window.location.hash = '#fertility'}>
          ← Back to Fertility
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="create-form-content">
        {/* LEFT SIDEBAR */}
        <div className="create-sidebar">
          {/* Tab Navigation */}
          <div className="sidebar-tabs">
            <button 
              className={`tab-btn ${activeTab === 'components' ? 'active' : ''}`}
              onClick={() => setActiveTab('components')}
            >
              🧩 Components
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
            {activeTab === 'components' && (
              <div className="components-list">
                <h4>Available Components</h4>
                <p>Drag these components to build your form:</p>
                {AVAILABLE_COMPONENTS.map((component, index) => (
                  <div
                    key={index}
                    className="component-item"
                    draggable
                    onDragStart={(e) => onDragStart(e, component)}
                  >
                    <div className="component-icon">
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
                <p>Click on a template to load it into the form builder:</p>
                {savedTemplates.length === 0 ? (
                  <div className="empty-state">
                    <p>No templates saved yet</p>
                    <p>Create your first template above!</p>
                  </div>
                ) : (
                  savedTemplates.map(template => (
                    <div key={template.id} className="template-card">
                      <div className="template-header">
                        <h5>{template.name}</h5>
                        <small>{new Date(template.createdAt).toLocaleDateString()}</small>
                      </div>
                      <div className="template-actions">
                        <button 
                          className="load-template-btn" 
                          onClick={() => loadTemplate(template)}
                        >
                          🔄 Load
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT - FORM BUILDER */}
        <div className="create-form-builder">
          <div className="form-builder-header">
            <h2>{formName || 'Untitled Template'}</h2>
            <div className="form-actions">
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Template Name"
                className="template-name-input"
              />
              <button className="save-template-btn" onClick={saveForm}>
                💾 Save Template
              </button>
            </div>
          </div>

          {/* Form Area */}
          <div className="form-area" onDragOver={onDragOver} onDrop={onDrop}>
            {formFields.length === 0 ? (
              <div className="empty-form-area">
                <div className="empty-icon">📝</div>
                <h3>Start Building Your Form</h3>
                <p>Drag components from the left panel to begin creating your fertility form template</p>
                <div className="drag-hint">
                  <p>💡 <strong>Tip:</strong> You can also click on the Templates tab to load and edit existing templates</p>
                </div>
              </div>
            ) : (
              <div className="form-fields-container">
                {formFields.map((field, index) => (
                  <div
                    key={field.id}
                    className={`form-field ${selectedField?.id === field.id ? 'selected' : ''}`}
                    onClick={() => setSelectedField(field)}
                  >
                    <div className="field-header">
                      <span className="field-type">{field.type}</span>
                      <span className="field-label">{field.label}</span>
                      <button 
                        className="remove-field-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteField(field.id);
                        }}
                      >
                        ✕
                      </button>
                    </div>
                    <div className="field-content">
                      {field.type === 'text' && (
                        <input
                          type="text"
                          placeholder={field.placeholder || field.label}
                          className="field-input"
                          readOnly
                        />
                      )}
                      {field.type === 'date' && (
                        <input
                          type="date"
                          className="field-input"
                          readOnly
                        />
                      )}
                      {field.type === 'textarea' && (
                        <textarea
                          placeholder={field.placeholder || field.label}
                          className="field-textarea"
                          rows="3"
                          readOnly
                        />
                      )}
                      {field.type === 'dropdown' && (
                        <select className="field-select" readOnly>
                          <option>{field.label}</option>
                        </select>
                      )}
                      {field.type === 'number' && (
                        <input
                          type="number"
                          placeholder={field.placeholder || field.label}
                          className="field-input"
                          readOnly
                        />
                      )}
                      {field.type === 'email' && (
                        <input
                          type="email"
                          placeholder={field.placeholder || field.label}
                          className="field-input"
                          readOnly
                        />
                      )}
                      {field.type === 'submit' && (
                        <button className="field-submit" disabled>
                          {field.label}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Field Properties Panel */}
      {selectedField && (
        <div className="field-properties-panel">
          <div className="properties-header">
            <h3>Field Properties</h3>
            <button 
              className="close-properties-btn"
              onClick={() => setSelectedField(null)}
            >
              ✕
            </button>
          </div>
          <div className="properties-content">
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
            <button 
              className="save-field-btn"
              onClick={() => {
                updateField(selectedField.id, selectedField);
                setSelectedField(null);
              }}
            >
              Save Changes
            </button>
                <option value="0px">0px</option>
                <option value="4px">4px</option>
                <option value="6px">6px</option>
                <option value="8px">8px</option>
                <option value="12px">12px</option>
              </select>
            </div>

            {selectedField.type === 'submit' && (
              <div className="property-group">
                <label>Button Text</label>
                <input
                  type="text"
                  value={selectedField.buttonText}
                  onChange={(e) => {
                    const updated = { ...selectedField, buttonText: e.target.value };
                    setSelectedField(updated);
                  }}
                />
              </div>
            )}

            <div className="properties-actions">
              <button className="save-field-button" onClick={saveField}>
                Save Field
              </button>
              <button className="delete-button" onClick={() => deleteField(selectedField.id)}>
                Delete Field
              </button>
            </div>
          </div>
        ) : (
          <p className="placeholder-text">Select a field to edit properties</p>
        )}
      </div>
    </div>
  );
};

export default FertilityCreatePage;
