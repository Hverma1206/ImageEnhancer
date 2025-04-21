from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import cv2
import numpy as np
import os
from PIL import Image, ImageEnhance
import uuid
import base64
from io import BytesIO
import time
import json
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

UPLOAD_FOLDER = 'uploads'
ENHANCED_FOLDER = 'enhanced'
HISTORY_FILE = 'processing_history.json'

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(ENHANCED_FOLDER, exist_ok=True)

def load_history():
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, 'r') as f:
                return json.load(f)
        except:
            return []
    return []

def save_history(history):
    with open(HISTORY_FILE, 'w') as f:
        json.dump(history, f)

processing_history = load_history()

@app.route('/', methods=['GET'])
def server():
    return jsonify({
        "message": "Image Enhancement API is running",
        "status": "healthy",
        "version": "1.0.0",
                "endpoints": {
            "/": "Server health check",
            "/enhance": "Enhance an image",
            "/options": "Get enhancement options",
            "/history": "View processing history"
        }
    }), 200

@app.route('/options', methods=['GET'])
def get_options():
    return jsonify({
        "enhancement_options": {
            "brightness": {
                "min": 0.5,
                "max": 2.0,
                "default": 1.2,
                "step": 0.1,
                "description": "Adjust image brightness"
            },
            "contrast": {
                "min": 0.5,
                "max": 2.0,
                "default": 1.2,
                "step": 0.1,
                "description": "Adjust image contrast"
            },
            "saturation": {
                "min": 0.5,
                "max": 2.0,
                "default": 1.2,
                "step": 0.1,
                "description": "Adjust image color saturation"
            },
            "sharpness": {
                "min": 1.0,
                "max": 2.0,
                "default": 1.3,
                "step": 0.1,
                "description": "Adjust image sharpness"
            }
        }
    })

@app.route('/history', methods=['GET'])
def get_history():
    return jsonify({"history": processing_history})

@app.route('/enhance', methods=['POST'])
def enhance_image():
    start_time = time.time()
    
    if 'image' not in request.files:
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({"error": "No image provided", "help": "Please upload an image file or provide a base64 encoded image"}), 400
        
        try:
            base64_string = data['image']
            if ',' in base64_string:
                base64_string = base64_string.split(',', 1)[1]
            
            image_data = base64.b64decode(base64_string)
            
            params = data.get('params', {})
            brightness = float(params.get('brightness', 1.2))
            contrast = float(params.get('contrast', 1.2))
            saturation = float(params.get('saturation', 1.2))
            sharpness = float(params.get('sharpness', 1.3))
            
            img = Image.open(BytesIO(image_data))
            
            enhanced_img = enhance_with_pil(img, brightness, contrast, saturation, sharpness)
            
            buffered = BytesIO()
            enhanced_img.save(buffered, format="JPEG")
            img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')
            
            processing_time = round(time.time() - start_time, 2)
            history_entry = {
                "id": uuid.uuid4().hex,
                "timestamp": datetime.now().isoformat(),
                "processing_time_seconds": processing_time,
                "parameters": {
                    "brightness": brightness,
                    "contrast": contrast,
                    "saturation": saturation,
                    "sharpness": sharpness
                },
                "type": "base64"
            }
            processing_history.append(history_entry)
            save_history(processing_history)
            
            return jsonify({
                "enhanced_image": f"data:image/jpeg;base64,{img_str}",
                "processing_time_seconds": processing_time,
                "success": True
            })
            
        except Exception as e:
            error_msg = str(e)
            print(f"Error processing image: {error_msg}")
            return jsonify({
                "error": "Failed to process image",
                "details": error_msg,
                "suggestions": ["Try a different image format", "Check that your image is valid"]
            }), 500
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    try:
        temp_filename = f"{uuid.uuid4().hex}.jpg"
        temp_path = os.path.join(UPLOAD_FOLDER, temp_filename)
        file.save(temp_path)
        
        brightness = float(request.form.get('brightness', 1.2))
        contrast = float(request.form.get('contrast', 1.2))
        saturation = float(request.form.get('saturation', 1.2))
        sharpness = float(request.form.get('sharpness', 1.3))
        
        img = Image.open(temp_path)
        enhanced_img = enhance_with_pil(img, brightness, contrast, saturation, sharpness)
        
        enhanced_path = os.path.join(ENHANCED_FOLDER, temp_filename)
        enhanced_img.save(enhanced_path)
        
        processing_time = round(time.time() - start_time, 2)
        history_entry = {
            "id": uuid.uuid4().hex,
            "timestamp": datetime.now().isoformat(),
            "processing_time_seconds": processing_time,
            "parameters": {
                "brightness": brightness,
                "contrast": contrast,
                "saturation": saturation,
                "sharpness": sharpness
            },
            "type": "file"
        }
        processing_history.append(history_entry)
        save_history(processing_history)
        
        return send_file(enhanced_path, mimetype='image/jpeg')
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def enhance_with_opencv(img_path, brightness=1.2, contrast=1.2):
    img = cv2.imread(img_path)
    
    img = cv2.convertScaleAbs(img, alpha=brightness, beta=0)
    
    img = cv2.convertScaleAbs(img, alpha=contrast, beta=0)
    
    enhanced_path = os.path.join(ENHANCED_FOLDER, os.path.basename(img_path))
    cv2.imwrite(enhanced_path, img)
    
    return enhanced_path

def enhance_with_pil(img, brightness=1.2, contrast=1.2, saturation=1.2, sharpness=1.3):
    enhancer = ImageEnhance.Brightness(img)
    img = enhancer.enhance(brightness)
    
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(contrast)
    
    enhancer = ImageEnhance.Color(img)
    img = enhancer.enhance(saturation)
    
    enhancer = ImageEnhance.Sharpness(img)
    img = enhancer.enhance(sharpness)
    
    return img

if __name__ == '__main__':

    app.run(debug=True, host='0.0.0.0', port=5000)
