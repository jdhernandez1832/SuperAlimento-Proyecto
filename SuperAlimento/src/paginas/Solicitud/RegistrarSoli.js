import React, { useState, useEffect } from "react";
import Navegacion from "../../componentes/componentes/navegacion";
import "../../componentes/css/Login.css";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import Select from 'react-select'; 

const RegistrarSoli = () => {
  const [formData, setFormData] = useState({
    FechaSolicitud: '',
    EstadoSolicitud: 'Pendiente',
    PrecioSolicitud: '',
    ObservacionSolicitud: '',
    id_proveedor: '',
    numero_documento: '',
  });

  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [setUsuarios] = useState([]);
  const [cart, setCart] = useState([]);
  const [cantidadesProductos, setCantidadesProductos] = useState({});
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
          // Filtrar proveedores activos
          const proveedoresActivos = data.filter(proveedor => proveedor.estado !== 'Desactivo');
          setProveedores(proveedoresActivos);
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
        setCantidadesProductos({}); // Limpiar las cantidades si no hay proveedor seleccionado
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
  
          // Obtener las cantidades para cada producto al cambiar de proveedor
          const nuevasCantidades = {};
          await Promise.all(data.map(async (producto) => {
            const cantidad = await fetchCantidad(producto.id_producto);
            nuevasCantidades[producto.id_producto] = cantidad;
          }));
          setCantidadesProductos(nuevasCantidades);
        } else {
          console.error('Error al obtener productos del proveedor:', response.statusText);
          setProductos([]);
        }
      } catch (error) {
        console.error("Error al obtener productos del proveedor:", error);
        setProductos([]);
      }
    };
  
    const fetchCantidad = async (id_producto) => {
      try {
        const response = await fetch(`http://localhost:3001/api/producto/cantidad/${id_producto}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Rol': rol,
          },
        });
        if (response.ok) {
          const data = await response.json();
          return data.cantidad; // Asegúrate de que esto coincida con la estructura de tu respuesta
        } else {
          console.error('Error al obtener cantidad:', response.statusText);
          return 0; // Retornar 0 si hay un error
        }
      } catch (error) {
        console.error("Error al obtener cantidad:", error);
        return 0;
      }
    };
  
    fetchProductosPorProveedor();
  }, [formData.id_proveedor, token, rol]);
  

  const handleChange = (e) => {
    const { id, value } = e.target;
    
    if (id === 'ObservacionSolicitud' && !/^[a-zA-Z0-9 ]*$/.test(value)) {
      Swal.fire({
        icon: 'error',
        title: 'Entrada no válida',
        text: 'Solo se permiten letras y números en el campo de observaciones.',
        confirmButtonColor: '#28a745', // Color verde
      });
      return;
    }
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };
  const handleSelectChange = (selectedOption, actionMeta) => {
    const { name } = actionMeta;
    setFormData({
        ...formData,
        [name]: selectedOption ? selectedOption.value : '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.id_proveedor || !formData.numero_documento) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Debe seleccionar un proveedor y un usuario',
        confirmButtonColor: '#28a745', // Color verde
      });
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
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Solicitud registrada con éxito',
          confirmButtonColor: '#28a745', // Color verde
        }).then(() => {
          navigate('/ConsultarSoli');
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al registrar solicitud',
          confirmButtonColor: '#28a745', // Color verde
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error en el registro: ${error}`,
        confirmButtonColor: '#28a745', // Color verde
      });
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value || '');
  };
  
  const handleAddToCart = async (producto) => {
    // Mueve la función fetchCantidad fuera de handleAddToCart
    const fetchCantidad = async () => {
        const response = await fetch(`http://localhost:3001/api/producto/cantidad/${producto.id_producto}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'X-Rol': rol,
            },
        });

        if (response.ok) {
            const data = await response.json();
            return data.cantidad; // Asegúrate de que esto coincida con la estructura de tu respuesta
        } else {
            console.error('Error al obtener cantidad:', response.statusText);
            return 0; // Retornar 0 si hay un error
        }
    };

    const cantidadDisponible = await fetchCantidad();

    // Actualiza el estado de las cantidades de productos antes de mostrar el Swal
    setCantidadesProductos(prev => ({ ...prev, [producto.id_producto]: cantidadDisponible }));

    // Ahora muestra el Swal con la cantidad actualizada
    Swal.fire({
      title: `<strong>${producto.nombre_producto}</strong>`,
      html: ` 
          <img src="${producto.imagen ? producto.imagen : 'default-product-image.png'}" 
              alt="${producto.nombre_producto}" width="200" /><br/>
          <strong>Precio: </strong> $${producto.precio_compra.toLocaleString()}<br/>
          <strong>Disponibilidad: </strong> ${cantidadDisponible} unidades<br/><br/>
          <label for="cantidad">Cantidad a agregar:</label>
          <input type="number" id="cantidad" class="swal2-input" min="1" placeholder="Cantidad" />`, 
      showCancelButton: true,
      confirmButtonText: 'Agregar a la solicitud',
      confirmButtonColor: '#4caf50',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
          const cantidad = Swal.getPopup().querySelector('#cantidad').value;
          if (!cantidad || isNaN(cantidad) || cantidad <= 0) {
              Swal.showValidationMessage('Por favor ingrese una cantidad válida');
          }
          return { cantidad: parseInt(cantidad, 10) };
      }
  }).then((result) => {
        if (result.isConfirmed && result.value.cantidad > 0) {
            // Asegúrate de que la cantidad se agregue al carrito sin restricciones
            setCart([...cart, { ...producto, quantity: result.value.cantidad }]);
            Swal.fire({
                icon: 'success',
                title: 'Producto agregado',
                text: `${result.value.cantidad} unidades de ${producto.nombre_producto} han sido agregadas a la solicitud.`,
                confirmButtonColor: '#28a745'
            });
        }
    });
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
                    {filteredProducts.map((producto) => (
                      <div
                        key={producto.id_producto}
                        className="product-item"
                        onClick={() => handleAddToCart(producto)}
                      >
                        <img src={producto.imagen} alt={producto.nombre_producto} width={'200'} />
                        <h4>{producto.nombre_producto}</h4>
                        <p>Cantidad disponible: {cantidadesProductos[producto.id_producto] || 0} unidades</p> {/* Mostrar cantidad */}
                        <p>${producto.precio_compra.toLocaleString()}</p>
                      </div>
                    ))}
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
                          <Select
                            options={proveedores.map(proveedor => ({
                              value: proveedor.id_proveedor,
                              label: proveedor.nombre_proveedor,
                            }))}
                            onChange={handleSelectChange}
                            name="id_proveedor"
                            placeholder="Seleccione un proveedor"
                            isClearable
                            isSearchable={true}
                          />
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
                        <button type="button" onClick={() => window.location.reload()} className="btn btn-secondary mr-2">Cancelar</button>
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