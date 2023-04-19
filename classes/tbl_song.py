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
                if request.args['sid'] == "*":
                    drive = []
                    sql = "SELECT * FROM `tbl_song`"
                    cursor.execute(sql)
                    result = cursor.fetchall()
                    for i in result:
                        data = {
                            'my_song_id': i[0],
                            'my_name': i[1],
                            'my_description': i[2],
                            'my_type_id': i[3],
                        }
                        drive.append(data)
                    return drive, 200

                # get by id
                else:
                    sql = "SELECT * FROM `tbl_song` WHERE `sid`=%s"
                    cursor.execute(sql, (request.args['sid']))
                    result = cursor.fetchone()
                    data = {
                        'my_song_id': result[0],
                        'my_name': result[1],
                        'my_description': result[2],
                        'my_type_id': result[3],
                    }
                    return data, 200
        else:
            return {"status": "error"}

    def post(self):
        if request.is_json:
            # convert to json
            data = request.get_json(force=True)
            with self.connection.cursor() as cursor:
                sql_insert = "INSERT INTO `tbl_song` (`eid`, `name`, `phone`, `email`) " \
                           "VALUES ('{}', '{}','{}', '{}');"
                sql_post = sql_insert.format(data['eid'], data['name'], data['phone'], data['email'])
                cursor.execute(sql_post)
                self.connection.commit()
            return {'status': 'success'}, 200
        else:
            return {"status": "error"}

    def delete(self):
        if request.is_json:
            # convert to json
            data = request.get_json(force=True)
            sid = data['sid']
            with self.connection.cursor() as cursor:
                sql_delete = "DELETE FROM `tbl_song` WHERE `sid`=%s"
                # Execute the query
                cursor.execute(sql_delete, sid)
                # the connection is not autocommited by default. So we must commit to save our changes.
                self.connection.commit()
            return {"status": "success"}, 200
        else:
            return {"status": "error"}

    def put(self):
        if request.is_json:
            # convert to json
            data = request.get_json(force=True)
            sql_put = "update tbl_employee set {} where {};"
            with self.connection.cursor() as cursor:
                cursor.execute(command_format(data, sql_put))
                self.connection.commit()
            return {'status': 'success'}, 200
        else:
            return {"status": "error"}
