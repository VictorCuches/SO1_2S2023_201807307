import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Table from "../components/TableData.jsx";
import GraphPie from "../components/GraphPie";
import "bootstrap-icons/font/bootstrap-icons.css"; 
const RealTime = () => {
  const [processVM, setProcessVM] = useState([]);
  const [porcentajeGraph, setPorcentajeGraph] = useState({cpu:0, ram: 0});
  const [textFilter, setTextFilter] = useState("");
  const [selectVM, setSelectVM] = useState("VM1"); 

  const listSemester = [
    { value: "", label: "Seleccione Semestre" },
    { value: "1S", label: "Primer Semestre" },
    { value: "2S", label: "Segundo Semestre" },
  ];

  const API_NODE_URL = process.env.REACT_APP_API_URL;

 
  const loadDataGraphs = async () => {
    console.log("REACT: loadDataGraphs")
    try {
      const response_ram = await fetch(`${API_NODE_URL}/infoRam/${selectVM}`);
      if (!response_ram.ok) {
        throw new Error("No se pudo obtener la respuesta de la API.");
      }

      const response_cpu = await fetch(`${API_NODE_URL}/porcentaje_uso_cpu/${selectVM}`);
      if (!response_cpu.ok) {
        throw new Error("No se pudo obtener la respuesta de la API.");
      }

      const data_ram = await response_ram.json();
      const data_cpu = await response_cpu.json();

      setPorcentajeGraph({cpu: data_cpu.cpu_porcentaje, ram: data_ram.Porcentaje});

      const body = {
        "ram": data_ram.Porcentaje,
        "cpu": data_cpu.cpu_porcentaje,
        "maquina": selectVM
      } 
      const response_history = await fetch(`${API_NODE_URL}/saveHistory`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
      });
      
      if (!response_history.ok) {
        throw new Error("No se pudo obtener la respuesta de la API.");
      }
      const data_history = await response_history.json(); 
      console.log("Historial guardado")
 
    } catch (error) {
      console.log(error.message);
    }
  }

  const refresh = () => {
    setTextFilter("");
    loadDataGraphs();
  };

  const handleSelectChange = (event) => {
    const valueSelect = event.target.value;
    
    setSelectVM(valueSelect);
    refresh()
  };

  // useEffect(() => {   
  //   loadProcessVM();
  //   loadDataGraphs();
  //   const intervalId = setInterval(() => { 
  //     console.log("REACT: Actualizando graficas")
  //     loadDataGraphs();
  //   }, 30000);
   
  //   return () => clearInterval(intervalId);
  // }, [selectVM]);

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
                    <h1>12345</h1>
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

              <h3>Curso vs Cant de Alumnos</h3>
              {/* <button onClick={prueba}>Historial MySQL</button> */}
              
              
              <div className="my-4">
                {processVM ? <Table data={processVM} /> : <p>Cargando...</p>}
              </div>
              
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default RealTime;
