from flask import request
from flask_restful import Resource
from classes.utils import command_format


class Begin(Resource):
    def __init__(self, **kwargs):
        self.connection = kwargs['connection']

    def get(self):
        if request.json is not None or request.json != "":
            with self.connection.cursor() as cursor:
                # get all
                if request.args['begin_id'] == "*":
                    drive = []
                    sql = "SELECT * FROM tbl_begin"
                    cursor.execute(sql)
                    result = cursor.fetchall()
                    for i in result:
                        data = {
                            'begin_id': i[0],
                            'song_id': i[1],
                            'singer_id': i[2],
                            'album_id': i[3],
                            'date': i[4],
                            'location': i[5],
                        }
                        da = drive.append(data)
                    return da, 200

                # get by id
                else:
                    sql = "SELECT * FROM tbl_begin WHERE begin_id=%s"
                    cursor.execute(sql, (request.args['begin_id']))
                    result = cursor.fetchone()
                    data = {
                        'begin_id': result[0],
                        'song_id': result[1],
                        'singer_id': result[2],
                        'album_id': result[3],
                        'date': result[4],
                        'location': result[5],
                    }
                    return data, 200
        else:
            return {"status": "error"}, 404

    def post(self):
        if request.is_json:
            # convert to json
            data = request.get_json(force=True)["data"]

            with self.connection.cursor() as cursor:
                sql_insert = "INSERT INTO tbl_begin (begin_id, date, location, song_id, album_id, singer_id) " \
                             "VALUES ('{}', '{}','{}', '{}', '{}', '{}')"
                sql_post = sql_insert.format(data['begin_id'], data['date'], data['location'],
                                             data['song_id'], data['album_id'], data['singer_id'])
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
            begin_id = data['begin_id']
            with self.connection.cursor() as cursor:
                sql_delete = "DELETE FROM tbl_begin WHERE begin_id=%s"
                # Execute the query
                cursor.execute(sql_delete, begin_id)
                # the connection is not autocommit by default. So we must commit to save our changes.
                self.connection.commit()
            return {"status": "success"}, 200
        else:
            return {"status": "error"}, 404

    def put(self):
        if request.is_json:
            # convert to json
            data = request.get_json(force=True)
            sql_put = "update tbl_begin set {} where {};"
            with self.connection.cursor() as cursor:
                cursor.execute(command_format(data, sql_put))
                self.connection.commit()
            return {'status': 'success'}, 200
        else:
            return {"status": "error"}, 404
