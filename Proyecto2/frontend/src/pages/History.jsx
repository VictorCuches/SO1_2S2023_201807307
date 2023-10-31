import React, { useState, useEffect } from "react";
import GraphLine from "../components/GraphLine";
import GraphPie from "../components/GraphPie";

import TableData from "../components/TableData";
import Form from "react-bootstrap/Form";

const History = () => {
  const [dataStudents, setDataStudents] = useState([]);
  const [dataApprovedCourse, setDataApprovedCourse] = useState([]);
  const [dataCourseStudent, setDataCourseStudent] = useState([]);
  const [dataAvgStudent, setDataAvgStudent] = useState([]);

  const [selectCourse, setSelectCourse] = useState('SO1');
  const [selectSemester1, setSelectSemester1] = useState('1S');
  const [selectSemester2, setSelectSemester2] = useState('1S');
  const [selectSemester3, setSelectSemester3] = useState('1S');

  const listSemester = [
    { value: "1S", label: "Primer Semestre" },
    { value: "2S", label: "Segundo Semestre" },
  ];

  const listCourses = [
    { value: "SO1", label: "Sistemas Operativos 1" },
    { value: "BD1", label: "Sistemas de Bases de Datos 1" },
    { value: "LFP", label: "Lenguajes Formales y de Programación" },
    { value: "SA", label: "Software Avanzado" },
    { value: "AYD1", label: "Análisis y Diseño 1" },
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
      const response = await fetch(`${API_NODE_URL}/approvedCourse/${selectCourse}/${selectSemester1}`);

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
      const response = await fetch(`${API_NODE_URL}/courseStudent/${selectSemester2}`);

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
      const response = await fetch(`${API_NODE_URL}/avgStudent/${selectSemester3}`);

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

  const handleSelectCourse = (event) => {
    const valueSelect = event.target.value;
    setSelectCourse(valueSelect);
    refresh();
  };

  const handleSelectSemester1 = (event) => {
    const valueSelect = event.target.value;
    setSelectSemester1(valueSelect);
    refresh();
  };

  const handleSelectSemester2 = (event) => {
    const valueSelect = event.target.value;
    setSelectSemester2(valueSelect);
    refresh();
  };

  const handleSelectSemester3 = (event) => {
    const valueSelect = event.target.value;
    setSelectSemester3(valueSelect);
    refresh();
  };

  const refresh = () => {
    loadDataHistory();
    loadApprovedCourse();
    loadCourseStudent();
    loadAvgStudent();
  }

  useEffect(() => {   
    refresh()
  }, [selectCourse, selectSemester1, selectSemester2, selectSemester3]);

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

              <div className="col-12">
                <Form.Select
                  aria-label="Default select example"
                  onChange={handleSelectCourse}
                  className="my-4"
                >
                  {/* <option>Seleccione maquina virtual</option> */}
                  {listCourses.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </Form.Select>
              </div>
              
              <div className="col-12">
                <Form.Select
                  aria-label="Default select example"
                  onChange={handleSelectSemester1}
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


              { dataCourseStudent.length > 0 ? (<GraphPie dataValue={[dataApprovedCourse[0].Aprobados, dataApprovedCourse[0].Reprobados]} />) : (<div>Cargando</div>) }
              
            </div>
          </div>
          <div className="card shadow-lg mb-5 bg-white rounded">
            <div className="card-body">
              <div className="col-12">
                  <Form.Select
                    aria-label="Default select example"
                    onChange={handleSelectSemester2}
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
              { dataCourseStudent.length > 0 ? (<GraphLine title='Cursos con mayor numero de alumnos' type='count' dataGraph={dataCourseStudent} />) : (<div>Cargando</div>) }
            </div>
          </div>
          <div className="card shadow-lg mb-5 bg-white rounded">
            <div className="card-body">
              <div className="col-12">
                <Form.Select
                  aria-label="Default select example"
                  onChange={handleSelectSemester3}
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
              { dataAvgStudent.length > 0 ? (<GraphLine title='Alumnos con mejor promedio' type='avg' dataGraph={dataAvgStudent} />) : (<div>Cargando</div>) }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
