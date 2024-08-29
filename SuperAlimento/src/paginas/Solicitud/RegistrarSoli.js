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
    id_proveedor: '', // Cambiado a id_proveedor
    numero_documento: '', // Agregado para el usuario
  });

  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]); // Productos inicializados como array vacío
  const [searchTerm, setSearchTerm] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/proveedor/todos');
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
        const response = await fetch('http://localhost:3001/api/usuario/todos');
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
  }, []);

  useEffect(() => {
    const fetchProductosPorProveedor = async () => {
      if (!formData.id_proveedor) { // Cambiado a id_proveedor
        setProductos([]); // Limpiar productos si no hay proveedor seleccionado
        return;
      }

      try {
        const response = await fetch(`http://localhost:3001/api/producto/por-proveedor/${formData.id_proveedor}`); // Cambiado a id_proveedor
        if (response.ok) {
          const data = await response.json();
          setProductos(data);
        } else {
          console.error('Error al obtener productos del proveedor:', response.statusText);
          setProductos([]); // Limpiar productos si ocurre un error
        }
      } catch (error) {
        console.error("Error al obtener productos del proveedor:", error);
        setProductos([]); // Limpiar productos en caso de error
      }
    };

    fetchProductosPorProveedor();
  }, [formData.id_proveedor]); // Cambiado a id_proveedor

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Verificar que el proveedor y usuario estén seleccionados
    if (!formData.id_proveedor || !formData.numero_documento) {
      window.alert('Debe seleccionar un proveedor y un usuario');
      return;
    }
  
    // Calcular el precio total basado en los productos en el carrito
    const precioTotal = cart.reduce((total, item) => total + item.precio_compra * item.quantity, 0);
  
    // Preparar la fecha actual si no se ha especificado
    const fechaActual = formData.FechaSolicitud || new Date().toISOString().split('T')[0];
  
    // Asegurarse de actualizar el precio total en formData
    const solicitudData = {
      fecha_entrada: fechaActual,  // Enviar la fecha de la solicitud
      estado_solicitud: formData.EstadoSolicitud,
      precio_total: precioTotal,  // Asignar el precio total calculado
      observacion: formData.ObservacionSolicitud,
      numero_documento: formData.numero_documento,
      id_proveedor: formData.id_proveedor,
      productos: cart.map(item => ({
        id_producto: item.id_producto,
        cantidad: item.quantity,
      })),  // Incluir los productos seleccionados con la cantidad
    };
  
    try {
      const response = await fetch('http://localhost:3001/api/solicitud/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
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
    setSearchTerm(e.target.value || ''); // Asegúrate de que searchTerm siempre sea una cadena
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
        <div className="card card-success" style={{ height: "88vh" }}>
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
                          <select
                            className="form-control"
                            id="numero_documento"
                            value={formData.numero_documento}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Seleccione un usuario</option>
                            {usuarios.map((usuario) => (
                              <option key={usuario.numero_documento} value={usuario.numero_documento}>
                                {usuario.nombre_usuario}
                              </option>
                            ))}
                          </select>
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
                        <button type="submit" className="btn btn-primary custom-button mr-2">Registrar Solicitud</button>
                        <Link to="/ConsultarSoli" className="btn btn-primary custom-button mr-2">Cancelar</Link>
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
