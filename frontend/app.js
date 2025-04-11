// Image Enhancement UI Controller

const API_URL = 'http://localhost:5000';

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Check server status
    fetch(`${API_URL}/`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('server-status').textContent = `Server: ${data.status}`;
        })
        .catch(error => {
            document.getElementById('server-status').textContent = 'Server: Offline';
            document.getElementById('server-status').classList.add('error');
        });

    // Load enhancement options
    fetch(`${API_URL}/options`)
        .then(response => response.json())
        .then(data => {
            const options = data.enhancement_options;
            
            // Create slider controls for each option
            Object.keys(options).forEach(option => {
                const settings = options[option];
                createSlider(option, settings);
            });
        });

    // Setup image upload
    const uploadForm = document.getElementById('upload-form');
    uploadForm.addEventListener('submit', handleImageUpload);

    // Preview uploaded image
    const imageInput = document.getElementById('image-input');
    imageInput.addEventListener('change', previewImage);

    // Load processing history
    loadProcessingHistory();
});

function createSlider(name, settings) {
    const controlsContainer = document.getElementById('enhancement-controls');
    
    const container = document.createElement('div');
    container.className = 'control-group';
    
    const label = document.createElement('label');
    label.textContent = settings.description;
    label.htmlFor = `${name}-slider`;
    
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = settings.min;
    slider.max = settings.max;
    slider.step = settings.step;
    slider.value = settings.default;
    slider.id = `${name}-slider`;
    
    const valueDisplay = document.createElement('span');
    valueDisplay.textContent = settings.default;
    valueDisplay.className = 'slider-value';
    
    slider.addEventListener('input', () => {
        valueDisplay.textContent = slider.value;
    });
    
    container.appendChild(label);
    container.appendChild(slider);
    container.appendChild(valueDisplay);
    controlsContainer.appendChild(container);
}

function previewImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        document.getElementById('original-image').src = event.target.result;
        document.getElementById('original-preview').classList.remove('hidden');
        document.getElementById('enhanced-preview').classList.add('hidden');
    };
    reader.readAsDataURL(file);
}

function handleImageUpload(e) {
    e.preventDefault();
    
    const imageFile = document.getElementById('image-input').files[0];
    if (!imageFile) {
        showMessage('Please select an image first', 'error');
        return;
    }
    
    // Show loading indicator
    document.getElementById('loading-indicator').classList.remove('hidden');
    
    // Get enhancement parameters
    const params = {};
    document.querySelectorAll('#enhancement-controls input[type="range"]').forEach(slider => {
        const name = slider.id.replace('-slider', '');
        params[name] = parseFloat(slider.value);
    });
    
    const reader = new FileReader();
    reader.onload = function(event) {
        // Send to API
        fetch(`${API_URL}/enhance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image: event.target.result,
                params: params
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                showMessage(data.error, 'error');
                return;
            }
            
            // Display enhanced image
            document.getElementById('enhanced-image').src = data.enhanced_image;
            document.getElementById('enhanced-preview').classList.remove('hidden');
            document.getElementById('processing-time').textContent = 
                `Processing time: ${data.processing_time_seconds}s`;
                
            // Refresh history
            loadProcessingHistory();
        })
        .catch(error => {
            showMessage('Error enhancing image: ' + error.message, 'error');
        })
        .finally(() => {
            document.getElementById('loading-indicator').classList.add('hidden');
        });
    };
    reader.readAsDataURL(imageFile);
}

function showMessage(message, type = 'info') {
    const messageEl = document.getElementById('message');
    messageEl.textContent = message;
    messageEl.className = `message ${type}`;
    messageEl.classList.remove('hidden');
    
    setTimeout(() => {
        messageEl.classList.add('hidden');
    }, 5000);
}

function loadProcessingHistory() {
    fetch(`${API_URL}/history`)
        .then(response => response.json())
        .then(data => {
            const historyList = document.getElementById('history-list');
            historyList.innerHTML = '';
            
            if (data.history.length === 0) {
                historyList.innerHTML = '<li class="no-history">No processing history yet</li>';
                return;
            }
            
            // Display last 5 entries
            data.history.slice(-5).reverse().forEach(entry => {
                const item = document.createElement('li');
                const date = new Date(entry.timestamp).toLocaleString();
                
                item.innerHTML = `
                    <div class="history-time">${date}</div>
                    <div class="history-params">
                        B: ${entry.parameters.brightness} | 
                        C: ${entry.parameters.contrast} | 
                        S: ${entry.parameters.saturation}
                    </div>
                    <div class="history-time">${entry.processing_time_seconds}s</div>
                `;
                historyList.appendChild(item);
            });
        })
        .catch(error => {
            console.error('Error fetching history:', error);
        });
}
