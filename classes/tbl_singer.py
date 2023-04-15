from flask import Flask, jsonify, request, abort

app = Flask(__name__)


MySinger = [
    {'singer_id': 1, 'name': 'Singer 1', 'hometown': 'Hanoi', 'day_of_birth': '1990-01-01', 'description': 'description 1'},
    {'singer_id': 2, 'name': 'Singer 2', 'hometown': 'HCMC', 'day_of_birth': '1995-02-02', 'description': 'description 2'}
]



@app.route('/MySinger', methods=['GET'])
def get_MySinger():
    return jsonify(MySinger)



@app.route('/MySinger/<int:singer_id>', methods=['GET'])
def get_singer(singer_id):
    singer = [singer for singer in MySinger if singer['singer_id'] == singer_id]
    if len(singer) == 0:
        abort(404)
    return jsonify(singer[0])



@app.route('/MySinger', methods=['POST'])
def create_singer():
    if not request.json or not 'singer_id' in request.json:
        abort(400)
    singer = {
        'singer_id': MySinger[-1]['singer_id'] + 1,
        'name': request.json['name'],
        'hometown': request.json['hometown'],
        'day_of_birth': request.json['day_of_birth'],
        'description': request.json['description']
    }
    MySinger.append(singer)
    return jsonify({'singer': singer}), 201



@app.route('/MySinger/<int:singer_id>', methods=['PUT'])
def update_singer(singer_id):
    singer = [singer for singer in MySinger if singer['singer_id'] == singer_id]
    if len(singer) == 0:
        abort(404)
    if not request.json:
        abort(400)
    singer[0]['name'] = request.json.get('name', singer[0]['name'])
    singer[0]['hometown'] = request.json.get('hometown', singer[0]['hometown'])
    singer[0]['day_of_birth'] = request.json.get('day_of_birth', singer[0]['day_of_birth'])
    singer[0]['description'] = request.json.get('description', singer[0]['description'])

    return jsonify({'singer': singer[0]})



@app.route('/MySinger/<int:singer_id>', methods=['DELETE'])
def delete_singer(singer_id):
    singer = [singer for singer in MySinger if singer['singer_id'] == singer_id]
    if len(singer) == 0:
        abort(404)
    MySinger.remove(singer[0])
    return jsonify({'result': True})


if __name__ == '__main__':
    app.run(debug=True)
