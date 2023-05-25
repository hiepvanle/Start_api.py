from flask import request, jsonify
from flask_restful import Resource

from classes.utils import command_format


class Singer(Resource):
    def __init__(self, **kwargs):
        self.connections = kwargs['connections']

    def get(self):
        if 'singer_id' != "":
            cur = self.connections.cursor()
            drive = []
            sql = "SELECT * FROM tbl_singer"
            cur.execute(sql)
            result = cur.fetchall()
            for i in result:
                data = {
                    'singer_id': i[0],
                    'singer_name': i[1],
                    'singer_description': i[2],
                    'hometown': i[3],
                    'date_of_birth': i[4],
                }
                drive.append(data)
            return jsonify(result)
        else:
            cur = self.connections.cursor()
            sql = "SELECT * FROM tbl_singer WHERE singer_id=%s"
            drive = []
            cur.execute(sql, ('singer_id',))
            result = cur.fetchone()
            for i in result:
                data = {
                    'singer_id': i[0],
                    'singer_name': i[1],
                    'singer_description': i[2],
                    'hometown': i[3],
                    'date_of_birth': i[4],
                }
                drive.append(data)
            return jsonify(result)

    def post(self):
        if request.is_json:
            # convert to json
            data = request.get_json(force=True)["data"]
            with self.connections.cursor() as cursor:
                sql_insert = "INSERT INTO tbl_singer (singer_id, singer_name, singer_description, hometown, "\
                             "date_of_birth) " \
                             "VALUES ('{}', '{}','{}', '{}', '{}');"
                sql_post = sql_insert.format(data['singer_id'], data['singer_name'], data['singer_description'],
                                             data['hometown'], data['date_of_birth'])
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
            song_id = data['singer_id']
            with self.connections.cursor() as cursor:
                sql_delete = "DELETE FROM tbl_singer WHERE singer_id=%s"
                # Execute the query
                cursor.execute(sql_delete, song_id)
                # the connection is not autocommit by default. So we must commit to save our changes.
                self.connections.commit()
            return {"status": "success"}, 200
        else:
            return {"status": "error"}, 404

    def put(self):
        if request.is_json:
            # convert to json
            data = request.get_json(force=True)["data"]
            sql_put = "update tbl_singer set {} where {};"
            with self.connections.cursor() as cursor:
                cursor.execute(command_format(data, sql_put))
                self.connections.commit()
            return {'status': 'success'}, 200
        else:
            return {"status": "error"}, 404
