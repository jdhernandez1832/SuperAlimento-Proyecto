import useDataTable from '../../hooks/useDataTable';
import React, { useState, useEffect, useRef } from 'react';
import Navegacion from "../../componentes/componentes/navegacion"; // Importa el componente correctamente
import "../../componentes/css/Login.css";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; 


const ConsultarProd = () => {
  const tableRef1 = useRef(null);
  const [productos, setProducto] = useState([]);
  useDataTable(tableRef1, productos); // Pasar los datos al hook
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('Rol');

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/producto/todos', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Rol': rol,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setProducto(data);
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Error al obtener los productos',
            icon: 'error',
            confirmButtonColor: '#4caf50',
          });
        }
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: `Error en la solicitud: ${error.message}`,
          icon: 'error',
          confirmButtonColor: '#4caf50',
        });
      }
    };

    fetchProducto();
  }, [rol, token]);

  const handleEstado = async (id_producto) => {
    try {
      const response = await fetch(`http://localhost:3001/api/producto/estado/${id_producto}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Rol': rol,
        },
        body: JSON.stringify({ estado: 'Desactivo' }),
      });

      if (response.ok) {
        setProducto(productos.filter(producto => producto.id_producto !== id_producto));
        Swal.fire({
          title: 'Éxito',
          text: 'Producto desactivado correctamente',
          icon: 'success',
          confirmButtonColor: '#4caf50',
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Error al cambiar el estado del producto',
          icon: 'error',
          confirmButtonColor: '#4caf50',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: `Error en la solicitud: ${error.message}`,
        icon: 'error',
        confirmButtonColor: '#4caf50',
      });
    }
  };
  const generarReporte = () => {
    const doc = new jsPDF('p', 'pt', 'a4');

    const logo = new Image();
    logo.src = '../../dist/img/SuperAlimento.png';

    logo.onload = () => {

        doc.addImage(logo, 'PNG', 40, 30, 50, 50); 
        doc.setFontSize(18);
        doc.text('SuperAlimento', 150, 60); 


        doc.setFontSize(14);
        doc.text('Reporte de Productos', 40, 100);

        const headers = [['Imagen', 'Nombre', 'Código de Barras', 'Precio Compra', 'Precio Venta', 'Cantidad']];

        const data = productos.map((producto) => [
            '', 
            producto.nombre_producto,
            producto.codigo_barras,
            producto.precio_compra.toFixed(2),
            producto.precio_venta.toFixed(2),
            producto.cantidad
        ]);


        doc.autoTable({
            head: headers,
            body: data,
            startY: 120, 
            styles: { fontSize: 8 }, 
            headStyles: {
                fillColor: [34, 139, 34], 
                textColor: [255, 255, 255], 
            },
            didDrawCell: (data) => {
                if (data.column.index === 0 && data.cell.section === 'body') {
                    const imgUrl = `http://localhost:3001/uploads/${productos[data.row.index].imagen}`;
                    const img = new Image();
                    img.src = imgUrl;

                    img.onload = () => {
                        doc.addImage(img, 'JPEG', data.cell.x + 2, data.cell.y + 2, 30, 30); 
                        if (data.row.index === productos.length - 1) {
                            doc.save('reporte_productos.pdf'); 
                        }
                    };
                }
            },
        });
        if (productos.every(p => !p.imagen)) {
            doc.save('reporte_productos.pdf');
        }
    };
};

  
  return (
    <div>
      <Navegacion>
        <div className="card card-success">
          <div className="card-body colorFondo">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Productos</h3>
                  </div>
                  <div className="card-body table-responsive p-0">
                    {productos.length === 0 ? (
                      <p>No hay datos en esta tabla</p>
                    ) : (
                      <table ref={tableRef1} className="table table-hover text-nowrap">
                        <thead>
                          <tr>
                            <th>Imagen</th>
                            <th>Código</th>
                            <th>Nombre de producto</th>
                            <th>Código de barras</th>
                            <th>Precio de compra</th>
                            <th>Precio de venta</th>
                            <th>Descripción</th>
                            <th>Cantidad</th>
                            <th>Actualizar</th>
                            <th>Eliminar</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productos.map((producto) => (
                            producto.estado !== 'Desactivo' && (
                              <tr key={producto.id_producto}>
                                <td>
                                  <img
                                    src={`http://localhost:3001/uploads/${producto.imagen}`}
                                    alt={producto.nombre_producto}
                                    width="50"
                                    height="50"
                                  />
                                </td>
                                <td>{producto.id_producto}</td>
                                <td>{producto.nombre_producto}</td>
                                <td>{producto.codigo_barras}</td>
                                <td>{producto.precio_compra}</td>
                                <td>{producto.precio_venta}</td>
                                <td>{producto.descripcion_producto}</td>
                                <td>{producto.cantidad}</td>
                                <td><Link to={`/ActualizarProd/${producto.id_producto}`} className="btn btn-warning">Actualizar</Link></td>
                                <td>
                                  <button 
                                    className="btn btn-danger"
                                    onClick={() => handleEstado(producto.id_producto)}
                                  >
                                    Eliminar
                                  </button>
                                </td>
                              </tr>
                            )
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                  <div className="card-header">
                    <button onClick={generarReporte} className="btn btn-secondary mr-2">Generar reporte de productos</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Navegacion>
    </div>
  );
}

export default ConsultarProd;

