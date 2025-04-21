# Image Enhancer

An image enhancement web application with a React frontend and Python backend.

## Setup Instructions

### Frontend Setup
1. Install Node.js dependencies:
```
npm install
```

2. Create a `.env` file in the root directory with the following content:
```
API_URL=your_python_endpoint
```
Replace `your_python_endpoint` with your Python backend URL (e.g., `http://127.0.0.1:5000`).

3. Start the React development server:
```
npm run dev
```

### Backend Setup
1. Navigate to the backend directory:
```
cd backend
```

2. Create a virtual environment (optional but recommended):
```
python -m venv venv
```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Install Python dependencies:
```
pip install -r requirements.txt
```

5. Run the Flask server:
```
python app.py
```

The backend server will start

## How It Works

1. Upload an image using the frontend interface
2. The image is sent to the Python backend as a base64 string
3. The backend processes the image using PIL and OpenCV
4. The enhanced image is returned to the frontend
5. You can download the enhanced image

## Enhancement Techniques

- Brightness adjustment
- Contrast enhancement
- Color saturation improvement
- Image sharpening

## Technologies Used

- Frontend: React, JavaScript
- Backend: Flask, Python
- Image Processing: PIL (Pillow), OpenCV
