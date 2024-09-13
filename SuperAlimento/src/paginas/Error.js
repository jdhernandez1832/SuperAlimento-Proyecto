import React from 'react';
import { useNavigate } from 'react-router-dom';

const Error = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/Login');
  };

  return (
    <div>
      <section className="content">
        <div className="error-page">
          <h2 className="headline text-danger">500</h2>
          <div className="error-content">
            <h3><i className="fas fa-exclamation-triangle text-danger" /> Oops! Algo ha salido mal.</h3>
            <p>
              Parece que no cuentas con los permisos suficientes para ingresar a esta página o que no has iniciado sesión correctamente.
            </p>
            <button onClick={handleBack} className="btn btn-danger">Volver</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Error;
