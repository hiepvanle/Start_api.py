from flask import Flask, jsonify, request, abort

app = Flask(__name__)

# Create data example
writers = [
    {'writer_id': 1, 'name': 'Writer 1', 'description': 'description 1'},
    {'writer_id': 2, 'name': 'Writer 2', 'description': 'description 2'}
]

# Get a list of all writer
@app.route('/writer', methods=['GET'])
def get_writers():
    return jsonify(writers)


# Get a writer by ID
@app.route('/writer/<int:writer_id>', methods=['GET'])
def get_writer(writer_id):
    track = [writer  for writer  in writers if writer ['writer_id'] == writer_id]
    if len(track) == 0:
        abort(404)
    return jsonify(track[0])


# Add a new writer
@app.route('/writer', methods=['POST'])
def create_writer():
    if not request.json or not 'writer_id' in request.json:
        abort(400)
    writer = {
        'writer_id': writers[-1]['writer_id'] + 1,
        'name': request.json['name'],
        'description': request.json['description']
    }
    writers.append(writer)
    return jsonify({'writer': writer}), 201


# Update information of a writer by ID
@app.route('/writers/<int:writer_id>', methods=['PUT'])
def update_writer(writer_id):
    track = [track for track in writers if track['writer_id']
             == writer_id]
    if len(track) == 0:
        abort(404)
    if not request.json:
        abort(400)
    track[0]['name'] = request.json.get('name',
                                        track[0]['name'])
    track[1]['description'] = request.json.get(
        'description', track[1]['description'])

    return jsonify({'writer': track[0]})


# Delete a writer by ID
@app.route('/writers/<int:writer_id>', methods=['DELETE'])
def delete_writer(writer_id):
    writer = [writer for writer in writers if writer['writer_id'] == writer_id]
    if len(writer) == 0:
        abort(404)
    writers.remove(writer[0])
    return jsonify({'result': True})


if __name__ == '__main__':
    app.run(debug=True)
