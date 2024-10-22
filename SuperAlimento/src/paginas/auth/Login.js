import React, { useState, useEffect } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../componentes/css/Login.css";

const Login = () => {
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [clave, setClave] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Verifica si el usuario ya está logueado
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/Index");
    }
  }, [navigate]);

  const validateFields = () => {
    let errors = {};

    // Validar número de identificación (solo números)
    const regexNumber = /^[0-9]+$/;
    if (!regexNumber.test(numeroDocumento)) {
      errors.numeroDocumento = "El número de identificación solo debe contener números.";
    }

    // Validar campo de contraseña (no vacío)
    if (clave.trim() === "") {
      errors.clave = "La contraseña no puede estar vacía.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (event) => {
    event.preventDefault();
  
    if (!validateFields()) {
      return; // Si hay errores, detener el proceso de inicio de sesión
    }
  
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
  
      // Comprobamos primero el estado del usuario en la respuesta
      if (data.estado === "Desactivo") {
        Swal.fire({
          icon: "error",
          title: "Usuario desactivado",
          text: "Tu cuenta ha sido desactivada. Por favor contacta al administrador.",
          confirmButtonColor: "#d33",
        });
        return; // No permitir el acceso si el usuario está desactivado
      }
  
      // Si la respuesta no es exitosa (código HTTP fuera de rango 200-299)
      if (!response.ok) {
        if (response.status === 401) {
          Swal.fire({
            icon: "error",
            title: "Credenciales incorrectas",
            text: "El número de documento o la contraseña son incorrectos.",
            confirmButtonColor: "#28a745",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Ocurrió un error al iniciar sesión. Intente nuevamente. Puede que su cuenta este inactiva",
            confirmButtonColor: "#28a745",
          });
        }
        return; // Detener la ejecución si hay un error
      }
  
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("Rol", data.rol);
        localStorage.setItem("numero_documento", data.numero_documento);
  
        Swal.fire({
          icon: "success",
          title: "¡Inicio de sesión exitoso!",
          text: `Bienvenido, ${data.numero_documento}`,
          showConfirmButton: false,
          timer: 1500,
        });
  
        setTimeout(() => {
          navigate("/Index");
        }, 1500);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo conectar con el servidor. Intente nuevamente.",
        confirmButtonColor: "#28a745",
      });
    }
  };
  
  
  
  
  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Validación en tiempo real
  const handleNumeroDocumentoChange = (e) => {
    const value = e.target.value;
    setNumeroDocumento(value);

    const regexNumber = /^[0-9]+$/;
    if (!regexNumber.test(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        numeroDocumento: "El número de identificación solo debe contener números.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        numeroDocumento: null,
      }));
    }
  };

  const handleClaveChange = (e) => {
    const value = e.target.value;
    setClave(value);

    if (value.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        clave: "La contraseña no puede estar vacía.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        clave: null,
      }));
    }
  };

  return (
    <div className="hold-transition login-page colorFondo">
      <div className="login-box">
        <div className="login-logo logo">
          <div
            id="carouselExampleIndicators"
            className="carousel slide"
            data-ride="carousel"
          >
            <div className="carousel-inner caja">
              <div className="carousel-item active">
                <img
                  className="d-block w-100"
                  src="../../dist/img/Super.jpeg"
                  alt=""
                  width="100px"
                  height="150px"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body login-card-body bordes">
            <center>
              <img
                className="bd-placeholder-img rounded-circle img-fluid"
                src="../../dist/img/SuperAlimento.png"
                alt="SuperAlimento logo"
                width={100}
                height={100}
              />
            </center>
            <center>
              <h2>Inciar Sesion</h2>
            </center>
            <br />
            <form onSubmit={handleLogin}>
              <p>Numero de Identificacion</p>
              <div className="input-group mb-3">
                <input
                  type="number"
                  className={`form-control ${errors.numeroDocumento ? 'is-invalid' : ''}`}
                  value={numeroDocumento}
                  onChange={handleNumeroDocumentoChange}
                  required
                  min={1}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-bookmark"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
                    </svg>
                  </div>
                </div>
              </div>
              {errors.numeroDocumento && (
                <div className="invalid-feedback">{errors.numeroDocumento}</div>
              )}

              <p>Contraseña</p>
              <div className="input-group mb-3">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-control ${errors.clave ? 'is-invalid' : ''}`}
                  value={clave}
                  onChange={handleClaveChange}
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
              {errors.clave && (
                <div className="invalid-feedback">{errors.clave}</div>
              )}

              <div className="row">
                <div className="col-8">
                  <div className="icheck-primary">
                    <input type="checkbox" id="remember" />
                    <label htmlFor="remember">Recuerdame</label>
                  </div>
                </div>
                <div className="col-4">
                  <button type="submit" className="custom-button">
                    Ingresar
                  </button>
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
