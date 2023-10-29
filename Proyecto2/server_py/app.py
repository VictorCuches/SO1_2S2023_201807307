from flask import Flask, request, jsonify
from flask_cors import CORS
import redis
import json
import mysql.connector
from decouple import config

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

print(config("MYSQLDB_HOST"))

db_connection = mysql.connector.connect(
    host=config("MYSQLDB_HOST"),
    user=config("MYSQLDB_USER"),
    password=config("MYSQLDB_PASS"),
    database=config("MYSQLDB_DB")
)
db_cursor = db_connection.cursor()

redis_client = redis.StrictRedis(host=config("REDIS_HOST"),
                                 port=config("REDIS_PORT"), 
                                 db=config("REDIS_DB"))

@app.route('/')
def hola_mundo():
    return 'Proyecto 2 - 201807307'

@app.route('/prueba')
def prueba():
    return 'CAMBIO DE ENDPOINT'


@app.route('/registrar_alumno', methods=['POST'])
def registrar_alumno():
    try:
        data = request.get_json()
 
        required_fields = ['carnet', 'nombre', 'curso', 'nota', 'semestre', 'year']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Falta el campo obligatorio: {field}'}), 400

        carnet = data['carnet']
        curso = data['curso']
        year = data['year']
 
        alumno_data = {
            'carnet': carnet,
            'nombre': data['nombre'],
            'curso': curso,
            'nota': data['nota'],
            'semestre': data['semestre'],
            'year': year
        }
 
        alumno_json = json.dumps(alumno_data)
 
        redis_key = f'alumno:{carnet}:{curso}:{year}'
        redis_client.set(redis_key, alumno_json)

        print("*** REDIS *** registro almacenado")
        registro_mysql(data)

        return jsonify({'message': f'Alumno "{data["nombre"]}" registrado en Redis'}), 201

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

@app.route('/ver_registros', methods=['GET'])
def ver_registros():
    try:
        keys = redis_client.keys("alumno:*")

        registros = []

        for key in keys:
            registro_json = redis_client.get(key)
            registro = json.loads(registro_json)
            registros.append(registro)

        return jsonify(registros), 200

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500


def registro_mysql(data):
    try:
        db_cursor.callproc("registro_estudiante", (data['carnet'], data['nombre'], data['curso'], data['nota'], data['semestre'], data['year']))
        db_connection.commit()

        print("*** PYTHON/MYSQL *** registro almacenado")

    except Exception as e:
        print(str(e))
    # finally:
    #     db_cursor.close()

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=4000)
