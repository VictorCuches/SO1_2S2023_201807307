import React, { useState, useEffect } from "react";
import GraphLine from "../components/GraphLine";
import GraphPie from "../components/GraphPie";

import TableData from "../components/TableData";

const History = () => {
  const [dataStudents, setDataStudents] = useState([]);
  const [dataApprovedCourse, setDataApprovedCourse] = useState([]);
  const [dataCourseStudent, setDataCourseStudent] = useState([]);
  const [dataAvgStudent, setDataAvgStudent] = useState([]);


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
      const response = await fetch(`${API_NODE_URL}/getAllData`);

      console.log(`${API_NODE_URL}/getAllData`)
      if (!response.ok) {
        throw new Error("No se pudo obtener la respuesta de la API.");
      }

      const data = await response.json();

      setDataStudents(data);
 
    } catch (error) {
      console.log(error.message);
    }
  }

  const loadApprovedCourse = async () => {
    console.log("REACT: loadApprovedCourse")
    try {
      const response = await fetch(`${API_NODE_URL}/approvedCourse/SO1/2S`);

      if (!response.ok) {
        throw new Error("No se pudo obtener la respuesta de la API.");
      }

      const data = await response.json();

      setDataApprovedCourse(data);
 
    } catch (error) {
      console.log(error.message);
    }
  }

  const loadCourseStudent = async () => {
    console.log("REACT: loadCourseStudent")
    try {
      const response = await fetch(`${API_NODE_URL}/courseStudent/1S`);

      if (!response.ok) {
        throw new Error("No se pudo obtener la respuesta de la API.");
      }

      const data = await response.json();

      setDataCourseStudent(data);
 
    } catch (error) {
      console.log(error.message);
    }
  }

  const loadAvgStudent = async () => {
    console.log("REACT: loadAvgStudent")
    try {
      const response = await fetch(`${API_NODE_URL}/avgStudent/2S`);

      if (!response.ok) {
        throw new Error("No se pudo obtener la respuesta de la API.");
      }

      const data = await response.json();

      console.log("avgStudnet",data);
      setDataAvgStudent(data);
 
    } catch (error) {
      console.log(error.message);
    }
  }



  const handleSelectChange = (event) => {
    const valueSelect = event.target.value;
  };

  useEffect(() => {   
    loadDataHistory();
    loadApprovedCourse();
    loadCourseStudent();
    loadAvgStudent();
  }, []);

  return (
    <div className="container">
      <div className="row py-3">
        <div className="col-8">
          <div className="card shadow-lg p-3 mb-5 bg-white rounded">
            <div className="card-body">
              <TableData dataEstudents={dataStudents}  />
            </div>
          </div>
        </div>

        <div className="col-4">
          <div className="card shadow-lg mb-5 bg-white rounded">
            <div className="card-body">
              { dataCourseStudent.length > 0 ? (<GraphPie dataValue={[dataApprovedCourse[0].Aprobados, dataApprovedCourse[0].Reprobados]} />) : (<div>Cargando</div>) }
              
            </div>
          </div>
          <div className="card shadow-lg mb-5 bg-white rounded">
            <div className="card-body">
              { dataCourseStudent.length > 0 ? (<GraphLine title='Cursos con mayor numero de alumnos' type='count' dataGraph={dataCourseStudent} />) : (<div>Cargando</div>) }
            </div>
          </div>
          <div className="card shadow-lg mb-5 bg-white rounded">
            <div className="card-body">
              { dataAvgStudent.length > 0 ? (<GraphLine title='Alumnos con mejor promedio' type='avg' dataGraph={dataAvgStudent} />) : (<div>Cargando</div>) }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
