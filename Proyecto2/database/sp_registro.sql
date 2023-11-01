-- FUNCIONALIDAD: REGISTRAR_ESTUDIANTE --
DELIMITER //

CREATE PROCEDURE registro_estudiante3(
	IN carnet_ BIGINT,
    IN nombre VARCHAR(100),
    IN curso VARCHAR(10),
    IN nota INT,
    IN semestre VARCHAR(10),
    IN anio INT
)
sp:BEGIN
	DECLARE num_rows INT;
    SELECT COUNT(*) INTO num_rows FROM alumno WHERE carnet = carnet_;
    
    IF num_rows = 0 THEN
        INSERT INTO alumno(carnet, nombre)
		VALUES(carnet_, nombre);
    END IF;
    
    INSERT INTO registro(nota, semestre, anio, carnet, cod_curso)
    VALUES(nota, semestre, anio, carnet_, curso);
    
END //

DELIMITER ;


