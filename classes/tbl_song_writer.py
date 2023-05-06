from flask import request
from flask_restful import Resource

from classes.utils import command_format


class Song_writer(Resource):
    def __init__(self, **kwargs):
        self.connection = kwargs['connection']

    def get(self):
        if request.json is not None or request.json != "":
            with self.connection.cursor() as cursor:
                # get all
                if request.args['song_writer_id'] == "*":
                    drive = []
                    sql = "SELECT * FROM tbl_song_writer"
                    cursor.execute(sql)
                    result = cursor.fetchall()
                    for i in result:
                        data = {
                            'song_writer_id': i[0],
                            'writer_date': i[1],
                            'write_id': i[3],
                        }
                        drive.append(data)
                    return drive, 200

                # get by id
                else:
                    sql = "SELECT * FROM tbl_song_writer WHERE song_writer_id=%s"
                    cursor.execute(sql, (request.args['song_writer_id']))
                    result = cursor.fetchone()
                    data = {
                        'song_writer_id': result[0],
                        'writer_date': result[1],
                        'write_id': result[3],
                    }
                    return data, 200
        else:
            return {"status": "error"}, 404

    def post(self):
        if request.is_json:
            # convert to json
            data = request.get_json(force=True)["data"]
            with self.connection.cursor() as cursor:
                sql_insert = "INSERT INTO tbl_song_writer (song_writer_id, writer_date, write_id) " \
                           "VALUES ('{}', '{}','{}');"
                sql_post = sql_insert.format(data['song_writer_id'], data['writer_date'], data['write_id'])
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
            song_writer_id = data['song_writer_id']
            with self.connection.cursor() as cursor:
                sql_delete = "DELETE FROM tbl_song_writer WHERE song_writer_id=%s"
                # Execute the query
                cursor.execute(sql_delete, song_writer_id)
                # the connection is not autocommit by default. So we must commit to save our changes.
                self.connection.commit()
            return {"status": "success"}, 200
        else:
            return {"status": "error"}, 404

    def put(self):
        if request.is_json:
            # convert to json
            data = request.get_json(force=True)
            sql_put = "update tbl_song_writer set {} where {};"
            with self.connection.cursor() as cursor:
                cursor.execute(command_format(data, sql_put))
                self.connection.commit()
            return {'status': 'success'}, 200
        else:
            return {"status": "error"}, 404
