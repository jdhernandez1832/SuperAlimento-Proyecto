import React, { useState, useEffect } from "react";
import Navegacion from "../../componentes/componentes/navegacion";
import "../../componentes/css/Login.css";
import { Link, useNavigate } from "react-router-dom";

const RegistrarVenta = () => {
  const [formData, setFormData] = useState({
    FechaVenta: '',
    MetodoPago: '',
    Caja: '',
    NumeroDocumento: '', 
  });

  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]); // Productos inicializados como array vacío
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
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
        console.error("Error al obtener los usuarios:", error);
      }
    };
  
    fetchUsuarios();
  }, []);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/producto/todos');
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
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Verificar que el usuario esté seleccionado
    if (!formData.NumeroDocumento) {
      window.alert('Debe seleccionar un usuario');
      return;
    }
  
    // Calcular el precio total basado en los productos en el carrito
    const precioTotal = cart.reduce((total, item) => total + item.precio_venta * item.quantity, 0);
  
    // Preparar la fecha actual si no se ha especificado
    const fechaActual = formData.FechaVenta || new Date().toISOString().split('T')[0];
  
    // Asegurarse de actualizar el precio total en formData
    const ventaData = {
      fecha_venta: fechaActual,  // Enviar la fecha de la venta
      metodo_pago: formData.MetodoPago,
      caja: formData.Caja,
      total_venta: precioTotal,  // Asignar el precio total calculado
      numero_documento: formData.NumeroDocumento,
      productos: cart.map(item => ({
        id_producto: item.id_producto,
        cantidad: item.quantity,
        precio: item.precio_venta,
      })),  // Incluir los productos seleccionados con la cantidad
    };
  
    try {
      const response = await fetch('http://localhost:3001/api/venta/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ventaData)
      });
  
      if (response.ok) {
        const result = await response.json();
        const ventaId = result.id_venta;  // Asumiendo que la respuesta contiene el ID de la venta
        window.alert('Venta registrada con éxito');
        navigate(`/DetallesVenta/${ventaId}`);  // Redirigir a la página de detalles de la venta
      } else {
        const errorMessage = await response.text();
        window.alert(`Error al registrar venta: ${errorMessage}`);
      }
    } catch (error) {
      window.alert(`Error en el registro: ${error}`);
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
                            required
                            value={formData.FechaVenta}
                            onChange={handleChange}
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
                          <select
                            className="form-control"
                            id="NumeroDocumento"
                            value={formData.NumeroDocumento}
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
                      </div>
                      <div className="card-footer">
                        <button type="submit" className="btn btn-primary custom-button mr-2">Registrar Venta</button>
                        <Link to="/ConsultarVent" className="btn btn-primary custom-button mr-2">Cancelar</Link>
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
