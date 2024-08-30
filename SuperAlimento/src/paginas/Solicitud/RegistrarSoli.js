import React, { useState, useEffect } from "react";
import Navegacion from "../../componentes/componentes/navegacion";
import "../../componentes/css/Login.css";
import { Link, useNavigate } from "react-router-dom";

const RegistrarSoli = () => {
  const [formData, setFormData] = useState({
    FechaSolicitud: '',
    EstadoSolicitud: 'Pendiente',
    PrecioSolicitud: '',
    ObservacionSolicitud: '',
    id_proveedor: '',
    numero_documento: '',  // El número de documento debe estar aquí
  });

  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [setUsuarios] = useState([]);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('Rol');

  
  useEffect(() => {

    const numero_documento = localStorage.getItem('numero_documento');
    setFormData(prevState => ({
      ...prevState,
      numero_documento: numero_documento || ''  
    }));
  }, []);  

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/proveedor/todos', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Rol': rol,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setProveedores(data);
        } else {
          console.error('Error al obtener proveedores:', response.statusText);
        }
      } catch (error) {
        console.error("Error al obtener los proveedores:", error);
      }
    };

    const fetchUsuarios = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/usuario/todos', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Rol': rol,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUsuarios(data);
        } else {
          console.error('Error al obtener usuarios:', response.statusText);
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    };

    fetchProveedores();
    fetchUsuarios();
  }, [token, rol, setUsuarios]);

  useEffect(() => {
    const fetchProductosPorProveedor = async () => {
      if (!formData.id_proveedor) {
        setProductos([]);
        return;
      }
      try {
        const response = await fetch(`http://localhost:3001/api/producto/por-proveedor/${formData.id_proveedor}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Rol': rol,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setProductos(data);
        } else {
          console.error('Error al obtener productos del proveedor:', response.statusText);
          setProductos([]);
        }
      } catch (error) {
        console.error("Error al obtener productos del proveedor:", error);
        setProductos([]);
      }
    };

    fetchProductosPorProveedor();
  }, [formData.id_proveedor, token, rol]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.id_proveedor || !formData.numero_documento) {
      window.alert('Debe seleccionar un proveedor y un usuario');
      return;
    }
  
    const precioTotal = cart.reduce((total, item) => total + item.precio_compra * item.quantity, 0);
  
    const fechaActual = formData.FechaSolicitud || new Date().toISOString().split('T')[0];
  
    const solicitudData = {
      fecha_entrada: fechaActual,
      estado_solicitud: formData.EstadoSolicitud,
      precio_total: precioTotal,
      observacion: formData.ObservacionSolicitud,
      numero_documento: formData.numero_documento,
      id_proveedor: formData.id_proveedor,
      productos: cart.map(item => ({
        id_producto: item.id_producto,
        cantidad: item.quantity,
      })),
    };
  
    try {
      const response = await fetch('http://localhost:3001/api/solicitud/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Rol': rol,
        },
        body: JSON.stringify(solicitudData)
      });
  
      if (response.ok) {
        window.alert('Solicitud registrada con éxito');
        navigate('/ConsultarSoli');
      } else {
        window.alert('Error al registrar solicitud');
      }
    } catch (error) {
      window.alert('Error en el registro:', error);
    }
  };
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value || '');
  };

  const handleAddToCart = (product) => {
    const quantity = parseInt(prompt('Ingrese la cantidad:'), 10);
    if (!isNaN(quantity) && quantity > 0) {
      setCart([...cart, { ...product, quantity }]);
    }
  };

  const filteredProducts = productos.filter(
    (product) =>
      (product.nombre_producto && product.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.codigo_barras && product.codigo_barras.toString().includes(searchTerm))
  );

  return (
    <div>
      <Navegacion>
        <div className="card card-secondary" style={{ height: "88vh" }}>
          <div className="card-body">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-6">
                  <div className="input-group input-group-sm mb-3" style={{ width: "100%" }}>
                    <input
                      type="text"
                      name="table_search"
                      className="form-control float-right"
                      placeholder="Digita o escanea el producto a buscar"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                    <div className="input-group-append">
                      <button type="submit" className="btn btn-default custom-button">
                        <i className="fas fa-search" />
                      </button>
                    </div>
                  </div>
                  <div className="product-list">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((producto) => (
                        <div
                          key={producto.id_producto}
                          className="product-item"
                          onClick={() => handleAddToCart(producto)}
                        >
                          <img src={producto.imagen ? `http://localhost:3001/uploads/${producto.imagen}` : "default-product-image.png"} alt={producto.nombre_producto} width={'200'}/>
                          <h4>{producto.nombre_producto}</h4>
                          <p>{producto.cantidad}</p>
                          <p>${producto.precio_compra.toLocaleString()}</p>
                        </div>
                      ))
                    ) : (
                      <p>No hay productos disponibles para este proveedor.</p>
                    )}
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="cart">
                    <h2>Solicitud de abastecimiento</h2>
                    <form onSubmit={handleSubmit}>
                      <div className="card-body">
                        <div className="form-group">
                          <label htmlFor="FechaSolicitud">Fecha de entrada</label>
                          <input
                            type="date"
                            className="form-control"
                            id="FechaSolicitud"
                            required
                            value={formData.FechaSolicitud}
                            onChange={handleChange}
                          />
                        </div>
                        <div hidden>
                          <label htmlFor="EstadoSolicitud">Estado de la solicitud</label>
                          <select
                            className="custom-select form-control-border border-width-2"
                            id="EstadoSolicitud"
                            value={formData.EstadoSolicitud}
                            onChange={handleChange}
                          >
                            <option value="Pendiente">Pendiente</option>
                            <option value="Aprobada">Aprobada</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label htmlFor="ObservacionSolicitud">Observación</label>
                          <input
                            type="text"
                            className="form-control"
                            id="ObservacionSolicitud"
                            required
                            value={formData.ObservacionSolicitud}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="id_proveedor">Proveedor</label>
                          <select
                            className="custom-select form-control-border border-width-2"
                            id="id_proveedor"
                            value={formData.id_proveedor}
                            onChange={handleChange}
                          >
                            <option value="">Seleccione un proveedor</option>
                            {proveedores.map(proveedor => (
                              <option key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                                {proveedor.nombre_proveedor}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <label htmlFor="numero_documento">Usuario</label>
                          <input
                            className="form-control"
                            id="numero_documento"
                            required
                            value={formData.numero_documento}
                            readOnly
                          >
                          </input>
                        </div>
                        <div className="form-group">
                          <label>Productos en la solicitud</label>
                          <ul>
                            {cart.map((item, index) => (
                              <li key={index}>
                                {item.nombre_producto} - Cantidad: {item.quantity} - Precio: ${item.precio_compra.toLocaleString()}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="form-group">
                          <label htmlFor="PrecioSolicitud">Precio total</label>
                          <input
                            type="number"
                            min="0"
                            className="form-control"
                            id="PrecioSolicitud"
                            required
                            value={cart.reduce((total, item) => total + item.precio_compra * item.quantity, 0).toFixed(2)}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="card-footer">
                        <button type="submit" className="btn btn-secondary mr-2">Registrar Solicitud</button>
                        <Link to="/ConsultarSoli" className="btn btn-secondary mr-2">Cancelar</Link>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Navegacion>
    </div>
  );
};

export default RegistrarSoli;
