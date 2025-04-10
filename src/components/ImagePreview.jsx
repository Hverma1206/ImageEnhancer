import React from 'react'
import { generateEnhancedFilename } from '../utils/imageEnhancer'

const ImagePreview = ({ originalImage, enhancedImage, isEnhancing, originalFilename }) => {
  const handleDownload = () => {
    if (!enhancedImage) return;

    // Generate a filename based on the original filename
    const downloadFilename = generateEnhancedFilename(originalFilename);

    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = enhancedImage;
    link.download = downloadFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!originalImage) {
    return (
      <div className="preview-placeholder">
        <p>Upload an image to see the enhanced version</p>
      </div>
    )
  }

  return (
    <div className="preview-container">
      <div className="image-comparison">
        <div className="image-box">
          <h3>Original Image</h3>
          <div className="image-wrapper">
            <img src={originalImage} alt="Original" />
          </div>
        </div>
        
        <div className="image-box">
          <h3>Enhanced Image</h3>
          <div className="image-wrapper">
            {isEnhancing && (
              <div className="loading">
                <div className="spinner"></div>
                <p>Applying AI enhancements...</p>
              </div>
            )}
            {!isEnhancing && enhancedImage && (
              <img src={enhancedImage} alt="Enhanced" />
            )}
            {!isEnhancing && !enhancedImage && (
              <div className="loading">Processing complete soon...</div>
            )}
          </div>
          {enhancedImage && !isEnhancing && (
            <>
              <div className="enhancement-metrics">
                <span className="metric">✓ Brightness enhanced</span>
                <span className="metric">✓ Contrast improved</span>
                <span className="metric">✓ Colors enriched</span>
              </div>
              <button className="download-btn" onClick={handleDownload}>
                <span className="download-icon">↓</span> Download Enhanced Image
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImagePreview