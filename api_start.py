from flask import Flask
from flask_restful import Api


from utils import *

app = Flask(__name__)
api = Api(app)

conf = read_config()

connection = pymysql.connect(
    host=conf['DATABASE_00']['host'],
    user=conf['DATABASE_00']['user'],
    password=conf['DATABASE_00']['password'],
    db=conf['DATABASE_00']['db'])



if __name__ == '__main__':
    app.run(debug=True)