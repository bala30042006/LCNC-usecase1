import React, { useState, useEffect } from 'react';
import '../styles/FormBuilder.css';

// Fertility Create Page - Professional form builder with clean UI
const FertilityCreatePage = () => {
  const [formFields, setFormFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [formName, setFormName] = useState('Fertility Registration Form');
  const [savedForms, setSavedForms] = useState([]);
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
    // Load saved forms from localStorage
    const forms = JSON.parse(localStorage.getItem('fertilitySavedForms') || '[]');
    setSavedForms(forms);
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

  const deleteForm = (formId) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      const updatedForms = savedForms.filter(form => form.id !== formId);
      setSavedForms(updatedForms);
      localStorage.setItem('fertilitySavedForms', JSON.stringify(updatedForms));
      alert('Form deleted successfully!');
    }
  };

  const saveForm = () => {
    if (formFields.length === 0) {
      alert('Please add at least one field to the form');
      return;
    }

    const formData = {
      id: Date.now(),
      name: formName,
      fields: formFields,
      createdAt: new Date().toISOString()
    };
    
    // Get existing forms from localStorage
    const existingForms = JSON.parse(localStorage.getItem('fertilitySavedForms') || '[]');
    existingForms.push(formData);
    
    // Save to localStorage
    localStorage.setItem('fertilitySavedForms', JSON.stringify(existingForms));
    localStorage.setItem('fertilityFormStructure', JSON.stringify(formFields));
    
    // Update local state
    setSavedForms(existingForms);
    
    alert('Fertility form saved successfully! You can now fill it in the Fill Form page.');
    window.location.hash = '#fertility-fill';
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
    <div className="lcnc-container">
      {/* LEFT PANEL – COMPONENTS/FORMS */}
      <div className="components-panel">
        <div className="panel-header">
          <h3>{activeTab === 'components' ? 'Components' : 'Saved Forms'}</h3>
          <button className="back-to-dashboard-btn" onClick={() => window.location.hash = '#fertility'}>
            ← Fertility
          </button>
        </div>
        
        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'components' ? 'active' : ''}`}
            onClick={() => setActiveTab('components')}
          >
            Components
          </button>
          <button 
            className={`tab-btn ${activeTab === 'forms' ? 'active' : ''}`}
            onClick={() => setActiveTab('forms')}
          >
            Forms ({savedForms.length})
          </button>
        </div>

        {activeTab === 'components' ? (
          AVAILABLE_COMPONENTS.map((component, index) => (
            <div
              key={index}
              className="component-item"
              draggable
              onDragStart={(e) => onDragStart(e, component)}
            >
              {component.label}
            </div>
          ))
        ) : (
          <div className="forms-list">
            {savedForms.length === 0 ? (
              <p className="no-forms-message">No saved forms yet</p>
            ) : (
              savedForms.map(form => (
                <div key={form.id} className="form-card-item">
                  <div className="form-card-content">
                    <h4>{form.name}</h4>
                    <p>{form.fields.length} fields</p>
                    <p>Created: {new Date(form.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button 
                    className="delete-form-btn" 
                    onClick={() => deleteForm(form.id)}
                    title="Delete form"
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* CENTER – FORM AREA */}
      <div className="form-area" onDragOver={onDragOver} onDrop={onDrop}>
        <div className="form-builder-header">
          <div className="form-title-section">
            <h1>Fertility Form Builder</h1>
          </div>
          <div className="form-actions-top">
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Form Name"
              className="form-name-input"
            />
            <button className="save-form-button" onClick={saveForm}>
              Save Form
            </button>
          </div>
        </div>

        {formFields.length === 0 && (
          <p className="placeholder-text">
            Drag fields here to build fertility form
          </p>
        )}

        {formFields.map((field) => (
          <div 
            key={field.id} 
            className={`form-field ${selectedField?.id === field.id ? 'selected' : ''}`}
            onClick={() => setSelectedField(field)}
          >
            <div className="field-label">{field.title}</div>
            {renderField(field)}
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
                  deleteField(field.id);
                }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}

      </div>

      {/* RIGHT PANEL – PROPERTIES */}
      <div className="properties-panel">
        <div className="panel-header">
          <h3>PROPERTIES</h3>
          <button className="back-to-dashboard-btn" onClick={() => window.location.hash = '#fertility'}>
            ← Fertility
          </button>
        </div>
        {selectedField ? (
          <div className="properties-content">
            <div className="property-group">
              <label>Title</label>
              <input
                type="text"
                value={selectedField.title}
                onChange={(e) => {
                  const updated = { ...selectedField, title: e.target.value };
                  setSelectedField(updated);
                }}
              />
            </div>

            <div className="property-group">
              <label>Label Text</label>
              <input
                type="text"
                value={selectedField.label}
                onChange={(e) => {
                  const updated = { ...selectedField, label: e.target.value };
                  setSelectedField(updated);
                }}
              />
            </div>

            <div className="property-group">
              <label>Background Color</label>
              <input
                type="color"
                value={selectedField.backgroundColor}
                onChange={(e) => {
                  const updated = { ...selectedField, backgroundColor: e.target.value };
                  setSelectedField(updated);
                }}
              />
            </div>

            <div className="property-group">
              <label>Text Color</label>
              <input
                type="color"
                value={selectedField.textColor}
                onChange={(e) => {
                  const updated = { ...selectedField, textColor: e.target.value };
                  setSelectedField(updated);
                }}
              />
            </div>

            <div className="property-group">
              <label>Font Size</label>
              <select
                value={selectedField.fontSize}
                onChange={(e) => {
                  const updated = { ...selectedField, fontSize: e.target.value };
                  setSelectedField(updated);
                }}
              >
                <option value="12px">12px</option>
                <option value="14px">14px</option>
                <option value="16px">16px</option>
                <option value="18px">18px</option>
                <option value="20px">20px</option>
              </select>
            </div>

            <div className="property-group">
              <label>Font Weight</label>
              <select
                value={selectedField.fontWeight}
                onChange={(e) => {
                  const updated = { ...selectedField, fontWeight: e.target.value };
                  setSelectedField(updated);
                }}
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
              </select>
            </div>

            <div className="property-group">
              <label>Border Radius</label>
              <select
                value={selectedField.borderRadius}
                onChange={(e) => {
                  const updated = { ...selectedField, borderRadius: e.target.value };
                  setSelectedField(updated);
                }}
              >
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
