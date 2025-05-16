from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from routes.graph import graph_bp
from routes.auth import auth_bp
from routes.poll import poll_bp
from db_config import get_db_connection

app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app, resources={r"/*": {"origins": "*"}})

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(poll_bp, url_prefix='/poll')
app.register_blueprint(graph_bp, url_prefix='/graph')

# Frontend Routes
@app.route('/')
def home():
    return render_template('home.html')

@app.route('/register')
def register():
    return render_template('register.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/polls')
def polls():
    return render_template('polls.html')


# Correct Login Endpoint
@app.route('/auth/login', methods=['POST'])
def handle_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE username = %s AND password = %s", (username, password))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user:
        return jsonify({'message': 'Login successful', 'user': user})
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

# Correct Register Endpoint
@app.route('/auth/register', methods=['POST'])
def handle_register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO users (username, password, role) VALUES (%s, %s, %s)", (username, password, role))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'message': 'User registered successfully'})

@app.route('/dashboard/teacher')
def teacher_dashboard():
    return render_template('teacher_dashboard.html')

@app.route('/dashboard/student')
def student_dashboard():
    return render_template('student_dashboard.html')


if __name__ == '__main__':
    app.run(debug=True)
