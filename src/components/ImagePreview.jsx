import React from 'react'
import { generateEnhancedFilename } from '../utils/imageEnhancer'

const ImagePreview = ({ originalImage, enhancedImage, isEnhancing, originalFilename }) => {
  const handleDownload = () => {
    if (!enhancedImage) return;

    const downloadFilename = generateEnhancedFilename(originalFilename);

    const link = document.createElement('a');
    link.href = enhancedImage;
    link.download = downloadFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!originalImage) {
    return (
      <>
      </>
    )
  }

  return (
    <div className="preview-container fade-in">
      <div className="image-comparison">
        <div className="image-box glow-effect">
          <h3>Original Image</h3>
          <div className="image-wrapper">
            <img src={originalImage} alt="Original" />
          </div>
        </div>
        
        <div className="image-box glow-effect">
          <h3>Enhanced Image</h3>
          <div className="image-wrapper">
            {!isEnhancing && enhancedImage && (
              <img src={enhancedImage} alt="Enhanced" />
            )}
            {!isEnhancing && !enhancedImage && (
              <div className="loading">Processing complete soon...</div>
            )}
          </div>
          {enhancedImage && !isEnhancing && (
            <>
              <button 
                className="download-btn" 
                onClick={handleDownload}
                aria-label="Download enhanced image"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 12l-4-4h2.5V3h3v5H12L8 12z"/>
                  <path d="M14 14H2v-3h2v1h8v-1h2v3z"/>
                </svg>
                Download Enhanced Image
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImagePreview