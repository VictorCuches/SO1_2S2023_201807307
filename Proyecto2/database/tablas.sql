use sopes; 

CREATE TABLE alumno(
	carnet BIGINT PRIMARY KEY,
    nombre VARCHAR(100)
);

CREATE TABLE curso(
	cod_curso VARCHAR(10) PRIMARY KEY,
    nombre VARCHAR(100)
);

CREATE TABLE registro(
	cod_registro INT AUTO_INCREMENT PRIMARY KEY,
    nota INT,
    semestre VARCHAR(10),
    anio INT,
    carnet BIGINT,
    cod_curso VARCHAR(10),
    FOREIGN KEY (carnet) REFERENCES alumno(carnet),
    FOREIGN KEY (cod_curso) REFERENCES curso(cod_curso)
);


INSERT INTO alumno(carnet, nombre)
VALUES(201807307, 'Victor Cuches');

-- CURSOS
INSERT INTO curso(cod_curso, nombre)
VALUES('SO1', 'Sistemas Operativos 1');

INSERT INTO curso(cod_curso, nombre)
VALUES('BD1', 'Sistemas de Bases de Datos 1');

INSERT INTO curso(cod_curso, nombre)
VALUES('LFP', 'Lenguajes Formales y de Programación');

INSERT INTO curso(cod_curso, nombre)
VALUES('SA', 'Software Avanzado');

INSERT INTO curso(cod_curso, nombre)
VALUES('AYD1', 'Análisis y Diseño 1');

SELECT * FROM curso;

CALL registro_estudiante(201807307, 'Victor Cuches', 'SO1', 60, '2S', 2023);
SELECT * FROM alumno
SELECT * FROM registro
