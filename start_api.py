from flask import Flask, jsonify, request, abort

app = Flask(__name__)

# Tạo dữ liệu ví dụ
tracks = [
    {'my_song_id': 1, 'my_name': 'Song 1'},
    {'my_song_id': 2, 'my_name': 'Song 2'}
]


# Lấy danh sách tất cả các tracks
@app.route('/tracks', methods=['GET'])
def get_tracks():
    return jsonify(tracks)


# Lấy một track theo ID
@app.route('/tracks/<int:song_id>', methods=['GET'])
def get_track(song_id):
    track = [track for track in tracks if track['my_song_id'] == song_id]
    if len(track) == 0:
        abort(404)
    return jsonify(track[0])


# Thêm một track mới
@app.route('/tracks', methods=['POST'])
def create_track():
    if not request.json or not 'my_name' in request.json:
        abort(400)
    track = {
        'my_song_id': tracks[-1]['my_song_id'] + 1,
        'my_name': request.json['my_name'],
    }
    tracks.append(track)
    return jsonify({'track': track}), 201


# Cập nhật thông tin của một track theo ID
@app.route('/tracks/<int:track_id>', methods=['PUT'])
def update_track(song_id):
    track = [track for track in tracks if track['my_song_id'] == song_id]
    if len(track) == 0:
        abort(404)
    if not request.json:
        abort(400)
    track[0]['my_name'] = request.json.get('my_name', track[0]['my_name'])
    return jsonify({'track': track[0]})


# Xóa một track theo ID
@app.route('/tracks/<int:song_id>', methods=['DELETE'])
def delete_track(song_id):
    track = [track for track in tracks if track['my_song_id'] == song_id]
    if len(track) == 0:
        abort(404)
    tracks.remove(track[0])
    return jsonify({'result': True})


if __name__ == '__main__':
    app.run(debug=True)
