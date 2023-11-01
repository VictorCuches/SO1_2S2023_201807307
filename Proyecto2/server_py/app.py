from flask import Flask, request, jsonify
from flask_cors import CORS
import redis
import json
from mysql.connector.pooling import MySQLConnectionPool

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Configura la pool de conexiones de MySQL
mysql_pool = MySQLConnectionPool(
    pool_name="my_pool",
    pool_size=5,
    host="34.170.239.207",
    user="root",
    password="root",
    database="sopes"
)

try:
    redis_client = redis.StrictRedis(host="redis", port=6379, db=1)
except Exception as e:
    print("Error al conectar a Redis: ", str(e))

next_id = 1

@app.route('/')
def hola_mundo():
    return 'Proyecto 2 - 201807307'

@app.route('/prueba')
def prueba():
    return 'CAMBIO DE ENDPOINT - 201807307'

@app.route('/registrar_alumno', methods=['POST'])
def registrar_alumno():
    global next_id
    try:
        data = request.get_json()

        required_fields = ['carnet', 'nombre', 'curso', 'nota', 'semestre', 'year']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Falta el campo obligatorio: {field}'}), 400

        carnet = data['carnet']
        curso = data['curso']
        year = data['year']

        # Genera una clave única basada en el próximo ID
        clave_incr = f'alumno:{next_id}'
        next_id += 1  # Incrementa el ID

        alumno_data = {
            'carnet': carnet,
            'nombre': data['nombre'],
            'curso': curso,
            'nota': data['nota'],
            'semestre': data['semestre'],
            'year': year
        }

        alumno_json = json.dumps(alumno_data)

        # Usa la clave única generada
        redis_client.set(clave_incr, alumno_json)

        print("*** REDIS *** registro almacenado")
        registro_mysql(data)

        return jsonify({'message': f'Alumno "{data["nombre"]}" registrado en Redis'}), 201

    except Exception as e:
        print("Error en registrar alumno:", str(e))
        return jsonify({'error en registrar alumno: ': str(e)}), 500

def registro_mysql(data):
    try:
        connection = mysql_pool.get_connection()
        cursor = connection.cursor()
        cursor.callproc("registro_estudiante3", (data['carnet'], data['nombre'], data['curso'], data['nota'], data['semestre'], data['year']))
        connection.commit()
        print("*** PYTHON/MYSQL *** registro almacenado")
    except Exception as e:
        print("ERROR MYSQL: ", str(e))
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

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
        print("Error en ver registros:", str(e))
        return jsonify({'error en ver registros: ': str(e)}), 500

@app.route('/cursos', methods=['GET'])
def get_cursos():
    try:
        connection = mysql_pool.get_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM curso")
        data = cursor.fetchall()
        curso_list = []

        for curso in data:
            curso_dict = {
                'cod_curso': curso[0],
                'nombre': curso[1]
            }
            curso_list.append(curso_dict)

        return jsonify(curso_list)

    except Exception as e:
        print("Error en obtener cursos:", str(e))
        return jsonify({'error en obtener cursos: ': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000)
