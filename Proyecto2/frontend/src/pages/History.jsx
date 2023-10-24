import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import GraphLine from "../components/GraphLine";
import GraphPie from "../components/GraphPie";

import TableData from "../components/TableData";

const History = () => {
  const [selectVM, setSelectVM] = useState("VM1");
  const [fechasHistory, setFechasHistory] = useState([]);
  const [cpuHistory, setCpuHistory] = useState([]);
  const [ramHistory, setRamHistory] = useState([]);

  const listVM = [
    { value: "VM1", label: "Maquina Virtual 1" },
    { value: "VM2", label: "Maquina Virtual 2" },
    { value: "VM3", label: "Maquina Virtual 3" },
    { value: "VM4", label: "Maquina Virtual 4" },
  ];
  const API_NODE_URL = process.env.REACT_APP_API_URL;

  const loadDataHistory = async () => {
    console.log("REACT: loadDataHistory")
    try {
      const response = await fetch(`${API_NODE_URL}/dataHistory/${selectVM}`);
      if (!response.ok) {
        throw new Error("No se pudo obtener la respuesta de la API.");
      }

      const data = await response.json();

      const fechas = data.map(item => item.fecha);
      const ram = data.map(item => item.ram);
      const cpu = data.map(item => item.cpu);

      setFechasHistory(fechas);
      setRamHistory(ram);
      setCpuHistory(cpu);

      console.log(fechas)
      console.log(ram)
      console.log(cpu)

 
    } catch (error) {
      console.log(error.message);
    }
  }

  const refresh = () => {
    setFechasHistory([]);
    setRamHistory([]);
    setCpuHistory([]);
    loadDataHistory()
  };

  const handleSelectChange = (event) => {
    const valueSelect = event.target.value;
    setSelectVM(valueSelect);
  };

  useEffect(() => {   
    loadDataHistory();
  }, []);

  return (
    <div className="container">
      <div className="row py-3">
        <div className="col-8">
          <div className="card shadow-lg p-3 mb-5 bg-white rounded">
            <div className="card-body">
              <TableData/>
            </div>
          </div>
        </div>

        <div className="col-4">
          <div className="card shadow-lg mb-5 bg-white rounded">
            <div className="card-body">
              <GraphPie/>
            </div>
          </div>
          <div className="card shadow-lg mb-5 bg-white rounded">
            <div className="card-body">
              <GraphLine/>
            </div>
          </div>
          <div className="card shadow-lg mb-5 bg-white rounded">
            <div className="card-body">
              <GraphLine/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
