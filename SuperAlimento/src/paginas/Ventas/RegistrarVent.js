import React, { useState, useEffect } from "react";
import Navegacion from "../../componentes/componentes/navegacion";
import "../../componentes/css/Login.css";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'; // Importa SweetAlert

const RegistrarVenta = () => {
  const [formData, setFormData] = useState({
    FechaVenta: new Date().toISOString().split('T')[0], // Inicializa con la fecha actual
    MetodoPago: '',
    Caja: '',
    NumeroDocumento: '',
  });

  const [setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('Rol');

  useEffect(() => {
    const numero_documento = localStorage.getItem('numero_documento');
    setFormData(prevState => ({
      ...prevState,
      NumeroDocumento: numero_documento || ''
    }));
  }, []);

  useEffect(() => {
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
        console.error("Error al obtener los usuarios:", error);
      }
    };

    fetchUsuarios();
  }, [rol, setUsuarios, token]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/producto/todos', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Rol': rol,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setProductos(data);
        } else {
          console.error('Error al obtener productos:', response.statusText);
          setProductos([]); // Limpiar productos si ocurre un error
        }
      } catch (error) {
        console.error("Error al obtener productos:", error);
        setProductos([]); // Limpiar productos en caso de error
      }
    };

    fetchProductos();
  }, [rol, token]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar el precio total
    const precioTotal = cart.reduce((total, item) => total + item.precio_venta * item.quantity, 0);
    if (precioTotal <= 0) {
      setError('El precio total debe ser mayor a 0.');
      return;
    }

    const ventaData = {
      fecha_venta: formData.FechaVenta,
      metodo_pago: formData.MetodoPago,
      caja: formData.Caja,
      total_venta: precioTotal,
      numero_documento: formData.NumeroDocumento,
      productos: cart.map(item => ({
        id_producto: item.id_producto,
        cantidad: item.quantity,
        precio: item.precio_venta,
      })),
    };

    try {
      const response = await fetch('http://localhost:3001/api/venta/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Rol': rol,
        },
        body: JSON.stringify(ventaData)
      });

      if (response.ok) {
        const result = await response.json();
        const ventaId = result.id_venta;

        // SweetAlert para éxito
        Swal.fire({
          title: '¡Éxito!',
          text: 'Venta registrada con éxito',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#28a745', // Verde
        }).then(() => {
          navigate(`/DetallesVenta/${ventaId}`);
        });
      } else {
        const errorMessage = await response.text();
        // SweetAlert para error
        Swal.fire({
          title: 'Error',
          text: `Error al registrar venta: ${errorMessage}`,
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#dc3545', // Rojo
        });
      }
    } catch (error) {
      // SweetAlert para error en la solicitud
      Swal.fire({
        title: 'Error',
        text: `Error en el registro: ${error}`,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#dc3545', // Rojo
      });
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value || '');
  };

  const handleAddToCart = (product) => {
    const quantity = parseInt(prompt('Ingrese la cantidad:'), 10);
    if (isNaN(quantity) || quantity <= 0) {
      setError('La cantidad debe ser un número mayor a 0.');
      return;
    }
    if (quantity > product.cantidad) {
      setError('La cantidad ingresada supera el stock disponible.');
      return;
    }
    setError('');
    setCart([...cart, { ...product, quantity }]);
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
                          <img src={producto.imagen ? `http://localhost:3001/uploads/${producto.imagen}` : "default-product-image.png"} alt={producto.nombre_producto} width={'200'} />
                          <h4>{producto.nombre_producto}</h4>
                          <p>{producto.cantidad}</p>
                          <p>${producto.precio_venta.toLocaleString()}</p>
                        </div>
                      ))
                    ) : (
                      <p>No hay productos disponibles.</p>
                    )}
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="cart">
                    <h2>Registrar Venta</h2>
                    <form onSubmit={handleSubmit}>
                      <div className="card-body">
                        <div className="form-group">
                          <label htmlFor="FechaVenta">Fecha de venta</label>
                          <input
                            type="date"
                            className="form-control"
                            id="FechaVenta"
                            value={formData.FechaVenta}
                            readOnly // Hace que el campo sea de solo lectura
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="MetodoPago">Método de pago</label>
                          <select
                            className="form-control"
                            id="MetodoPago"
                            value={formData.MetodoPago}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Seleccione un método de pago</option>
                            <option value="Efectivo">Efectivo</option>
                            <option value="Tarjeta">Tarjeta</option>
                            <option value="Transferencia">Transferencia</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label htmlFor="Caja">Caja</label>
                          <input
                            type="number"
                            min={'1'}
                            max={'4'}
                            className="form-control"
                            id="Caja"
                            required
                            value={formData.Caja}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="NumeroDocumento">Usuario</label>
                          <input
                            className="form-control"
                            id="NumeroDocumento"
                            required
                            value={formData.NumeroDocumento}
                            readOnly
                          />
                        </div>
                        <div className="form-group">
                          <label>Productos en el carrito</label>
                          <ul>
                            {cart.map((item, index) => (
                              <li key={index}>
                                {item.nombre_producto} - Cantidad: {item.quantity} - Precio: ${item.precio_venta.toLocaleString()}
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
                            value={cart.reduce((total, item) => total + item.precio_venta * item.quantity, 0).toFixed(2)}
                            readOnly
                          />
                        </div>
                        {error && <div className="alert alert-danger">{error}</div>}
                      </div>
                      <div className="card-footer">
                        <button type="submit" className="btn btn-secondary mr-2">Registrar Venta</button>
                        <Link to="/ConsultarVent" className="btn btn-secondary mr-2">Cancelar</Link>
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

export default RegistrarVenta;
