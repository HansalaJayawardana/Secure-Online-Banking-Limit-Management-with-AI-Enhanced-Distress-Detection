from flask import Flask, request, jsonify
import base64
import numpy as np
import cv2
from fer import FER

app = Flask(__name__)
detector = FER(mtcnn=True)

@app.route('/emotion/analyze', methods=['POST'])
def analyze_emotion():
    data = request.get_json()
    img_base64 = data.get('imageBase64')

    if not img_base64:
        return jsonify({'error': 'No imageBase64 provided'}), 400

    try:
        img_bytes = base64.b64decode(img_base64)
        img_array = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

        emotion, score = detector.top_emotion(frame)
        if emotion is None:
            return jsonify({'error': 'No face detected'}), 400

        return jsonify({'emotion': emotion, 'score': score})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
