import React from "react";
import Navegacion from "../../componentes/componentes/navegacion"; // Importa el componente correctamente
import "../../componentes/css/Login.css";
import { Link } from "react-router-dom";


const Perfil = () => {
  return (
    <div>
        <Navegacion>
            <div className="card card-success">
                <div className="card-body colorFondo">
                    <div className="card card-success">
                        <div className="card-header">
                            <h3 className="card-title">Perfil</h3>
                        </div>
                        <form>
                            <div className="card-body">
                            <div className="form-group">
                                <label htmlFor="NumeroUsuario">Numero de documento</label>
                                <input type="Number" min={"0"} className="form-control" id="NumeroUsuario" required/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="NombreUsuario">Nombre de usuario</label>
                                <input type="text" className="form-control" id="NombreUsuario" required />
                            </div>
                            <div class="form-group">
                                <label for="TipoUsuario">Tipo de documento</label>
                                <select class="custom-select form-control-border border-width-2" id="TipoUsuario">
                                    <option>Cedula</option>
                                    <option>Cedula de extranjeria</option>
                                    <option>Tarjeta de identidad</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="EmailUsuario">Email</label>
                                <input type="Email" className="form-control" id="EmailUsuario" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="TelefonoUsuario">Telefono</label>
                                <input type="Number" className="form-control" id="TelefonoUsuario" required />
                            </div>
                            <div>
                                <label for="RolUsuario">Rol</label>
                                <select class="custom-select form-control-border border-width-2" id="RolUsuario">
                                    <option>Administrador</option>
                                    <option>Inventarista</option>
                                    <option>Cajero</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="ContraseñaUsuario">Contraseña</label>
                                <input type="text" className="form-control" id="ContraseñaUsuario" required />
                            </div>
                            </div>
                            <div className="card-footer">
                            <Link to="/Index" className="btn btn-primary custom-button mr-2">Volver</Link>
                            <button type="submit" className="btn btn-primary custom-button">Actualizar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Navegacion>
    </div>
  );
}

export default Perfil;

