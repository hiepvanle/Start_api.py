from flask import Flask
from flask_restful import Resource, Api, reqparse
import pymysql
import json

app = Flask(__name__)
api = Api(app)
connection = pymysql.connect(host='localhost', user='root', password='0397495785Ab@', db='mymucsic')


class MyMusicObj(Resource):
    # select data
    def get(self, mymucsic_id):
        if mymucsic_id != '*':
            with connection.cursor() as cursor:
                # Read a single record
                sql = "SELECT * FROM 'tbl_song' WHERE 'my_song_id'=%s"
                cursor.execute(sql, mymucsic_id)
                result = cursor.fetchone()
                if result is not None:
                    res = {'my_song_id': result[0],
                           'my_name': result[1],
                           'my_description': result[2],
                           'my_type_id': result[3]
                           }
                    return res
                else:
                    return "", 404
        else:
            with connection.cursor() as cursor:
                # Read a single record
                sql = "SELECT * FROM 'tbl_song'"
                cursor.execute(sql)
                result = cursor.fetchall()
                if result is not None:
                    res = []
                    for r in result:
                        res.append(
                            {'my_song_id': result[0],
                             'my_name': result[1],
                             'my_description': result[2],
                             'my_type_id': result[3]
                             })
                    return res
                else:
                    return "", 500

    # insert data
    def post(self, mymucsic_id):
        args = parser.parse_args()
        json_msg = json.load(args['data'])  # json.loads(args['data'])
        with connection.cursor() as cursor:
            for param in json_msg:
                sql = "INSERT INTO 'tbl_song' VALUES (%s, %s, %s, %s)"
                params = (param['my_song_id'], param['my_name'], param['my_description'], param['my_type_id'])
                # Execute the query
                cursor.execute(sql, params)
                # the connection is not autocommited by default. So we must commit to save our changes.
                connection.commit()
        return {"status": "success|fail"}, 200 | 500

    # modify data
    def put(self, mymucsic_id):
        pass

    # delete data
    def delete(self, mymucsic_id):
        with connection.cursor() as cursor:
            sql_delete = "DELETE FROM `tbl_employee` WHERE `em_id`=%s"
            params = (mymucsic_id)
            # Execute the query
            cursor.execute(sql_delete, params)
            # the connection is not autocommited by default. So we must commit to save our changes.
            connection.commit()
        return {"status": "success"}, 204
        pass


# class EmployeeQuery:
#     def post(self):
#         pass


api.add_resource(MyMusicObj, '/tbl/song/*')
# api.add_resource(EmployeeQuery, '/query/emp')

if __name__ == '__main__':
    parser = reqparse.RequestParser()
    # Look only in the POST body
    parser.add_argument('data', type=list, location='json')
    app.run(debug=True)
