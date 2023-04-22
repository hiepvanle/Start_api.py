from flask import request
from flask_restful import Resource

from classes.utils import command_format


class Song_type(Resource):
    def __init__(self, **kwargs):
        self.connection = kwargs['connection']

    def get(self):
        if request.json is not None or request.json != "":
            with self.connection.cursor() as cursor:
                # get all
                if request.args['type_id'] == "*":
                    drive = []
                    sql = "SELECT * FROM 'tbl_song_type'"
                    cursor.execute(sql)
                    result = cursor.fetchall()
                    for i in result:
                        data = {
                            'type_id': i[0],
                            'type_name': i[1],
                            'type_description': i[2],
                        }
                        drive.append(data)
                    return drive, 200

                # get by id
                else:
                    sql = "SELECT * FROM 'tbl_song_type' WHERE 'type_id'=%s"
                    cursor.execute(sql, (request.args['type_id']))
                    result = cursor.fetchone()
                    data = {
                        'type_id': result[0],
                        'type_name': result[1],
                        'type_description': result[2],
                    }
                    return data, 200
        else:
            return {"status": "error"}, 404

    def post(self):
        if request.is_json:
            # convert to json
            data = request.get_json(force=True)["data"]
            with self.connection.cursor() as cursor:
                sql_insert = "INSERT INTO tbl_song_type (type_id, type_name, type_description)" \
                             "VALUES ('{}', '{}','{}');"
                sql_post = sql_insert.format(data['type_id'], data['type_name'], data['type_description'])
                print(sql_post)
                cursor.execute(sql_post)
                self.connection.commit()
            return {'status': 'success'}, 200
        else:
            return {"status": "error"}, 404

    def delete(self):
        if request.is_json:
            # convert to json
            data = request.get_json(force=True)
            type_id = data['type_id']
            with self.connection.cursor() as cursor:
                sql_delete = "DELETE FROM 'tbl_song_type' WHERE 'type_id'=%s"
                # Execute the query
                cursor.execute(sql_delete, type_id)
                # the connection is not autocommit by default. So we must commit to save our changes.
                self.connection.commit()
            return {"status": "success"}, 200
        else:
            return {"status": "error"}, 404

    def put(self):
        if request.is_json:
            # convert to json
            data = request.get_json(force=True)
            sql_put = "update tbl_song_type set {} where {};"
            with self.connection.cursor() as cursor:
                cursor.execute(command_format(data, sql_put))
                self.connection.commit()
            return {'status': 'success'}, 200
        else:
            return {"status": "error"}, 404
