use sopes;

SELECT 
	al.carnet, al.nombre,
	reg.nota, reg.semestre, reg.anio, reg.cod_curso
 FROM 
	alumno al 
	INNER JOIN registro reg ON reg.carnet = al.carnet
 ORDER BY 
	reg.cod_registro ASC


-- Gráfica Circular de las Notas de un Curso en un semestre. (No. Aprobados y Reprobados)
SELECT
	SUM(CASE WHEN reg.nota > 60 THEN 1 ELSE 0 END) AS Aprobados,
    SUM(CASE WHEN reg.nota <= 60 THEN 1 ELSE 0 END) AS Reprobados
FROM 
	alumno alu 
    INNER JOIN registro reg ON reg.carnet = alu.carnet
WHERE 
	reg.cod_curso = 'SO1'
    AND reg.semestre = '2S';
    
    
-- Gráfica de Barras de Cursos con Mayor número de alumnos en un semestre específico. (Mostrar Top 3).
SELECT
	reg.cod_curso,
    COUNT(alu.carnet) 'cantidad'
FROM 
	alumno alu 
    INNER JOIN registro reg ON reg.carnet = alu.carnet
WHERE 
	reg.semestre = '2S'
GROUP BY 
	reg.cod_curso
ORDER BY 
	cantidad DESC
LIMIT 3;

-- Gráfica de Barras de Alumnos con mejor Promedio (Mostrar únicamente un Top 5)
SELECT
	alu.carnet, 
    alu.nombre,
    AVG(reg.nota) 'promedio'
FROM 
	alumno alu 
    INNER JOIN registro reg ON reg.carnet = alu.carnet
WHERE 
	reg.semestre = '1S' 
GROUP BY 
	alu.carnet,
    alu.nombre
ORDER BY 
	promedio DESC
LIMIT 5;

    
    
    
    