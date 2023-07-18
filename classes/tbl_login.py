from flask import request
from flask_restful import Resource


class Login(Resource):
    def __init__(self, **kwargs):
        self.connections = kwargs['connections']

    def login(self):
        if request.query_string is not None or request.query_string != "":
            with self.connections.cursor() as cursor:
                # get all
                if request.args[''] == "email":
                    drive = []
                    sql = "SELECT * FROM `tbl_login` WHERE `email`=%s AND `password`=%s"
                    cursor.execute(sql)
                    result = cursor.fetchall()
                    for i in result:
                        data = {
                            'email': i[0],
                            'password': i[1],
                        }
                        drive.append(data)
                    if len(data) == 0:
                        return False
                    else:
                        return drive, 200

    def signup(self):
        if request.is_json:
            # convert to json
            data = request.get_json(force=True)
            with self.connections.cursor() as cursor:
                sql_post = "INSERT INTO `tbl_login` (`email`, `password`) " \
                           "VALUES ('{}', '{}');"
                sql_post = sql_post.format(data['email'], data['password'])
                cursor.execute(sql_post)
                self.connections.commit()
            return {'status': 'success'}, 201
        else:
            return {"status": "error"}
