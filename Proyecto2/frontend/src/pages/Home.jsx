import React, { useState, useEffect } from 'react'
import socket from '../socket/Socket';

const Home = () => {
  const [registros, setRegistros] = useState([]);

  // const loadProcessVM = async () => {
  //   console.log("REACT: loadProcessVM")

  //   try {
  //     const response = await fetch(`${API_NODE_URL}/infoCpu/${selectVM}`);
  //     if (!response.ok) {
  //       throw new Error("No se pudo obtener la respuesta de la API.");
  //     }

  //     const data = await response.json();
  //     setProcessVM(data.Procesos);
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  useEffect(() => {   
    socket.emit("obtener_registros");

    socket.on("registros", (data) => {
      console.log("Registros recibidos:", data);
      setRegistros(data)
    });

  }, []);

  return (
    <div>
      <ul>
        {registros.map((registro, index) => (
          <li key={index}>{registro.clave}: {registro.valor}</li>
        ))}
      </ul>

    </div>
  )
}

export default Home