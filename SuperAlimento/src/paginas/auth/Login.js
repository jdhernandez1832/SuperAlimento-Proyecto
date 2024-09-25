import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Importa SweetAlert2
import "../../componentes/css/Login.css"; // Importa el archivo CSS

const Login = () => {
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [clave, setClave] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar la visibilidad de la contraseña
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
        localStorage.setItem("numero_documento", data.numero_documento);

        // Alerta de éxito con SweetAlert2
        Swal.fire({
          icon: "success",
          title: "¡Inicio de sesión exitoso!",
          text: `Bienvenido, ${data.numero_documento}`,
          showConfirmButton: false,
          timer: 1500,
        });

        if (data.rol === "Administrador" || data.rol === "Cajero" || data.rol === "Inventarista") {
          setTimeout(() => {
            navigate("/Index");
          }, 1500);
        }
      } else {
        throw new Error("Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      // Alerta de error con SweetAlert2
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Credenciales incorrectas, por favor intente nuevamente.",
        confirmButtonColor: '#28a745',
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="hold-transition login-page colorFondo">
      <div className="login-box">
        <div className="login-logo logo">
          <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
            <div className="carousel-inner caja">
              <div className="carousel-item active">
                <img className="d-block w-100" src="../../dist/img/Super.jpeg" alt="" width="100px" height="150px" />
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body login-card-body bordes">
            <center><img className="bd-placeholder-img rounded-circle img-fluid" src="../../dist/img/SuperAlimento.png" alt="SuperAlimento logo" width={100} height={100} /></center>
            <center><h2>Inciar Sesion</h2></center>
            <br />
            <form onSubmit={handleLogin}>
              <p>Numero de Identificacion</p>
              <div className="input-group mb-3">
                <input
                  type="number"
                  className="form-control"
                  min="0"
                  value={numeroDocumento}
                  onChange={(e) => setNumeroDocumento(e.target.value)}
                  required
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bookmark" viewBox="0 0 16 16">
                      <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
                    </svg>
                  </div>
                </div>
              </div>
              <p>Contraseña</p>
              <div className="input-group mb-3">
                <input
                  type={showPassword ? "text" : "password"} 
                  className="form-control"
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                  required
                />
                <div className="input-group-append">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={togglePasswordVisibility}
                  >
                    <span className="fas fa-eye"></span>
                  </button>
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
                  <button type="submit" className="custom-button">Ingresar</button>
                </div>
              </div>
            </form>
            <p className="mb-1">
              <Link to="/Olvido" className="letras">Olvide mi Contraseña</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
