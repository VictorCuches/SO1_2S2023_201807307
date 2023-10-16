const express = require('express');
const cors = require('cors');
const http = require('http');
const Redis = require('ioredis');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

const server = http.createServer(app);

app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
// app.use(bodyParser.json());

const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
})


const client = new Redis({
  host: 'localhost',
  port: 6379,
  password: '',
  db: 0,
});

app.get('/', (req, res) => {
  res.send('¡Hola, Mundo desde Node!');
});


app.get('/obtener_registros', async (req, res) => {
  try { 
    const keys = await client.keys('album:*');
 
    if (keys.length === 0) {
      return res.json([]);  
    }
 
    const valores = await client.mget(...keys);
 
    const registros = keys.map((clave, index) => ({
      clave,
      valor: valores[index],
    }));

    res.json(registros);
  } catch (error) {
    console.error('Error al obtener registros desde Redis', error);
    res.status(500).json({ error: 'Error al obtener registros desde Redis' });
  }
});


io.on('connection', (socket) => {
  console.log('Cliente conectado');
  
  // Definir una función que obtiene y emite los registros
  const obtenerYEnviarRegistros = async () => {
    try {
      const keys = await client.keys('album:*');

      if (keys.length === 0) {
        socket.emit('registros', []); // Enviar una respuesta al cliente
        return;
      }

      const valores = await client.mget(...keys);

      const registros = keys.map((clave, index) => ({
        clave,
        valor: valores[index],
      }));

      socket.emit('registros', registros); // Enviar una respuesta al cliente
    } catch (error) {
      console.error('Error al obtener registros desde Redis', error);
      socket.emit('error', 'Error al obtener registros desde Redis'); // Enviar un error al cliente
    }
  };

  // Ejecutar la función cada segundo con setInterval
  const interval = setInterval(obtenerYEnviarRegistros, 1000);

  // Manejar la desconexión del cliente
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
    // Limpiar el intervalo cuando el cliente se desconecta
    clearInterval(interval);
  });
});



server.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});
