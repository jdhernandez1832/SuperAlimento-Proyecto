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
  
          // Para cada producto, obtenemos la cantidad
          const productosConCantidad = await Promise.all(data.map(async (producto) => {
            const cantidadResponse = await fetch(`http://localhost:3001/api/producto/cantidad/${producto.id_producto}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'X-Rol': rol,
              },
            });
            const cantidadData = await cantidadResponse.json();
            return { ...producto, cantidad: cantidadData.cantidad }; // Añadimos la cantidad al producto
          }));
  
          setProductos(productosConCantidad);
        } else {
          Swal.fire('Error', 'Error al obtener los productos', 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'Error en la solicitud', 'error');
      }
    };
  
    fetchProductos();
  }, [rol, token]);
  const handleAddToCart = async (product) => { 
    try {
        const response = await fetch(`http://localhost:3001/api/producto/fechas-vencimiento/${product.id_producto}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-Rol': rol,
            },
        });

        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            Swal.fire({
                title: 'Sin fechas de vencimiento',
                text: 'Este producto no tiene fechas de vencimiento registradas.',
                icon: 'info',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#28a745',
            });
            return;
        }

        const opcionesFechas = data
            .filter(item => item.cantidad > 0)
            .map(item => ({
                id: item.id,
                fecha: new Date(item.fecha_vencimiento).toLocaleDateString(),
                cantidad: item.cantidad,
            }));

        if (opcionesFechas.length === 0) {
            Swal.fire({
                title: 'Sin fechas disponibles',
                text: 'No hay fechas de vencimiento con cantidad disponible.',
                icon: 'info',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#28a745',
            });
            return;
        }

        const inputOptions = opcionesFechas.reduce((acc, fecha) => {
            acc[fecha.id] = `${fecha.fecha} (Cantidad: ${fecha.cantidad})`;
            return acc;
        }, {});

        const { value: selectedFecha } = await Swal.fire({
            title: product.nombre_producto,
            html: `<div style="text-align: center;">
                        <img src="${product.imagen ? product.imagen : 'default-product-image.png'}"  style="width: 100px; height: 100px; margin-bottom: 10px;">
                        <div><p>Seleccione la fecha de vencimiento relacionada con el producto afectado</p></div>
                   </div>`,
            input: 'select',
            inputOptions: inputOptions,
            inputPlaceholder: 'Selecciona una fecha de vencimiento',
            showCancelButton: true,
            confirmButtonText: 'Seleccionar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#28a745',
        });

        if (selectedFecha) {
            const fechaSeleccionada = opcionesFechas.find(fecha => fecha.id === parseInt(selectedFecha));

            const { value: quantity } = await Swal.fire({
                title: product.nombre_producto,
                html: `<div style="text-align: center;">
                      <img src="${product.imagen ? product.imagen : 'default-product-image.png'}" alt="${product.nombre_producto}" style="width: 100px; height: 100px; margin-bottom: 10px;">
                       </div>
                       <div><p>Agregue la cantidad afectada</p></div>
                       <p>Fecha de vencimiento: ${fechaSeleccionada.fecha}</p>
                       <p>Cantidad disponible: ${fechaSeleccionada.cantidad}</p>`,
                input: 'number',
                inputAttributes: {
                    min: 1,
                    max: fechaSeleccionada.cantidad,
                },
                showCancelButton: true,
                confirmButtonText: 'Agregar a la incidencia',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#28a745',
                preConfirm: (value) => {
                    if (value <= 0 || value > fechaSeleccionada.cantidad) {
                        Swal.showValidationMessage(`Cantidad inválida. Debe estar entre 1 y ${fechaSeleccionada.cantidad}`);
                        return false;
                    }
                    return value;
                },
            });

            if (quantity) {
                setCart([...cart, { ...product, quantity, id_fecha_vencimiento: fechaSeleccionada.id, fecha: fechaSeleccionada.fecha }]);
            }
        }
    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: 'Error al obtener las fechas de vencimiento.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#28a745',
        });
        console.error("Error al obtener fechas de vencimiento:", error);
    }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      setError('Debes registrar al menos un producto afectado.');
      return;
    }

    const incidenciasData = cart.map(item => ({
      descripcion_incidencia: formData.DescripcionIncidencia,
      fecha_incidencia: formData.FechaIncidencia,
      cantidad_afectada: item.quantity,
      numero_documento: formData.NumeroDocumento,
      id_producto: item.id_producto,
      id_fecha_vencimiento: item.id_fecha_vencimiento,
    }));

    try {
      const response = await fetch('http://localhost:3001/api/incidencia/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Rol': rol,
        },
        body: JSON.stringify(incidenciasData),
      });

      if (response.ok) {
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
        Swal.fire({
          title: 'Error',
          text: `Error al registrar incidencia: ${errorMessage}`,
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#28a745',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: `Error en el registro: ${error}`,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#28a745',
      });
    }
  };

  const handleRemoveFromCart = (productId) => {

    const updatedCart = cart.filter(item => item.id_producto !== productId);
    setCart(updatedCart);
  

  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = productos.filter(
    (product) =>
      product.estado === 'Activo' &&
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
                        <img src={producto.imagen} alt={producto.nombre_producto}/>
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
