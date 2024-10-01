from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
from PIL import Image
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for the Flask app

# Load the TFLite model and allocate tensors.
interpreter = tf.lite.Interpreter(model_path="U:/sih/rishabh.tflite")
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
def predict_route():
    """
    Flask route to handle prediction requests.
    """
    image_file = request.files['image']  # Get the image from the request
    prediction = predict(image_file)  # Run the prediction
    output = prediction.tolist()  # Convert numpy array to list
    return jsonify({'prediction': output})

if __name__ == '__main__':
    app.run(port=5001, debug=True)