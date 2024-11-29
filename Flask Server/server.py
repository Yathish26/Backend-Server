from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'  # Database file
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Define a model for the data
class Data(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)

# Initialize the database
with app.app_context():
    db.create_all()

# Home route
@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Python Backend Server with Database!"})

# POST endpoint to save data
@app.route('/api/data', methods=['POST'])
def post_data():
    incoming_data = request.json  # Get JSON data from the request

    # Validate the JSON data
    name = incoming_data.get('name')
    age = incoming_data.get('age')

    if not name or not isinstance(age, int):
        return jsonify({"error": "Invalid data"}), 400

    # Save data to the database
    new_entry = Data(name=name, age=age)
    db.session.add(new_entry)
    db.session.commit()

    return jsonify({"message": "Data saved successfully!", "saved_data": {"name": name, "age": age}})

# GET endpoint to retrieve all data
@app.route('/api/data', methods=['GET'])
def get_data():
    all_data = Data.query.all()
    data_list = [{"id": item.id, "name": item.name, "age": item.age} for item in all_data]
    return jsonify(data_list)

# Run the server
if __name__ == '__main__':
    app.run(debug=True)
