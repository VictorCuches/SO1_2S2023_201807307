from flask import Flask
from flask import request
from flask import jsonify
from flask_cors import CORS
import redis
import json
import mysql.connector
from decouple import config

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

db_connection = mysql.connector.connect(
    host="34.170.239.207",
    user="root",
    password="root",
    database="sopes"
)
db_cursor = db_connection.cursor()

try:
    redis_client = redis.StrictRedis(host="redis",
                                    port="6379", 
                                    db=1)
except Exception as e:
    print("Error al conectar a redis ", str(e))

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
        return jsonify({'error en registrar alumno: ': str(e)}), 500

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
        return jsonify({'error en ver registros: ': str(e)}), 500


def registro_mysql(data):
    try:
        db_cursor.callproc("registro_estudiante", (data['carnet'], data['nombre'], data['curso'], data['nota'], data['semestre'], data['year']))
        db_connection.commit()
        print("*** PYTHON/MYSQL *** registro almacenado")

    except Exception as e:
        print(str(e))
    # finally:
    #     db_cursor.close()

@app.route('/cursos', methods=['GET'])
def get_cursos():
    cur = db_cursor
    db_cursor.execute("SELECT * FROM curso")
    data = cur.fetchall()
    cur.close()

    curso_list = []
    for curso in data:
        curso_dict = {
            'cod_curso': curso[0],
            'nombre': curso[1]
        }
        curso_list.append(curso_dict)

    return jsonify(curso_list)

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=4000)
