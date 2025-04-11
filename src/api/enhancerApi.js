/**
 * API client for the custom Python image enhancement backend
 */

const API_URL = 'http://localhost:5000';

export const enhanceImageWithPython = async (imageFile, enhancementParams = {}) => {
  try {
    // Convert the file to base64
    const base64Image = await fileToBase64(imageFile);

    // Set up default enhancement parameters
    const params = {
      brightness: enhancementParams.brightness || 1.2,
      contrast: enhancementParams.contrast || 1.2,
      saturation: enhancementParams.saturation || 1.2,
    };

    // Send to our Python backend API
    const response = await fetch(`${API_URL}/enhance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Image,
        params: params
      }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data.enhanced_image;
  } catch (error) {
    console.error('Error enhancing image with Python backend:', error);
    throw error;
  }
};

// Helper function to convert a file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
