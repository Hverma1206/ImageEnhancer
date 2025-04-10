from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import cv2
import numpy as np
import os
from PIL import Image, ImageEnhance
import uuid
import base64
from io import BytesIO

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

UPLOAD_FOLDER = 'uploads'
ENHANCED_FOLDER = 'enhanced'

# Create directories if they don't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(ENHANCED_FOLDER, exist_ok=True)

@app.route('/enhance', methods=['POST'])
def enhance_image():
    if 'image' not in request.files:
        # Check if the image is sent as base64
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({"error": "No image provided"}), 400
        
        # Get base64 string and convert to image
        try:
            # Remove data URL prefix if present
            base64_string = data['image']
            if ',' in base64_string:
                base64_string = base64_string.split(',', 1)[1]
            
            # Decode base64
            image_data = base64.b64decode(base64_string)
            
            # Get enhancement parameters
            params = data.get('params', {})
            brightness = float(params.get('brightness', 1.2))
            contrast = float(params.get('contrast', 1.2))
            saturation = float(params.get('saturation', 1.2))
            
            # Create PIL Image from bytes
            img = Image.open(BytesIO(image_data))
            
            # Apply enhancements
            enhanced_img = enhance_with_pil(img, brightness, contrast, saturation)
            
            # Convert back to base64 for response
            buffered = BytesIO()
            enhanced_img.save(buffered, format="JPEG")
            img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')
            
            return jsonify({
                "enhanced_image": f"data:image/jpeg;base64,{img_str}"
            })
            
        except Exception as e:
            print(f"Error processing image: {str(e)}")
            return jsonify({"error": str(e)}), 500
    
    # Handle file upload if not base64
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    try:
        # Save the uploaded file temporarily
        temp_filename = f"{uuid.uuid4().hex}.jpg"
        temp_path = os.path.join(UPLOAD_FOLDER, temp_filename)
        file.save(temp_path)
        
        # Get enhancement parameters
        brightness = float(request.form.get('brightness', 1.2))
        contrast = float(request.form.get('contrast', 1.2))
        saturation = float(request.form.get('saturation', 1.2))
        
        # Process the image
        img = Image.open(temp_path)
        enhanced_img = enhance_with_pil(img, brightness, contrast, saturation)
        
        # Save enhanced image
        enhanced_path = os.path.join(ENHANCED_FOLDER, temp_filename)
        enhanced_img.save(enhanced_path)
        
        # Return the enhanced image
        return send_file(enhanced_path, mimetype='image/jpeg')
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def enhance_with_opencv(img_path, brightness=1.2, contrast=1.2):
    """Enhance image using OpenCV"""
    img = cv2.imread(img_path)
    
    # Apply brightness
    img = cv2.convertScaleAbs(img, alpha=brightness, beta=0)
    
    # Apply contrast
    img = cv2.convertScaleAbs(img, alpha=contrast, beta=0)
    
    # Save enhanced image
    enhanced_path = os.path.join(ENHANCED_FOLDER, os.path.basename(img_path))
    cv2.imwrite(enhanced_path, img)
    
    return enhanced_path

def enhance_with_pil(img, brightness=1.2, contrast=1.2, saturation=1.2):
    """Enhance image using PIL/Pillow"""
    # Apply brightness
    enhancer = ImageEnhance.Brightness(img)
    img = enhancer.enhance(brightness)
    
    # Apply contrast
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(contrast)
    
    # Apply color/saturation
    enhancer = ImageEnhance.Color(img)
    img = enhancer.enhance(saturation)
    
    # Apply sharpness
    enhancer = ImageEnhance.Sharpness(img)
    img = enhancer.enhance(1.3)
    
    return img

if __name__ == '__main__':
    app.run(debug=True, port=5000)
