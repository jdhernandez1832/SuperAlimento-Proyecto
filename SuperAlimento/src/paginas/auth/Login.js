import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../componentes/css/Login.css"; // Importa el archivo CSS

const Login = () => {
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [clave, setClave] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/api/login/ingreso", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          numero_documento: numeroDocumento,
          clave: clave,
        }),
      });

      const data = await response.json();
      console.log(data);
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("Rol", data.rol);
        localStorage.setItem("numero_documento", data.numero_documento)


        if (data.rol === "Administrador" || data.rol === "Cajero" || data.rol === "Inventarista") {
          navigate("/Index"); 
        }
      } else {
        throw new Error("Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Credenciales incorrectas, por favor intente nuevamente.");
    }
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
            <form onSubmit={handleLogin}>
              <p>Numero de Identificacion</p>
              <div className="input-group mb-3">
                <input
                  type="number"
                  className="form-control"
                  min="0"
                  value={numeroDocumento}
                  onChange={(e) => setNumeroDocumento(e.target.value)}
                />
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
                <input
                  type="password"
                  className="form-control"
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                />
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
                  <button type="submit" className="btn btn-secondary btn-block custom-button">Ingresar</button>
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
