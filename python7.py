from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
from PIL import Image
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for the Flask app

# Load the TFLite model and allocate tensors.
# interpreter = tf.lite.Interpreter(model_path="U:/sih/new_model.tflite")
interpreter = tf.lite.Interpreter(model_path="U:/sih/model2.tflite")
interpreter.allocate_tensors()

# Get input and output tensors.
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

def preprocess_image(image_file):
    """
    Preprocess the input image to match the model's expected format.
    """
    image = Image.open(image_file)
    image = image.convert('RGB')  # Convert to RGB if necessary
    image = image.resize((256, 256))  # Resize to the expected size (200x200)
    image_array = np.array(image, dtype=np.float32)  # Convert to NumPy array with float32 dtype
    image_array = image_array / 255.0  # Normalize if required
    image_array = np.expand_dims(image_array, axis=0)  # Add batch dimension
    return image_array

def predict(image_file):
    """
    Perform prediction using the TFLite model.
    """
    # Preprocess the image
    input_data = preprocess_image(image_file)

    # Set the tensor to point to the input data to be inferred
    interpreter.set_tensor(input_details[0]['index'], input_data)

    # Run the inference
    interpreter.invoke()

    # The function `get_tensor()` returns a copy of the output data
    output_data = interpreter.get_tensor(output_details[0]['index'])
    return output_data

@app.route('/predict', methods=['POST'])
@app.route('/predict', methods=['POST'])
@app.route('/predict', methods=['POST'])
def predict_route():
    """
    Flask route to handle prediction requests.
    """
    image_file = request.files['image']  # Get the image from the request
    prediction = predict(image_file)  # Run the prediction
    
    # Get the index of the highest value in the prediction
    max_index = np.argmax(prediction)
    
    # List of possible labels corresponding to the prediction output
    possible_labels = [
       'Apple Apple scab', 'Apple Black rot', 'Apple Cedar apple rust', 'Apple healthy', 'Bacterial leaf blight in rice leaf', 'Blight in corn Leaf', 'Blueberry healthy', 'Brown spot in rice leaf', 'Cercospora leaf spot', 'Cherry (including sour) Powdery mildew', 'Cherry (including_sour) healthy', 'Common Rust in corn Leaf', 'Corn (maize) healthy', 'Garlic', 'Grape Black rot', 'Grape Esca Black Measles', 'Grape Leaf blight Isariopsis Leaf Spot', 'Grape healthy', 'Gray Leaf Spot in corn Leaf', 'Leaf smut in rice leaf', 'Orange Haunglongbing Citrus greening', 'Peach healthy', 'Pepper bell Bacterial spot', 'Pepper bell healthy', 'Potato Early blight', 'Potato Late blight', 'Potato healthy', 'Raspberry healthy', 'Sogatella rice', 'Soybean healthy', 'Strawberry Leaf scorch', 'Strawberry healthy', 'Tomato Bacterial spot', 'Tomato Early blight', 'Tomato Late blight', 'Tomato Leaf Mold', 'Tomato Septoria leaf spot', 'Tomato Spider mites Two spotted spider mite', 'Tomato Target Spot', 'Tomato Tomato mosaic virus', 'Tomato healthy', 'algal leaf in tea', 'anthracnose in tea', 'bird eye spot in tea', 'brown blight in tea', 'cabbage looper', 'corn crop', 'ginger', 'healthy tea leaf', 'lemon canker', 'onion', 'potassium deficiency in plant', 'potato crop', 'potato hollow heart', 'red leaf spot in tea', 'tomato canker'
    ]
    
    # Get the corresponding disease/label
    disease_label = possible_labels[max_index]
    
    # Convert the prediction value to a native Python float
    confidence = float(prediction[0][max_index])
    
    return jsonify({'prediction': disease_label, 'confidence': confidence})

if __name__ == '__main__':
    app.run(port=5005, debug=True)