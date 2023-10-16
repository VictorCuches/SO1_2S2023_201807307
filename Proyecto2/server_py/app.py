from flask import Flask, request, jsonify
import redis
import json

app = Flask(__name__)
redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)

@app.route('/')
def hola_mundo():
    return 'Hola mundo 201807307'


@app.route('/agregar_album', methods=['POST'])
def agregar_album():
    try:
        data = request.get_json()

        # Verifica que el JSON recibido contiene los campos requeridos
        if 'album' not in data or 'artist' not in data or 'year' not in data:
            return jsonify({'error': 'Faltan campos obligatorios'}), 400

        album = data['album']
        artist = data['artist']
        year = data['year']

        # Crea un diccionario con los datos del álbum
        album_data = {
            'album': album,
            'artist': artist,
            'year': year
        }

        # Convierte el diccionario a formato JSON
        album_json = json.dumps(album_data)

        # Inserta el JSON en Redis con la clave 'album:{album}'
        redis_key = f'album:{album}'
        redis_client.set(redis_key, album_json)

        return jsonify({'message': f'Álbum "{album}" agregado a Redis'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0',port=4000)
