from flask import request
from flask_restful import Resource

from classes.utils import command_format


class Singer(Resource):
    def __init__(self, **kwargs):
        self.connection = kwargs['connection']

    def get(self):
        if request.json is not None or request.json != "":
            with self.connection.cursor() as cursor:
                # get all
                if request.args['singer_id'] == "*":
                    drive = []
                    sql = "SELECT * FROM 'tbl_singer'"
                    cursor.execute(sql)
                    result = cursor.fetchall()
                    for i in result:
                        data = {
                            'singer_id': i[0],
                            'singer_name': i[1],
                            'singer_description': i[2],
                            'hometown': i[3],
                            'date_of_birth': i[4],
                        }
                        drive.append(data)
                    return drive, 200

                # get by id
                else:
                    sql = "SELECT * FROM 'tbl_singer' WHERE 'singer_id'=%s"
                    cursor.execute(sql, (request.args['singer_id']))
                    result = cursor.fetchone()
                    data = {
                        'singer_id': result[0],
                        'singer_name': result[1],
                        'singer_description': result[2],
                        'hometown': result[3],
                        'date_of_birth': result[4],
                    }
                    return data, 200
        else:
            return {"status": "error"}

    def post(self):
        if request.is_json:
            # convert to json
            data = request.get_json(force=True)
            with self.connection.cursor() as cursor:
                sql_insert = "INSERT INTO 'tbl_singer' ('singer_id', 'singer_name', 'singer_description', 'hometown', "\
                             "'date_of_birth') " \
                             "VALUES ('{}', '{}','{}', '{}', '{}');"
                sql_post = sql_insert.format(data['singer_id'], data['singer_name'], data['singer_description'],
                                             data['hometown'], data['date_of_birth'])
                cursor.execute(sql_post)
                self.connection.commit()
            return {'status': 'success'}, 200
        else:
            return {"status": "error"}

    def delete(self):
        if request.is_json:
            # convert to json
            data = request.get_json(force=True)
            song_id = data['singer_id']
            with self.connection.cursor() as cursor:
                sql_delete = "DELETE FROM 'tbl_singer' WHERE 'singer_id'=%s"
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
            sql_put = "update tbl_singer set {} where {};"
            with self.connection.cursor() as cursor:
                cursor.execute(command_format(data, sql_put))
                self.connection.commit()
            return {'status': 'success'}, 200
        else:
            return {"status": "error"}
