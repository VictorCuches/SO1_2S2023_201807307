
CREATE DATABASE sopes;
USE sopes;

CREATE  TABLE calificacion(
    id_calificacion INT AUTO_INCREMENT PRIMARY KEY,
    carnet bigint,
    nombre VARCHAR(100),
    curso VARCHAR(10),
    nota INT,
    semestre VARCHAR(10),
    year INT
);

INSERT INTO calificacion(carnet, nombre, curso, nota, semestre, year)
VALUES(201807307, 'Victor Cuches', 'SO1', 80, '2S', 2023);

SELECT * FROM calificacion;