import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../componentes/css/Login.css"; // Importa el archivo CSS

const Login = () => {
  const navigate = useNavigate();

  const navegacion = (event) => {
    event.preventDefault(); // Previene el comportamiento predeterminado del formulario
    navigate("/Index"); // Redirige al usuario al índice
  };

  return (
    <div className="hold-transition login-page colorFondo">
      <div className="login-box">
        <div className="login-logo logo">
          <p><b>Super</b>Alimento</p>
        </div>
        <div className="card">
          <div className="card-body login-card-body bordes">
            <p className="login-box-msg">Ingresa Sesion Aqui!!</p>
            <form onSubmit={navegacion}>
              <p>Numero de Identificacion</p>
              <div className="input-group mb-3">
                <input type="number" className="form-control" min="0" />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bookmark" viewBox="0 0 16 16">
                      <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z"/>
                    </svg>
                  </div>
                </div>
              </div>
              <p>Contraseña</p>
              <div className="input-group mb-3">
                <input type="password" className="form-control" />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock" />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-8">
                  <div className="icheck-primary">
                    <input type="checkbox" id="remember" />
                    <label htmlFor="remember">
                      Recuerdame
                    </label>
                  </div>
                </div>
                <div className="col-4">
                  <button type="submit" className="btn btn-primary btn-block custom-button">Ingresar</button>
                </div>
              </div>
            </form>
            <p className="mb-1">
              <Link to="#" className="letras">Olvide mi Contraseña</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;