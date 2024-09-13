import React from "react";

const Principal = () => {
  return (
    <div>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
          <header data-bs-theme="dark">
            <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                <div class="container-fluid">
                <a class="navbar-brand" href="#i">SuperAlimento</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarCollapse">
                    <ul class="navbar-nav me-auto mb-2 mb-md-0">
                    <li class="nav-item">
                        <a class="nav-link" href="#SN">Sobre nosotros</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#rol">Roles</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/Login">Ingresar</a>
                    </li>
                    </ul>
                </div>
                </div>
            </nav>
            </header>
          </div>
        </div>
      </section>
      <section className="content" id="i">
        <div className="card">
          <div className="card-body">
            <div>
                  <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                    <div className="carousel-inner caja">
                      <div className="carousel-item active">
                        <img className="d-block w-100" src="../../dist/img/Super.jpeg" alt="" width="100px" height="500px"/>
                      </div>
                    </div>
                  </div>
                  <br/>
                <div className="container marketing">
                    <hr className="featurette-divider" />
                    <center><h1 id="SN">Sobre nosotros</h1></center>
                    <br/>
                    <div className="row featurette">
                    <div className="col-md-7">
                        <h3 className="featurette-heading fw-normal lh-1">Superalimento es el supermercado especializado en alimentos empaquetados de alta calidad.</h3>
                        <p className="lead">Ofrecemos una extensa selección de productos enlatados, congelados, snacks, bebidas y artículos de despensa, todos cuidadosamente seleccionados para garantizar frescura y sabor. Nuestro compromiso es proporcionarte una experiencia de compra conveniente con una variedad de opciones que satisfacen tus necesidades diarias. En Superalimento, encuentras todo lo que necesitas para tu despensa, con la confianza de calidad y buen precio en cada producto.</p>
                    </div>
                    <div className="col-md-5">
                        <img
                        className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto"
                        src="../../dist/img/principal1.jpeg" 
                        alt="Descripción de la imagen 4"
                        width={500}
                        height={500}
                        />
                    </div>
                    </div>
                    <hr className="featurette-divider" />

                    <div className="row featurette">
                    <div className="col-md-7 order-md-2">
                        <h2 className="featurette-heading fw-normal lh-1">Nos dedicamos a ofrecerte:</h2>
                        <ul>
                            <li className="lead"><strong>Variedad:</strong> Desde alimentos enlatados y congelados hasta snacks y bebidas, tenemos todo lo que necesitas bajo un mismo techo.</li>
                            <li className="lead"><strong>Accesibilidad:</strong> Precios competitivos y promociones especiales para que obtengas el mejor valor</li>
                            <li className="lead"><strong>Atención al Cliente: </strong>Nuestro equipo está aquí para asistirte y asegurarse de que tu experiencia de compra sea excelente.</li>
                        </ul>
                    </div>
                    <div className="col-md-5 order-md-1">
                        <img
                        className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto"
                        src="../../dist/img/principal2.jpeg" 
                        alt="Descripción de la imagen 5"
                        width={500}
                        height={500}
                        />
                    </div>
                    </div>

                    <hr className="featurette-divider" />

                    <div className="row featurette">
                    <div className="col-md-7">
                        <h2 className="featurette-heading fw-normal lh-1">Nos enfocamos en:</h2>
                        <ul>
                            <li className="lead"><strong>Calidad Superior:</strong> Seleccionamos productos de marcas reconocidas y confiables para garantizar tu satisfacción.</li>
                            <li className="lead"><strong>Innovación: </strong> Siempre estamos buscando nuevas opciones para enriquecer tu experiencia de compra.</li>
                            <li className="lead"><strong>Sostenibilidad: </strong>Nos esforzamos por minimizar nuestro impacto ambiental con prácticas responsables.</li>
                        </ul>
                    </div>
                    <div className="col-md-5">
                        <img
                        className="bd-placeholder-img bd-placeholder-img-lg featurette-image mx-auto img-fluid"
                        src="../../dist/img/principal3.jpeg" 
                        alt="Descripción de la imagen 6"
                        width={500}
                        height={400}
                        />
                    </div>
                    </div>
                <hr className="featurette-divider" />
                <center><h1 id="rol">Roles</h1></center>
                    <br/>
                    <div className="row d-flex justify-content-center">
                        <div className="col-lg-4 d-flex flex-column align-items-center">
                            <img
                            className="bd-placeholder-img  img-fluid"
                            src="../../dist/img/administrado1.jpg" // Cambia esto por la ruta de tu imagen
                            alt="Descripción de la imagen 1"
                            width={140}
                            height={140}
                            />
                            <h2 className="fw-normal">Administrador</h2>
                            <p>Supervisa a los trabajadores así como asigna y da recomendaciones sobre cómo se maneja el supermercado, también puede hacer la funciones de los demás roles.</p>
                        </div>
                        <div className="col-lg-4 d-flex flex-column align-items-center">
                            <img
                            className="bd-placeholder-img img-fluid"
                            src="../../dist/img/inventarista1.jpg" // Cambia esto por la ruta de tu imagen
                            alt="Descripción de la imagen 2"
                            width={140}
                            height={140}
                            />
                            <h2 className="fw-normal">Inventarista</h2>
                            <p>Encargado de gestionar el inventario, así como de registrar nuevos proveedores y nuevas solicitudes de productos para el supermercado, este corrobora la llegada de estas solicitudes y se encarga así de organizar su ingreso.</p>
                        </div>
                        <div className="col-lg-4 d-flex flex-column align-items-center">
                            <img
                            className="bd-placeholder-img img-fluid"
                            src="../../dist/img/cajero.jpg" // Cambia esto por la ruta de tu imagen
                            alt="Descripción de la imagen 3"
                            width={140}
                            height={140}
                            />
                            <h2 className="fw-normal">Cajero</h2>
                            <p>Encargado de llevar el proceso de la venta desde su registro, consulta y detallado de la misma, trabaja en caja y sus funciones no pasan más de la gestión de ventas.</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
        <footer class="container">
        <p class="float-end"><a href="#i" className="letras">Volver</a></p>
        <p>&copy; 2024 SuperAlimento.</p>
      </footer>
      </section>
    </div>
  );
}

export default Principal;
