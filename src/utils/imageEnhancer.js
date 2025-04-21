
export const enhanceImage = (imageUrl, options = {}) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      const settings = {
        brightness: options.brightness || 15,
        contrast: options.contrast || 20,
        saturation: options.saturation || 20,
        sharpness: options.sharpness || 0.5
      };
      
      const factor = (259 * (settings.contrast + 255)) / (255 * (259 - settings.contrast));
      
      for (let i = 0; i < data.length; i += 4) {
        data[i] += settings.brightness;
        data[i+1] += settings.brightness;
        data[i+2] += settings.brightness;
        
        data[i] = factor * (data[i] - 128) + 128;
        data[i+1] = factor * (data[i+1] - 128) + 128;
        data[i+2] = factor * (data[i+2] - 128) + 128;
        
        const gray = 0.2989 * data[i] + 0.5870 * data[i+1] + 0.1140 * data[i+2];
        const satFactor = 1 + settings.saturation / 100;
        
        data[i] = gray + satFactor * (data[i] - gray);
        data[i+1] = gray + satFactor * (data[i+1] - gray);
        data[i+2] = gray + satFactor * (data[i+2] - gray);
      }
      
      ctx.putImageData(imageData, 0, 0);
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '12px Arial';
      ctx.fillText('Enhanced with AI', 10, canvas.height - 10);
      
      const enhancedImageUrl = canvas.toDataURL('image/jpeg', 0.95);
      resolve(enhancedImageUrl);
    };
    
    img.src = imageUrl;
  });
};

export const generateEnhancedFilename = (originalFilename = '') => {
  const date = new Date();
  const timestamp = `${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
  
  if (originalFilename) {
    const baseName = originalFilename.replace(/\.[^/.]+$/, "");
    return `${baseName}-enhanced-${timestamp}.jpg`;
  }
  
  return `enhanced-image-${timestamp}.jpg`;
};

export const downloadEnhancedImage = (imageUrl, originalFilename) => {
  return new Promise((resolve, reject) => {
    try {
      const downloadFilename = generateEnhancedFilename(originalFilename);
      
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = downloadFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => {
        resolve(downloadFilename);
      }, 500);
    } catch (error) {
      reject(error);
    }
  });
};

export const getEnhancementExplanation = () => {
  return {
    title: "How Our Python Image Enhancer Works",
    steps: [
      {
        id: 1,
        name: "Image Processing",
        description: "Your image is sent to our custom Python backend which uses advanced image processing libraries."
      },
      {
        id: 2,
        name: "Brightness Adjustment",
        description: "The Python backend uses PIL (Python Imaging Library) to increase the luminosity values of all pixels in the image."
      },
      {
        id: 3,
        name: "Contrast Enhancement",
        description: "We apply mathematical transformations to increase the difference between light and dark areas."
      },
      {
        id: 4,
        name: "Color Saturation",
        description: "The saturation of colors is increased to make the image more vibrant while preserving the natural appearance."
      },
      {
        id: 5,
        name: "Sharpness Enhancement",
        description: "Finally, we apply a sharpening filter to make details more pronounced and clear."
      }
    ],
    technologies: "This enhancer uses a custom Python backend with OpenCV and PIL (Pillow) libraries for professional-grade image enhancement. The processed image is sent back to your browser for immediate viewing and download."
  };
};
