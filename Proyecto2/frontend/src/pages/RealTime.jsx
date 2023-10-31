import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Table from "../components/TableData.jsx";
import GraphHorizontal from "../components/GraphHorizontal";
import "bootstrap-icons/font/bootstrap-icons.css"; 
import socket from '../socket/Socket';



const RealTime = () => {
  const [registros, setRegistros] = useState({});
  const [semester, setSemester] = useState('1S');

  const listSemester = [
    { value: "1S", label: "Primer Semestre" },
    { value: "2S", label: "Segundo Semestre" },
  ];

  const handleSelectChange = (event) => {
    const valueSelect = event.target.value;
    setSemester(valueSelect);    
    loadRegistros()
  };

  const loadRegistros = () => {
    socket.emit("obtener_registros");
    
    socket.on("registros", (data) => {
      console.log("Registros recibidos:", data);
      if(semester === '1S'){
        setRegistros(data.datosParaGrafica1S)
      } else {
        setRegistros(data.datosParaGrafica2S)
      }
    });

  }

  useEffect(() => {   
    loadRegistros();

  }, [semester]);

  return (
    <div className="container ">
      <div className="row py-3 d-flex justify-content-center">
        <div className="col-10">
          <div className="card shadow-lg p-3 mb-5 bg-white rounded">
            <div className="card-body">
              <h1>REDIS</h1>

              <div className="d-flex justify-content-center col-12">
                <div className="shadow-lg p-3 mb-2 bg-white rounded col-4 text-center">
                  <div>
                    <h1>{registros.totalRegistros}</h1>
                  </div>
                  <div>
                    <span>Cantidad de datos</span>                    
                  </div>
                </div>                
              </div>

              <div className="col-12">
                <Form.Select
                  aria-label="Default select example"
                  onChange={handleSelectChange}
                  className="my-4"
                >
                  {/* <option>Seleccione maquina virtual</option> */}
                  {listSemester.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </Form.Select>
              </div>

              {/* <h3>Curso vs Cant de Alumnos</h3> */}
              {/* <button onClick={prueba}>Historial MySQL</button> */}
              
              
              {/* <div className="my-4">
                {processVM ? <Table data={processVM} /> : <p>Cargando...</p>}
              </div> */}

              <GraphHorizontal courses={registros.cursos} noStudents={registros.cantidades} />
              
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default RealTime;
