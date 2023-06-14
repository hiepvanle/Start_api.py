from flask import request
from flask_restful import Resource


class Begin(Resource):
    def __init__(self, **kwargs):
        self.connections = kwargs['connections']

    def get(self):
        if request.query_string is not None or request.query_string != "":
            with self.connections.cursor() as cursor:
                # get all
                if request.args[''] == "*":
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



