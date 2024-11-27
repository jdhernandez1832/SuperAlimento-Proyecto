import React from "react";
import { useNavigate } from 'react-router-dom';


const Principal = () => {
  const navigate = useNavigate();
  return (
    <div className="w-100">
        <header
          className="bg-cover bg-center min-vh-70 d-flex flex-column justify-content-between w-100 position-relative"
          style={{
            backgroundImage: `url(/dist/img/hola.png)`, // Imagen de fondo
            backgroundSize: 'cover', // La imagen cubre el contenedor
            backgroundPosition: 'center', // Centra la imagen dentro del contenedor
            backgroundRepeat: 'no-repeat', // No repite la imagen
          }}
        >
        <div className="position-absolute w-100 h-100 bg-dark" style={{ opacity: 0.6 }}></div>
        <div className="d-flex align-items-center justify-content-between w-100 p-3 position-relative">
          <img src="../../dist/img/SuperGod.png" alt="Logo" className="img-fluid" style={{ width: "300px", height: "100px"}} />
          <nav className="d-flex align-items-center">
            <button
              className="btn btn-light px-4 py-2 mr-3"
              onClick={() => navigate('/login')}
            >
              Iniciar Sesión
            </button>
          </nav>
        </div>
        <div className="text-center my-auto position-relative z-index-10">
          <h1 className="display-4 text-white text-uppercase mb-4 font-weight-bold">
            Descubre Todo en un Solo Lugar
          </h1>
          <p className="lead text-white px-3 px-md-5 font-weight-normal">
            Imagina un lugar donde puedas encontrar todo lo que necesitas, desde productos frescos hasta los artículos esenciales para tu hogar. En nuestro supermercado, trabajamos para ofrecerte calidad, variedad y precios competitivos en un ambiente cómodo y accesible. Únete a nosotros y experimenta la conveniencia de realizar tus compras en un lugar que prioriza tus necesidades y tu bienestar.
          </p>
        </div>
      </header>

      <section className="py-5 bg-light w-100">
        <div className="container px-3 px-md-5">
          <div className="row">
            <div className="col-md-4 text-center">
              <i className="fas fa-tags mb-3" style={{ fontSize: "80px" }}></i>  {/* Icono de ofertas */}
              <h3 className="h5 font-weight-bold">Ofertas Especiales</h3>
              <p>
                Descubre nuestras promociones exclusivas y ahorra en productos de alta calidad. ¡No te pierdas las mejores ofertas de la semana!
              </p>
            </div>
            <div className="col-md-4 text-center">
              <i className="fas fa-apple-alt mb-3" style={{ fontSize: "80px" }}></i>  {/* Icono de productos frescos */}
              <h3 className="h5 font-weight-bold">Productos Frescos</h3>
              <p>
                Disfruta de una amplia selección de productos frescos como frutas, verduras, carnes y panadería, siempre con la mejor calidad.
              </p>
            </div>
            <div className="col-md-4 text-center">
              <i className="fas fa-solid fa-phone-volume" style={{ fontSize: "80px" }}></i>  {/* Icono de atención al cliente */}
              <h3 className="h5 font-weight-bold">Atención al Cliente</h3>
              <p>
                Nuestro equipo de atención al cliente está disponible para ayudarte en todo lo que necesites, asegurando que tu experiencia de compra sea siempre positiva.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main
        className="position-relative  w-100 bg-cover bg-center"
        style={{
          backgroundImage: `url(/dist/img/hola2.jpg)`, // Imagen de fondo
          backgroundSize: 'cover', // La imagen cubre el contenedor
          backgroundPosition: 'center', // Centra la imagen dentro del contenedor
          backgroundRepeat: 'no-repeat', // No repite la imagen
        }}
      >
        <div className="position-absolute w-100 h-100 bg-dark" style={{ opacity: 0.6 }}></div>
        <div className="container px-3 px-md-5 position-relative z-index-10 text-center pt-4 pb-4">
          <div className="row">
            <div className="col-md-6">
              <h2 className="h3 font-weight-bold mb-4 text-white">Encuentra Tu Marca Favorita</h2>
              <p className="lead text-white  font-weight-normal">
                Explora una amplia variedad de marcas y descubre aquellas que se ajustan a tus preferencias. Ya sea que busques productos orgánicos, locales o de marcas reconocidas, nuestra plataforma te permite encontrar y seguir las marcas que más te interesan para facilitar tus compras.
              </p>
            </div>
            <div className="col-md-6 d-flex justify-content-center align-items-center">
              <i className="fa-solid fa-cart-shopping" style={{ fontSize: "80px", color: "white" }}></i>  {/* Icono de etiqueta */}
            </div>
          </div>
        </div>
      </main>

      <section className="bg-light py-5 w-100">
        <div className="container px-3 px-md-5">
          <div className="row text-center">
            <div className="col-md-4">
              <i className="fas fa-ban mb-3" style={{ fontSize: "80px" }}></i>  {/* Icono de prohibición */}
              <h3 className="font-weight-bold">No Promovemos la Venta de Alcohol</h3>
            </div>
            <div className="col-md-4">
              <i className="fas fa-exclamation-triangle mb-3" style={{ fontSize: "80px" }}></i>  {/* Icono de advertencia */}
              <h3 className="font-weight-bold">No Se Permite el Contenido Inapropiado</h3>
            </div>
            <div className="col-md-4">
              <i className="fas fa-headset mb-3" style={{ fontSize: "80px" }}></i>  {/* Icono de atención al cliente */}
              <h3 className="font-weight-bold">Atención al Cliente 24/7</h3>
            </div>
          </div>
          <p className="mt-4 mx-auto" style={{ maxWidth: "600px" }}>
            En nuestro supermercado, nos comprometemos a ofrecer productos de alta calidad en un ambiente seguro y respetuoso. No promovemos la venta de alcohol ni de productos que puedan perjudicar la salud. Además, mantenemos un espacio libre de contenido inapropiado. Para cualquier inquietud o problema, nuestro equipo de atención al cliente está disponible las 24 horas del día, los 7 días de la semana, para ofrecerte el mejor servicio posible y asegurarnos de que tengas una experiencia satisfactoria en nuestra tienda.
          </p>
        </div>
      </section>

      <footer className="text-center py-4 w-100" style={{
          backgroundImage: `url(/dist/img/hola2.jpg)`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          backgroundRepeat: 'no-repeat',
        }}>
          <div className="position-absolute bg-dark" style={{ opacity: 0.6 }}></div>
            <p className="text-white font-weight-normal">© {new Date().getFullYear()} Todos los derechos reservados.</p> 
      </footer>
    </div>
  );
}

export default Principal;
