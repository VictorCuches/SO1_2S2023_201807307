from flask import Flask, request, jsonify
from flask_cors import CORS
# import redis
import json

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# redis_client = redis.StrictRedis(host='localhost', port=6379, db=15)

@app.route('/')
def hola_mundo():
    return 'Hola mundo 201807307'


# @app.route('/set_album', methods=['POST'])
# def agregar_album():
#     try:
#         data = request.get_json()

#         # Verifica que el JSON recibido contiene los campos requeridos
#         if 'album' not in data or 'artist' not in data or 'year' not in data:
#             return jsonify({'error': 'Faltan campos obligatorios'}), 400

#         album = data['album']
#         artist = data['artist']
#         year = data['year']

#         # Crea un diccionario con los datos del álbum
#         album_data = {
#             'album': album,
#             'artist': artist,
#             'year': year
#         }

#         # Convierte el diccionario a formato JSON
#         album_json = json.dumps(album_data)

#         # Inserta el JSON en Redis con la clave 'album:{album}'
#         redis_key = f'album:{album}'
#         redis_client.set(redis_key, album_json)

#         return jsonify({'message': f'"{album}" registrado en Redis'}), 201

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500


# @app.route('/registrar_alumno', methods=['POST'])
# def registrar_alumno():
#     try:
#         data = request.get_json()
 
#         required_fields = ['carnet', 'nombre', 'curso', 'nota', 'semestre', 'year']
#         for field in required_fields:
#             if field not in data:
#                 return jsonify({'error': f'Falta el campo obligatorio: {field}'}), 400

#         carnet = data['carnet']
#         curso = data['curso']
#         year = data['year']
 
#         alumno_data = {
#             'carnet': carnet,
#             'nombre': data['nombre'],
#             'curso': curso,
#             'nota': data['nota'],
#             'semestre': data['semestre'],
#             'year': year
#         }
 
#         alumno_json = json.dumps(alumno_data)
 
#         redis_key = f'alumno:{carnet}:{curso}:{year}'
#         redis_client.set(redis_key, alumno_json)

#         print("*** REDIS *** registro almacenado")

#         return jsonify({'message': f'Alumno "{data["nombre"]}" registrado en Redis'}), 201

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500



if __name__ == '__main__':
    app.run(host='0.0.0.0',port=4000)
