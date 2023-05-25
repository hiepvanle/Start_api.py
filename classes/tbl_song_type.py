from flask import request, jsonify
from flask_restful import Resource

from classes.utils import command_format


class Song_type(Resource):
    def __init__(self, **kwargs):
        self.connections = kwargs['connections']

    def get(self):
        if 'type_id' != "":
            cur = self.connections.cursor()
            drive = []
            sql = "SELECT * FROM tbl_song_type"
            cur.execute(sql)
            result = cur.fetchall()
            for i in result:
                data = {
                    'type_id': i[0],
                    'type_name': i[1],
                    'type_description': i[3],
                }
                drive.append(data)
            return jsonify(result)
        else:
            cur = self.connections.cursor()
            sql = "SELECT * FROM tbl_song_type WHERE type_id=%s"
            drive = []
            cur.execute(sql, ('type_id',))
            result = cur.fetchone()
            for i in result:
                data = {
                    'type_id': i[0],
                    'type_name': i[1],
                    'type_description': i[3],
                }
                drive.append(data)
            return jsonify(result)

    def post(self):
        if request.is_json:
            # convert to json
            data = request.get_json(force=True)["data"]
            with self.connections.cursor() as cursor:
                sql_insert = "INSERT INTO tbl_song_type (type_id, type_name, type_description)" \
                             "VALUES ('{}', '{}','{}');"
                sql_post = sql_insert.format(data['type_id'], data['type_name'], data['type_description'])
                print(sql_post)
                cursor.execute(sql_post)
                self.connections.commit()
            return {'status': 'success'}, 200
        else:
            return {"status": "error"}, 404

    def delete(self):
        if request.is_json:
            # convert to json
            data = request.get_json(force=True)
            type_id = data['type_id']
            with self.connections.cursor() as cursor:
                sql_delete = "DELETE FROM tbl_song_type WHERE type_id=%s"
                # Execute the query
                cursor.execute(sql_delete, type_id)
                # the connection is not autocommit by default. So we must commit to save our changes.
                self.connections.commit()
            return {"status": "success"}, 200
        else:
            return {"status": "error"}, 404

    def put(self):
        if request.is_json:
            # convert to json
            data = request.get_json(force=True)["data"]
            sql_put = "update tbl_song_type set {} where {};"
            with self.connections.cursor() as cursor:
                cursor.execute(command_format(data, sql_put))
                self.connections.commit()
            return {'status': 'success'}, 200
        else:
            return {"status": "error"}, 404
