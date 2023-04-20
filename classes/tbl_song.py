from flask import request
from flask_restful import Resource

from classes.utils import command_format


class Song(Resource):
    def __init__(self, **kwargs):
        self.connection = kwargs['connection']

    def get(self):
        if request.json is not None or request.json != "":
            with self.connection.cursor() as cursor:
                # get all
                if request.args['song_id'] == "*":
                    drive = []
                    sql = "SELECT * FROM 'tbl_song'"
                    cursor.execute(sql)
                    result = cursor.fetchall()
                    for i in result:
                        data = {
                            'song_id': i[0],
                            'song_name': i[1],
                            'song_writer_id': i[2],
                            'type_id': i[3],
                        }
                        drive.append(data)
                    return drive, 200

                # get by id
                else:
                    sql = "SELECT * FROM 'tbl_song' WHERE 'song_id'=%s"
                    cursor.execute(sql, (request.args['song_id']))
                    result = cursor.fetchone()
                    data = {
                        'song_id': result[0],
                        'song_name': result[1],
                        'song_writer_id': result[2],
                        'type_id': result[3],
                    }
                    return data, 200
        else:
            return {"status": "error"}

    def post(self):
        if request.is_json:
            # convert to json
            data = request.get_json(force=True)
            with self.connection.cursor() as cursor:
                sql_insert = "INSERT INTO 'tbl_song' ('song_id', 'song_name', 'song_writer_id', 'type_id') " \
                           "VALUES ('{}', '{}','{}', '{}');"
                sql_post = sql_insert.format(data['song_id'], data['song_name'], data['song_writer_id'], data['type_id'])
                cursor.execute(sql_post)
                self.connection.commit()
            return {'status': 'success'}, 200
        else:
            return {"status": "error"}

    def delete(self):
        if request.is_json:
            # convert to json
            data = request.get_json(force=True)
            song_id = data['song_id']
            with self.connection.cursor() as cursor:
                sql_delete = "DELETE FROM 'tbl_song' WHERE 'song_id'=%s"
                # Execute the query
                cursor.execute(sql_delete, song_id)
                # the connection is not autocommit by default. So we must commit to save our changes.
                self.connection.commit()
            return {"status": "success"}, 200
        else:
            return {"status": "error"}

    def put(self):
        if request.is_json:
            # convert to json
            data = request.get_json(force=True)
            sql_put = "update tbl_song set {} where {};"
            with self.connection.cursor() as cursor:
                cursor.execute(command_format(data, sql_put))
                self.connection.commit()
            return {'status': 'success'}, 200
        else:
            return {"status": "error"}
