import json
import pymysql

def read_config(file='conf/config.json'):
    with open(file) as f:
        return json.load(f)


