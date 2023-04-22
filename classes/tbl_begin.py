from flask import request
from flask_restful import Resource


class Begin(Resource):
    def __init__(self, **kwargs):
        self.connection = kwargs['connection']

    def get(self):
        if request.json is not None or request.json != "":
            with self.connection.cursor() as cursor:
                # get all
                if request.args['begin_id'] == "*":
                    drive = []
                    sql = "SELECT * FROM 'tbl_begin'"
                    cursor.execute(sql)
                    result = cursor.fetchall()
                    for i in result:
                        data = {
                            'begin_id': i[0],
                            'song_id': i[1],
                            'singer_id': i[2],
                            'album_id': i[3],
                            'date': i[4],
                            'location': i[5],
                        }
                        drive.append(data)
                    return drive, 200

                # get by id
                else:
                    sql = "SELECT * FROM 'tbl_begin' WHERE 'begin_id'=%s"
                    cursor.execute(sql, (request.args['begin_id']))
                    result = cursor.fetchone()
                    data = {
                        'begin_id': result[0],
                        'song_id': result[1],
                        'singer_id': result[2],
                        'album_id': result[3],
                        'date': result[4],
                        'location': result[5],
                    }
                    return data, 200
        else:
            return {"status": "error"}, 404
