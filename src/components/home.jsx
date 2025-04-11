import React, { useState } from 'react'
import ImageUpload from './ImageUpload'
import ImagePreview from './ImagePreview'
import ProcessExplanation from './ProcessExplanation'
// import { getEnhancementExplanation } from '../utils/imageEnhancer'
import { enhanceImageWithPython } from '../api/enhancerApi'

const Home = () => {
  const [originalImage, setOriginalImage] = useState(null)
  const [enhancedImage, setEnhancedImage] = useState(null)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [originalFilename, setOriginalFilename] = useState('')
//   const [enhancementInfo] = useState(getEnhancementExplanation())
  
  const handleImageUpload = async (file) => {
    const imageUrl = URL.createObjectURL(file)
    setOriginalImage(imageUrl)
    setOriginalFilename(file.name)
    setEnhancedImage(null)
    setIsEnhancing(true)
    
    try {
      const enhancedImageData = await enhanceImageWithPython(file, {
        brightness: 1.2,
        contrast: 1.2,
        saturation: 1.2
      });
      
      setEnhancedImage(enhancedImageData);
    } catch (error) {
      console.error('Enhancement failed:', error)
      // Fallback to original in case of error
      setEnhancedImage(imageUrl)
      alert('Image enhancement failed. Please try again with a different image.');
    } finally {
      setIsEnhancing(false)
    }
  }

  return (
    <div className="container">
      <h1>AI Image Enhancer</h1>
      <ImageUpload onImageUpload={handleImageUpload} />
      <ImagePreview 
        originalImage={originalImage} 
        enhancedImage={enhancedImage}
        isEnhancing={isEnhancing}
        originalFilename={originalFilename}
      />
      {/* {originalImage && <ProcessExplanation explanationData={enhancementInfo} />} */}
    </div>
  )
}

export default Home