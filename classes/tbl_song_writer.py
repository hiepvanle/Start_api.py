from flask import request, jsonify
from flask_restful import Resource

from classes.utils import command_format


class Song_writer(Resource):
    def __init__(self, **kwargs):
        self.connections = kwargs['connections']

    def get(self):
        if 'song_writer_id' != "":
            cur = self.connections.cursor()
            drive = []
            sql = "SELECT * FROM tbl_song_writer"
            cur.execute(sql)
            result = cur.fetchall()
            for i in result:
                data = {
                    'song_writer_id': i[0],
                    'writer_date': i[1],
                    'write_id': i[3],
                }
                drive.append(data)
            return jsonify(result)
        else:
            cur = self.connections.cursor()
            sql = "SELECT * FROM tbl_song_writer WHERE song_writer_id=%s"
            drive = []
            cur.execute(sql, ('song_writer_id',))
            result = cur.fetchone()
            for i in result:
                data = {
                    'song_writer_id': i[0],
                    'writer_date': i[1],
                    'write_id': i[3],
                }
                drive.append(data)
            return jsonify(result)

    def post(self):
        if request.is_json:
            # convert to json
            data = request.get_json(force=True)["data"]
            with self.connections.cursor() as cursor:
                sql_insert = "INSERT INTO tbl_song_writer (song_writer_id, writer_date, write_id) " \
                           "VALUES ('{}', '{}','{}');"
                sql_post = sql_insert.format(data['song_writer_id'], data['writer_date'], data['write_id'])
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
            song_writer_id = data['song_writer_id']
            with self.connections.cursor() as cursor:
                sql_delete = "DELETE FROM tbl_song_writer WHERE song_writer_id=%s"
                # Execute the query
                cursor.execute(sql_delete, song_writer_id)
                # the connection is not autocommit by default. So we must commit to save our changes.
                self.connections.commit()
            return {"status": "success"}, 200
        else:
            return {"status": "error"}, 404

    def put(self):
        if request.is_json:
            # convert to json
            data = request.get_json(force=True)
            sql_put = "update tbl_song_writer set {} where {};"
            with self.connections.cursor() as cursor:
                cursor.execute(command_format(data, sql_put))
                self.connections.commit()
            return {'status': 'success'}, 200
        else:
            return {"status": "error"}, 404
