from flask import request
from flask_restful import Resource


class Begin(Resource):
    def __init__(self, **kwargs):
        self.connections = kwargs['connections']

    def get(self):
        if request.query_string is not None or request.query_string != "":
            with self.connections.cursor() as cursor:
                # get all
                if request.args['full'] == "*":
                    drive = []
                    sql = "SELECT * FROM `tbl_begin`"
                    cursor.execute(sql)
                    result = cursor.fetchall()
                    for i in result:
                        data = {
                            'song_id': i[0],
                            'singer_id': i[1],
                            'album_id': i[2],
                            'date': i[3],
                            'location': i[4],
                        }
                        drive.append(data)
                    return drive, 200
                else:
                    sql = "SELECT * FROM `tbl_begin` WHERE `song_id`=%s OR `singer_id`=%s OR `album_id`=%s "
                    cursor.execute(sql, (request.args['sid'], request.args['sgid'], request.args['aid']))
                    result = cursor.fetchone()
                    data = {
                        'song_id': result[0],
                        'singer_id': result[1],
                        'album_id': result[2],
                        'date': result[3],
                        'location': result[4],
                    }
                    return data, 200
        else:
            return {"Not Found"}


    def delete(self):
        return {"status": "method delete not supported"}

    def post(self):
        return {"status":"method post not supported"}

    def put(self):
        return {"status":"method put not supported"}

