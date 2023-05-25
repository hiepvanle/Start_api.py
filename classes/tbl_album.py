from flask import request, jsonify
from flask_restful import Resource

from classes.utils import command_format


class Album(Resource):
    def __init__(self, **kwargs):
        self.connections = kwargs['connections']

    def get(self):
        if 'album_id' != "":
            cur = self.connections.cursor()
            drive = []
            sql = "SELECT * FROM tbl_album"
            cur.execute(sql)
            result = cur.fetchall()
            for i in result:
                data = {
                    'album_id': i[0],
                    'album_name': i[1],
                    'singer_id': i[2],
                    'album_description': i[3],
                }
                drive.append(data)
            return jsonify(result)
        else:
            cur = self.connections.cursor()
            sql = "SELECT * FROM tbl_album WHERE album_id=%s"
            drive = []
            cur.execute(sql, ('album_id',))
            result = cur.fetchone()
            for i in result:
                data = {
                    'album_id': i[0],
                    'album_name': i[1],
                    'singer_id': i[2],
                    'album_description': i[3],
                }
                drive.append(data)
            return jsonify(result)

    def post(self):
        if request.is_json:
            # convert to json
            data = request.get_json(force=True)["data"]
            with self.connections.cursor() as cursor:
                sql_insert = "INSERT INTO tbl_album (album_id, album_name, album_description, album_date) " \
                           "VALUES ('{}', '{}','{}', '{}');"
                sql_post = sql_insert.format(data['album_id'], data['album_name'], data['album_description'],
                                             data['album_date'])
                print(sql_post)
                cursor.execute(sql_post)
                self.connections.commit()
            return {'status': 'success'}, 200
        else:
            return {"status": "error"}

    def delete(self):
        if request.is_json:
            # convert to json
            data = request.get_json(force=True)
            song_id = data['album_id']
            with self.connections.cursor() as cursor:
                sql_delete = "DELETE FROM tbl_album WHERE album_id=%s"
                # Execute the query
                cursor.execute(sql_delete, song_id)
                # the connection is not autocommit by default. So we must commit to save our changes.
                self.connections.commit()
            return {"status": "success"}, 200
        else:
            return {"status": "error"}

    def put(self):
        if request.is_json:
            # convert to json
            data = request.get_json(force=True)["data"]
            sql_put = "update tbl_album set {} where {};"
            with self.connections.cursor() as cursor:
                cursor.execute(command_format(data, sql_put))
                self.connections.commit()
            return {'status': 'success'}, 200
        else:
            return {"status": "error"}
