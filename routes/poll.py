from flask import Blueprint, request, jsonify
from db_config import get_db_connection

poll_bp = Blueprint('poll', __name__)

@poll_bp.route('/create', methods=['POST'])
def create_poll():
    data = request.get_json()
    question = data['question']
    options = data['options']
    created_by = data['created_by']

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("INSERT INTO polls (question, created_by) VALUES (%s, %s)", (question, created_by))
    poll_id = cursor.lastrowid

    for opt in options:
        cursor.execute("INSERT INTO poll_options (poll_id, option_text) VALUES (%s, %s)", (poll_id, opt))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'message': 'Poll created successfully'})

@poll_bp.route('/answer', methods=['POST'])
def answer_poll():
    data = request.get_json()
    poll_id = data['poll_id']
    selected_option_id = data['option_id']
    student_id = data['student_id']

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("INSERT INTO responses (poll_id, option_id, student_id) VALUES (%s, %s, %s)",
                   (poll_id, selected_option_id, student_id))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'message': 'Response submitted successfully'})

@poll_bp.route('/results/<int:poll_id>', methods=['GET'])
def poll_results(poll_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT o.option_text, COUNT(r.id) AS votes
        FROM poll_options o
        LEFT JOIN responses r ON o.id = r.option_id
        WHERE o.poll_id = %s
        GROUP BY o.id
    """, (poll_id,))
    results = cursor.fetchall()

    cursor.close()
    conn.close()
    return jsonify(results)

@poll_bp.route('/all', methods=['GET'])
def all_polls():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT id, question
        FROM polls
    """)
    polls = cursor.fetchall()

    cursor.close()
    conn.close()
    return jsonify(polls)

@poll_bp.route('/delete/<int:poll_id>', methods=['DELETE'])
def delete_poll(poll_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM poll_options WHERE poll_id = %s", (poll_id,))
    cursor.execute("DELETE FROM responses WHERE poll_id = %s", (poll_id,))
    cursor.execute("DELETE FROM polls WHERE id = %s", (poll_id,))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'message': 'Poll deleted successfully'})

@poll_bp.route('/available', methods=['GET'])
def available_polls():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Fetch all polls and their options
    cursor.execute("SELECT id, question FROM polls")
    polls = cursor.fetchall()

    all_polls = []
    for poll in polls:
        cursor.execute("SELECT id, option_text FROM poll_options WHERE poll_id = %s", (poll['id'],))
        options = cursor.fetchall()
        all_polls.append({
            'id': poll['id'],
            'question': poll['question'],
            'options': options
        })

    cursor.close()
    conn.close()
    return jsonify(all_polls)

@poll_bp.route('/answered/<int:student_id>', methods=['GET'])
def answered_polls(student_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT p.question, po.option_text
        FROM responses r
        JOIN polls p ON r.poll_id = p.id
        JOIN poll_options po ON r.option_id = po.id
        WHERE r.student_id = %s
    """, (student_id,))

    answered = cursor.fetchall()

    cursor.close()
    conn.close()
    return jsonify(answered)
