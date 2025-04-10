import React, { useRef } from 'react'

const ImageUpload = ({ onImageUpload }) => {
  const fileInputRef = useRef(null)

  const handleButtonClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.match('image.*')) {
      onImageUpload(file)
    }
  }

  return (
    <div className="upload-container">
      <h2>Upload Your Image</h2>
      <button className="upload-btn" onClick={handleButtonClick}>
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