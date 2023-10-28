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
  db: 15,
});

app.get('/', (req, res) => {
  res.send('Proyecto 2 SOPES 1');
});

app.get('/obtener_registros', async (req, res) => {
  try { 
    const keys = await client.keys('alumno:*');
 
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
  
  const obtenerYEnviarRegistros = async () => {
    try {
      const keys = await client.keys('alumno:*');
      const totalRegistros = keys.length;
      const valores = await client.mget(...keys);

      const estudiantesPorCurso = {};

      valores.forEach((valor) => {
        const registro = JSON.parse(valor);
        const curso = registro.curso;

        if (estudiantesPorCurso[curso]) {
          estudiantesPorCurso[curso]++;
        } else {
          estudiantesPorCurso[curso] = 1;
        }
      });

      const datosParaGrafica = {
        totalRegistros,
        cursos: Object.keys(estudiantesPorCurso),
        cantidades: Object.values(estudiantesPorCurso),
      };

      socket.emit('registros', datosParaGrafica);
    } catch (error) {
      console.error('Error al obtener registros desde Redis', error);
      socket.emit('error', 'Error al obtener registros desde Redis');
    }
  };

  const interval = setInterval(obtenerYEnviarRegistros, 1000);

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
    clearInterval(interval);
  });
});

app.get('/obtenerRegistros', async (req, res) => {
  try {
    const keys = await client.keys('alumno:*');
    const totalRegistros = keys.length;
    const valores = await client.mget(...keys);

    const estudiantesPorCurso = {};

    valores.forEach((valor) => {
      const registro = JSON.parse(valor);
      const curso = registro.curso;

      if (estudiantesPorCurso[curso]) {
        estudiantesPorCurso[curso]++;
      } else {
        estudiantesPorCurso[curso] = 1;
      }
    });

    const datosParaGrafica = {
      totalRegistros,
      cursos: Object.keys(estudiantesPorCurso),
      cantidades: Object.values(estudiantesPorCurso),
    };

    res.json(datosParaGrafica);
  } catch (error) {
    console.error('Error al obtener registros desde Redis', error);
    res.status(500).json({ error: 'Error al obtener registros desde Redis' });
  }
});

app.use(require('./routes/consultas.js'));


server.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});
