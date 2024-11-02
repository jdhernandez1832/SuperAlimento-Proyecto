import React, { useState, useEffect } from "react";
import Navegacion from "../../componentes/componentes/navegacion";
import "../../componentes/css/Login.css";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'; 

const RegistrarIncidencia = () => {
    const [formData, setFormData] = useState({
      FechaIncidencia: new Date().toISOString().split('T')[0], 
      DescripcionIncidencia: '',
      NumeroDocumento: '',
    });
  
    const [setUsuarios] = useState([]);
    const [productos, setProductos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState([]); 
    const [error, setError] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null); 
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
  
      // Validar que haya productos en el carrito
      if (cart.length === 0) {
        setError('Debes registrar al menos un producto afectado.');
        return;
      }
  
      // Aquí puedes crear un arreglo con los datos de todas las incidencias
      const incidenciasData = cart.map(item => ({
        descripcion_incidencia: formData.DescripcionIncidencia,
        fecha_incidencia: formData.FechaIncidencia,
        cantidad_afectada: item.quantity,
        numero_documento: formData.NumeroDocumento,
        id_producto: item.id_producto,
      }));
  
      // Envía las incidenciasData a tu API
      try {
        const response = await fetch('http://localhost:3001/api/incidencia/registrar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-Rol': rol,
          },
          body: JSON.stringify(incidenciasData) // Asegúrate de que tu API acepte un array
        });
  
        if (response.ok) {
          // Muestra un mensaje de éxito
          Swal.fire({
            title: '¡Éxito!',
            text: 'Incidencia registrada con éxito',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#28a745',
          }).then(() => {
            navigate(`/ConsultarInci`); 
          });
        } else {
          const errorMessage = await response.text();
          // Muestra un mensaje de error
          Swal.fire({
            title: 'Error',
            text: `Error al registrar incidencia: ${errorMessage}`,
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#dc3545',
          });
        }
      } catch (error) {
        // Maneja errores
        Swal.fire({
          title: 'Error',
          text: `Error en el registro: ${error}`,
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#dc3545',
        });
      }
    };
  
    const handleSearch = (e) => {
      setSearchTerm(e.target.value || '');
    };
  
    const handleAddToCart = (product) => {
      if (selectedProduct && selectedProduct.id_producto !== product.id_producto) {
        // Si ya hay un producto seleccionado y no es el mismo
        Swal.fire({
          title: 'Error',
          text: 'Solo puedes seleccionar un producto a la vez.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#dc3545',
        });
        return;
      }
  
      Swal.fire({
        title: product.nombre_producto,
        html: `
          <div>
            <img src="${product.imagen ? `http://localhost:3001/uploads/${product.imagen}` : 'default-product-image.png'}" alt="${product.nombre_producto}" width="200" />
            <p>Precio: $${product.precio_venta.toLocaleString()}</p>
            <p>Cantidad disponible: ${product.cantidad}</p>
            <input id="quantityInput" type="number" min="1" max="${product.cantidad}" placeholder="Cantidad afectada" class="swal2-input" style="width: 80%;" />
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Agregar a la incidencia',
        confirmButtonColor: '#4caf50',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
          const quantity = parseInt(document.getElementById('quantityInput').value, 10);
          if (isNaN(quantity) || quantity <= 0 || quantity > product.cantidad) {
            Swal.showValidationMessage('Por favor, ingrese una cantidad válida.');
            return false;
          }
          return { ...product, quantity };
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const { quantity } = result.value;
  
          // Establecer el producto seleccionado
          setSelectedProduct(product);
  
          // Añadir el producto al carrito
          setCart([{ ...product, quantity }]);
        }
      });
    };
  
    const handleRemoveFromCart = (productId) => {
      setCart(cart.filter(item => item.id_producto !== productId));
      // Reiniciar el producto seleccionado si se elimina
      setSelectedProduct(null);
    };
  
    const filteredProducts = productos.filter(
      (product) =>
        product.estado === 'Activo' && // Filtra solo productos con estado "activo"
        (
          (product.nombre_producto && product.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (product.codigo_barras && product.codigo_barras.toString().includes(searchTerm))
        )
    );

  return (
    <div>
      <Navegacion>
        <div className="colorFondo" style={{ height: "100%" }}>
          <div className="card-body">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-6">
                  <div className="input-group input-group-sm mb-3" style={{ width: "100%" }}>
                    <input
                      type="text"
                      name="table_search"
                      className="form-control float-right"
                      placeholder="Digita el producto a buscar"
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
                          <img src={producto.imagen ? `http://localhost:3001/uploads/${producto.imagen}` : 'default-product-image.png'} alt={producto.nombre_producto} />
                          <h4>{producto.nombre_producto}</h4>
                          <p>Cantidad disponible: {producto.cantidad}</p>
                        </div>
                      ))
                    ) : (
                      <p>No se encontraron productos</p>
                    )}
                  </div>
                </div>
                <div className="col-lg-6">
                <h2>Registrar Incidencia</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="FechaIncidencia">Fecha de la incidencia</label>
                      <input
                        type="date"
                        className="form-control"
                        id="FechaIncidencia"
                        value={formData.FechaIncidencia}
                        onChange={handleChange}
                        disabled
                        readOnly
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="DescripcionIncidencia">Descripción de la incidencia</label>
                      <textarea
                        className="form-control"
                        id="DescripcionIncidencia"
                        value={formData.DescripcionIncidencia}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="NumeroDocumento">Número de documento</label>
                      <input
                        type="text"
                        className="form-control"
                        id="NumeroDocumento"
                        value={formData.NumeroDocumento}
                        onChange={handleChange}
                        readOnly 
                      />
                    </div>

                    <h3>Producto seleccionado</h3>
                    {cart.length > 0 ? (
                      <ul>
                        {cart.map(item => (
                          <li key={item.id_producto}>
                            {item.nombre_producto} - Cantidad: {item.quantity}
                            <button className="btn btn-secondary ml-2" onClick={() => handleRemoveFromCart(item.id_producto)}>X</button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No hay un producto para registrar la incidencia</p>
                    )}

                    {error && <p className="text-danger">{error}</p>}
                        <button type="submit" className="btn btn-secondary mr-2">Registrar Incidencia</button>
                        <button type="button" onClick={() => window.location.reload()} className="btn btn-secondary mr-2">Cancelar</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Navegacion>
    </div>
  );
};

export default RegistrarIncidencia;
