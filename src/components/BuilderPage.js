import React, { useState, useEffect } from 'react';

// Builder Page Component - Drag and Drop functionality for creating report forms
const BuilderPage = () => {
  const [droppedComponents, setDroppedComponents] = useState([]);
  const [draggedComponent, setDraggedComponent] = useState(null);

  // Available draggable components
  const availableComponents = [
    { type: 'text', label: 'Text Input', icon: '📝' },
    { type: 'textarea', label: 'Text Area', icon: '📄' },
    { type: 'date', label: 'Date Picker', icon: '📅' },
    { type: 'dropdown', label: 'Dropdown', icon: '📋' }
  ];

  // Load saved report structure from localStorage on component mount
  useEffect(() => {
    const savedStructure = localStorage.getItem('reportStructure');
    if (savedStructure) {
      try {
        setDroppedComponents(JSON.parse(savedStructure));
      } catch (error) {
        console.error('Error loading saved structure:', error);
      }
    }
  }, []);

  // Save report structure to localStorage whenever it changes
  useEffect(() => {
    if (droppedComponents.length > 0) {
      localStorage.setItem('reportStructure', JSON.stringify(droppedComponents));
    }
  }, [droppedComponents]);

  // Handle drag start - store the component being dragged
  const handleDragStart = (e, component) => {
    setDraggedComponent(component);
    e.target.classList.add('dragging');
  };

  // Handle drag end - remove dragging class
  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
  };

  // Handle drag over canvas - prevent default to allow drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  // Handle drag leave - remove drag-over class
  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  // Handle drop on canvas - add component to dropped components
  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    if (draggedComponent) {
      const newComponent = {
        id: Date.now().toString(), // Unique ID using timestamp
        type: draggedComponent.type,
        label: draggedComponent.label,
        editableLabel: draggedComponent.label,
        options: draggedComponent.type === 'dropdown' ? ['Option 1', 'Option 2', 'Option 3'] : []
      };
      
      setDroppedComponents([...droppedComponents, newComponent]);
      setDraggedComponent(null);
    }
  };

  // Update component label
  const updateLabel = (id, newLabel) => {
    setDroppedComponents(components =>
      components.map(comp =>
        comp.id === id ? { ...comp, editableLabel: newLabel } : comp
      )
    );
  };

  // Remove component from canvas
  const removeComponent = (id) => {
    setDroppedComponents(components =>
      components.filter(comp => comp.id !== id)
    );
  };

  // Clear all components
  const clearCanvas = () => {
    setDroppedComponents([]);
    localStorage.removeItem('reportStructure');
  };

  return (
    <div className="builder-layout">
      {/* Left Panel - Available Components */}
      <div className="components-panel">
        <h2>Form Components</h2>
        {availableComponents.map((component, index) => (
          <div
            key={index}
            className="component-item"
            draggable
            onDragStart={(e) => handleDragStart(e, component)}
            onDragEnd={handleDragEnd}
          >
            <span>{component.icon}</span> {component.label}
          </div>
        ))}
        <button 
          className="btn btn-secondary" 
          style={{ marginTop: '1rem', width: '100%' }}
          onClick={clearCanvas}
        >
          Clear Canvas
        </button>
      </div>

      {/* Center Canvas - Drop Area */}
      <div className="canvas">
        <h2>Report Canvas</h2>
        <div
          className="canvas-drop-area"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            minHeight: '300px',
            border: droppedComponents.length === 0 ? '2px dashed #ddd' : 'none',
            borderRadius: '4px',
            padding: droppedComponents.length === 0 ? '2rem' : '0'
          }}
        >
          {droppedComponents.length === 0 ? (
            <div className="empty-state">
              <h3>Drag components here to build your report</h3>
              <p>Start by dragging form components from the left panel</p>
            </div>
          ) : (
            droppedComponents.map((component) => (
              <div key={component.id} className="dropped-component">
                <div className="component-label">
                  <input
                    type="text"
                    className="editable-label"
                    value={component.editableLabel}
                    onChange={(e) => updateLabel(component.id, e.target.value)}
                  />
                  <button
                    className="remove-btn"
                    onClick={() => removeComponent(component.id)}
                  >
                    Remove
                  </button>
                </div>
                
                {/* Render preview of the component */}
                {component.type === 'text' && (
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Text input preview"
                    disabled
                  />
                )}
                {component.type === 'textarea' && (
                  <textarea
                    className="form-textarea"
                    placeholder="Text area preview"
                    disabled
                  />
                )}
                {component.type === 'date' && (
                  <input
                    type="date"
                    className="form-date"
                    disabled
                  />
                )}
                {component.type === 'dropdown' && (
                  <select className="form-select" disabled>
                    <option value="">Select an option</option>
                    {component.options.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                )}
              </div>
            ))
          )}
        </div>
        
        {droppedComponents.length > 0 && (
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <p style={{ color: '#27ae60', fontWeight: '600' }}>
              ✓ Report structure saved automatically
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuilderPage;
