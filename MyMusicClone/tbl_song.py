from flask import Flask, jsonify, request, abort
import pymysql

app = Flask(__name__)
collections = pymysql.connect(host="localhost", user="root", password="0397495785Ab@", db="mymucsic")
# create data example
song = [
    {'my_song_id': 1, 'my_name': 'Song 1', 'my_description': 'description 1', 'my_type_id': 1},
    # {'my_song_id': 2, 'my_name': 'Song 2', 'my_description': 'description 2', 'my_type_id': 2}
]


# Get a list of all songs
@app.route('/song', methods=['GET'])
def get_song():
    return jsonify(song)


# Get a song by ID
@app.route('/song/<int:song_id>', methods=['GET'])
def get_track(song_id):
    track = [track for track in song if track['my_song_id'] == song_id]
    if len(track) == 0:
        abort(404)
    return jsonify(track[0])


# Add a new song
@app.route('/song', methods=['POST'])
def create_track():
    if not request.json or not 'my_song_id' in request.json:
        abort(400)

    cursor = collections.cursor()

    sql_insert = "INSERT INTO tbl_song(my_song_id, my_name, my_description, my_type_id) VALUES(%s, %s, %s, %s)"
    track = (
        "'my_song_id': song[-1]['my_song_id'] + 1",
        "'my_name': request.json['my_name']",
        "'m_description': request.json['my_description']",
        "'my_type_id': song[-1]['my_type_id'] + 1"
    )
    sql = cursor.execute(sql_insert, track)
    collections.commit()
    # mysong = [
    #     {'my_song_id': 1, 'my_name': 'Song 1', 'my_description': 'description 1', 'my_type_id': 1},
    #     {'my_song_id': 2, 'my_name': 'Song 2', 'my_description': 'description 2', 'my_type_id': 2}
    # ]
    print(collections.rowcount, "was inserted.")
    song.append(sql)
    return jsonify({'sql': sql}), 201


# Update information of a song by ID
@app.route('/song/<int:song_id>', methods=['PUT'])
def update_track(song_id):
    track = [track for track in song if track['my_song_id'] == song_id]
    if len(track) == 0:
        abort(404)
    if not request.json:
        abort(400)
    track[0]['my_name'] = request.json.get('my_name', track[0]['my_name'])
    track[1]['my_description'] = request.json.get('my_description', track[1]['my_description'])

    return jsonify({'track': track[0]})


# Delete a song by ID
@app.route('/song/<int:song_id>', methods=['DELETE'])
def delete_track(song_id):
    track = [track for track in song if track['my_song_id'] == song_id]
    if len(track) == 0:
        abort(404)
    song.remove(track[0])
    return jsonify({'result': True})


if __name__ == '__main__':
    app.run(debug=True)
