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
  host: 'redis',
  port: 6379,
  password: '',
  db: 1,
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
      const valores = await client.mget(...keys);

      const registros1S = [];
      const registros2S = [];

      valores.forEach((valor) => {
        const registro = JSON.parse(valor);
        const curso = registro.curso;
        const semestre = registro.semestre;

        if (semestre === "1S") {
          registros1S.push(registro);
        } else if (semestre === "2S") {
          registros2S.push(registro);
        }
      });

      const estudiantesPorCurso1S = {};
      const estudiantesPorCurso2S = {};

      registros1S.forEach((registro) => {
        const curso = registro.curso;

        if (estudiantesPorCurso1S[curso]) {
          estudiantesPorCurso1S[curso]++;
        } else {
          estudiantesPorCurso1S[curso] = 1;
        }
      });

      registros2S.forEach((registro) => {
        const curso = registro.curso;

        if (estudiantesPorCurso2S[curso]) {
          estudiantesPorCurso2S[curso]++;
        } else {
          estudiantesPorCurso2S[curso] = 1;
        }
      });

      const datosParaGrafica1S = {
        totalRegistros: registros1S.length,
        cursos: Object.keys(estudiantesPorCurso1S),
        cantidades: Object.values(estudiantesPorCurso1S),
      };

      const datosParaGrafica2S = {
        totalRegistros: registros2S.length,
        cursos: Object.keys(estudiantesPorCurso2S),
        cantidades: Object.values(estudiantesPorCurso2S),
      };

      socket.emit('registros', { datosParaGrafica1S, datosParaGrafica2S });
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
      const valores = await client.mget(...keys);

      const registros1S = [];
      const registros2S = [];

      valores.forEach((valor) => {
        const registro = JSON.parse(valor);
        const curso = registro.curso;
        const semestre = registro.semestre;

        if (semestre === "1S") {
          registros1S.push(registro);
        } else if (semestre === "2S") {
          registros2S.push(registro);
        }
      });

      const estudiantesPorCurso1S = {};
      const estudiantesPorCurso2S = {};

      registros1S.forEach((registro) => {
        const curso = registro.curso;

        if (estudiantesPorCurso1S[curso]) {
          estudiantesPorCurso1S[curso]++;
        } else {
          estudiantesPorCurso1S[curso] = 1;
        }
      });

      registros2S.forEach((registro) => {
        const curso = registro.curso;

        if (estudiantesPorCurso2S[curso]) {
          estudiantesPorCurso2S[curso]++;
        } else {
          estudiantesPorCurso2S[curso] = 1;
        }
      });

      const datosParaGrafica1S = {
        totalRegistros: registros1S.length,
        cursos: Object.keys(estudiantesPorCurso1S),
        cantidades: Object.values(estudiantesPorCurso1S),
      };

      const datosParaGrafica2S = {
        totalRegistros: registros2S.length,
        cursos: Object.keys(estudiantesPorCurso2S),
        cantidades: Object.values(estudiantesPorCurso2S),
      };

    res.json( { datosParaGrafica1S, datosParaGrafica2S });
  } catch (error) {
    console.error('Error al obtener registros desde Redis', error);
    res.status(500).json({ error: 'Error al obtener registros desde Redis' });
  }
});

app.use(require('./routes/consultas.js'));


server.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});
