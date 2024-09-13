import React from "react";
import "../componentes/css/Login.css";
import { useNavigate } from 'react-router-dom';


const Olvido = () => {
    const navigate = useNavigate();

    const handleBack = () => {
      navigate('/Login');
    };
  
  return (
            <div className="card">
            <div className="card-body">
                <h1 className="text-center">Olvido su contraseña?</h1>
                <h3 className="text-center">Contactenos</h3>
            </div>
            <div className="card-body">
                <div className="text-center d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <h2>Super<strong>Alimento</strong></h2>
                    <p className="lead mb-5">Transversal 127 a bis no 137 a 10<br />
                    Celular: +57 305 2433356
                    </p>
                </div>
                </div>
                <center><button onClick={handleBack} className="btn btn-danger">Volver</button></center>
            </div>
            </div>
           
  );
}
export default Olvido;

