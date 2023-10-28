import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Table from "../components/TableData.jsx";
import GraphHorizontal from "../components/GraphHorizontal";
import "bootstrap-icons/font/bootstrap-icons.css"; 
import socket from '../socket/Socket';



const RealTime = () => {
  const [registros, setRegistros] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [noStudents, setNoStudents] = useState([]);
  const [noData, setNoData] = useState(0);


  const listSemester = [
    { value: "", label: "Seleccione Semestre" },
    { value: "1S", label: "Primer Semestre" },
    { value: "2S", label: "Segundo Semestre" },
  ];

  const API_NODE_URL = process.env.REACT_APP_API_URL;

  const handleSelectChange = (event) => {
    const valueSelect = event.target.value;
    
  };

  useEffect(() => {   
    socket.emit("obtener_registros");

    socket.on("registros", (data) => {
      // console.log("Registros recibidos:", data);
      setNoData(data.totalRegistros)
      setCursos(data.cursos)
      setNoStudents(data.cantidades)
      setRegistros(data)
    });

  }, []);

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
                    <h1>{noData}</h1>
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

              <GraphHorizontal courses={cursos} noStudents={noStudents} />
              
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default RealTime;
