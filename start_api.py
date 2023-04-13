from flask import Flask, jsonify, request, abort

app = Flask(__name__)

sữasữa

# Tạo dữ liệu ví dụ
tracks = [
    {'id': 1, 'title': 'Track 1', 'artist': 'Artist 1'},
    {'id': 2, 'title': 'Track 2', 'artist': 'Artist 2'}
]


# Lấy danh sách tất cả các tracks
@app.route('/tracks', methods=['GET'])
def get_tracks():
    return jsonify(tracks)


# Lấy một track theo ID
@app.route('/tracks/<int:track_id>', methods=['GET'])
def get_track(track_id):
    track = [track for track in tracks if track['id'] == track_id]
    if len(track) == 0:
        abort(404)
    return jsonify(track[0])


# Thêm một track mới
@app.route('/tracks', methods=['POST'])
def create_track():
    if not request.json or not 'title' in request.json:
        abort(400)
    track = {
        'id': tracks[-1]['id'] + 1,
        'title': request.json['title'],
        'artist': request.json.get('artist', '')
    }
    tracks.append(track)
    return jsonify({'track': track}), 201


# Cập nhật thông tin của một track theo ID
@app.route('/tracks/<int:track_id>', methods=['PUT'])
def update_track(track_id):
    track = [track for track in tracks if track['id'] == track_id]
    if len(track) == 0:
        abort(404)
    if not request.json:
        abort(400)
    track[0]['title'] = request.json.get('title', track[0]['title'])
    track[0]['artist'] = request.json.get('artist', track[0]['artist'])
    return jsonify({'track': track[0]})


# Xóa một track theo ID
@app.route('/tracks/<int:track_id>', methods=['DELETE'])
def delete_track(track_id):
    track = [track for track in tracks if track['id'] == track_id]
    if len(track) == 0:
        abort(404)
    tracks.remove(track[0])
    return jsonify({'result': True})


if __name__ == "__main__":
    app.run(debug=True)
