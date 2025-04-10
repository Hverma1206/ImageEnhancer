import React from 'react'

const ProcessExplanation = ({ explanationData }) => {
  return (
    <div className="explanation-container">
      <h2>{explanationData.title}</h2>
      
      <div className="steps-container">
        {explanationData.steps.map(step => (
          <div className="explanation-step" key={step.id}>
            <div className="step-number">{step.id}</div>
            <div className="step-content">
              <h3>{step.name}</h3>
              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="technologies-info">
        <h3>Technical Details</h3>
        <p>{explanationData.technologies}</p>
      </div>
    </div>
  )
}

export default ProcessExplanation
