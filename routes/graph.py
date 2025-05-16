# Inside routes/graph.py

import matplotlib.pyplot as plt
from io import BytesIO
from flask import Blueprint, jsonify, send_file
from db_config import get_db_connection

graph_bp = Blueprint('graph', __name__)

# New API for bar graph data
@graph_bp.route('/results_bar/<int:poll_id>', methods=['GET'])
def poll_results_bar(poll_id):
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

    # Transform results into a format suitable for a bar chart
    data = {
        "labels": [result['option_text'] for result in results],
        "data": [result['votes'] for result in results]
    }

    return jsonify(data)

# New API to generate a downloadable bar graph image
@graph_bp.route('/results_bar_image/<int:poll_id>', methods=['GET'])
def poll_results_bar_image(poll_id):
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

    # Data for the bar graph
    labels = [result['option_text'] for result in results]
    votes = [result['votes'] for result in results]

    # Create the bar chart
    fig, ax = plt.subplots()
    ax.bar(labels, votes, color='skyblue')
    ax.set_xlabel('Poll Options')
    ax.set_ylabel('Votes')
    ax.set_title('Poll Results')

    # Save the plot to a BytesIO object and convert to base64
    img_stream = BytesIO()
    plt.savefig(img_stream, format='png')
    img_stream.seek(0)

    return send_file(img_stream, mimetype='image/png', as_attachment=True, download_name='poll_results.png')
