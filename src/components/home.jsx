import React, { useState, useEffect } from 'react'
import ImageUpload from './ImageUpload'
import ImagePreview from './ImagePreview'
import { enhanceImage } from '../utils/imageEnhancer'

const Home = () => {
  const [originalImage, setOriginalImage] = useState(null)
  const [enhancedImage, setEnhancedImage] = useState(null)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [originalFilename, setOriginalFilename] = useState('')
  const [showContainer, setShowContainer] = useState(false)
  
  useEffect(() => {
    setTimeout(() => {
      setShowContainer(true)
    }, 100)
  }, [])
  
  const handleImageUpload = async (file) => {
    const imageUrl = URL.createObjectURL(file)
    setOriginalImage(imageUrl)
    setOriginalFilename(file.name)
    setEnhancedImage(null)
    setIsEnhancing(true)
    
    try {
      const enhancedImageData = await enhanceImage(imageUrl, {
        brightness: 15,
        contrast: 20,
        saturation: 20
      });
      
      setEnhancedImage(enhancedImageData);
      
    } catch (error) {
      console.error('Enhancement failed:', error)
      setEnhancedImage(imageUrl)
      alert('Image enhancement failed. Please try again with a different image.');
    } finally {
      setIsEnhancing(false)
    }
  }

  return (
    <div className={`container ${showContainer ? 'fade-in' : ''}`}>
      <div className="app-title">
        <h1><span className="highlight">AI</span> Image Enhancer</h1>
        <div className="title-underline"></div>
      </div>
      <ImageUpload onImageUpload={handleImageUpload} />
      <ImagePreview 
        originalImage={originalImage} 
        enhancedImage={enhancedImage}
        isEnhancing={isEnhancing}
        originalFilename={originalFilename}
      />
    </div>
  )
}

export default Home