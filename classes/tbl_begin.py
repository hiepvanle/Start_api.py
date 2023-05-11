from flask import request, jsonify
from flask_restful import Resource
from classes.utils import command_format


class Begin(Resource):
    def __init__(self, **kwargs):
        self.connections = kwargs['connections']

    def get(self):
        if 'begin_id' != "":
            cur = self.connections.cursor()
            drive = []
            sql = "SELECT * FROM tbl_begin"
            cur.execute(sql)
            result = cur.fetchall()
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
            return jsonify(result)
        else:
            cur = self.connections.cursor()
            sql = "SELECT * FROM tbl_begin WHERE begin_id=%s"
            drive = []
            cur.execute(sql, ('begin_id',))
            result = cur.fetchone()
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
            if result:
                return jsonify(result)
            else:
                return "No results found ID"

    def post(self):
        if request.is_json:
            # convert to json
            data = request.get_json(force=True)["data"]

            with self.connections.cursor() as cursor:
                sql_insert = "INSERT INTO tbl_begin (begin_id, date, location, song_id, album_id, singer_id) " \
                             "VALUES ('{}', '{}','{}', '{}', '{}', '{}')"
                sql_post = sql_insert.format(data['begin_id'], data['date'], data['location'],
                                             data['song_id'], data['album_id'], data['singer_id'])
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
            begin_id = data['begin_id']
            with self.connections.cursor() as cursor:
                sql_delete = "DELETE FROM tbl_begin WHERE begin_id=%s"
                # Execute the query
                cursor.execute(sql_delete, begin_id)
                # the connection is not autocommit by default. So we must commit to save our changes.
                self.connections.commit()
            return {"status": "success"}, 200
        else:
            return {"status": "error"}, 404

    def put(self):
        if request.is_json:
            # convert to json
            data = request.get_json(force=True)
            sql_put = "update tbl_begin set {} where {};"
            with self.connections.cursor() as cursor:
                cursor.execute(command_format(data, sql_put))
                self.connections.commit()
            return {'status': 'success'}, 200
        else:
            return {"status": "error"}, 404
