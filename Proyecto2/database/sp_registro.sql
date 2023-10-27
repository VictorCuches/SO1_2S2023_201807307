-- FUNCIONALIDAD: REGISTRAR_ESTUDIANTE --
DELIMITER //

CREATE PROCEDURE registro_estudiante(
	IN carnet BIGINT,
    IN nombre VARCHAR(100),
    IN curso VARCHAR(10),
    IN nota INT,
    IN semestre VARCHAR(10),
    IN anio INT
)
sp:BEGIN
	DECLARE num_rows INT;
    SELECT COUNT(*) INTO num_rows FROM alumno WHERE carnet = 201807307;
    
    IF num_rows = 0 THEN
        INSERT INTO alumno(carnet, nombre)
		VALUES(carnet, nombre);
    END IF;
    
    INSERT INTO registro(nota, semestre, anio, carnet, cod_curso)
    VALUES(nota, semestre, anio, carnet, curso);
    
END //

DELIMITER ;


