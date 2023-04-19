from flask import Flask
from flask_restful import Api
import pymysql
from classes.tbl_song import Song

app = Flask(__name__)
api = Api(app)
connections = pymysql.connect(host='localhost', user='root', password='0397495785Ab@', db='mymucsic')

api.add_resource(Song, '/song', resouces_class_args={"connection": connections})

if __name__ == '__main__':
    app.run(debug=True)
