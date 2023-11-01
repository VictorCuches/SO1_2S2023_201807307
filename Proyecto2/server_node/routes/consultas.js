
const express = require('express')
const dotenv = require('dotenv')
const router = express.Router();
const mysql = require('mysql2/promise');
const { promisify } = require('util');


dotenv.config()

const { MYSQLDB_HOST, MYSQLDB_ROOT_PASSWORD, MYSQLDB_DATABASE, MYSQLDB_DOCKER_PORT, API_GO_URL } = process.env;

const dbConfig = {
    host: "34.170.239.207",
    port: "3306",
    user: 'root',
    password: "root",
    database: "sopes",
};

async function connectToDatabase() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        return connection;
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err.message);
        throw err;
    }
}

 
router.get('/rutasbd', (req, res) => {
  res.send('RUTA BD');
});

router.get('/prueba', async (req, res) => {
    try {
        const connection = await connectToDatabase();

        const [rows] = await connection.execute(
            `SELECT * FROM curso`
        );
        res.json(rows);

        connection.end();
    } catch (error) {
        console.error('Error al obtener datos: ', error);
        res.status(500).json({ error: 'Error al obtener datos' });
    }
});

router.get('/getAllData', async (req, res) => {
    try {
        const connection = await connectToDatabase();

        const [rows] = await connection.execute(
            `SELECT 
                al.carnet, al.nombre,
                reg.nota, reg.semestre, reg.anio, reg.cod_curso
             FROM 
                alumno al 
                INNER JOIN registro reg ON reg.carnet = al.carnet
             ORDER BY 
	            reg.cod_registro ASC;`
        );
        res.json(rows);
        
        connection.end();
    } catch (error) {
        console.error('Error al obtener datos: ', error);
        res.status(500).json({ error: 'Error al obtener datos' });
    }
});

router.get('/approvedCourse/:course/:semester', async (req, res) => {
    const course = req.params.course;
    const semester = req.params.semester;
    console.log(`NODE: Porcentaje de aprobacion curso`)
    try {
        const connection = await connectToDatabase();

        const [rows] = await connection.execute(
            `SELECT
                SUM(CASE WHEN reg.nota > 60 THEN 1 ELSE 0 END) AS Aprobados,
                SUM(CASE WHEN reg.nota <= 60 THEN 1 ELSE 0 END) AS Reprobados
            FROM 
                alumno alu 
                INNER JOIN registro reg ON reg.carnet = alu.carnet
            WHERE 
                reg.cod_curso = ?
                AND reg.semestre = ? `,
            [course, semester]
        );
        res.json(rows);

        connection.end();
    } catch (error) {
        console.error('Error al obtener datos dataHistory:', error);
        res.status(500).json({ error: 'Error al obtener datos' });
    }
});

router.get('/courseStudent/:semester', async (req, res) => {
    const semester = req.params.semester;
    console.log(`NODE: Cantidad de alumnos por curso`)
    try {
        const connection = await connectToDatabase();

        const [rows] = await connection.execute(
            `SELECT
                reg.cod_curso,
                COUNT(alu.carnet) 'cantidad'
            FROM 
                alumno alu 
                INNER JOIN registro reg ON reg.carnet = alu.carnet
            WHERE 
                reg.semestre = ?
            GROUP BY 
                reg.cod_curso
            ORDER BY 
                cantidad DESC
            LIMIT 3`,
            [semester]
        );
        res.json(rows);

        connection.end();
    } catch (error) {
        console.error('Error al obtener datos dataHistory:', error);
        res.status(500).json({ error: 'Error al obtener datos' });
    }
});

router.get('/avgStudent/:semester', async (req, res) => {
    const semester = req.params.semester;
    console.log(`NODE: Promedio alumnos`)
    try {
        const connection = await connectToDatabase();

        const [rows] = await connection.execute(
            `SELECT
                alu.carnet, 
                alu.nombre,
                AVG(reg.nota) 'promedio'
            FROM 
                alumno alu 
                INNER JOIN registro reg ON reg.carnet = alu.carnet
            WHERE 
                reg.semestre = ?
            GROUP BY 
                alu.carnet,
                alu.nombre
            ORDER BY 
                promedio DESC
            LIMIT 5`,
            [semester]
        );
        res.json(rows);

        connection.end();
    } catch (error) {
        console.error('Error al obtener datos dataHistory:', error);
        res.status(500).json({ error: 'Error al obtener datos' });
    }
});

module.exports = router;