import React from 'react';
import Table from 'react-bootstrap/Table';

function TableData({ dataEstudents}) {
  return (
    <div style={{ overflowX: 'auto', maxHeight: '800px' }}>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Carnet</th>
            <th>Nombre</th>
            <th>Curso</th>
            <th>Nota</th>
            <th>Semestre</th>
            <th>Year</th>
          </tr>
        </thead>
        <tbody>
          {dataEstudents.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.carnet}</td>
              <td>{item.nombre}</td>
              <td>{item.cod_curso}</td>
              <td>{item.nota}</td>
              <td>{item.semestre}</td>
              <td>{item.anio}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default TableData;
