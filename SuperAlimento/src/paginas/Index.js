
import Navegacion from "../componentes/componentes/navegacion"; 
import "../componentes/css/Login.css";
import { Link } from "react-router-dom";
import SalesChart from '../componentes/componentes/ventas';
import useDataTable from '../hooks/useDataTable';
import React, { useRef } from 'react';

const Index = () => {
    const tableRef1 = useRef(null);
    const tableRef2 = useRef(null);
    useDataTable(tableRef1);
    useDataTable(tableRef2); 
  return (
    <div>
      <Navegacion>
        <div className="card card-success">
          <div className="card-body">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-3 col-6">
                  <div className="small-box bg-info">
                    <div className="inner">
                      <h3>$0</h3>
                      <p>Ventas del día</p>
                    </div>
                    <div className="icon">
                      <i>
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="white" className="bi bi-basket3" viewBox="0 0 16 16">
                          <path d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5v-1A.5.5 0 0 1 .5 6h1.717L5.07 1.243a.5.5 0 0 1 .686-.172zM3.394 15l-1.48-6h-.97l1.525 6.426a.75.75 0 0 0 .729.574h9.606a.75.75 0 0 0 .73-.574L15.056 9h-.972l-1.479 6z"/>
                        </svg>
                      </i>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-6">
                  <div className="small-box bg-success">
                    <div className="inner">
                      <h3>#0</h3>
                      <p>Número de ventas</p>
                    </div>
                    <div className="icon">
                      <i>
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="white" className="bi bi-ticket-detailed-fill" viewBox="0 0 16 16">
                          <path d="M0 4.5A1.5 1.5 0 0 1 1.5 3h13A1.5 1.5 0 0 1 16 4.5V6a.5.5 0 0 1-.5.5 1.5 1.5 0 0 0 0 3 .5.5 0 0 1 .5.5v1.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 11.5V10a.5.5 0 0 1 .5-.5 1.5 1.5 0 1 0 0-3A.5.5 0 0 1 0 6zm4 1a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5m0 5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5M4 8a1 1 0 0 0 1 1h6a1 1 0 1 0 0-2H5a1 1 0 0 0-1 1"/>
                        </svg> 
                      </i>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-6">
                  <div className="small-box bg-danger">
                    <div className="inner">
                      <h3>#0</h3>
                      <p>Costos del día</p>
                    </div>
                    <div className="icon">
                      <i>
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="white" className="bi bi-cash" viewBox="0 0 16 16">
                          <path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
                          <path d="M0 4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V6a2 2 0 0 1-2-2z"/>
                        </svg>
                      </i>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-6">
                  <div className="small-box bg-warning">
                    <div className="inner">
                      <h3>$0</h3>
                      <p>Utilidad del día</p>
                    </div>
                    <div className="icon">
                      <i>
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="black" className="bi bi-coin" viewBox="0 0 16 16">
                          <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518z"/>
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                          <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11m0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12"/>
                        </svg>
                      </i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card card-success">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-6">
                <div className="card">
                  <div className="card-header border-0">
                    <div className="d-flex justify-content-between">
                      <h3 className="card-title">Ventas por últimos 7 días</h3>
                      <Link to="#">Ver reportes</Link>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="d-flex">
                      <p className="d-flex flex-column">
                        <span className="text-bold text-lg">155</span>
                        <span>Toda la semana</span>
                      </p>
                    </div>

                    <div className="position-relative mb-4">
                      <SalesChart />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="card">
                  <div className="card-header border-0">
                    <h3 className="card-title">Productos más vendidos</h3>
                  </div>
                  <div className="card-body table-responsive p-0">
                    <table ref={tableRef1} className="table table-striped table-valign-middle display nowrap">
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>Precio</th>
                          <th>Ventas</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            Arroz 500g
                          </td>
                          <td>$10000</td>
                          <td>
                            100 
                          </td>
                        </tr>
                        <tr>
                          <td>
                            Lentejas 500g
                          </td>
                          <td>$5000</td>
                          <td>
                            50 
                          </td>
                        </tr>
                        <tr>
                          <td>
                            Chocolatina Jet M
                          </td>
                          <td>$1230 </td>
                          <td>
                            198 
                          </td>
                        </tr>
                        <tr>
                          <td>
                            Bombum Sandia
                          </td>
                          <td>$600</td>
                          <td>
                            87 
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header border-0">
                    <h3 className="card-title">Categorias mas vendidas</h3>
                  </div>
                  <div className="card-body table-responsive p-0">
                    <table ref={tableRef2} className="table table-striped table-valign-middle display nowrap">
                      <thead>
                        <tr>
                          <th>Categoria</th>
                          <th>Venta</th>
                        </tr>
                      </thead>
                      <tbody>
                      </tbody>
                    </table>
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

export default Index;