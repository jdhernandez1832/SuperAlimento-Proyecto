import React from "react";
import Navegacion from "../componentes/componentes/navegacion"; // Importa el componente correctamente
import "../componentes/css/Login.css";


const Contacto = () => {
  return (
    <div>
        <Navegacion>
            <div className="card">
            <div className="card-body">
                <h1 className="text-center">Contactanos</h1>
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
            </div>
            </div>

        </Navegacion>
    </div>
  );
}

export default Contacto;

