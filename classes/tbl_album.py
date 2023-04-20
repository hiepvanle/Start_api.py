from flask import request
from flask_restful import Resource

from classes.utils import command_format


class Album(Resource):
    def __init__(self, **kwargs):
        self.connection = kwargs['connection']

    def get(self):
        if request.json is not None or request.json != "":
            with self.connection.cursor() as cursor:
                # get all
                if request.args['album_id'] == "*":
                    drive = []
                    sql = "SELECT * FROM 'tbl_album'"
                    cursor.execute(sql)
                    result = cursor.fetchall()
                    for i in result:
                        data = {
                            'album_id': i[0],
                            'album_name': i[1],
                            'album_description': i[2],
                            'album_date': i[3],
                        }
                        drive.append(data)
                    return drive, 200

                # get by id
                else:
                    sql = "SELECT * FROM 'tbl_album' WHERE 'album_id'=%s"
                    cursor.execute(sql, (request.args['album_id']))
                    result = cursor.fetchone()
                    data = {
                        'album_id': result[0],
                        'album_name': result[1],
                        'album_description': result[2],
                        'album_date': result[3],
                    }
                    return data, 200
        else:
            return {"status": "error"}

    def post(self):
        if request.is_json:
            # convert to json
            data = request.get_json(force=True)
            with self.connection.cursor() as cursor:
                sql_insert = "INSERT INTO 'tbl_album' ('album_id', 'album_name', 'album_description', 'album_date') " \
                           "VALUES ('{}', '{}','{}', '{}');"
                sql_post = sql_insert.format(data['album_id'], data['album_name'], data['album_description'],
                                             data['album_date'])
                cursor.execute(sql_post)
                self.connection.commit()
            return {'status': 'success'}, 200
        else:
            return {"status": "error"}

    def delete(self):
        if request.is_json:
            # convert to json
            data = request.get_json(force=True)
            song_id = data['album_id']
            with self.connection.cursor() as cursor:
                sql_delete = "DELETE FROM 'tbl_album' WHERE 'album_id'=%s"
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
            sql_put = "update tbl_album set {} where {};"
            with self.connection.cursor() as cursor:
                cursor.execute(command_format(data, sql_put))
                self.connection.commit()
            return {'status': 'success'}, 200
        else:
            return {"status": "error"}
