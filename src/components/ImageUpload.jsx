import React, { useRef, useState } from 'react'

const ImageUpload = ({ onImageUpload }) => {
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleButtonClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.match('image.*')) {
      onImageUpload(file)
    }
  }
  
  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }
  
  const handleDragLeave = () => {
    setIsDragging(false)
  }
  
  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file && file.type.match('image.*')) {
      onImageUpload(file)
    }
  }

  return (
    <div 
      className={`upload-container ${isDragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="upload-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 14V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V14" stroke="#6c5ce7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 3L12 15M12 3L8 7M12 3L16 7" stroke="#6c5ce7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h2>Enhance Your Image</h2>
      <p className="upload-instructions">Drag & drop your image here or</p>
      <button className="upload-btn pulse" onClick={handleButtonClick}>
        Choose an Image
      </button>
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleFileChange}
      />
      <p className="upload-info">Supported formats: JPEG, PNG, WebP</p>
    </div>
  )
}

export default ImageUpload