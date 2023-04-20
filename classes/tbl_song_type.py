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
                            'listen_count': i[3],
                            'rate_1_star': i[4],
                            'rate_2_star': i[5],
                            'rate_3_star': i[6],
                            'rate_4_star': i[7],
                            'rate_5_star': i[8],
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
                        'listen_count': result[3],
                        'rate_1_star': result[4],
                        'rate_2_star': result[5],
                        'rate_3_star': result[6],
                        'rate_4_star': result[7],
                        'rate_5_star': result[8],
                    }
                    return data, 200
        else:
            return {"status": "error"}

    def post(self):
        if request.is_json:
            # convert to json
            data = request.get_json(force=True)
            with self.connection.cursor() as cursor:
                sql_insert = "INSERT INTO 'tbl_song_type' ('type_id', 'type_name', 'type_description', " \
                             "'listen_count', 'rate_1_star'," \
                             " 'rate_2_star', 'rate_3_star', 'rate_4_star', 'rate_5_star', ) " \
                             "VALUES ('{}', '{}','{}', '{}', '{}', '{}', '{}', '{}', '{}', );"
                sql_post = sql_insert.format(data['type_id'], data['type_name'], data['type_description'],
                                             data['listen_count'], data['rate_1_star'], data['rate_2_star'],
                                             data['rate_3_star'], data['rate_4_star'], data['rate_5_star'])
                cursor.execute(sql_post)
                self.connection.commit()
            return {'status': 'success'}, 200
        else:
            return {"status": "error"}

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
            return {"status": "error"}

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
            return {"status": "error"}
