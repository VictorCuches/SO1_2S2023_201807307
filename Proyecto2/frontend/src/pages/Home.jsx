import React, { useState, useEffect } from 'react'
import socket from '../socket/Socket';

const Home = () => {
  const [registros, setRegistros] = useState([]);


  // useEffect(() => {   
  //   socket.emit("obtener_registros");

  //   socket.on("registros", (data) => {
  //     console.log("Registros recibidos:", data);
  //     setRegistros(data)
  //   });

  // }, []);

  return (
    <div>
      <h1>Victor Cuches</h1>

    </div>
  )
}

export default Home